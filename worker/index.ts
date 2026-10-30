interface D1Result<T = unknown> { results?: T[]; success: boolean; }
interface D1PreparedStatement { bind(...values: unknown[]): D1PreparedStatement; first<T = unknown>(column?: string): Promise<T | null>; all<T = unknown>(): Promise<D1Result<T>>; run(): Promise<D1Result>; }
interface D1Database { prepare(query: string): D1PreparedStatement; batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>; }
interface AssetsBinding { fetch(request: Request): Promise<Response>; }
interface Env { CMS_DB: D1Database; ASSETS: AssetsBinding; CMS_ADMIN_PASSWORD: string; CMS_JWT_SECRET: string; }
const CONTENT_KEYS = ['projects','disciplines','team','collaborations','bgAudioConfig','siteVisuals','custom3DModel'] as const;
type ContentKey = typeof CONTENT_KEYS[number];
const TOKEN_TTL_SECONDS = 43200;
const MAX_BODY_BYTES = 1800000;
function json(data: unknown, status = 200, headers?: Headers): Response {
  const out = new Headers(headers); out.set('Content-Type','application/json; charset=utf-8'); out.set('Cache-Control','no-store');
  return new Response(JSON.stringify(data),{status,headers:out});
}
function cors(request: Request): Headers {
  const origin=request.headers.get('Origin')||'', requestUrl=new URL(request.url);
  const allowed=new Set([requestUrl.origin,'https://thomshaan.github.io','http://localhost:5173','http://localhost:3000','http://localhost:8787']);
  const h=new Headers({'Vary':'Origin','Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'86400'});
  if(origin&&allowed.has(origin)) h.set('Access-Control-Allow-Origin',origin); return h;
}
function b64url(bytes: Uint8Array): string { let s=''; for(const b of bytes)s+=String.fromCharCode(b); return btoa(s).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }
function unb64url(value: string): Uint8Array { const s=atob(value.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-value.length%4)%4)); return Uint8Array.from(s,c=>c.charCodeAt(0)); }
async function signToken(secret:string):Promise<string>{
 const payload=b64url(new TextEncoder().encode(JSON.stringify({sub:'ovrstudio-admin',exp:Math.floor(Date.now()/1000)+TOKEN_TTL_SECONDS})));
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(payload)); return payload+'.'+b64url(new Uint8Array(sig));
}
async function verifyToken(request:Request,secret:string):Promise<boolean>{
 const auth=request.headers.get('Authorization')||'', token=auth.startsWith('Bearer ')?auth.slice(7):'';
 const [payload,sig,extra]=token.split('.'); if(!payload||!sig||extra)return false;
 try{
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  if(!await crypto.subtle.verify('HMAC',key,unb64url(sig),new TextEncoder().encode(payload)))return false;
  const claims=JSON.parse(new TextDecoder().decode(unb64url(payload)));
  return claims.sub==='ovrstudio-admin'&&Number(claims.exp)>Math.floor(Date.now()/1000);
 }catch{return false;}
}
async function readJson(request:Request):Promise<Record<string,unknown>|null>{
 if(Number(request.headers.get('Content-Length')||0)>MAX_BODY_BYTES)return null;
 try{const raw=await request.text();if(new TextEncoder().encode(raw).byteLength>MAX_BODY_BYTES)return null;const v=JSON.parse(raw);return v&&typeof v==='object'&&!Array.isArray(v)?v:null;}catch{return null;}
}
function validContent(key:ContentKey,value:unknown):boolean{
 if(['projects','disciplines','team','collaborations'].includes(key))return Array.isArray(value);
 return !!value&&typeof value==='object'&&!Array.isArray(value);
}
async function getSnapshot(env:Env){
 const [meta,rows]=await Promise.all([
  env.CMS_DB.prepare("SELECT meta_value FROM cms_meta WHERE meta_key='initialized'").first<{meta_value:string}>(),
  env.CMS_DB.prepare('SELECT content_key,content_json FROM cms_content').all<{content_key:string;content_json:string}>()
 ]);
 const content:Partial<Record<ContentKey,unknown>>={};
 for(const row of rows.results||[]){if((CONTENT_KEYS as readonly string[]).includes(row.content_key)){try{content[row.content_key as ContentKey]=JSON.parse(row.content_json);}catch{}}}
 return {initialized:meta?.meta_value==='true',content};
}
async function api(request:Request,env:Env):Promise<Response>{
 const headers=cors(request),origin=request.headers.get('Origin');
 if(origin&&!headers.has('Access-Control-Allow-Origin'))return json({error:'Origin not allowed.'},403,headers);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 const path=new URL(request.url).pathname.replace(/\/+$/,'')||'/';
 if(path==='/api/cms/health'&&request.method==='GET')return json({ok:true},200,headers);
 if(path==='/api/cms/login'&&request.method==='POST'){
  const body=await readJson(request);
  if(!env.CMS_ADMIN_PASSWORD||!env.CMS_JWT_SECRET)return json({error:'CMS authentication is not configured on the Worker.'},503,headers);
  if(typeof body?.password!=='string'||body.password!==env.CMS_ADMIN_PASSWORD)return json({error:'Incorrect studio password.'},401,headers);
  return json({token:await signToken(env.CMS_JWT_SECRET),expiresIn:TOKEN_TTL_SECONDS},200,headers);
 }
 if(path==='/api/cms/bootstrap'&&request.method==='GET'){
  try{return json(await getSnapshot(env),200,headers);}catch{return json({error:'CMS database is not ready. Run the D1 setup.'},503,headers);}
 }
 if(path==='/api/cms/migrate'&&request.method==='POST'){
  if(!await verifyToken(request,env.CMS_JWT_SECRET||''))return json({error:'Authentication required.'},401,headers);
  const body=await readJson(request),snapshot=body?.content;
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot))return json({error:'A content snapshot is required.'},400,headers);
  const values=snapshot as Record<string,unknown>;
  for(const key of CONTENT_KEYS)if(!(key in values)||!validContent(key,values[key]))return json({error:'Invalid or incomplete migration snapshot: '+key},400,headers);
  try{
   const current=await getSnapshot(env);if(current.initialized)return json({error:'CMS is already initialized.',...current},409,headers);
   const now=new Date().toISOString();
   const statements=CONTENT_KEYS.map(key=>env.CMS_DB.prepare('INSERT INTO cms_content(content_key,content_json,updated_at) VALUES(?,?,?) ON CONFLICT(content_key) DO UPDATE SET content_json=excluded.content_json,updated_at=excluded.updated_at').bind(key,JSON.stringify(values[key]),now));
   statements.push(env.CMS_DB.prepare("INSERT INTO cms_meta(meta_key,meta_value,updated_at) VALUES('initialized','true',?) ON CONFLICT(meta_key) DO UPDATE SET meta_value='true',updated_at=excluded.updated_at").bind(now));
   await env.CMS_DB.batch(statements);return json(await getSnapshot(env),201,headers);
  }catch{return json({error:'Could not migrate browser content into D1.'},500,headers);}
 }
 const match=path.match(/^\/api\/cms\/([A-Za-z0-9_-]+)$/);
 if(match&&request.method==='PUT'){
  if(!await verifyToken(request,env.CMS_JWT_SECRET||''))return json({error:'Authentication required.'},401,headers);
  const key=match[1] as ContentKey;if(!(CONTENT_KEYS as readonly string[]).includes(key))return json({error:'Unknown CMS collection.'},404,headers);
  const body=await readJson(request);if(!body||!validContent(key,body.value))return json({error:'Invalid CMS content.'},400,headers);
  const now=new Date().toISOString();
  try{
   await env.CMS_DB.batch([
    env.CMS_DB.prepare('INSERT INTO cms_content(content_key,content_json,updated_at) VALUES(?,?,?) ON CONFLICT(content_key) DO UPDATE SET content_json=excluded.content_json,updated_at=excluded.updated_at').bind(key,JSON.stringify(body.value),now),
    env.CMS_DB.prepare("INSERT INTO cms_meta(meta_key,meta_value,updated_at) VALUES('initialized','true',?) ON CONFLICT(meta_key) DO UPDATE SET meta_value='true',updated_at=excluded.updated_at").bind(now)
   ]);
   return json({ok:true,key,updatedAt:now},200,headers);
  }catch{return json({error:'Could not publish this CMS update to D1.'},500,headers);}
 }
 return json({error:'Not found.'},404,headers);
}
export default { async fetch(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return api(request,env);return env.ASSETS.fetch(request);
}};

interface R2ObjectBody {
  body: ReadableStream;
  size: number;
  httpEtag?: string;
  range?: { offset: number; length: number };
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
    contentDisposition?: string;
  };
  writeHttpMetadata?: (headers: Headers) => void;
}

interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | string | Blob, options?: {
    httpMetadata?: { contentType?: string; cacheControl?: string; contentDisposition?: string };
    customMetadata?: Record<string, string>;
  }): Promise<unknown>;
  get(key: string, options?: { range?: Headers }): Promise<R2ObjectBody | null>;
}

interface Env {
  MEDIA_BUCKET: R2Bucket;
  PUBLIC_BASE_URL: string;
  UPLOAD_TOKEN: string;
  CMS_JWT_SECRET?: string;
  ALLOWED_ORIGINS: string;
}

const MAX_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/ogg',
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm',
  'text/plain', 'application/octet-stream', 'model/gltf+json', 'model/gltf-binary',
]);

function corsHeaders(request: Request, env: Env): Headers {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((v) => v.trim()).filter(Boolean);
  const headers = new Headers({
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Range',
    'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Length, Content-Range, ETag',
    'Access-Control-Max-Age': '86400',
  });
  if (origin && allowed.includes('*')) headers.set('Access-Control-Allow-Origin', '*');
  else if (origin && allowed.includes(origin)) headers.set('Access-Control-Allow-Origin', origin);
  return headers;
}

function json(data: unknown, status: number, headers: Headers): Response {
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { status, headers });
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifyCmsToken(token: string, secret: string): Promise<boolean> {
  if (!secret) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'],
    );
    const valid = await crypto.subtle.verify(
      'HMAC', key, decodeBase64Url(signature), new TextEncoder().encode(payload),
    );
    if (!valid) return false;
    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    return claims.sub === 'ovr...';
  } catch {
    return false;
  }
}

function safeExtension(filename: string, contentType: string): string {
  const ext = filename.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'webm', 'ogg', 'mp3', 'wav', 'obj', 'fbx', 'glb', 'gltf'].includes(ext)) return ext;
  const byType: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
    'image/gif': 'gif', 'image/svg+xml': 'svg', 'video/mp4': 'mp4',
    'video/webm': 'webm', 'video/ogg': 'ogg', 'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3', 'audio/wav': 'wav', 'audio/ogg': 'ogg',
    'audio/webm': 'webm', 'text/plain': 'obj', 'model/gltf+json': 'gltf',
    'model/gltf-binary': 'glb',
  };
  return byType[contentType] || 'bin';
}

async function serveMedia(request: Request, env: Env, headers: Headers, url: URL): Promise<Response> {
  let key = '';
  try {
    key = url.pathname.slice('/media/'.length).split('/').map(decodeURIComponent).join('/');
  } catch {
    return json({ error: 'Invalid media path.' }, 400, headers);
  }
  if (!key || key.split('/').some((part) => !part || part === '.' || part === '..' || part.includes('\\'))) {
    return json({ error: 'Invalid media path.' }, 400, headers);
  }

  try {
    const object = await env.MEDIA_BUCKET.get(key, request.headers.has('Range') ? { range: request.headers } : undefined);
    if (!object) return json({ error: 'Media not found.' }, 404, headers);

    const mediaHeaders = new Headers(headers);
    object.writeHttpMetadata?.(mediaHeaders);
    if (!mediaHeaders.has('Content-Type')) mediaHeaders.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    if (!mediaHeaders.has('Cache-Control')) mediaHeaders.set('Cache-Control', object.httpMetadata?.cacheControl || 'public, max-age=3600');
    if (!mediaHeaders.has('Content-Disposition')) mediaHeaders.set('Content-Disposition', object.httpMetadata?.contentDisposition || 'inline');
    mediaHeaders.set('Accept-Ranges', 'bytes');
    if (object.httpEtag) mediaHeaders.set('ETag', object.httpEtag);

    const isPartial = !!object.range;
    if (isPartial) {
      const start = object.range!.offset;
      const end = start + object.range!.length - 1;
      mediaHeaders.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
      mediaHeaders.set('Content-Length', String(object.range!.length));
    } else {
      mediaHeaders.set('Content-Length', String(object.size));
    }

    return new Response(request.method === 'HEAD' ? null : object.body, {
      status: isPartial ? 206 : 200,
      headers: mediaHeaders,
    });
  } catch {
    return json({ error: 'Could not read this media object from R2.' }, 500, headers);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(request, env);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      if (!request.headers.get('Origin') || !headers.has('Access-Control-Allow-Origin')) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers });
    }
    if (request.headers.get('Origin') && !headers.has('Access-Control-Allow-Origin')) {
      return json({ error: 'Origin not allowed.' }, 403, headers);
    }

    if (url.pathname === '/health' && request.method === 'GET') return json({ ok: true }, 200, headers);
    if (url.pathname.startsWith('/media/') && (request.method === 'GET' || request.method === 'HEAD')) {
      return serveMedia(request, env, headers, url);
    }
    if (url.pathname !== '/upload' || request.method !== 'POST') return json({ error: 'Not found.' }, 404, headers);

    const auth = request.headers.get('Authorization') || '';
    const suppliedToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const legacyTokenValid = !!env.UPLOAD_TOKEN && suppliedToken === env.UPLOAD_TOKEN;
    const cmsSessionValid = await verifyCmsToken(suppliedToken, env.CMS_JWT_SECRET || '');
    if (!legacyTokenValid && !cmsSessionValid) return json({ error: 'Invalid or expired upload authorization. Sign in to the CMS again.' }, 401, headers);

    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > MAX_SIZE + 1024 * 1024) return json({ error: 'Upload exceeds the 50MB limit.' }, 413, headers);

    let form: FormData;
    try { form = await request.formData(); }
    catch { return json({ error: 'Expected multipart form data.' }, 400, headers); }
    const file = form.get('file');
    if (!(file instanceof File)) return json({ error: 'No file was provided.' }, 400, headers);
    if (file.size <= 0 || file.size > MAX_SIZE) return json({ error: 'File must be between 1 byte and 50MB.' }, 413, headers);

    const contentType = (file.type || 'application/octet-stream').toLowerCase();
    if (!ALLOWED_TYPES.has(contentType)) return json({ error: `File type is not allowed: ${contentType}` }, 415, headers);
    if (contentType === 'image/svg+xml') {
      const svg = await file.text();
      if (/<script\\b|on\\w+\\s*=|javascript:/i.test(svg)) return json({ error: 'SVG contains potentially unsafe active content.' }, 415, headers);
    }

    const category = contentType.startsWith('image/') ? 'images'
      : contentType.startsWith('video/') ? 'videos'
      : contentType.startsWith('audio/') ? 'audio'
      : 'models';
    const key = `${category}/${crypto.randomUUID()}.${safeExtension(file.name, contentType)}`;
    await env.MEDIA_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType,
        cacheControl: 'public, max-age=31536000, immutable',
        contentDisposition: 'inline',
      },
      customMetadata: { originalName: file.name.slice(0, 180) },
    });

    const mediaUrl = new URL(`/media/${key.split('/').map(encodeURIComponent).join('/')}`, url.origin).toString();
    headers.set('Cache-Control', 'no-store');
    return json({ url: mediaUrl, key, name: file.name, size: file.size, type: contentType }, 201, headers);
  },
};

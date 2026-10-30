export type CmsKey = 'projects' | 'disciplines' | 'team' | 'collaborations' | 'bgAudioConfig' | 'siteVisuals' | 'custom3DModel';
export type CmsSnapshot = Partial<Record<CmsKey, unknown>> & { initialized?: boolean };
const TOKEN_KEY = 'ovr_cms_admin_token';
const API_BASE = (import.meta.env.VITE_CMS_API_BASE as string | undefined)?.trim().replace(/\/$/, '') || '';
function endpoint(path: string) { return `${API_BASE}${path}`; }
export function getCmsToken(): string {
  try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}
export function setCmsToken(token: string) {
  try { sessionStorage.setItem(TOKEN_KEY, token); } catch { /* session storage may be unavailable */ }
}
export function clearCmsToken() {
  try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint(path), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `CMS request failed (${response.status}).`);
  return payload as T;
}
export async function loginToCms(password: string): Promise<string> {
  const result = await request<{ token: string }>('/api/cms/login', {
    method: 'POST', body: JSON.stringify({ password }),
  });
  if (!result.token) throw new Error('The CMS did not return an authentication token.');
  setCmsToken(result.token);
  return result.token;
}
export async function fetchCmsSnapshot(): Promise<{ initialized: boolean; content: CmsSnapshot }> {
  return request<{ initialized: boolean; content: CmsSnapshot }>('/api/cms/bootstrap');
}
export async function migrateCmsSnapshot(content: Record<CmsKey, unknown>): Promise<{ initialized: boolean; content: CmsSnapshot }> {
  return request<{ initialized: boolean; content: CmsSnapshot }>('/api/cms/migrate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getCmsToken()}` },
    body: JSON.stringify({ content }),
  });
}
export async function publishCmsContent(key: CmsKey, value: unknown): Promise<void> {
  const token = getCmsToken();
  if (!token) throw new Error('Your CMS session has expired. Please sign in again.');
  await request(`/api/cms/${key}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ value }),
  });
}

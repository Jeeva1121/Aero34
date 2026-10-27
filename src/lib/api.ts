import { Route, AvailabilityResponse, CreateRequestInput, RequestRecord } from '../../shared/schemas.js';

const API_BASE = '/api';

export async function fetchRoutes(): Promise<Route[]> {
  const res = await fetch(`${API_BASE}/routes`);
  if (!res.ok) throw new Error('Failed to retrieve routes');
  return res.json();
}

export async function fetchRouteBySlug(slug: string): Promise<Route> {
  const res = await fetch(`${API_BASE}/routes/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error('Route not found');
  return res.json();
}

export async function fetchAvailability(routeId: string, month?: string): Promise<AvailabilityResponse> {
  const q = new URLSearchParams({ route: routeId });
  if (month) q.append('month', month);
  const res = await fetch(`${API_BASE}/routes/availability/lookup?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to retrieve availability');
  return res.json();
}

export async function submitSeatRequest(data: CreateRequestInput): Promise<{ ref: string; status: string }> {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Failed to submit request');
  }
  return body;
}

export interface PublicStatusResponse {
  ref: string;
  status: 'Received' | 'Confirming' | 'Held' | 'Declined';
  originCity: string;
  originCode: string;
  destCity: string;
  destCode: string;
  aircraft: string;
  dates: string;
  partySize: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchRequestStatus(ref: string): Promise<PublicStatusResponse> {
  const res = await fetch(`${API_BASE}/requests/${encodeURIComponent(ref)}/status`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Reference inquiry failed');
  return body;
}

export function subscribeToStatusUpdates(
  ref: string,
  onUpdate: (payload: { ref: string; status: string; updatedAt: string }) => void
): () => void {
  const source = new EventSource(`${API_BASE}/requests/${encodeURIComponent(ref)}/stream`);

  source.addEventListener('status_update', (event) => {
    try {
      const data = JSON.parse(event.data);
      onUpdate(data);
    } catch {
      // safe fallback
    }
  });

  return () => {
    source.close();
  };
}

export async function fetchShortlist(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/shortlist`);
  if (!res.ok) return [];
  const body = await res.json();
  return body.routeIds || [];
}

export async function toggleShortlist(routeId: string, isSaved: boolean): Promise<boolean> {
  if (isSaved) {
    const res = await fetch(`${API_BASE}/shortlist/${encodeURIComponent(routeId)}`, {
      method: 'DELETE',
    });
    return !res.ok;
  } else {
    const res = await fetch(`${API_BASE}/shortlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeId }),
    });
    return res.ok;
  }
}

export async function adminLogin(username: string, password: string):Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Login rejected');
  return body;
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_BASE}/admin/logout`, { method: 'POST' });
}

export async function adminCheckAuth(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/admin/me`);
  return res.ok;
}

export async function adminFetchRequests(status?: string): Promise<RequestRecord[]> {
  const url = status && status !== 'all' ? `${API_BASE}/admin/requests?status=${status}` : `${API_BASE}/admin/requests`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Admin authorization required');
  return res.json();
}

export async function adminPatchStatus(ref: string, status: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/requests/${encodeURIComponent(ref)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Status patch rejected');
}

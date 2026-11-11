import Constants from 'expo-constants';

const PORT = 4000;

export const JSON_HEADERS = { 'Content-Type': 'application/json' };

let token: string | null = null;

export function setToken(value: string | null) {
  token = value;
}

function baseUrl(): string {
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:${PORT}`;
}

export async function request(path: string, options: RequestInit, action: string): Promise<Response> {
  const headers: Record<string, string> = { ...JSON_HEADERS };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(baseUrl() + path, { ...options, headers });
  } catch {
    throw new Error('No connection to the server. Check your network and try again.');
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Something went wrong when ${action}`);
  }

  return response;
}

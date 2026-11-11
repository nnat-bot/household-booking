import { request } from './client';
import type { LoginResult, Role, User } from '../types';

export async function register(
  name: string,
  email: string,
  password: string,
  role: Role,
): Promise<LoginResult> {
  const response = await request(
    '/auth/register',
    { method: 'POST', body: JSON.stringify({ name, email, password, role }) },
    'creating the account',
  );
  return response.json();
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await request(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    'logging in',
  );
  return response.json();
}

export async function getMe(): Promise<User> {
  const response = await request('/auth/me', {}, 'loading your account');
  return response.json();
}

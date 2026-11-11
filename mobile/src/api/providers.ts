import { request } from './client';
import type { Cleaner, CleanerProfile, ProviderService, Slot, WorkingHours } from '../types';

export async function getCleaners(): Promise<Cleaner[]> {
  const response = await request('/providers', {}, 'loading the cleaners');
  return response.json();
}

export async function getCleaner(id: number): Promise<CleanerProfile> {
  const response = await request(`/providers/${id}`, {}, 'loading the profile');
  return response.json();
}

export async function getSlots(id: number, date: string): Promise<Slot[]> {
  const response = await request(`/providers/${id}/slots?date=${date}`, {}, 'loading the free times');
  return response.json();
}

export async function updateMyProfile(
  name: string,
  bio: string,
  hourlyRate: string,
  avatarUrl: string | null,
): Promise<void> {
  await request(
    '/providers/me',
    { method: 'PUT', body: JSON.stringify({ name, bio, hourlyRate, avatarUrl }) },
    'saving the profile',
  );
}

export async function getMyWorkingHours(): Promise<WorkingHours[]> {
  const response = await request('/providers/me/availability', {}, 'loading your working hours');
  return response.json();
}

export async function saveMyWorkingHours(
  hours: { weekday: number; startTime: string; endTime: string }[],
): Promise<WorkingHours[]> {
  const response = await request(
    '/providers/me/availability',
    { method: 'PUT', body: JSON.stringify({ hours }) },
    'saving your working hours',
  );
  return response.json();
}

export async function getMyServices(): Promise<ProviderService[]> {
  const response = await request('/providers/me/services', {}, 'loading your services');
  return response.json();
}

export async function addMyService(service: {
  category: string;
  title: string;
  description: string;
  priceFrom: string;
}): Promise<ProviderService> {
  const response = await request(
    '/providers/me/services',
    { method: 'POST', body: JSON.stringify(service) },
    'adding the service',
  );
  return response.json();
}

export async function updateMyService(
  id: number,
  service: { category: string; title: string; description: string; priceFrom: string },
): Promise<ProviderService> {
  const response = await request(
    `/providers/me/services/${id}`,
    { method: 'PUT', body: JSON.stringify(service) },
    'saving the service',
  );
  return response.json();
}

export async function deleteMyService(id: number): Promise<void> {
  await request(`/providers/me/services/${id}`, { method: 'DELETE' }, 'deleting the service');
}

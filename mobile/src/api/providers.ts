import { request } from './client';
import type { Cleaner, CleanerProfile, Slot, WorkingHours } from '../types';

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

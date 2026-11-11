import { request } from './client';
import type { Booking, BookingDetail, NewBooking } from '../types';

export async function createBooking(booking: NewBooking): Promise<Booking> {
  const response = await request(
    '/bookings',
    { method: 'POST', body: JSON.stringify(booking) },
    'saving the booking',
  );
  return response.json();
}

export async function getBookings(): Promise<Booking[]> {
  const response = await request('/bookings', {}, 'loading the bookings');
  return response.json();
}

export async function getBooking(id: number): Promise<BookingDetail> {
  const response = await request(`/bookings/${id}`, {}, 'loading the booking');
  return response.json();
}

async function changeStatus(id: number, action: string, what: string): Promise<void> {
  await request(`/bookings/${id}/${action}`, { method: 'PUT' }, what);
}

export function cancelBooking(id: number): Promise<void> {
  return changeStatus(id, 'cancel', 'cancelling the booking');
}

export function acceptBooking(id: number): Promise<void> {
  return changeStatus(id, 'accept', 'accepting the request');
}

export function declineBooking(id: number): Promise<void> {
  return changeStatus(id, 'decline', 'declining the request');
}

export function completeBooking(id: number): Promise<void> {
  return changeStatus(id, 'complete', 'finishing the booking');
}

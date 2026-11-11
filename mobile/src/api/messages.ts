import { request } from './client';
import type { Message } from '../types';

export async function getMessages(bookingId: number): Promise<Message[]> {
  const response = await request(`/messages/${bookingId}`, {}, 'loading the messages');
  return response.json();
}

export async function sendMessage(bookingId: number, body: string): Promise<Message> {
  const response = await request(
    `/messages/${bookingId}`,
    { method: 'POST', body: JSON.stringify({ body }) },
    'sending the message',
  );
  return response.json();
}

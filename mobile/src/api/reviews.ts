import { request } from './client';

export async function addReview(bookingId: number, rating: number, comment: string): Promise<void> {
  await request(
    '/reviews',
    { method: 'POST', body: JSON.stringify({ bookingId, rating, comment }) },
    'saving the review',
  );
}

import { Reservation, ReservationsResponse } from './types';

export const convertStatus = (text: ReservationsResponse['reservations'][0]['status']): Reservation['status'] => {
  // if (text === '') return 'pending'; // 不明
  if (text === 'confirmed') return 'approved';
  // if (text === '') return 'staying'; // 不明
  // if (text === '') return 'stayed'; // confirmed
  if (text === 'canceled') return 'canceled';
  if (text === 'declined') return 'rejected';

  return null;
};

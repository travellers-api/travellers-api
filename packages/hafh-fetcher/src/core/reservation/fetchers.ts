import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { ReservationsResponse } from './types';

export const fetchReservations = async (
  token: string,
  type: 'upcoming' | 'past' = 'upcoming'
): Promise<ReservationsResponse> => {
  const res = await fetch(`https://www.hafh.com/api/neighbors/reservations/${type}`, {
    headers: {
      authorization: `Bearer ${token}`,
      'Accept-Language': 'ja',
      'User-Agent': userAgent,
    },
  });
  const json = (await res.json()) as ReservationsResponse;
  return json;
};

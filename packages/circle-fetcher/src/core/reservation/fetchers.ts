import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { parseReservations } from './parsers';
import { Reservation } from './types';

export const fetchReservations = async (cookie: string): Promise<Reservation[]> => {
  const url = 'https://reserva.be/mypage/reservehistory';
  const res = await fetch(url, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
  });
  if (!res.ok && res.status === 404) {
    throw new Error('not found');
  }
  if (!res.ok) {
    throw new Error();
  }

  const html = await res.text();

  const reservations = parseReservations(html);

  return reservations;
};

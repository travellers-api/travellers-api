import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { parseReservations } from './parsers';
import { Reservation } from './types';

export const fetchReservations = async (
  cookie: string,
  tab: 'reserved' | 'staying' | 'stayed' | 'canceled' = 'reserved'
): Promise<Reservation[]> => {
  const res = await fetch(`https://address.love/reservations?tab=${tab}`, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
  });
  const html = await res.text();
  const reservations = parseReservations(html);

  return reservations;
};

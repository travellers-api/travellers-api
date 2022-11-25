import fetch from 'node-fetch';
import { parseReservations } from './parsers';
import { Reservation } from './types';

export const fetchReservations = async (
  cookie: string,
  tab: 'reserved' | 'staying' | 'stayed' | 'canceled' = 'reserved'
): Promise<Reservation[]> => {
  const res = await fetch(`https://address.love/reservations?tab=${tab}`, {
    headers: {
      cookie,
    },
  });
  const html = await res.text();
  const reservations = parseReservations(html);

  return reservations;
};

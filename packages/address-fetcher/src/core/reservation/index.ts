import { fetchReservations } from './fetchers';
import { Reservation } from './types';
import { concatReservations, sortReservations } from './utils';

export const getReservations = async (cookie: string): Promise<Reservation[]> => {
  const [stayingReservations, reservedReservations] = await Promise.all([
    fetchReservations(cookie, 'staying'),
    fetchReservations(cookie, 'reserved'),
  ]);
  const rawReservations = [...stayingReservations, ...reservedReservations];
  const reservations = concatReservations(sortReservations(rawReservations));
  return reservations;
};

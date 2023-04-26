import { fetchReservations } from './fetchers';
import { Reservation } from './types';
import { mergeReservations, sortByCheckInDate } from './utils';

export const getReservations = async (cookie: string): Promise<Reservation[]> => {
  const [stayingReservations, reservedReservations] = await Promise.all([
    fetchReservations(cookie, 'staying'),
    fetchReservations(cookie, 'reserved'),
  ]);
  const rawReservations = [...stayingReservations, ...reservedReservations].sort(sortByCheckInDate);
  const reservations = mergeReservations(rawReservations);
  return reservations;
};

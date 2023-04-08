import { fetchReservations } from './fetchers';
import { Reservation } from './types';
import { filterByAfterNow, sortByCheckInDate } from './utils';

export const getReservations = async (cookie: string, now = new Date()): Promise<Reservation[]> => {
  const [reservingReservations, doneReservations] = await Promise.all([
    fetchReservations(cookie, 'reserving'),
    fetchReservations(cookie, 'done'),
  ]);
  return [...reservingReservations, ...doneReservations].sort(sortByCheckInDate).filter(filterByAfterNow(now));
};

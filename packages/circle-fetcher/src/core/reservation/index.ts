import { fetchReservations } from './fetchers';
import { Reservation } from './types';

export const getReservations = async (cookie: string): Promise<Reservation[]> => {
  const reservations = fetchReservations(cookie);
  return reservations;
};

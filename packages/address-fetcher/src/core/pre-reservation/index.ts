import { fetchPreReservation } from './fetchers';

export const getPreReservation = async (cookie: string, roomId: string, checkInDate: string, checkOutDate: string) => {
  const preReservation = await fetchPreReservation(cookie, roomId, checkInDate, checkOutDate);
  return preReservation;
};

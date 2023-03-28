import { fetchHomeStatuses } from './fetchers';
import { HomeReservationStatus } from './types';

export const getHomeReservationStatuses = async (
  hotelNumber: number,
  targetDate: string,
  cookie: string
): Promise<HomeReservationStatus[]> => {
  const homeStatuses = await fetchHomeStatuses(hotelNumber, targetDate, cookie);
  return homeStatuses;
};

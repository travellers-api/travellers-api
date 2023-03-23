import { Hotel } from '../shared/hotel-title/types';

export type Reservation = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  hotel: Hotel;
};

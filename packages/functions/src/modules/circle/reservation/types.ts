import { Hotel } from '../shared/hotel-title/types';

export type Reservation = {
  id: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | null;
  checkInDate: string;
  checkOutDate: string;
  hotel: Hotel;
};

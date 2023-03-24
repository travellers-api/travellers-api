import { fetchReservations } from './fetchers';
import { Reservation } from './types';
import { convertStatus } from './utils';

export const getReservations = async (token: string): Promise<Reservation[]> => {
  const { reservations } = await fetchReservations(token, 'upcoming');

  return reservations.map((reservation) => ({
    id: reservation.confirmation_number,
    status: convertStatus(reservation.status),
    checkInDate: reservation.check_in_date,
    checkOutDate: reservation.check_out_date,
    home: {
      name: reservation.property.name,
      city: reservation.property.prefecture,
    },
  }));
};

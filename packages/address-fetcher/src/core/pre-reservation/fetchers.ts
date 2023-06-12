import { userAgent } from '../../constants';
import { parsePreReservation } from './parsers';

export const fetchPreReservation = async (
  cookie: string,
  roomId: string,
  checkInDate: string,
  checkOutDate: string
) => {
  const url = new URL('https://address.love/reservations/new');
  url.searchParams.append('room_id', roomId);
  url.searchParams.append('check_in_date', checkInDate);
  url.searchParams.append('check_out_date', checkOutDate);

  const res = await fetch(url, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
  });
  const html = await res.text();
  const preReservation = parsePreReservation(html);
  return preReservation;
};

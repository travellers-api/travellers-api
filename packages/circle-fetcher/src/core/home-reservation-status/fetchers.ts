import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { parseHomeReservationStatusesPage } from './parsers';
import { HomeReservationStatus } from './types';

export const fetchHomeStatuses = async (
  hotelNumber: number,
  targetDate: string,
  cookie: string
): Promise<HomeReservationStatus[]> => {
  const url = 'https://reserva.be/AjaxSearch';
  const body = new URLSearchParams();
  body.append('cmd', 'hotel_calendar');
  body.append('htl_no', hotelNumber.toString());
  body.append('reserve_bus_cd', '221146');
  body.append('htl_room_num', '1');
  body.append('htl_target_date', targetDate);
  body.append('stay_people', '1');
  body.append('is_mobile', '0');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    body,
  });
  if (!res.ok && res.status === 404) {
    throw new Error('not found');
  }
  if (!res.ok) {
    throw new Error();
  }

  const json = (await res.json()) as { htl_target_date: string; calenadr_html: string };

  const dates = await parseHomeReservationStatusesPage(targetDate, json.calenadr_html);

  return dates;
};

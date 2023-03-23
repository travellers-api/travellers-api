import * as cheerio from 'cheerio';
import { parseHotelTitle } from '../shared/hotel-title/parsers';
import { Reservation } from './types';

export const parseReservations = (html: string): Reservation[] => {
  const $ = cheerio.load(html);

  const reservations: Reservation[] = $('#main_tbody tr')
    .map((index, element) => {
      const $element = $(element);
      const id = $element.attr('id')?.split('_')[1] ?? '';
      const dateText = $element.find('.day').text().trim().replace(/\//g, '-');
      const [startDate = '', endDate = ''] = dateText.split('～').map((date) => date.replace(/\n/g, ''));

      const title = $element.find('.name').text().trim();
      const hotel = parseHotelTitle(title);

      const reservation: Reservation = {
        id,
        status: $element.find('.status span').text().trim(),
        startDate,
        endDate,
        hotel,
      };

      return reservation;
    })
    .get();

  return reservations;
};

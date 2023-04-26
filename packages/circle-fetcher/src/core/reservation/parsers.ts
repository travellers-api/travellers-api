import * as cheerio from 'cheerio';
import { parseHomeTitle } from '../shared/home-title/parsers';
import { Reservation } from './types';

export const parseReservations = (html: string): Reservation[] => {
  const $ = cheerio.load(html);

  if ($('.attention.center').text().trim() === '該当データがありません。') {
    return [];
  }

  const reservations: Reservation[] = $('#main_tbody tr')
    .map((index, element) => {
      const $element = $(element);
      const id = $element.attr('id')?.split('_')[1] ?? '';
      const dateText = $element.find('.day').text().trim().replace(/\//g, '-');
      const [checkInDate = '', checkOutDate = ''] = dateText.split('～').map((date) => date.replace(/\n/g, ''));

      const title = $element.find('.name').text().trim();
      const home = parseHomeTitle(title);

      const reservation: Reservation = {
        id,
        status: parseStatus($element.find('.status span').text().trim()),
        checkInDate,
        checkOutDate,
        home,
      };

      return reservation;
    })
    .get()
    .sort((a, z) => (a.checkInDate > z.checkInDate ? 1 : -1));

  return reservations;
};

const parseStatus = (text: string): Reservation['status'] => {
  text = text.replace('●', '').trim();

  if (text === '申請中') return 'pending'; // 不明
  if (text === '予約確定') return 'approved';
  if (text === '滞在中') return 'staying'; // 不明
  if (text === '滞在済み') return 'stayed'; // 不明
  if (text === 'キャンセル') return 'canceled';

  return null;
};

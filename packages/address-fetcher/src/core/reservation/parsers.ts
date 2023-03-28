import * as cheerio from 'cheerio';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { Reservation } from './types';

dayjs.extend(customParseFormat);

export const parseReservations = (html: string): Reservation[] => {
  const $ = cheerio.load(html);

  const elms = $('.history-list').get();
  const data = elms.map((elm) => {
    const $target = $(elm);
    return {
      id: $target.find('.btn.btn-white.btn-single').attr('href')?.replace('/reservations/', '') ?? '',
      status: parseStatus($target.find('h4 + p').text()),
      checkInDate: parseDate($target.find('li:nth-child(1)').text()),
      checkOutDate: parseDate($target.find('li:nth-child(2)').text()),
      home: {
        id: $target.find('h4 a').attr('href')?.replace('/homes/', '') ?? '',
        name: $target.find('h4 a').text(),
        room: $target.find('h4 small').text(),
      },
    };
  });
  return data;
};

const parseDate = (text: string): string => {
  return dayjs(
    text.replace(/^(到着日|出発日)：/, '').replace(/（[月火水木金土日]）$/, ''),
    'YYYY年MM月DD日',
    true
  ).format('YYYY-MM-DD');
};

const parseStatus = (text: string): Reservation['status'] => {
  text = text.replace('●', '').trim();

  if (text === '申請中') return 'pending';
  if (text === '承認済み') return 'approved';
  if (text === '滞在中') return 'staying';
  if (text === '滞在済み') return 'stayed';
  if (text === 'キャンセル') return 'canceled';

  return null;
};

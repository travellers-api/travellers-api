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
      checkInDate: parseDate($(elm).find('li:nth-child(1)').text()),
      checkOutDate: parseDate($(elm).find('li:nth-child(2)').text()),
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

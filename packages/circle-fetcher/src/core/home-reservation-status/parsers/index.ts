import * as cheerio from 'cheerio';
import { HomeReservationStatus } from '../types';

export const parseHomeReservationStatusesPage = (targetDate: string, html: string): HomeReservationStatus[] => {
  const $ = cheerio.load(html);

  const dates = $('table.cal td')
    .get()
    .filter((dateElm) => $(dateElm).find('.day').length > 0)
    .map((dateElm) => {
      const $date = $(dateElm);
      const date = targetDate.slice(0, 8) + `0${$date.find('.day').text()}`.slice(-2);

      if ($date.attr('class') === 'complete') {
        return {
          date,
          vacancy: null,
        };
      }

      if ($date.attr('class') === 'full') {
        return {
          date,
          vacancy: false,
        };
      }

      return {
        date,
        vacancy: true,
      };
    });

  return dates;
};

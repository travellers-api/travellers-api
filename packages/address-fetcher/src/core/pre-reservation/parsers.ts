import * as cheerio from 'cheerio';
import { PreReservation } from './types';

export const parsePreReservation = (html: string): PreReservation => {
  const $ = cheerio.load(html);

  const errors = $('.alert.alert-danger ul li')
    .get()
    .map((elm) => {
      const $elm = $(elm);
      return $elm.text().trim();
    });
  return {
    errors,
  };
};

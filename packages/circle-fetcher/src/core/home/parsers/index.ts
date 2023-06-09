import * as cheerio from 'cheerio';
import { parseHomeTitle } from '../../shared/home-title/parsers';
import { Home } from '../types';

export const parseHomesPage = (html: string): Home[] => {
  const $ = cheerio.load(html);

  const homes = $('.wrap')
    .get()
    .map((homeElm) => {
      try {
        const $home = $(homeElm);

        const hotelNumber = Number(
          $home
            .find('[id^="hotel_no_"]')
            .attr('id')
            ?.replace(/^hotel_no_/, '') ?? ''
        );
        const id = $home.find('[id^="hotel_no_"]').attr('value') ?? '';
        const { name, city, roomType } = parseHomeTitle($home.find('.title').text());
        const tags = $home
          .find('.info span')
          .get()
          .map((info) => $(info).text());

        const home: Home = {
          hotelNumber,
          id,
          name,
          city,
          roomType,
          tags,
        };
        return home;
      } catch (e) {
        console.error(e);
        return null;
      }
    })
    .filter((home): home is Home => home !== null);

  return homes;
};

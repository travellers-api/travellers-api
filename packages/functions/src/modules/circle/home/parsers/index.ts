import * as cheerio from 'cheerio';
import { Home } from '../types';

const parseTitle = (title: string): Pick<Home, 'name' | 'city' | 'roomType' | 'sex'> => {
  const name = title.replace(/^【.+】/, '').trim();
  const matches = title.match(/^【(.+?)?\/(.+?)?(（(.+?)）)?】/);

  return {
    name,
    city: matches?.[1]?.trim() ?? '',
    roomType: matches?.[2]?.trim() ?? '',
    sex: matches?.[4]?.trim() ?? null,
  };
};

export const parseHomesPage = (html: string): Home[] => {
  const $ = cheerio.load(html);

  const homes = $('.wrap')
    .get()
    .map((homeElm) => {
      const $home = $(homeElm);

      const hotelNumber = Number(
        $home
          .find('[id^="hotel_no_"]')
          .attr('id')
          ?.replace(/^hotel_no_/, '') ?? ''
      );
      const id = $home.find('[id^="hotel_no_"]').attr('value') ?? '';
      const { name, city, roomType, sex } = parseTitle($home.find('.title').text());
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
        sex,
        tags,
      };
      return home;
    });

  return homes;
};

import * as cheerio from 'cheerio';
import { Home, Room } from '../types';

const fields: {
  name: keyof Home;
  parse: ($: cheerio.CheerioAPI) => any | Promise<any>;
}[] = [
  {
    name: 'id',
    parse: ($) => {
      return Number($('link[rel="canonical"]').attr('href')?.replace('https://address.love/homes/', '') ?? '0');
    },
  },
  {
    name: 'url',
    parse: ($) => {
      return $('link[rel="canonical"]').attr('href') ?? '';
    },
  },
  {
    name: 'name',
    parse: ($) => {
      return $('.propertydetail-title h1').text();
    },
  },
  {
    name: 'thumbnail',
    parse: ($) => {
      return $('.homes-card__thumbnail img').attr('src') ?? '';
    },
  },
  {
    name: 'prefecture',
    parse: ($) => {
      return $('.propertydetail-title p').text();
    },
  },
  {
    name: 'homeType',
    parse: ($) => {
      return (
        $('.base-infolist li')
          .get()
          .filter((li) => {
            const $li = $(li);
            return $li
              .find('img')
              .attr('src')
              ?.startsWith('https://cdn.address.love/packs/media/images/icon_baseinfo_home');
          })
          .map((li) => {
            const $li = $(li);
            return $li.find('p:nth-child(2)').text().split('\n')[0]?.trim() ?? '';
          })[0] ?? ''
      );
    },
  },
  {
    name: 'reservationLimit',
    parse: ($) => {
      return (
        $('.base-infolist li')
          .get()
          .filter((li) => {
            const $li = $(li);
            return $li
              .find('img')
              .attr('src')
              ?.startsWith('https://cdn.address.love/packs/media/images/icon_baseinfo_calendar');
          })
          .map((li) => {
            const $li = $(li);
            return $li.find('p:nth-child(2)').text().split('\n')[0]?.trim() ?? '予約制限なし';
          })[0] ?? '予約制限なし'
      );
    },
  },
  {
    name: 'address',
    parse: ($) => {
      const text = $('#access + div > p').text().replace('GoogleMap', '').trim();
      const postalCode = text.replace(/^〒(\d+)\s.+$/, '$1');
      const latLngText = $('#access + div > p a').attr('href')?.replace('https://maps.google.com/?q=', '') ?? '';

      return {
        postalCode,
        text,
        lat: Number(latLngText.replace(/,.+$/, '') ?? '0'),
        lng: Number(latLngText.replace(/^.+,/, '') ?? '0'),
      };
    },
  },
  {
    name: 'rooms',
    parse: ($) => {
      return $('#room-all .room')
        .get()
        .map((elm): Room => {
          const type = $(elm).find('ul li:first-child').text().trim().replace(/（.+$/, '');

          const id = Number($(elm).find('button').attr('data-bs-room-id') ?? '');
          const name = $(elm).find('h3').text();
          const thumbnail = $(elm).find('.card__image').attr('src') ?? '';
          const capacity = Number(
            $(elm)
              .find('ul li:first-child')
              .text()
              .trim()
              .replace(/^.+（定員/, '')
              .replace(/名）$/, '')
          );
          const sex = type.startsWith('男性専用') ? 'male' : type.startsWith('女性専用') ? 'female' : null;

          const room: Home['rooms'][0] = {
            id,
            name,
            thumbnail,
            type: type.replace(/^[男女]性専用/, '') as Room['type'],
            capacity,
            sex,
            // あとから合成
            calendar: {
              reservedDates: [],
              calStartDate: '',
              calEndDate: '',
              reservablePeriod: '',
              holidays: [],
              minDays: -1,
              availableWeeks: -1,
            },
          };

          return room;
        });
    },
  },
];

export const parseHomePage = async (html: string): Promise<Home> => {
  const $ = cheerio.load(html);

  const obj: Partial<Home> = {};
  await Promise.all(
    fields.map(async (field) => {
      obj[field.name] = await field.parse($);
    })
  );
  return obj as Home;
};

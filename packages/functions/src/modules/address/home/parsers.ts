import * as cheerio from 'cheerio';

export const parseHomePage = (html: string): any => {
  const $ = cheerio.load(html);

  const $calendar = $('#roomReserveCalendar');
  const rooms = JSON.parse($calendar.attr('data-rooms') ?? '');
  const calStartDate = $calendar.attr('data-cal-start-date') ?? '';
  const calEndDate = $calendar.attr('data-cal-end-date') ?? '';
  const reservablePeriod = $calendar.attr('data-reservable-period') ?? '';
  const holidays = JSON.parse($calendar.attr('data-holydays') ?? '[]');
  const minDays = Number($calendar.attr('data-min-days') ?? '');

  return {
    id: Number($('link[rel="canonical"]').attr('href')?.replace('https://address.love/homes/', '') ?? '0'),
    name: $('.propertydetail-title h1').text(),
    thumbnail: $('.homes-card__thumbnail img').attr('src') || '',
    prefecture: $('.propertydetail-title p').text(),
    address: {
      text: $('#access + div > p').text().replace('GoogleMap', '').trim(),
      lat: Number(
        $('#access + div > p a').attr('href')?.replace('https://maps.google.com/?q=', '').replace(/,.+$/, '') ?? '0'
      ),
      lng: Number(
        $('#access + div > p a').attr('href')?.replace('https://maps.google.com/?q=', '').replace(/^.+,/, '') ?? '0'
      ),
    },
    rooms: $('#room-all .room')
      .get()
      .map((elm) => ({
        id: Number($(elm).find('button').attr('data-bs-room-id') || ''),
        name: $(elm).find('h3').text(),
        thumbnail: $(elm).find('.card__image').attr('src') || '',
        type: $(elm).find('ul li:first-child').text().trim().replace(/（.+$/, ''),
        capacity: Number(
          $(elm)
            .find('ul li:first-child')
            .text()
            .trim()
            .replace(/^.+（定員/, '')
            .replace(/名）$/, '')
        ),
      })),
    calendar: {
      rooms,
      calStartDate,
      calEndDate,
      reservablePeriod,
      holidays,
      minDays,
    },
  };
};

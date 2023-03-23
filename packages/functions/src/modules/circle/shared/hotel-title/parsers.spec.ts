import { parseHotelTitle } from './parsers';

test('parseHotelTitle', () => {
  expect(parseHotelTitle('【北海道安平町 / 相部屋（男女共用）】VACILANDO')).toEqual({
    name: 'VACILANDO',
    city: '北海道安平町',
    roomType: '相部屋（男女共用）',
  });

  expect(parseHotelTitle('【高知県東洋町/ 個室】生見邸')).toEqual({
    name: '生見邸',
    city: '高知県東洋町',
    roomType: '個室',
  });
});

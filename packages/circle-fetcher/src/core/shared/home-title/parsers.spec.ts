import { parseHomeTitle } from './parsers';

describe('parseHomeTitle', () => {
  test('通常', () => {
    expect(parseHomeTitle('【北海道安平町 / 相部屋（男女共用）】VACILANDO')).toEqual({
      name: 'VACILANDO',
      city: '北海道安平町',
      roomType: '相部屋（男女共用）',
    });
  });

  test('スペースがない', () => {
    expect(parseHomeTitle('【高知県東洋町/ 個室】生見邸')).toEqual({
      name: '生見邸',
      city: '高知県東洋町',
      roomType: '個室',
    });
  });

  test('※がある', () => {
    expect(parseHomeTitle('※期間限定！7/10まで※【長野県松本市 / 個室】B&Bテンガロンハット＆ヤムヤムツリー')).toEqual({
      name: 'B&Bテンガロンハット＆ヤムヤムツリー',
      city: '長野県松本市',
      roomType: '個室',
    });
  });
});

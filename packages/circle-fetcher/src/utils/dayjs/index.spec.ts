import { convertToJst } from '.';

describe('convertToJst', () => {
  test('日付オブジェクトから日本時刻の文字列を取得できる', () => {
    expect(convertToJst(new Date('2023-04-08T05:24:41.645Z'))).toBe('2023-04-08 14:24:41');
  });
});

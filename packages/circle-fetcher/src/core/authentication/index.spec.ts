import { checkValidityCookie } from '.';

describe('checkValidityCookie', () => {
  test('実際の Cookie', async () => {
    const isValid1 = await checkValidityCookie(process.env.CIRCLE_USER_COOKIE || '');
    expect(isValid1).toBe(true);
  });
  test('デタラメな Cookie', async () => {
    const isValid = await checkValidityCookie('PHPSESSID=abcde12345');
    expect(isValid).toBe(false);
  });
});

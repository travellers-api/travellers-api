import { checkValidityCookie } from '.';

describe('checkValidityCookie', () => {
  test('実際の Cookie', async () => {
    const isValid1 = await checkValidityCookie(process.env.ADDRESS_COOKIE || '');
    expect(isValid1).toBe(true);
  });
  test('デタラメな Cookie', async () => {
    const isValid = await checkValidityCookie('remember_user_token=abcde12345; _address_core_session=abcde12345');
    expect(isValid).toBe(false);
  });
});

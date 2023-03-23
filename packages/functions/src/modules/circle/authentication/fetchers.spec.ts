import { fetchUserCookie } from './fetchers';

test('fetchUserCookie', async () => {
  const cookie = await fetchUserCookie(process.env.CIRCLE_EMAIL || '', process.env.CIRCLE_PASSWORD || '');
  expect(cookie).toMatch(/^PHPSESSID=.+$/);
});

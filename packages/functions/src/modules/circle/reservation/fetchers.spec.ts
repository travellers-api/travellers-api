import { fetchReservations } from './fetchers';

test('fetchReservations', async () => {
  const reservations = await fetchReservations(process.env.CIRCLE_USER_COOKIE ?? '');
  expect(Array.isArray(reservations)).toBe(true);
});

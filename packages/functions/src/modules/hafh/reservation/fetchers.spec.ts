import { fetchReservations } from './fetchers';

describe('fetchReservations', () => {
  test('upcoming 取得できる', async () => {
    const response = await fetchReservations(process.env.HAFH_TOKEN || '', 'upcoming');
    expect(typeof response.total_count).toBe('number');
  });

  test('past 取得できる', async () => {
    const response = await fetchReservations(process.env.HAFH_TOKEN || '', 'past');
    expect(typeof response.total_count).toBe('number');
  });
});

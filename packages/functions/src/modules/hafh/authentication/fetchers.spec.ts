import { verifyPassword } from './fetchers';

describe('verifyPassword', () => {
  test('ログインできる', async () => {
    const json = await verifyPassword(process.env.HAFH_EMAIL || '', process.env.HAFH_PASSWORD || '');
    expect(Object.keys(json)).toEqual([
      'kind',
      'localId',
      'email',
      'displayName',
      'idToken',
      'registered',
      'profilePicture',
      'refreshToken',
      'expiresIn',
    ]);
  });
});

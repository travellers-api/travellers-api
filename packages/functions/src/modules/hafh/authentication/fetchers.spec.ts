import { checkValidityToken, getAccountInfo, verifyPassword } from './fetchers';

describe('一連', () => {
  test('ログインできる', async () => {
    const verifyPasswordRes = await verifyPassword(process.env.HAFH_EMAIL || '', process.env.HAFH_PASSWORD || '');
    const getAccountInfoRes = await getAccountInfo(verifyPasswordRes.idToken);
    const isValid = await checkValidityToken(getAccountInfoRes.users[0].localId, verifyPasswordRes.idToken);
    expect(isValid).toBe(true);
  });
});

describe('checkValidityToken', () => {
  test('適当なToken', async () => {
    const isValid = await checkValidityToken('abcde12345', 'aiueo12345');
    expect(isValid).toBe(false);
  });
});

import { checkValidityToken } from '.';

describe('checkValidityToken', () => {
  test('適当なToken', async () => {
    const isValid = await checkValidityToken('abcde12345', 'aiueo12345');
    expect(isValid).toBe(false);
  });
});

import { mergeCookie } from './utils';

describe('mergeCookie', () => {
  test('set-cookie 処理', () => {
    expect(
      mergeCookie(
        'AWSALB=abcde12345; Expires=Thu, 30 Mar 2023 21:51:45 GMT; Path=/, AWSALBCORS=12345abcde; Expires=Thu, 30 Mar 2023 21:51:45 GMT; Path=/; SameSite=None; Secure'
      )
    ).toBe('AWSALB=abcde12345; AWSALBCORS=12345abcde');

    expect(
      mergeCookie(
        'AWSALB=abcde12345; Expires=Thu, 30 Mar 2023 21:51:45 GMT; Path=/, AWSALBCORS=abcde12345; Expires=Thu, 30 Mar 2023 21:51:45 GMT; Path=/; SameSite=None; Secure, PHPSESSID=abc123; path=/; HttpOnly;Secure;SameSite=None'
      )
    ).toBe('AWSALB=abcde12345; AWSALBCORS=abcde12345; PHPSESSID=abc123');

    expect(
      mergeCookie(
        'AWSALB=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/, AWSALBCORS=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/; SameSite=None; Secure, IDPHPSESSID=def456; path=/; HttpOnly;HttpOnly;Secure;SameSite=None, auth_pass=1; expires=Thu, 23-Mar-2023 21:51:47 GMT; Max-Age=1; path=/; secure;HttpOnly;Secure;SameSite=None'
      )
    ).toBe('AWSALB=abcde12345==; AWSALBCORS=abcde12345==; IDPHPSESSID=def456');

    expect(
      mergeCookie(
        'AWSALB=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/, AWSALBCORS=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/; SameSite=None; Secure'
      )
    ).toBe('AWSALB=abcde12345==; AWSALBCORS=abcde12345==');

    expect(
      mergeCookie(
        'AWSALB=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/, AWSALBCORS=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/; SameSite=None; Secure, OP-SESSID-CONSUMER=ghi789; expires=Sat, 22-Apr-2023 21:51:46 GMT; Max-Age=2592000; path=/;HttpOnly;Secure;SameSite=None'
      )
    ).toBe('AWSALB=abcde12345==; AWSALBCORS=abcde12345==; OP-SESSID-CONSUMER=ghi789');

    expect(
      mergeCookie(
        'AWSALB=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/, AWSALBCORS=abcde12345==; Expires=Thu, 30 Mar 2023 21:51:46 GMT; Path=/; SameSite=None; Secure'
      )
    ).toBe('AWSALB=abcde12345==; AWSALBCORS=abcde12345==');
  });
});

import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { setCookieStringToMap } from '../../utils/cookie';
import { parseToken } from './parsers';

export const fetchToken = async (): Promise<{
  cookie: string;
  authenticityToken: string;
}> => {
  const res = await fetch('https://address.love/login', {
    headers: {
      'User-Agent': userAgent,
    },
  });
  const html = await res.text();

  const cookie = res.headers.get('set-cookie');

  if (!cookie) {
    throw new Error('cookie is not set.');
  }

  const { authenticityToken } = parseToken(html);

  return { cookie, authenticityToken };
};

export const fetchCookie = async ({
  cookie,
  authenticityToken,
  email,
  password,
}: {
  cookie: string;
  authenticityToken: string;
  email: string;
  password: string;
}): Promise<string> => {
  const params = new URLSearchParams();
  params.append('authenticity_token', authenticityToken);
  params.append('user[email]', email);
  params.append('user[password]', password);
  params.append('user[remember_me]', '0');
  params.append('user[remember_me]', '1');
  params.append('commit', 'ログイン');

  const res = await fetch('https://address.love/login', {
    method: 'POST',
    body: params,
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  const cookieMap = setCookieStringToMap(res.headers.get('set-cookie') || '');
  const rememberUserToken = cookieMap.get('remember_user_token');
  const addressCoreSession = cookieMap.get('_address_core_session');

  if (!rememberUserToken || !addressCoreSession) {
    throw new Error('cookie is not set.');
  }

  return `remember_user_token=${rememberUserToken}; _address_core_session=${addressCoreSession}`;
};

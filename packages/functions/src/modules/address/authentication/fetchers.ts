import fetch from 'node-fetch';
import { parseToken } from './parsers';

export const fetchToken = async (): Promise<{
  cookie: string;
  authenticityToken: string;
}> => {
  const res = await fetch('https://address.love/login');
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
    },
    redirect: 'manual',
  });
  const newCookie = res.headers.get('set-cookie');

  if (!newCookie) {
    throw new Error('cookie is not set.');
  }

  return newCookie;
};

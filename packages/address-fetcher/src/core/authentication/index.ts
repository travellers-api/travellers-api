import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { fetchToken, fetchCookie } from './fetchers';

export const getCookie = async ({ email, password }: { email: string; password: string }): Promise<string> => {
  const { cookie: baseCookie, authenticityToken } = await fetchToken();
  const cookie = await fetchCookie({
    cookie: baseCookie,
    authenticityToken,
    email,
    password,
  });
  return cookie;
};

export const checkValidityCookie = async (cookie: string): Promise<boolean> => {
  const res = await fetch('https://address.love/mypage/profile', {
    method: 'HEAD',
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  const location = res.headers.get('location');
  return !location;
};

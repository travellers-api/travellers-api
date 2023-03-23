import fetch from 'node-fetch';
import { setCookieStringToMap } from '../../../utils/cookie';
import { userAgent } from '../../client/user-agent';
import { ignoreCookieKeys } from './constants';
import { mergeCookie } from './utils';

export const fetchAikotobaCookie = async (aikotoba: string): Promise<string> => {
  const body = new URLSearchParams();
  body.append('bus_id', 'circle01cw');
  body.append('bus_aikotoba_answer', aikotoba);

  const res = await fetch('https://reserva.be/circle01cw/aikotoba', {
    method: 'POST',
    body,
    headers: {
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  const newCookie = res.headers.get('set-cookie') ?? '';
  const matches = newCookie.match(/PHPSESSID=.+?;/);

  if (!matches?.[0]) {
    throw new Error('cookie is not set.');
  }

  return matches[0];
};

export const fetchUserCookie = async (email: string, password: string): Promise<string> => {
  let cookie = '';

  const res1 = await fetch('https://reserva.be/login', {
    headers: {
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  cookie = mergeCookie(res1.headers.get('set-cookie'), cookie);
  const location2 = res1.headers.get('location') || '';

  const res2 = await fetch(location2, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  cookie = mergeCookie(res2.headers.get('set-cookie'), cookie);
  const location3 = res2.headers.get('location') || '';

  const res3 = await fetch(location3, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  cookie = mergeCookie(res3.headers.get('set-cookie'), cookie);
  const location4 = res3.headers.get('location') || '';

  const res4 = await fetch(location4, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  cookie = mergeCookie(res4.headers.get('set-cookie'), cookie);
  const html4 = await res4.text();
  const matches4 = html4.match(/<input type="hidden" name="form_token" value="([a-z0-9]+)" \/>/);
  const formToken = matches4?.[1] ?? '';

  const body5 = new URLSearchParams();
  body5.append('form_token', formToken);
  body5.append('mode', 'login');
  body5.append('next_check_flg', '0');
  body5.append('mem_id', email);
  body5.append('mem_pass', password);

  const res5 = await fetch('https://id-sso.reserva.be/login/consumer', {
    method: 'POST',
    body: body5,
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  cookie = mergeCookie(res5.headers.get('set-cookie'), cookie);
  const location6 = res5.headers.get('location') || '';

  const res6 = await fetch(location6, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
    redirect: 'manual',
  });
  cookie = mergeCookie(res6.headers.get('set-cookie'), cookie);

  const sessionId = setCookieStringToMap(cookie, ignoreCookieKeys).get('PHPSESSID');
  if (!sessionId) {
    throw new Error('cookie is not set.');
  }

  return `PHPSESSID=${sessionId}`;
};

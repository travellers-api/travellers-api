import fetch from 'node-fetch';
import { userAgent } from '../../client/user-agent';

export const fetchCookie = async (aikotoba: string): Promise<string> => {
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

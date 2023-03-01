import fetch from 'node-fetch';
import { userAgent } from '../../client/user-agent';
import { parseHomesPage } from './parsers';

export const fetchHomes = async (cookie: string): Promise<any> => {
  const url = 'https://reserva.be/circle01cw/reserve';
  const res = await fetch(url, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
  });
  if (!res.ok && res.status === 404) {
    throw new Error('not found');
  }
  if (!res.ok) {
    throw new Error();
  }

  const html = await res.text();

  const homes = await parseHomesPage(html);

  return homes;
};

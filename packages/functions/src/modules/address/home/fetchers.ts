import fetch from 'node-fetch';
import { parseHomePage } from './parsers';

export const fetchHome = async (id: string, cookie: string): Promise<any> => {
  const res = await fetch(`https://address.love/homes/${encodeURIComponent(id)}`, {
    headers: {
      cookie,
    },
  });
  if (!res.ok && res.status === 404) {
    throw new Error('not found');
  }
  if (!res.ok) {
    throw new Error();
  }

  const html = await res.text();

  const home = await parseHomePage(html);
  return home;
};

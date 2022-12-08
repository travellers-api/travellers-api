import { Home } from './types';

export const fetchCalendar = async (): Promise<Home[]> => {
  const res = await fetch(`https://api.traveller-api.amon.dev/address/calendar`);

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const { homes } = (await res.json()) as {
    homes: Home[];
  };

  return homes;
};

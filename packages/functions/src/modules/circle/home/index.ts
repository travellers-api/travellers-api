import { fetchHomes } from './fetchers';
import { Home } from './types';

export const getHomes = async (cookie: string): Promise<Home[]> => {
  const homes = await fetchHomes(cookie);
  return homes;
};

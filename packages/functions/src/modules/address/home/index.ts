import { fetchHome } from './fetchers';

export const getHome = async (id: string, cookie: string) => {
  const home = await fetchHome(id, cookie);
  return home;
};

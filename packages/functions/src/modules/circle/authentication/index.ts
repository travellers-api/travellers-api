import { fetchAikotobaCookie, fetchUserCookie } from './fetchers';

export const getAikotobaCookie = async (aikotoba: string): Promise<string> => {
  const cookie = await fetchAikotobaCookie(aikotoba);
  return cookie;
};

export const getUserCookie = async ({ email, password }: { email: string; password: string }): Promise<string> => {
  const cookie = await fetchUserCookie(email, password);
  return cookie;
};

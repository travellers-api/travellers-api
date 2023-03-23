import * as express from 'express';
import { getUserCookie } from '../modules/circle/authentication';
import { getReservations } from '../modules/circle/reservation';
import { Reservation } from '../modules/circle/reservation/types';
import { getHomes } from '../modules/firestore/cachedCircleHomes';
import { CachedCircleHome } from '../modules/firestore/cachedCircleHomes/types';
import { getSecret } from '../modules/firestore/secret/circle';

export const circleApp = express();

circleApp.get<
  {
    screenName: string;
  },
  {
    reservations: Reservation[];
  }
>('/circle/users/:screenName/reservations', async (req, res) => {
  try {
    const { screenName } = req.params;
    const secret = await getSecret(screenName);
    const cookie = secret.cookie || (await getUserCookie({ email: secret.email, password: secret.password }));

    const reservations = await getReservations(cookie);
    res.json({ reservations });
  } catch (e) {
    if (e instanceof Error && e.message === 'not found') {
      res.status(404).end();
    }

    res.status(500).end();
  }
});

circleApp.get<
  undefined,
  {
    homes: CachedCircleHome[];
  }
>('/circle/calendar', async (req, res) => {
  try {
    const homes = await getHomes();
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, must-revalidate');
    res.json({ homes: homes.map(({ data }) => data) });
  } catch (e) {
    res.status(500).end();
  }
});

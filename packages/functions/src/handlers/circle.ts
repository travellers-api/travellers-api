import * as express from 'express';
import { getHomes } from '../modules/firestore/cachedCircleHomes';
import { CachedCircleHome } from '../modules/firestore/cachedCircleHomes/types';

export const circleApp = express();

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

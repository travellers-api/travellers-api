import { getAikotobaCookie } from '@traveller-api/circle-fetcher/lib/core/authentication';
import { getHomes } from '@traveller-api/circle-fetcher/lib/core/home';
import { getHomeReservationStatuses } from '@traveller-api/circle-fetcher/lib/core/home-reservation-status';
import * as functions from 'firebase-functions';
import { dayjs } from '../../lib/dayjs';
import { addMonths } from '../../modules/date';
import { setHome } from '../../modules/firestore/cachedCircleHomes';
import { CachedCircleHome } from '../../modules/firestore/cachedCircleHomes/types';
import { defaultRegion } from '../../modules/functions/constants';

export const crawlHomes = functions
  .region(defaultRegion)
  .runWith({ secrets: ['CIRCLE_AIKOTOBA'] })
  .pubsub.schedule('0 * * * *')
  .onRun(async (context) => {
    const date = dayjs(context.timestamp).tz('Asia/Tokyo').set('date', 1).format('YYYY/MM/DD');

    const aikotoba = process.env.CIRCLE_AIKOTOBA ?? '';
    const cookie = await getAikotobaCookie(aikotoba);
    const homes = await getHomes(cookie);

    await Promise.all(
      homes.map(async (home) => {
        const statuses0 = await getHomeReservationStatuses(home.hotelNumber, addMonths(date, 0), cookie);
        const statuses1 = await getHomeReservationStatuses(home.hotelNumber, addMonths(date, 1), cookie);
        const statuses2 = await getHomeReservationStatuses(home.hotelNumber, addMonths(date, 2), cookie);
        const statuses3 = await getHomeReservationStatuses(home.hotelNumber, addMonths(date, 3), cookie);

        const savingHome: CachedCircleHome = {
          ...home,
          calendar: [...statuses0, ...statuses1, ...statuses2, ...statuses3],
        };
        await setHome(home.id, savingHome);
      })
    );
  });

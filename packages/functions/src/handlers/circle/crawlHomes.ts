import { getAikotobaCookie } from '@traveller-api/circle-fetcher/lib/core/authentication';
import { getHomes } from '@traveller-api/circle-fetcher/lib/core/home';
import { getHomeReservationStatuses } from '@traveller-api/circle-fetcher/lib/core/home-reservation-status';
import * as functions from 'firebase-functions';
import { dayjs } from '../../lib/dayjs';
import { setHome } from '../../modules/firestore/cachedCircleHomes';
import { CachedCircleHome } from '../../modules/firestore/cachedCircleHomes/types';
import { defaultRegion } from '../../modules/functions/constants';

export const crawlHomes = functions
  .region(defaultRegion)
  .runWith({ secrets: ['CIRCLE_AIKOTOBA'] })
  .pubsub.schedule('0 * * * *')
  .onRun(async (context) => {
    const day = dayjs(context.timestamp).tz('Asia/Tokyo');

    const aikotoba = process.env.CIRCLE_AIKOTOBA ?? '';
    const cookie = await getAikotobaCookie(aikotoba);
    const homes = await getHomes(cookie);

    await Promise.all(
      homes.map(async (home) => {
        const statuses0 = await getHomeReservationStatuses(
          home.hotelNumber,
          day.set('date', 1).add(0, 'month').format('YYYY/MM/DD'),
          cookie
        );
        const statuses1 = await getHomeReservationStatuses(
          home.hotelNumber,
          day.set('date', 1).add(1, 'month').format('YYYY/MM/DD'),
          cookie
        );
        const statuses2 = await getHomeReservationStatuses(
          home.hotelNumber,
          day.set('date', 1).add(2, 'month').format('YYYY/MM/DD'),
          cookie
        );
        const statuses3 = await getHomeReservationStatuses(
          home.hotelNumber,
          day.set('date', 1).add(3, 'month').format('YYYY/MM/DD'),
          cookie
        );

        const savingHome: CachedCircleHome = {
          ...home,
          calendar: [...statuses0, ...statuses1, ...statuses2, ...statuses3],
        };
        await setHome(home.id, savingHome);
      })
    );
  });

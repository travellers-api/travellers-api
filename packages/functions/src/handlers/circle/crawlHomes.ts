import { getAikotobaCookie } from '@travellers-api/circle-fetcher/lib/core/authentication';
import { getHomes as getHomesFromReserva } from '@travellers-api/circle-fetcher/lib/core/home';
import { getHomeReservationStatuses } from '@travellers-api/circle-fetcher/lib/core/home-reservation-status';
import * as functions from 'firebase-functions';
import * as pLimit from 'p-limit';
import { dayjs } from '../../lib/dayjs';
import { addMonths } from '../../modules/date';
import { deleteHome, getHomes as getHomesFromFirestore, setHome } from '../../modules/firestore/cachedCircleHomes';
import { CachedCircleHome } from '../../modules/firestore/cachedCircleHomes/types';
import { defaultRegion } from '../../modules/functions/constants';

const limit = pLimit(1);

export const crawlHomes = functions
  .region(defaultRegion)
  .runWith({ secrets: ['CIRCLE_AIKOTOBA'] })
  .pubsub.schedule('0 * * * *')
  .onRun(async (context) => {
    const date = dayjs(context.timestamp).tz('Asia/Tokyo').set('date', 1).format('YYYY/MM/DD');

    const aikotoba = process.env.CIRCLE_AIKOTOBA ?? '';
    const cookie = await getAikotobaCookie(aikotoba);
    const homesFromReserva = await getHomesFromReserva(cookie);

    await Promise.all(
      homesFromReserva.map(async (home) => {
        const statusesList = await Promise.all(
          [0, 1, 2, 3].map(async (i) => {
            const statuses = await limit(() =>
              getHomeReservationStatuses(home.hotelNumber, addMonths(date, i), cookie)
            );
            return statuses;
          })
        );

        const savingHome: CachedCircleHome = {
          ...home,
          calendar: statusesList.flat(),
        };
        await setHome(home.id, savingHome);
      })
    );

    const homesFromFirestore = await getHomesFromFirestore();
    await Promise.all(
      homesFromFirestore.map(async (home) => {
        const exists = homesFromReserva.some((homeFromReserva) => homeFromReserva.id === home.id);
        if (!exists) {
          await deleteHome(home.id);
        }
      })
    );
  });

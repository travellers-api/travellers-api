import { getHome } from '@traveller-api/address-fetcher/lib/core/home';
import * as functions from 'firebase-functions';
import * as pLimit from 'p-limit';
import { ADDRESS_HOME_MAX_COUNT } from '../../constants/address';
import { dayjs } from '../../lib/dayjs';
import { generateHomeIds, getCookieByUid } from '../../modules/address';
import { deleteHome, setHome } from '../../modules/firestore/cachedAddressHomes';
import { getRecentlyReservation } from '../../modules/firestore/cachedAddressRecentlyReservations';
import { defaultRegion } from '../../modules/functions/constants';

const limit = pLimit(1);

// 1分あたり8拠点, 1時間あたり480拠点クロール
export const crawlHomes = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const loopMinutes = 60;
    const now = dayjs(context.timestamp).tz('Asia/Tokyo');
    const homeIds = generateHomeIds(now, ADDRESS_HOME_MAX_COUNT, loopMinutes);

    console.log(JSON.stringify({ homeIds }));

    await getHomes(homeIds.map((id) => id.toString()));
  });

const getHomes = async (homeIds: string[]) => {
  const cookie = await getCookieByUid('amon');

  await Promise.all(
    homeIds.map(async (id) => {
      const home = await limit(() => getHome(id, cookie)).catch((e: Error) => e);
      if (home instanceof Error && home.message === 'not found') {
        await deleteHome(id);
        return;
      }
      if (home instanceof Error) {
        console.error(home.message);
        return;
      }

      // 直近の予約状況をマージ
      const recentlyReservations = await Promise.all(
        home.rooms.map(({ id }) => {
          return getRecentlyReservation(id.toString())
            .then((data) => ({ id, data }))
            .catch(() => null);
        })
      );

      const today = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD');

      home.rooms.forEach((room) => {
        if (!room.calendar) return;

        const recentlyReservation = recentlyReservations.find((r) => r?.id === room.id);
        if (!recentlyReservation) return;

        const recentlyReservedDays = Object.entries(recentlyReservation.data)
          .filter(([checkInDate, { reserved }]) => checkInDate >= today && reserved)
          .map(([checkInDate]) => checkInDate.replace(/-/g, '/'));
        room.calendar.reservedDates = [...recentlyReservedDays, ...room.calendar.reservedDates];
      });

      await setHome(id, home);
    })
  );
};

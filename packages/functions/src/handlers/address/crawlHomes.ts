import { getHome } from '@traveller-api/address-fetcher/lib/core/home';
import * as functions from 'firebase-functions';
import { ADDRESS_HOME_MAX_COUNT } from '../../constants/address';
import { dayjs } from '../../lib/dayjs';
import { getCookieByUid } from '../../modules/address';
import { deleteHome, setHomePartial } from '../../modules/firestore/cachedAddressHomes';
import { getRecentlyReservation } from '../../modules/firestore/cachedAddressRecentlyReservations';
import { defaultRegion } from '../../modules/functions/constants';

export const crawlHomes = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const minutes = new Date(context.timestamp).getMinutes();
    const count = Math.floor(ADDRESS_HOME_MAX_COUNT / 60);
    const baseId = count * minutes + 1;
    const targetIds = [...new Array(count)].map((_, i) => (baseId + i).toString());

    await getHomes(targetIds);
    await getHomesRooms(targetIds);
  });

const getHomes = async (targetIds: string[]) => {
  // 住所は、本会員のみ取得可能
  const cookie = await getCookieByUid('amon');

  await Promise.all(
    targetIds.map(async (id) => {
      const home = await getHome(id, cookie).catch((e: Error) => e);
      if (home instanceof Error && home.message === 'not found') {
        await deleteHome(id);
        return;
      }
      if (home instanceof Error) {
        console.error(home.message);
        return;
      }

      const { rooms, ...homeWithoutRooms } = home;
      await setHomePartial(id, homeWithoutRooms);
    })
  );
};

const getHomesRooms = async (targetIds: string[]) => {
  // 性別専用部屋を含む予約状況は、メール会員のみ取得可能
  const cookie = await getCookieByUid('bot');

  await Promise.all(
    targetIds.map(async (id) => {
      const home = await getHome(id, cookie).catch((e: Error) => e);
      if (home instanceof Error) {
        return;
      }

      const { rooms } = home;

      // 直近の予約状況をマージ
      const recentlyReservations = await Promise.all(
        rooms.map(({ id }) => {
          return getRecentlyReservation(id.toString())
            .then((data) => ({ id, data }))
            .catch(() => null);
        })
      );

      const today = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD');

      rooms.forEach((room) => {
        if (!room.calendar) return;

        const recentlyReservation = recentlyReservations.find((r) => r?.id === room.id);
        if (!recentlyReservation) return;

        const recentlyReservedDays = Object.entries(recentlyReservation.data)
          .filter(([checkInDate, { reserved }]) => checkInDate >= today && reserved)
          .map(([checkInDate]) => checkInDate.replace(/-/g, '/'));
        room.calendar.reservedDates = [...recentlyReservedDays, ...room.calendar.reservedDates];
      });

      await setHomePartial(id, { rooms });
    })
  );
};

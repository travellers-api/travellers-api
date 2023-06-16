import { getHome } from '@traveller-api/address-fetcher/lib/core/home';
import { getPreReservation } from '@traveller-api/address-fetcher/lib/core/pre-reservation';
import * as functions from 'firebase-functions';
import { ADDRESS_HOME_MAX_COUNT } from '../../constants/address';
import { dayjs } from '../../lib/dayjs';
import { generateHomeIds, getCookieByUid } from '../../modules/address';
import { addDays, getDiffDays } from '../../modules/date';
import { updateRecentlyReservations } from '../../modules/firestore/cachedAddressRecentlyReservations';
import { defaultRegion } from '../../modules/functions/constants';

// 1分あたり2拠点, 4時間あたり480拠点クロール
export const crawlRecentlyReservations = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const loopMinutes = 240;
    const now = dayjs(context.timestamp).tz('Asia/Tokyo');
    const today = now.format('YYYY-MM-DD');
    const homeIds = generateHomeIds(now, ADDRESS_HOME_MAX_COUNT, loopMinutes);

    console.log(JSON.stringify({ homeIds }));

    const cookie = await getCookieByUid('amon');
    await Promise.all(homeIds.map((homeId) => getRecentlyReservations(cookie, today, homeId)));
  });

const getRecentlyReservations = async (cookie: string, today: string, homeId: number) => {
  const home = await getHome(homeId.toString(), cookie).catch(() => null);
  if (!home) return;

  const requests: { roomId: string; checkInDate: string; checkOutDate: string }[] = [];
  home.rooms.forEach((room) => {
    const roomId = room.id.toString();
    const days = room.calendar?.calStartDate ? getDiffDays(room.calendar.calStartDate, today) : 3;

    Array.from({ length: days }, (_, i) => i).forEach((days) => {
      const checkInDate = addDays(today, days);
      const checkOutDate = addDays(today, days + 1);
      requests.push({ roomId, checkInDate, checkOutDate });
    });
  });

  const saves: { [roomId: string]: { data: { [checkInDate: string]: { reserved: boolean } } } } = {};
  for await (const { roomId, checkInDate, checkOutDate } of requests) {
    const { errors } = await getPreReservation(cookie, roomId, checkInDate, checkOutDate);
    const reserved = errors.includes('選択した期間は既に予約されています。他の日程を選択ください。');

    saves[roomId] = {
      ...saves[roomId],
      data: {
        ...saves[roomId]?.data,
        [checkInDate]: { reserved },
      },
    };
  }
  Object.entries(saves).map(async ([roomId, { data }]) => {
    await updateRecentlyReservations(roomId, data);
  });
};

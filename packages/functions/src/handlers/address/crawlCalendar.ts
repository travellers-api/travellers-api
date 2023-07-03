import { getRoomsFromHomeId } from '@travellers-api/address-fetcher/lib/core/home/room';
import { getRoomCalendar } from '@travellers-api/address-fetcher/lib/core/home/room/calendar';
import { RoomCalendar } from '@travellers-api/address-fetcher/lib/core/home/room/calendar/types';
import { Room } from '@travellers-api/address-fetcher/lib/core/home/room/types';
import * as functions from 'firebase-functions';
import * as pLimit from 'p-limit';
import { ADDRESS_HOME_MAX_COUNT } from '../../constants/address';
import { dayjs } from '../../lib/dayjs';
import { generateHomeIds, getCookieByUid } from '../../modules/address';
import { setHomeRooms } from '../../modules/firestore/cachedAddressHomes';
import { CachedAddressHomeRoom } from '../../modules/firestore/cachedAddressHomes/types';
import { getRecentlyReservation } from '../../modules/firestore/cachedAddressRecentlyReservations';
import { defaultRegion } from '../../modules/functions/constants';

const limit = pLimit(1);

// 1分あたり8拠点, 1時間あたり480拠点クロール
export const crawlCalendar = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const loopMinutes = 60;
    const now = dayjs(context.timestamp).tz('Asia/Tokyo');
    const homeIds = generateHomeIds(now, ADDRESS_HOME_MAX_COUNT, loopMinutes);

    console.log(JSON.stringify({ homeIds }));

    const cookie = await getCookieByUid('amon');
    await Promise.all(homeIds.map((id) => single(cookie, id)));
  });

const single = async (cookie: string, homeId: number) => {
  const res = await limit(() => getRoomsFromHomeId(homeId, cookie)).catch((e: Error) => e);
  if (res instanceof Error) {
    console.error(res.message);
    return;
  }

  // 直近の予約状況をマージ
  const recentlyReservations = await Promise.all(
    res.rooms.map(({ id }) =>
      getRecentlyReservation(id)
        .then((data) => ({ id, data }))
        .catch(() => null)
    )
  );

  const today = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD');

  const rooms = await Promise.all(
    res.rooms.map(async (roomRaw): Promise<CachedAddressHomeRoom> => {
      const room = convertRoom(roomRaw);

      const calendarRes = await limit(() => getRoomCalendar(room.id, cookie));
      if (calendarRes instanceof Error) {
        console.error(calendarRes.message);
        return room;
      }

      const calendar = convertCalendar(calendarRes.room);
      if (!calendar) return room;

      const recentlyReservation = recentlyReservations.find((r) => r?.id === room.id);
      if (!recentlyReservation) return { ...room, calendar };

      const recentlyReservedDays = Object.entries(recentlyReservation.data)
        .filter(([checkInDate, { reserved }]) => checkInDate >= today && reserved)
        .map(([checkInDate]) => checkInDate.replace(/-/g, '/'));
      return {
        ...room,
        calendar: {
          ...calendar,
          reservedDates: [...recentlyReservedDays, ...calendar.reservedDates],
        },
      };
    })
  );

  await setHomeRooms(homeId, { rooms });
};

const convertRoom = (room: Room): CachedAddressHomeRoom => {
  return {
    id: room.id,
    name: room.name,
    thumbnail: room.photo_url,
    type: room.is_dormitory ? 'ドミトリー' : '個室',
    capacity: room.capacity,
    sex: room.acceptable_sex === 'male' || room.acceptable_sex === 'female' ? room.acceptable_sex : null,
    calendar: null,
  };
};

const convertCalendar = (calendar: RoomCalendar): CachedAddressHomeRoom['calendar'] => {
  return {
    reservedDates: calendar.reserved_dates,
    calStartDate: calendar.calendar_start_date,
    calEndDate: calendar.calendar_end_date,
    reservablePeriod: calendar.reservable_period,
    holidays: calendar.holydays,
    minDays: calendar.min_days,
    availableWeeks: calendar.available_weeks,
  };
};

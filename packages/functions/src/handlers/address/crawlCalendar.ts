import { getRoomsFromHomeId } from "@travellers-api/address-fetcher/lib/core/home/room";
import { getRoomCalendar } from "@travellers-api/address-fetcher/lib/core/home/room/calendar";
import { RoomCalendar } from "@travellers-api/address-fetcher/lib/core/home/room/calendar/types";
import { Room } from "@travellers-api/address-fetcher/lib/core/home/room/types";
import { onSchedule } from "firebase-functions/scheduler";
import pLimit from "p-limit";
import { ADDRESS_HOME_MAX_ID } from "../../constants/address";
import { dayjs } from "../../lib/dayjs";
import { generateNumbers, getCookieByUid } from "../../modules/address";
import {
  existsHome,
  setHomeRooms,
} from "../../modules/firestore/cachedAddressHomes";
import { CachedAddressHomeRoom } from "../../modules/firestore/cachedAddressHomes/types";
import { getRecentlyReservation } from "../../modules/firestore/cachedAddressRecentlyReservations";
import { defaultRegion } from "../../modules/functions/constants";

const limit = pLimit(1);

// 各拠点ごとに1時間に1回、予約状況を取得
export const crawlCalendarV2 = onSchedule(
  { schedule: "* * * * *", region: defaultRegion },
  async (event) => {
    const loopMinutes = 60;
    const now = dayjs(event.scheduleTime).tz("Asia/Tokyo");
    const homeIds = generateNumbers(now, ADDRESS_HOME_MAX_ID, loopMinutes);

    console.log(JSON.stringify({ homeIds }));

    const cookie = await getCookieByUid("amon");
    await Promise.all(homeIds.map((id) => single(cookie, id)));
  },
);

const single = async (cookie: string, homeId: number) => {
  const exists = await existsHome(homeId);
  if (!exists) return;

  const res = await limit(() => getRoomsFromHomeId(homeId, cookie)).catch(
    (e: Error) => e,
  );
  if (res instanceof Error) {
    console.error(res.message);
    return;
  }

  // 直近の予約状況をマージ
  const recentlyReservations = await Promise.all(
    res.rooms.map(({ id }) =>
      getRecentlyReservation(id)
        .then((data) => ({ id, data }))
        .catch(() => null),
    ),
  );

  const today = dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD");

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

      const recentlyReservation = recentlyReservations.find(
        (r) => r?.id === room.id,
      );
      if (!recentlyReservation) return { ...room, calendar };

      const recentlyReservedDays = Object.entries(recentlyReservation.data)
        .filter(
          ([checkInDate, { reserved }]) => checkInDate >= today && reserved,
        )
        .map(([checkInDate]) => checkInDate.replace(/-/g, "/"));
      return {
        ...room,
        calendar: {
          ...calendar,
          reservedDates: [...recentlyReservedDays, ...calendar.reservedDates],
        },
      };
    }),
  );

  await setHomeRooms(homeId, { rooms });
};

const convertRoom = (room: Room): CachedAddressHomeRoom => {
  return {
    id: room.id,
    name: room.name,
    thumbnail: room.photo_url,
    type: room.is_dormitory ? "ドミトリー" : "個室",
    capacity: room.capacity,
    sex:
      room.acceptable_sex === "male" || room.acceptable_sex === "female"
        ? room.acceptable_sex
        : null,
    beds: room.bed_labels
      .map((text) => {
        const matches = text.trim().match(/(.+) x (\d)/);
        if (!matches) {
          return [];
        }
        const [, name = "", count = "0"] = matches;
        return Array(Number(count)).fill(name);
      })
      .flat(),
    calendar: null,
  };
};

const convertCalendar = (
  calendar: RoomCalendar,
): CachedAddressHomeRoom["calendar"] => {
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

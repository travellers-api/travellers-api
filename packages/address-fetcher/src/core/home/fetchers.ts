import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { parseHomePage } from './parsers';
import { Home } from './types';

export const fetchHome = async (id: string, cookie: string): Promise<Home> => {
  const res = await fetch(`https://address.love/homes/${encodeURIComponent(id)}`, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
  });
  if (!res.ok && res.status === 404) {
    throw new Error('not found');
  }
  if (!res.ok) {
    throw new Error();
  }

  const html = await res.text();
  const home = parseHomePage(html);

  await Promise.all(
    home.rooms.map(async (room) => {
      const id = room.id;
      const roomData = await fetchRoomJson(id, cookie).catch(() => null);

      if (!roomData) {
        room.calendar = null;
      } else {
        room.calendar = {
          reservedDates: roomData.room.reserved_dates,
          calStartDate: roomData.room.calendar_start_date,
          calEndDate: roomData.room.calendar_end_date,
          reservablePeriod: roomData.room.reservable_period,
          holidays: roomData.room.holydays,
          minDays: roomData.room.min_days,
          availableWeeks: roomData.room.available_weeks,
        };
      }
    })
  );

  return home;
};

type RoomResponse = {
  room: {
    id: number;
    name: string;
    reserved_dates: string[];
    calendar_start_date: string;
    calendar_end_date: string;
    reserve_until: string;
    available_weeks: number;
    reservable_period: string;
    holydays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
    min_days: number;
    consume_ticket_amounts: number;
  };
};

export const fetchRoomJson = async (id: number, cookie: string): Promise<RoomResponse> => {
  const res = await fetch(`https://address.love/api/v1/web/rooms/${encodeURIComponent(id)}`, {
    headers: {
      cookie,
      'User-Agent': userAgent,
    },
  });
  if (!res.ok && res.status === 404) {
    throw new Error('not found');
  }
  if (!res.ok) {
    throw new Error();
  }

  const json = (await res.json()) as RoomResponse;
  return json;
};

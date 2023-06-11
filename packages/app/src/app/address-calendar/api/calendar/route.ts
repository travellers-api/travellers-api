import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { fetchCalendar } from '../../../../lib/address/calendar/fetchers';
import { Home, Room } from '../../../../lib/address/calendar/types';
import { excludeClosedRooms } from '../../../../lib/address/calendar/utils';
import { prefectures } from '../../../../lib/prefecture/constants';

export type AddressCalendarForPage = {
  homes: Home[];
  dates: {
    date: string;
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }[];
  filters: {
    prefecture: string[];
    homeType: string[];
    roomType: string[];
    sex: { name: string; value: string }[];
  };
};

export async function GET(request: Request) {
  const homes = await fetchCalendar({ next: { revalidate: 60 } }).catch(() => null);
  if (!homes) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

  const now = dayjs();
  const dates = [...Array(60)].map((_, i) => {
    const dayjsObj = now.add(i, 'days');
    return {
      date: dayjsObj.format('YYYY/MM/DD'),
      day: Number(dayjsObj.format('d')) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    };
  });

  const { searchParams } = new URL(request.url);
  const prefectureQuery = searchParams.getAll('prefecture');
  const homeTypeQuery = searchParams.getAll('homeType');
  const roomTypeQuery = searchParams.getAll('roomType');
  const sexQuery = searchParams.getAll('sex');

  const json: AddressCalendarForPage = {
    filters: {
      prefecture: prefectures.map((prefecture) => prefecture.name),
      homeType: (() => {
        const values = new Set<string>();
        homes.forEach((home) => {
          values.add(home.homeType);
        });
        return Array.from(values).map((value) => value);
      })(),
      roomType: (() => {
        const values = new Set<string>();
        homes.forEach((home) => {
          home.rooms.forEach((room) => {
            values.add(room.type);
          });
        });
        return Array.from(values).map((value) => value);
      })(),
      sex: [
        { name: '男性', value: 'male' },
        { name: '女性', value: 'female' },
      ],
    },
    homes: homes
      .map((home) => {
        home.rooms = excludeClosedRooms(home.rooms);

        if (roomTypeQuery.length) {
          home.rooms = home.rooms.filter((room) => roomTypeQuery.includes(room.type));
        }

        if (sexQuery.length) {
          home.rooms = home.rooms.filter((room) => sexQuery.some((q) => [q, null].includes(room.sex)));
        }

        home.rooms = home.rooms.map((room) => {
          const calendar = room.calendar;
          const availables = calendar
            ? dates
                .map((date) => {
                  const isUnavailable = calendar.reservedDates.includes(date.date);
                  if (isUnavailable) {
                    return 'N';
                  }

                  const isOutOfTerm =
                    date.date < (calendar.calStartDate || '0000/01/01') ||
                    date.date > (calendar.calEndDate || '9999/12/31');
                  if (isOutOfTerm) {
                    return 'O';
                  }

                  const isHoliday = calendar.holidays.includes(date.day);
                  if (isHoliday) {
                    return 'H';
                  }

                  return 'Y';
                })
                .join('')
            : null;

          const returnRoom: Room = {
            ...room,
            calendar: calendar
              ? {
                  ...calendar,
                  reservedDates: [],
                }
              : null,
            availables,
          };
          return returnRoom;
        });

        // 不要フィールド削除
        home.thumbnail = '';
        home.rooms.forEach((room) => {
          room.thumbnail = '';
        });

        return home;
      })
      .filter((home) => {
        if (prefectureQuery.length) {
          const match = prefectureQuery.includes(home.prefecture);
          if (!match) return false;
        }

        if (homeTypeQuery.length) {
          const match = homeTypeQuery.includes(home.homeType);
          if (!match) return false;
        }

        if (home.rooms.length === 0) {
          return false;
        }

        return true;
      })
      .sort((a, z) => {
        const aPrefecture = prefectures.find((prefecture) => a.prefecture === prefecture.name)?.code ?? 0;
        const zPrefecture = prefectures.find((prefecture) => z.prefecture === prefecture.name)?.code ?? 0;

        if (aPrefecture !== zPrefecture) {
          return aPrefecture - zPrefecture;
        }

        return a.name > z.name ? 1 : -1;
      }),
    dates,
  };

  return NextResponse.json(json);
}

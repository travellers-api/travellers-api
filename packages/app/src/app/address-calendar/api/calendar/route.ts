import { NextResponse } from 'next/server';
import { fetchCalendar } from '../../../../lib/address/calendar/fetchers';
import { Home, Room } from '../../../../lib/address/calendar/types';
import { excludeClosedRooms } from '../../../../lib/address/calendar/utils';
import { dayjs } from '../../../../lib/dayjs';
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
    bed: string[];
    sex: { name: string; value: string }[];
    capacity: string[];
  };
};

export async function GET(request: Request) {
  const homes = await fetchCalendar({ next: { revalidate: 60 } }).catch(() => null);
  if (!homes) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

  const today = dayjs().tz('Asia/Tokyo');
  const dates = [...Array(60)].map((_, i) => {
    const dayjsObj = today.add(i, 'days');
    return {
      date: dayjsObj.format('YYYY/MM/DD'),
      day: Number(dayjsObj.format('d')) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    };
  });

  const { searchParams } = new URL(request.url);
  const prefectureQuery = searchParams.getAll('prefecture');
  const homeTypeQuery = searchParams.getAll('homeType');
  const roomTypeQuery = searchParams.getAll('roomType');
  const bedQuery = searchParams.getAll('bed');
  const sexQuery = searchParams.getAll('sex');
  const capacityQuery = searchParams.getAll('capacity');

  const json: AddressCalendarForPage = {
    filters: {
      prefecture: prefectures.map((prefecture) => prefecture.name),
      homeType: (() => {
        const homeTypes = homes.map((home) => home.homeType);
        const values = new Set<string>(...homeTypes);
        return Array.from(values).map((value) => value);
      })(),
      roomType: (() => {
        const types = homes
          .map((home) => home.rooms ?? [])
          .flat()
          .map((room) => room.type);
        const values = new Set<string>(...types);
        return Array.from(values).map((value) => value);
      })(),
      bed: (() => {
        const beds = homes
          .map((home) => home.rooms)
          .flat()
          .map((room) => room?.beds)
          .flat();
        const values = new Set<string>(...beds);
        return Array.from(values).map((value) => value);
      })(),
      sex: [
        { name: 'すべて', value: '' },
        { name: '男性が宿泊可能', value: 'male' },
        { name: '女性が宿泊可能', value: 'female' },
        { name: '誰でも宿泊可能', value: 'anyone' },
      ],
      capacity: ['1', '2', '3', '4', '5', '6'],
    },
    homes: homes
      .map((home) => {
        home.rooms = excludeClosedRooms(home.rooms);

        if (roomTypeQuery.length) {
          home.rooms = home.rooms?.filter((room) => roomTypeQuery.includes(room.type));
        }

        if (bedQuery.length) {
          home.rooms = home.rooms?.filter((room) => bedQuery.some((bed) => room.beds.includes(bed)));
        }

        const sex = sexQuery.at(0);
        if (sex) {
          home.rooms = home.rooms?.filter((room) => {
            if (sex === 'anyone') {
              return room.sex === null;
            }
            if (sex === 'male') {
              return room.sex !== 'female';
            }
            if (sex === 'female') {
              return room.sex !== 'male';
            }
            return true;
          });
        }

        home.rooms = home.rooms
          ?.filter((room) => {
            if (capacityQuery.at(0)) {
              return room.capacity >= Number(capacityQuery.at(0));
            }

            return true;
          })
          .map((room) => {
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
          })
          .slice()
          .sort((a, z) => a.name.localeCompare(z.name, 'ja'));

        // 不要フィールド削除
        home.thumbnail = '';
        home.rooms?.forEach((room) => {
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

        if (home.rooms?.length === 0) {
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

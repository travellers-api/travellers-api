import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { CalendarFilter } from '../../components/address-calendar/CalendarFilter';
import { CalendarSection } from '../../components/address-calendar/CalendarSection';
import { fetchCalendar } from '../../lib/address/calendar/fetchers';
import { Home } from '../../lib/address/calendar/types';
import { excludeClosedRooms } from '../../lib/address/calendar/utils';
import { prefectures } from '../../lib/prefecture/constants';
import { queryToArray } from '../../utils/router';

export type Props = {
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const homes = await fetchCalendar().catch(() => null);
  if (!homes) {
    return {
      notFound: true,
      revalidate: 0,
    };
  }

  const now = dayjs();
  const dates = [...Array(60)].map((_, i) => {
    const dayjsObj = now.add(i, 'days');
    return {
      date: dayjsObj.format('YYYY/MM/DD'),
      day: Number(dayjsObj.format('d')) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    };
  });

  const prefectureQuery = queryToArray(query?.prefecture);
  const homeTypeQuery = queryToArray(query?.homeType);
  const roomTypeQuery = queryToArray(query?.roomType);
  const sexQuery = queryToArray(query?.sex);

  return {
    props: {
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

          if (roomTypeQuery) {
            home.rooms = home.rooms.filter((room) => roomTypeQuery.includes(room.type));
          }

          if (sexQuery) {
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

            return {
              ...room,
              availables,
            };
          });

          // 不要フィールド削除
          home.thumbnail = '';
          home.rooms.forEach((room) => {
            room.thumbnail = '';
          });

          return home;
        })
        .filter((home) => {
          if (prefectureQuery) {
            const match = prefectureQuery.includes(home.prefecture);
            if (!match) return false;
          }

          if (homeTypeQuery) {
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
    },
  };
};

const Page: NextPage<Props> = ({ homes, dates, filters }) => {
  const title = 'ADDress予約状況カレンダー (非公式)';

  return (
    <div className="pb-80">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="mx-auto mb-20 flex flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">{title}</h1>
        <div className="text-center font-sans text-sm leading-6 tracking-wide opacity-80">
          <ul className="flex flex-wrap justify-center gap-x-8">
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <a className="underline" href="https://address.home/" target="_blank" rel="noopener noreferrer">
                ADDress公式サイト
              </a>
            </li>
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <a className="underline" href="https://twitter.com/amotarao" target="_blank" rel="noopener noreferrer">
                問い合わせ: あもん
              </a>
            </li>
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <Link className="underline" href="/circle-calendar">
                circle版
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <CalendarFilter className="mb-20" filters={filters} />
      <CalendarSection homes={homes} dates={dates} />
    </div>
  );
};

export default Page;

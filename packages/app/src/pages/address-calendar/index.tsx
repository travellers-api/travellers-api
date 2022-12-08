import { useVirtual } from '@tanstack/react-virtual';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';
import { fetchCalendar } from '../../lib/address/calendar/fetchers';
import { Home } from '../../lib/address/calendar/types';
import { excludeClosedRooms, simplifyRoomName, simplifyRoomType } from '../../lib/address/calendar/utils';
import { prefectures } from '../../lib/prefecture/constants';

const queryToArray = (query: string | string[] | undefined): string[] | null => {
  return query ? (typeof query === 'string' ? query.split(',') : query) : null;
};

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
  const dates = [...Array(40)].map((_, i) => {
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
            const calendarRoom = home.calendar?.rooms.find((calendarRoom) => calendarRoom.room.id === room.id);
            const availables = calendarRoom
              ? dates
                  .map((date) => {
                    const available =
                      !calendarRoom.reserved_dates.includes(date.date) &&
                      !home.calendar?.holidays.includes(date.day) &&
                      date.date <= (home.calendar?.calEndDate ?? '9999/12/31');
                    return available ? 'Y' : 'N';
                  })
                  .join('')
              : null;

            return {
              ...room,
              availables,
            };
          });

          // 不要フィールド削除
          home.url = '';
          home.thumbnail = '';
          home.rooms.forEach((room) => {
            room.thumbnail = '';
          });
          home.calendar = null;

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
  const router = useRouter();
  const title = 'ADDress予約状況カレンダー';

  const filterRef = useRef<HTMLDetailsElement>(null);

  return (
    <div className="pb-80">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="mx-auto mb-20 flex flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">{title}</h1>
        <div className="text-center font-sans text-sm tracking-wide opacity-80">
          <p>部屋別・フィルタ機能付き 非公式カレンダー</p>
          <p>気が向けば機能増やします</p>
          <p>
            問い合わせ:{' '}
            <a className="underline" href="https://twitter.com/amotarao">
              Twitter @amotarao
            </a>
          </p>
        </div>
      </header>
      <nav className="mb-20 px-20">
        <details className="w-max rounded-2xl border px-20 py-10" ref={filterRef}>
          <summary>フィルタ</summary>
          <div className="mt-20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                filterRef.current?.removeAttribute('open');

                router.replace({
                  pathname: '/address-calendar',
                  query: {
                    ...router.query,
                    prefecture: Array.from(
                      e.currentTarget.querySelectorAll<HTMLOptionElement>('[name="prefecture"] option:checked')
                    ).map((elm) => elm.value),
                    homeType: Array.from(
                      e.currentTarget.querySelectorAll<HTMLOptionElement>('[name="homeType"] option:checked')
                    ).map((elm) => elm.value),
                    roomType: Array.from(
                      e.currentTarget.querySelectorAll<HTMLOptionElement>('[name="roomType"] option:checked')
                    ).map((elm) => elm.value),
                    sex: Array.from(
                      e.currentTarget.querySelectorAll<HTMLOptionElement>('[name="sex"] option:checked')
                    ).map((elm) => elm.value),
                  },
                });
              }}
            >
              <div className="flex flex-col gap-20">
                <div className="flex flex-col items-start gap-10">
                  <button className="rounded border px-12 py-4 text-sm" type="submit">
                    フィルタ確定
                  </button>
                  <p className="text-sm">Ctrl/Cmdキーで複数選択、選択解除可能</p>
                </div>
                <div className="flex gap-20">
                  <div className="flex flex-col gap-4 text-sm">
                    <label className="font-bold" htmlFor="prefecture">
                      都道府県
                    </label>
                    <select
                      id="prefecture"
                      name="prefecture"
                      className="h-max rounded border px-8 py-4"
                      defaultValue={queryToArray(router.query?.prefecture) ?? []}
                      multiple
                      size={Math.min(filters.prefecture.length, 10)}
                    >
                      {filters.prefecture.map((prefecture) => (
                        <option key={prefecture} value={prefecture}>
                          {prefecture}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 text-sm">
                    <label className="font-bold" htmlFor="homeType">
                      拠点種別
                    </label>
                    <select
                      id="homeType"
                      name="homeType"
                      className="h-max rounded border px-8 py-4"
                      defaultValue={queryToArray(router.query?.homeType) ?? []}
                      multiple
                      size={Math.min(filters.homeType.length, 10)}
                    >
                      {filters.homeType.map((homeType) => (
                        <option key={homeType} value={homeType}>
                          {homeType}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 text-sm">
                    <label className="font-bold" htmlFor="roomType">
                      部屋種別
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      className="h-max rounded border px-8 py-4"
                      defaultValue={queryToArray(router.query?.roomType) ?? []}
                      multiple
                      size={Math.min(filters.roomType.length, 10)}
                    >
                      {filters.roomType.map((roomType) => (
                        <option key={roomType} value={roomType}>
                          {roomType}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 text-sm">
                    <label className="font-bold" htmlFor="sex">
                      性別
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      className="h-max rounded border px-8 py-4"
                      defaultValue={queryToArray(router.query?.sex) ?? []}
                      multiple
                      size={Math.min(filters.sex.length, 10)}
                    >
                      {filters.sex.map((sex) => (
                        <option key={sex.value} value={sex.value}>
                          {sex.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </details>
      </nav>
      <Calendar homes={homes} dates={dates} />
    </div>
  );
};

const Calendar: React.FC<
  {
    className?: string;
  } & Pick<Props, 'homes' | 'dates'>
> = ({ className, homes, dates }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const estimateSize = useCallback(
    (i: number) => {
      return homes[i]!.rooms.length * 31 + 10;
    },
    [homes]
  );
  const virtual = useVirtual({
    size: homes.length,
    parentRef,
    overscan: 5,
    estimateSize,
  });

  return (
    <section className={classNames('w-full overflow-x-scroll', className)}>
      <div className="w-max">
        <header className="w-full px-20">
          <div className="grid grid-cols-[280px_1fr] border-b">
            <p className="self-center py-5 text-xs">拠点名</p>
            <div className="grid grid-cols-[160px_1fr] gap-4 py-5">
              <p className="self-center text-xs">部屋名</p>
              <ul className="grid grid-cols-[repeat(40,24px)] self-center">
                {dates.map((date) => (
                  <li key={date.date} className="border-l text-center text-xs">
                    <p>{date.date.slice(5, 7)}</p>
                    <p>{date.date.slice(8)}</p>
                    <p>{'日月火水木金土'[date.day] ?? ''}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>
        <div
          ref={parentRef}
          className="h-screen max-h-[70vh] w-full overflow-y-auto px-20"
          style={{
            height: virtual.totalSize,
          }}
        >
          <ul className="relative flex flex-col">
            {virtual.virtualItems.map((virtualRow) => {
              const home = homes[virtualRow.index]!;

              return (
                <li
                  key={virtualRow.key}
                  className="absolute left-0 w-full"
                  style={{
                    top: `${virtualRow.start}px`,
                    height: `${virtualRow.size}px`,
                  }}
                >
                  <div className="grid grid-cols-[280px_1fr] border-b pb-10">
                    <div className="flex items-start gap-4 py-5 text-sm">
                      <p className="shrink-0 font-bold">
                        <a className="underline" href={home.url} target="_blank" rel="noreferrer">
                          {home.name}
                        </a>
                      </p>
                      <p className="shrink-0 border px-4 text-xs">{home.prefecture}</p>
                      <p className="shrink-0 border px-4 text-xs">{home.homeType}</p>
                      {home.reservationLimit === '予約制限あり' && <p className="shrink-0 border px-4 text-xs">制限</p>}
                    </div>
                    <ul>
                      {home.rooms.map((room, i) => {
                        // 女性専用部屋は ID が 0 になるので index も利用
                        const key = `${room.id}_${i}`;
                        return (
                          <li key={key} className="border-b last:border-b-0">
                            <div className="grid grid-cols-[160px_1fr] gap-4 py-5">
                              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 text-sm">
                                <div className="flex gap-4 self-center">
                                  {room.sex && (
                                    <p className="shrink-0 border px-4 text-xs">{room.sex === 'male' ? '男' : '女'}</p>
                                  )}
                                  <p className="shrink-0 border px-4 text-xs">{simplifyRoomType(room.type)}</p>
                                </div>
                                <p className="shrink-0 line-clamp-1">{simplifyRoomName(room.name)}</p>
                              </div>
                              {room.availables ? (
                                <div className="self-center text-xs">
                                  <ul className="grid grid-cols-[repeat(40,24px)] self-center">
                                    {room.availables.split('').map((available, i) => {
                                      return (
                                        <li key={i}>
                                          <div
                                            className={classNames(
                                              'border-l text-center',
                                              available === 'N' && 'bg-black/20'
                                            )}
                                          >
                                            <span>&nbsp;</span>
                                            <span className="sr-only">{available === 'Y' ? '予約可' : '予約不可'}</span>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ) : (
                                <div className="self-center text-xs">取得不可</div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Page;

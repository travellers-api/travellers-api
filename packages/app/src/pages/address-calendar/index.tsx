import classNames from 'classnames';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';

type Home = {
  id: number;
  url: string;
  name: string;
  thumbnail: string;
  prefecture: string;
  homeType: string;
  reservationLimit: '予約制限あり' | '予約制限なし';
  address: {
    postalCode: string;
    text: string;
    lat: number;
    lng: number;
  };
  rooms: {
    id: number;
    name: string;
    thumbnail: string;
    type: '個室' | 'ドミトリー';
    capacity: number;
    sex: 'male' | 'female' | null;
  }[];
  calendar: {
    rooms: {
      room: {
        id: number;
        name: string;
      };
      reserved_dates: string[];
      availables: string;
    }[];
    calStartDate: string;
    calEndDate: string;
    reservablePeriod: string;
    holidays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
    minDays: number;
  };
};

const prefectures: { name: string; code: number }[] = [
  { name: '北海道', code: 1 },
  { name: '青森県', code: 2 },
  { name: '岩手県', code: 3 },
  { name: '宮城県', code: 4 },
  { name: '秋田県', code: 5 },
  { name: '山形県', code: 6 },
  { name: '福島県', code: 7 },
  { name: '茨城県', code: 8 },
  { name: '栃木県', code: 9 },
  { name: '群馬県', code: 10 },
  { name: '埼玉県', code: 11 },
  { name: '千葉県', code: 12 },
  { name: '東京都', code: 13 },
  { name: '神奈川県', code: 14 },
  { name: '新潟県', code: 15 },
  { name: '富山県', code: 16 },
  { name: '石川県', code: 17 },
  { name: '福井県', code: 18 },
  { name: '山梨県', code: 19 },
  { name: '長野県', code: 20 },
  { name: '岐阜県', code: 21 },
  { name: '静岡県', code: 22 },
  { name: '愛知県', code: 23 },
  { name: '三重県', code: 24 },
  { name: '滋賀県', code: 25 },
  { name: '京都府', code: 26 },
  { name: '大阪府', code: 27 },
  { name: '兵庫県', code: 28 },
  { name: '奈良県', code: 29 },
  { name: '和歌山県', code: 30 },
  { name: '鳥取県', code: 31 },
  { name: '島根県', code: 32 },
  { name: '岡山県', code: 33 },
  { name: '広島県', code: 34 },
  { name: '山口県', code: 35 },
  { name: '徳島県', code: 36 },
  { name: '香川県', code: 37 },
  { name: '愛媛県', code: 38 },
  { name: '高知県', code: 39 },
  { name: '福岡県', code: 40 },
  { name: '佐賀県', code: 41 },
  { name: '長崎県', code: 42 },
  { name: '熊本県', code: 43 },
  { name: '大分県', code: 44 },
  { name: '宮崎県', code: 45 },
  { name: '鹿児島県', code: 46 },
  { name: '沖縄県', code: 47 },
];

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
    prefecture: { name: string; value: string }[];
    homeType: { name: string; value: string }[];
    roomType: { name: string; value: string }[];
    sex: { name: string; value: string }[];
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const res = await fetch(`https://api.traveller-api.amon.dev/address/calendar`);
  if (!res.ok) {
    return {
      notFound: true,
      revalidate: 0,
    };
  }

  const { homes } = (await res.json()) as {
    homes: Home[];
  };

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
        prefecture: prefectures.map((prefecture) => ({
          name: prefecture.name,
          value: prefecture.name,
        })),
        homeType: (() => {
          const values = new Set<string>();
          homes.forEach((home) => {
            values.add(home.homeType);
          });
          return Array.from(values).map((value) => ({
            name: value,
            value,
          }));
        })(),
        roomType: (() => {
          const values = new Set<string>();
          homes.forEach((home) => {
            home.rooms.forEach((room) => {
              values.add(room.type);
            });
          });
          return Array.from(values).map((value) => ({
            name: value,
            value,
          }));
        })(),
        sex: [
          { name: '男性', value: 'male' },
          { name: '女性', value: 'female' },
        ],
      },
      homes: homes
        .map((home) => {
          // 終了除外
          home.rooms = home.rooms.filter(
            (room) =>
              !room.name.match(
                /[(（【](予約停止中|提供終了|2022年10月で提供終了|予約不可|2022年2月で提供終了|提供終了|〜2022\/1\/31 {2}契約終了)[)）】]/
              )
          );

          if (roomTypeQuery) {
            home.rooms = home.rooms.filter((room) => roomTypeQuery.includes(room.type));
          }

          if (sexQuery) {
            home.rooms = home.rooms.filter((room) => sexQuery.some((q) => [q, null].includes(room.sex)));
          }

          // サムネイル削除
          home.thumbnail = '';
          home.rooms.map((room) => {
            room.thumbnail = '';
          });

          home.calendar.rooms = home.calendar.rooms
            .map((room) => ({
              ...room,
              reserved_dates: [],
              availables: dates
                .map((date) => {
                  const available =
                    !room.reserved_dates.includes(date.date) &&
                    !home.calendar.holidays.includes(date.day) &&
                    date.date <= home.calendar.calEndDate;
                  return available ? 'Y' : 'N';
                })
                .join(''),
            }))
            .sort((a, z) => a.room.id - z.room.id);

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
                        <option key={prefecture.value} value={prefecture.value}>
                          {prefecture.name}
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
                        <option key={homeType.value} value={homeType.value}>
                          {homeType.name}
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
                        <option key={roomType.value} value={roomType.value}>
                          {roomType.name}
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
      <Calendar className="mx-auto" homes={homes} dates={dates} />
    </div>
  );
};

const Calendar: React.FC<
  {
    className?: string;
  } & Pick<Props, 'homes' | 'dates'>
> = ({ className, homes, dates }) => {
  return (
    <section className={classNames('px-20', className)}>
      <header className="sticky top-0 w-max bg-white">
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
      <ul className="flex w-max flex-col">
        {homes.map((home) => (
          <li key={home.id}>
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
                  const calendarRoom = home.calendar.rooms.find((calendarRoom) => calendarRoom.room.id === room.id);
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
                            <p className="shrink-0 border px-4 text-xs">{room.type.replace('ドミトリー', 'ドミ')}</p>
                          </div>
                          <p className="shrink-0 line-clamp-1">
                            {room.name
                              .replace(/\s+/g, ' ')
                              .replace(/[(（]/, '(')
                              .replace(/[）)]/, ')')
                              .replace('(2022/2/1~)', '')
                              .replace('一階ゲストルーム', '')
                              .replace('(リンガー)', '')
                              .replace('(グラバー)', '')
                              .replace(/(シングルルーム|ツインルーム) (\d号室)/, '$2')
                              .replace('男女共用', '')
                              .replace(/シングルルーム(.+)/, '$1')
                              .replace(/(区画(オート)?)(サイト.+)[(（](.+)[)）]/, '$3 ($4)')
                              .replace(/約/g, '')
                              .replace('(2段ベッドツインルーム)', '')
                              .replace('ツインルーム116号室', '116号室')
                              .replace(/：[男女]性用/, ' ')}
                          </p>
                        </div>
                        {calendarRoom ? (
                          <div className="self-center text-xs">
                            <ul className="grid grid-cols-[repeat(40,24px)] self-center">
                              {calendarRoom.availables.split('').map((available, i) => {
                                return (
                                  <li key={i}>
                                    <div
                                      className={classNames('border-l text-center', available === 'N' && 'bg-black/20')}
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
        ))}
      </ul>
    </section>
  );
};

export default Page;

import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { CalendarSection } from '../../components/circle-calendar/CalendarSection';
import { fetchCalendar } from '../../lib/circle/calendar/fetchers';
import { Home } from '../../lib/circle/calendar/types';
import { prefectures } from '../../lib/prefecture/constants';

export type Props = {
  homes: Home[];
  dates: {
    date: string;
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }[];
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

  return {
    props: {
      homes: homes
        .map((home) => {
          home.availables =
            home.calendar
              ?.slice(0, dates.length)
              .map((cal) => (cal.vacancy ? 'Y' : 'N'))
              .join('') ?? '';
          home.calendar = null;
          return home;
        })
        .sort((a, z) => {
          const aPrefecture = prefectures.find((prefecture) => a.city.startsWith(prefecture.name))?.code ?? 0;
          const zPrefecture = prefectures.find((prefecture) => z.city.startsWith(prefecture.name))?.code ?? 0;

          if (aPrefecture !== zPrefecture) {
            return aPrefecture - zPrefecture;
          }

          return a.name > z.name ? 1 : -1;
        }),
      dates,
    },
  };
};

const Page: NextPage<Props> = ({ homes, dates }) => {
  const title = 'circle予約状況カレンダー';

  return (
    <div className="pb-80">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="mx-auto mb-20 flex flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">{title}</h1>
        <div className="text-center font-sans text-sm tracking-wide opacity-80">
          <p>circle予約状況 非公式カレンダー</p>
          <p>気が向けば機能増やします</p>
          <p>
            問い合わせ:{' '}
            <a className="underline" href="https://twitter.com/amotarao">
              Twitter @amotarao
            </a>
          </p>
        </div>
      </header>
      <CalendarSection homes={homes} dates={dates} />
    </div>
  );
};

export default Page;

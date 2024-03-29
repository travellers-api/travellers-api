import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarSection } from '../../components/circle-calendar/CalendarSection';
import { fetchCalendar } from '../../lib/circle/calendar/fetchers';
import { Home } from '../../lib/circle/calendar/types';
import { dayjs } from '../../lib/dayjs';
import { prefectures } from '../../lib/prefecture/constants';

type Props = {
  homes: Home[];
  dates: {
    date: string;
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }[];
};

const getData = async (): Promise<Props> => {
  const homes = await fetchCalendar({
    next: { revalidate: 60 * 30 },
  }).catch(() => null);
  if (!homes) {
    notFound();
  }

  const today = dayjs().tz('Asia/Tokyo');
  const dates = [...Array(60)].map((_, i) => {
    const dayjsObj = today.add(i, 'days');
    return {
      date: dayjsObj.format('YYYY/MM/DD'),
      day: Number(dayjsObj.format('d')) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    };
  });

  return {
    homes: homes
      .map((home) => {
        const firstIndex = home.calendar?.findIndex((cal) => cal.date === today.format('YYYY/MM/DD')) ?? -1;
        if (firstIndex >= 0) {
          home.availables =
            home.calendar
              ?.slice(firstIndex, firstIndex + dates.length)
              .map((cal) => (cal.vacancy === true ? 'Y' : cal.vacancy === false ? 'N' : 'O'))
              .join('') ?? '';
        } else {
          home.availables = '';
        }

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
  };
};

export default async function Page() {
  const { homes, dates } = await getData();

  return (
    <div className="pb-80">
      <header className="mx-auto mb-20 flex flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">
          circle予約状況カレンダー (非公式)
        </h1>
        <div className="text-center font-sans text-sm leading-6 tracking-wide opacity-80">
          <ul className="flex flex-wrap justify-center gap-x-8">
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <a className="underline" href="https://circle-cw.studio.site/" target="_blank" rel="noopener noreferrer">
                circle公式サイト
              </a>
            </li>
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <a className="underline" href="https://twitter.com/amotarao" target="_blank" rel="noopener noreferrer">
                問い合わせ: あもん
              </a>
            </li>
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <Link className="underline" href="/address-calendar">
                ADDress版
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <CalendarSection homes={homes} dates={dates} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'circle予約状況カレンダー (非公式)',
};

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarFilter } from '../../components/address-calendar/CalendarFilter';
import { CalendarSection } from '../../components/address-calendar/CalendarSection';
import { AddressCalendarForPage } from './api/calendar/route';

type PageContext = {
  searchParams?: {
    prefecture?: string | string[];
    homeType?: string | string[];
    roomType?: string | string[];
    bed?: string | string[];
    sex?: string | string[];
    capacity?: string | string[];
  };
};

const searchParamToArray = (value?: string | string[]): string[] => {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  return value;
};

const getData = async (context: PageContext): Promise<AddressCalendarForPage> => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';
  const url = new URL(`${baseUrl}/address-calendar/api/calendar`);

  const prefecture = searchParamToArray(context.searchParams?.prefecture);
  prefecture.forEach((v) => url.searchParams.append('prefecture', v));
  const homeType = searchParamToArray(context.searchParams?.homeType);
  homeType.forEach((v) => url.searchParams.append('homeType', v));
  const roomType = searchParamToArray(context.searchParams?.roomType);
  roomType.forEach((v) => url.searchParams.append('roomType', v));
  const bed = searchParamToArray(context.searchParams?.bed);
  bed.forEach((v) => url.searchParams.append('bed', v));
  const sex = searchParamToArray(context.searchParams?.sex);
  sex.forEach((v) => url.searchParams.append('sex', v));
  const capacity = searchParamToArray(context.searchParams?.capacity);
  capacity.forEach((v) => url.searchParams.append('capacity', v));

  const res = await fetch(url, { cache: 'force-cache' }).catch(() => null);
  if (!res) notFound();
  const json = await res.json();
  return json;
};

export default async function Page(context: PageContext) {
  const { homes, dates, filters } = await getData(context);

  return (
    <div className="pb-80">
      <header className="mx-auto mb-20 flex flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">
          ADDress予約状況カレンダー (非公式)
        </h1>
        <div className="text-center font-sans text-sm leading-6 tracking-wide opacity-80">
          <ul className="flex flex-wrap justify-center gap-x-8">
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <a className="underline" href="https://address.love/" target="_blank" rel="noopener noreferrer">
                ADDress公式サイト
              </a>
            </li>
            <li className='[&:nth-child(n+2)]:before:content-["_/_"]'>
              <a className="underline" href="https://twitter.com/amotarao" target="_blank" rel="noopener noreferrer">
                問い合わせ: あもん
              </a>
            </li>
          </ul>
        </div>
      </header>
      <CalendarFilter className="mb-20" filters={filters} />
      <CalendarSection homes={homes} dates={dates} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'ADDress予約状況カレンダー (非公式)',
};

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarFilter } from "../../components/address-calendar/CalendarFilter";
import { CalendarSection } from "../../components/address-calendar/CalendarSection";
import { AddressCalendarForPage } from "./api/calendar/route";

const searchParamToArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (typeof value === "string") return [value];
  return value;
};

const getData = async ({
  searchParams,
}: PageProps<"/address-calendar">): Promise<AddressCalendarForPage> => {
  const {
    prefecture: prefectureParam,
    homeType: homeTypeParam,
    roomType: roomTypeParam,
    bed: bedParam,
    sex: sexParam,
    capacity: capacityParam,
  } = await searchParams;

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
  const url = new URL(`${baseUrl}/address-calendar/api/calendar`);

  const prefecture = searchParamToArray(prefectureParam);
  prefecture.forEach((v) => url.searchParams.append("prefecture", v));
  const homeType = searchParamToArray(homeTypeParam);
  homeType.forEach((v) => url.searchParams.append("homeType", v));
  const roomType = searchParamToArray(roomTypeParam);
  roomType.forEach((v) => url.searchParams.append("roomType", v));
  const bed = searchParamToArray(bedParam);
  bed.forEach((v) => url.searchParams.append("bed", v));
  const sex = searchParamToArray(sexParam);
  sex.forEach((v) => url.searchParams.append("sex", v));
  const capacity = searchParamToArray(capacityParam);
  capacity.forEach((v) => url.searchParams.append("capacity", v));

  const res = await fetch(url, { cache: "force-cache" }).catch(() => null);
  if (!res) notFound();
  const json = await res.json();
  return json;
};

const LINKS = [
  { href: "https://address.love/", text: "ADDress公式サイト" },
  { href: "https://twitter.com/amotarao", text: "問い合わせ: あもん" },
];

export default async function Page(props: PageProps<"/address-calendar">) {
  const { homes, dates, filters } = await getData(props);

  return (
    <div className="pb-80">
      <header className="mx-auto mb-20 flex flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">
          ADDress予約状況カレンダー (非公式)
        </h1>
        <div className="text-center font-sans text-sm leading-6 tracking-wide opacity-80">
          <ul className="flex flex-wrap justify-center gap-x-8">
            {LINKS.map(({ href, text }) => (
              <li key={href} className="nth-[n+2]:before:content-['_/_']">
                <a
                  className="underline"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <CalendarFilter className="mb-20" filters={filters} />
      <CalendarSection homes={homes} dates={dates} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "ADDress予約状況カレンダー (非公式)",
};

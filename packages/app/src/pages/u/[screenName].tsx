import dayjs from 'dayjs';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';

type AddressReservation = {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | 'rejected' | null;
  home: {
    id: string;
    name: string;
    room: string;
  };
};

type CircleReservation = {
  id: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | 'rejected' | null;
  checkInDate: string;
  checkOutDate: string;
  home: {
    name: string;
    city: string;
    roomType: string;
  };
};

type HafhReservation = {
  id: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | 'rejected' | null;
  checkInDate: string;
  checkOutDate: string;
  home: {
    name: string;
    city: string;
  };
};

export type Params = {
  screenName: string;
};

export type Props = {
  screenName: string;
  reservations: (
    | { service: 'ADDress'; data: AddressReservation }
    | { service: 'circle'; data: CircleReservation }
    | { service: 'hafh'; data: HafhReservation }
  )[];
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const screenName = params?.screenName ?? '';
  if (!screenName) {
    return {
      notFound: true,
      revalidate: 0,
    };
  }

  const [address, circle, hafh] = await Promise.all([
    fetch(`https://api.traveller-api.amon.dev/address/users/${screenName}/reservations`).then(async (res) => {
      const { reservations } = (await res.json()) as { reservations: AddressReservation[] };
      return { ok: res.ok, reservations };
    }),
    fetch(`https://api.traveller-api.amon.dev/circle/users/${screenName}/reservations`).then(async (res) => {
      const { reservations } = (await res.json()) as { reservations: CircleReservation[] };
      return { ok: res.ok, reservations };
    }),
    fetch(`https://api.traveller-api.amon.dev/hafh/users/${screenName}/reservations`).then(async (res) => {
      const { reservations } = (await res.json()) as { reservations: HafhReservation[] };
      return { ok: res.ok, reservations };
    }),
  ]);

  if (!address.ok && !circle.ok && !hafh.ok) {
    return {
      notFound: true,
      revalidate: 0,
    };
  }

  const props: Props = {
    screenName,
    reservations: [
      ...address.reservations.map((data) => ({ service: 'ADDress' as const, data })),
      ...circle.reservations.map((data) => ({ service: 'circle' as const, data })),
      ...hafh.reservations.map((data) => ({ service: 'hafh' as const, data })),
    ]
      .sort((a, z) => (a.data.checkInDate > z.data.checkInDate ? 1 : -1))
      .filter((reservation) => reservation.data.status === 'approved' || reservation.data.status === 'staying'),
  };

  return {
    props,
    revalidate: 60 * 60,
  };
};

const Page: NextPage<Props> = ({ screenName, reservations }) => {
  const title = useMemo(() => `${screenName}の滞在予定`, [screenName]);

  return (
    <div className="pb-80">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="mx-auto mb-20 flex max-w-480 flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">{screenName}の滞在予定</h1>
        <div className="text-center font-sans text-sm tracking-wide opacity-80 [&_a]:underline">
          <p>「避けたい」にご活用ください</p>
          <p>
            <a href="https://twitter.com/amotarao">Twitter @amotarao</a>
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-480 px-20">
        <ul className="flex flex-col gap-20">
          {reservations.map((reservation) => (
            <li key={`${reservation.service}_${reservation.data.id}`}>
              <div className="grid min-h-[120px] grid-cols-[100px_1fr] rounded-3xl border-2 p-20">
                <div className="font-sans text-xs font-bold text-black/50">
                  <p>
                    <time dateTime={reservation.data.checkInDate}>
                      {dayjs(reservation.data.checkInDate).format('MM.DD ddd')}-
                    </time>
                  </p>
                  <p>
                    <time dateTime={reservation.data.checkOutDate}>
                      {dayjs(reservation.data.checkOutDate).format('MM.DD ddd')}
                    </time>
                  </p>
                </div>
                <div className="grid grid-cols-1 content-start gap-8 border-l-2 pl-20">
                  <p className="font-sans text-3xl font-bold opacity-80 line-clamp-1">{reservation.data.home.name}</p>
                  <div className="flex gap-8">
                    <p className="font-sans text-xs font-bold text-black/50">{reservation.service}</p>
                    {reservation.service === 'circle' && (
                      <p className="font-sans text-xs font-bold text-black/50">{reservation.data.home.city}</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Page;

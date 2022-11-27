import dayjs from 'dayjs';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';

type Reservation = {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  home: {
    id: string;
    name: string;
    room: string;
  };
};

export type Params = {
  screenName: string;
};

export type Props = {
  screenName: string;
  reservations: Reservation[];
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

  const res = await fetch(`https://api.traveller-api.amon.dev/address/users/${screenName}/reservations`);
  if (!res.ok) {
    return {
      notFound: true,
      revalidate: 0,
    };
  }

  const { reservations } = (await res.json()) as {
    reservations: Reservation[];
  };

  return {
    props: {
      screenName,
      reservations,
    },
    revalidate: 60 * 60,
  };
};

const Page: NextPage<Props> = ({ screenName, reservations }) => {
  const title = useMemo(() => `${screenName}のADDress滞在予定`, [screenName]);

  return (
    <div className="pb-80">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="mx-auto mb-20 flex max-w-480 flex-col gap-10 px-20 py-20">
        <h1 className="text-center font-sans text-xl font-bold tracking-wide opacity-80">
          {screenName}のADDress滞在予定
        </h1>
        <p className="text-center font-sans text-sm tracking-wide opacity-80">
          「避けたい」にご活用ください
          <br />
          <a className="underline" href="https://twitter.com/amotarao">
            Twitter @amotarao
          </a>
        </p>
      </header>
      <section className="mx-auto max-w-480 px-20">
        <ul className="flex flex-col gap-20">
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <div className="grid min-h-[120px] grid-cols-[100px_1fr] rounded-3xl border-2 p-20">
                <div className="font-sans text-xs font-bold opacity-50">
                  <p>
                    <time dateTime={reservation.checkInDate}>
                      {dayjs(reservation.checkInDate).format('MM.DD ddd')}-
                    </time>
                  </p>
                  <p>
                    <time dateTime={reservation.checkOutDate}>
                      {dayjs(reservation.checkOutDate).format('MM.DD ddd')}
                    </time>
                  </p>
                </div>
                <p className="border-l-2 pl-20">
                  <span className="font-sans text-3xl font-bold opacity-80">{reservation.home.name}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Page;

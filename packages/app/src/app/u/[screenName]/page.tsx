import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dayjs } from '../../../lib/dayjs';

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

type Params = {
  screenName: string;
};

type Props = {
  screenName: string;
  reservations: ({ service: 'ADDress'; data: AddressReservation } | { service: 'HafH'; data: HafhReservation })[];
};

const getData = async (screenName: string): Promise<Props> => {
  const [address, hafh] = await Promise.all([
    fetch(`https://api.travellers-api.amon.dev/address/users/${screenName}/reservations`, {
      next: { revalidate: 60 * 60 },
    }).then(async (res) => {
      const { reservations } = res.ok
        ? ((await res.json()) as { reservations: AddressReservation[] })
        : { reservations: [] };
      return { ok: res.ok, reservations };
    }),
    fetch(`https://api.travellers-api.amon.dev/hafh/users/${screenName}/reservations`, {
      next: { revalidate: 60 * 60 },
    }).then(async (res) => {
      const { reservations } = res.ok
        ? ((await res.json()) as { reservations: HafhReservation[] })
        : { reservations: [] };
      return { ok: res.ok, reservations };
    }),
  ]);

  if (!address.ok && !hafh.ok) {
    notFound();
  }

  const props: Props = {
    screenName,
    reservations: [
      ...address.reservations.map((data) => ({ service: 'ADDress' as const, data })),
      ...hafh.reservations.map((data) => ({ service: 'HafH' as const, data })),
    ]
      .sort((a, z) => (a.data.checkInDate > z.data.checkInDate ? 1 : -1))
      .filter((reservation) => reservation.data.status === 'approved' || reservation.data.status === 'staying'),
  };

  return props;
};

export default async function Page({ params }: { params: Params }) {
  const { screenName, reservations } = await getData(params.screenName);

  return (
    <div className="pb-80">
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
                      {dayjs.tz(reservation.data.checkInDate, 'Asia/Tokyo').format('MM.DD ddd')}-
                    </time>
                  </p>
                  <p>
                    <time dateTime={reservation.data.checkOutDate}>
                      {dayjs.tz(reservation.data.checkOutDate, 'Asia/Tokyo').format('MM.DD ddd')}
                    </time>
                  </p>
                </div>
                <div className="grid grid-cols-1 content-start gap-8 border-l-2 pl-20">
                  <p className="line-clamp-1 font-sans text-3xl font-bold opacity-80">{reservation.data.home.name}</p>
                  <div className="flex gap-8">
                    <p className="font-sans text-xs font-bold text-black/50">{reservation.service}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return {
    title: `${params.screenName}の滞在予定`,
  };
}

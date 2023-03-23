import { useVirtual } from '@tanstack/react-virtual';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { LabelText } from '../../components/address-calendar/LabelText';
import { Home } from '../../lib/circle/calendar/types';

export type CalendarSectionProps = {
  className?: string;
  homes: Home[];
  dates: {
    date: string;
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }[];
};

export const CalendarSection: React.FC<CalendarSectionProps> = ({ className, homes, dates }) => {
  return (
    <section className={className}>
      <aside className="mb-10 flex items-center gap-10 px-20">
        <p className="text-xs">凡例</p>
        <ul className="flex py-5 text-xs">
          <li>
            <div className="border-y border-l px-8 py-2 text-center">予約可能</div>
          </li>
          <li>
            <div className="border-y border-l bg-black/20 px-8 py-2 text-center">予約期間外・拠点休日</div>
          </li>
          <li>
            <div className="border-y border-l bg-black/50 px-8 py-2 text-center text-white">予約済み・予約不可</div>
          </li>
        </ul>
      </aside>
      <InnerSection homes={homes} dates={dates} />
    </section>
  );
};

const InnerSection: React.FC<Pick<CalendarSectionProps, 'homes' | 'dates'>> = ({ homes, dates }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const estimateSize = useCallback(() => {
    const roomCount = 1;
    return roomCount * 31 + 10;
  }, []);
  const virtual = useVirtual({
    size: homes.length,
    parentRef,
    overscan: 5,
    estimateSize,
  });

  return (
    <section
      className="w-full overflow-x-scroll"
      style={
        {
          '--dates-count': dates.length,
          '--home-width': '640px',
        } as React.CSSProperties
      }
    >
      <div className="w-max">
        <header className="w-full px-20">
          <div className="grid grid-cols-[var(--home-width)_1fr] border-b">
            <div className="flex flex-col gap-4 self-center py-5 text-xs">
              <p>拠点</p>
            </div>
            <div className="grid grid-cols-[var(--room-width)_1fr] gap-4 py-5">
              <ul className="grid grid-cols-[repeat(var(--dates-count),24px)] self-center">
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
        <div ref={parentRef} className="h-max max-h-[70vh] w-full overflow-y-auto px-20">
          <ul
            className="relative flex h-[var(--total-size)] flex-col"
            style={
              {
                '--total-size': `${virtual.totalSize}px`,
              } as React.CSSProperties
            }
          >
            {virtual.virtualItems.map((virtualRow) => {
              const home = homes[virtualRow.index]!;

              return (
                <li
                  key={virtualRow.key}
                  className="absolute left-0 top-[var(--start)] h-[var(--size)] w-full"
                  style={
                    {
                      '--start': `${virtualRow.start}px`,
                      '--size': `${virtualRow.size}px`,
                    } as React.CSSProperties
                  }
                >
                  <div className="grid grid-cols-[var(--home-width)_1fr] border-b pb-10">
                    <div className="flex items-center gap-4 self-start py-5 text-sm">
                      <p className="shrink-0 font-bold">
                        <a
                          className="underline"
                          href={`https://reserva.be/circle01cw/reserve?mode=htl&evt_no=${home.id}&room_num=1&people=1.0.0.0`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {home.name}
                        </a>
                      </p>
                      <div className="itesm-center flex gap-4">
                        <LabelText className="shrink-0">{home.city}</LabelText>
                        <LabelText className="shrink-0">{home.roomType}</LabelText>
                        {home.tags.map((tag, i) => (
                          <LabelText key={i} className="shrink-0">
                            {tag}
                          </LabelText>
                        ))}
                      </div>
                    </div>
                    <ul>
                      <li className="border-b last:border-b-0">
                        <div className="grid grid-cols-[var(--room-width)_1fr] gap-4 py-5">
                          {home.availables ? (
                            <div className="self-center text-xs">
                              <ul className="grid grid-cols-[repeat(var(--dates-count),24px)] self-center">
                                {home.availables.split('').map((available, i) => (
                                  <li key={i}>
                                    <div
                                      className={classNames(
                                        'border-l text-center',
                                        available === 'N'
                                          ? 'bg-black/40'
                                          : available === 'O'
                                          ? 'bg-black/20'
                                          : available === 'H'
                                          ? 'bg-black/20'
                                          : available === 'Y'
                                          ? ''
                                          : null
                                      )}
                                    >
                                      <span>&nbsp;</span>
                                      <span className="sr-only">
                                        {available === 'N'
                                          ? '予約済み・予約不可'
                                          : available === 'O'
                                          ? '予約期間外'
                                          : available === 'H'
                                          ? '拠点休日'
                                          : available === 'Y'
                                          ? '予約可能'
                                          : null}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="self-center text-xs">取得不可</div>
                          )}
                        </div>
                      </li>
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

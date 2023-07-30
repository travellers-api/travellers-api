'use client';

import classNames from 'classnames';
import { formatUrl } from 'next/dist/shared/lib/router/utils/format-url';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { queryToArray } from '../../utils/router';

type Props = {
  className?: string;
  filters: {
    prefecture: { name: string; value: string; group?: string }[];
    homeType: { name: string; value: string; group?: string }[];
    roomType: { name: string; value: string; group?: string }[];
    sex: { name: string; value: string; group?: string }[];
    capacity: { name: string; value: string; group?: string }[];
  };
};

export const CalendarFilter: React.FC<Props> = ({ className, filters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterRef = useRef<HTMLDetailsElement>(null);

  const [isShownSelectText, setIsShownSelectText] = useState(false);
  useEffect(() => {
    setIsShownSelectText(window.matchMedia('(pointer: fine)').matches);
  }, []);

  return (
    <nav className={classNames('px-20', className)}>
      <details className="w-full rounded-xl border px-20 py-10 md:w-max" ref={filterRef}>
        <summary>フィルタ</summary>
        <div className="mt-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              filterRef.current?.removeAttribute('open');

              router.replace(
                formatUrl({
                  pathname: '/address-calendar',
                  query: {
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
                    capacity: Array.from(
                      e.currentTarget.querySelectorAll<HTMLOptionElement>('[name="capacity"] option:checked')
                    ).map((elm) => elm.value),
                  },
                })
              );
            }}
          >
            <div className="flex flex-col gap-20">
              <div className="flex flex-col items-start gap-10">
                <button className="rounded border px-12 py-4 text-sm" type="submit">
                  フィルタ確定
                </button>
                {isShownSelectText && <p className="text-sm">Ctrl/Cmdキーで複数選択、選択解除可能</p>}
              </div>
              <div className="flex flex-col gap-20 md:flex-row">
                <Filter
                  title="都道府県"
                  multiple
                  defaultValue={queryToArray(searchParams.getAll('prefecture')) ?? []}
                  values={filters.prefecture}
                />
                <Filter
                  title="拠点種別"
                  multiple
                  defaultValue={queryToArray(searchParams.getAll('homeType')) ?? []}
                  values={filters.homeType}
                />
                <Filter
                  title="部屋種別"
                  multiple
                  defaultValue={queryToArray(searchParams.getAll('roomType')) ?? []}
                  values={filters.roomType}
                />
                <Filter title="性別" defaultValue={searchParams.get('sex') ?? undefined} values={filters.sex} />
                <Filter
                  title="利用人数"
                  defaultValue={searchParams.get('capacity') ?? undefined}
                  values={filters.capacity}
                />
              </div>
            </div>
          </form>
        </div>
      </details>
    </nav>
  );
};

const Filter: React.FC<
  {
    title: string;
    values: { name: string; value: string; group?: string }[];
  } & (
    | {
        multiple?: false;
        defaultValue?: string;
      }
    | {
        multiple: true;
        defaultValue: string[];
      }
  )
> = ({ title, multiple = false, defaultValue, values }) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-4 text-sm">
      <label className="font-bold" htmlFor={id}>
        {title}
      </label>
      <select
        id={id}
        name={id}
        className="h-max rounded border px-8 py-4"
        defaultValue={defaultValue}
        multiple={multiple}
        size={Math.min(values.length, 10)}
      >
        {values.map((value) =>
          typeof value === 'string' ? (
            <option key={value} value={value}>
              {value}
            </option>
          ) : (
            <option key={value.value} value={value.value}>
              {value.name}
            </option>
          )
        )}
      </select>
    </div>
  );
};

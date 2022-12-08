import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useCallback, useRef } from 'react';
import { queryToArray } from '../../utils/router';

export type CalendarFilterProps = {
  className?: string;
  filters: {
    prefecture: string[];
    homeType: string[];
    roomType: string[];
    sex: { name: string; value: string }[];
  };
};

export const CalendarFilter: React.FC<CalendarFilterProps> = ({ className, filters }) => {
  const router = useRouter();
  const filterRef = useRef<HTMLDetailsElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
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
          sex: Array.from(e.currentTarget.querySelectorAll<HTMLOptionElement>('[name="sex"] option:checked')).map(
            (elm) => elm.value
          ),
        },
      });
    },
    [router]
  );

  return (
    <nav className={classNames('px-20', className)}>
      <details className="w-full rounded-2xl border px-20 py-10 md:w-max" ref={filterRef}>
        <summary>フィルタ</summary>
        <div className="mt-20">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col items-start gap-10">
                <button className="rounded border px-12 py-4 text-sm" type="submit">
                  フィルタ確定
                </button>
                <p className="text-sm">Ctrl/Cmdキーで複数選択、選択解除可能</p>
              </div>
              <div className="flex flex-col gap-20 md:flex-row">
                <Filter
                  id="prefecture"
                  title="都道府県"
                  defaultValue={queryToArray(router.query?.prefecture) ?? []}
                  values={filters.prefecture}
                />
                <Filter
                  id="homeType"
                  title="拠点種別"
                  defaultValue={queryToArray(router.query?.homeType) ?? []}
                  values={filters.homeType}
                />
                <Filter
                  id="roomType"
                  title="部屋種別"
                  defaultValue={queryToArray(router.query?.roomType) ?? []}
                  values={filters.roomType}
                />
                <Filter
                  id="sex"
                  title="性別"
                  defaultValue={queryToArray(router.query?.sex) ?? []}
                  values={filters.sex}
                />
              </div>
            </div>
          </form>
        </div>
      </details>
    </nav>
  );
};

const Filter: React.FC<{
  id: string;
  title: string;
  defaultValue: string[];
  values: ({ name: string; value: string } | string)[];
}> = ({ id, title, defaultValue, values }) => {
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
        multiple
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

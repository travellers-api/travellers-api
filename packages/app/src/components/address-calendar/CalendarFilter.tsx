import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useRef } from 'react';
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

  return (
    <nav className={classNames('px-20', className)}>
      <details className="w-full rounded-2xl border px-20 py-10 md:w-max" ref={filterRef}>
        <summary>フィルタ</summary>
        <div className="mt-20">
          <form
            onSubmit={(e) => {
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
                  sex: Array.from(
                    e.currentTarget.querySelectorAll<HTMLOptionElement>('[name="sex"] option:checked')
                  ).map((elm) => elm.value),
                },
              });
            }}
          >
            <div className="flex flex-col gap-20">
              <div className="flex flex-col items-start gap-10">
                <button className="rounded border px-12 py-4 text-sm" type="submit">
                  フィルタ確定
                </button>
                <p className="text-sm">Ctrl/Cmdキーで複数選択、選択解除可能</p>
              </div>
              <div className="flex flex-col gap-20 md:flex-row">
                <div className="flex flex-col gap-4 text-sm">
                  <label className="font-bold" htmlFor="prefecture">
                    都道府県
                  </label>
                  <select
                    id="prefecture"
                    name="prefecture"
                    className="h-max rounded border px-8 py-4"
                    defaultValue={queryToArray(router.query?.prefecture) ?? []}
                    multiple
                    size={Math.min(filters.prefecture.length, 10)}
                  >
                    {filters.prefecture.map((prefecture) => (
                      <option key={prefecture} value={prefecture}>
                        {prefecture}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4 text-sm">
                  <label className="font-bold" htmlFor="homeType">
                    拠点種別
                  </label>
                  <select
                    id="homeType"
                    name="homeType"
                    className="h-max rounded border px-8 py-4"
                    defaultValue={queryToArray(router.query?.homeType) ?? []}
                    multiple
                    size={Math.min(filters.homeType.length, 10)}
                  >
                    {filters.homeType.map((homeType) => (
                      <option key={homeType} value={homeType}>
                        {homeType}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4 text-sm">
                  <label className="font-bold" htmlFor="roomType">
                    部屋種別
                  </label>
                  <select
                    id="roomType"
                    name="roomType"
                    className="h-max rounded border px-8 py-4"
                    defaultValue={queryToArray(router.query?.roomType) ?? []}
                    multiple
                    size={Math.min(filters.roomType.length, 10)}
                  >
                    {filters.roomType.map((roomType) => (
                      <option key={roomType} value={roomType}>
                        {roomType}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4 text-sm">
                  <label className="font-bold" htmlFor="sex">
                    性別
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    className="h-max rounded border px-8 py-4"
                    defaultValue={queryToArray(router.query?.sex) ?? []}
                    multiple
                    size={Math.min(filters.sex.length, 10)}
                  >
                    {filters.sex.map((sex) => (
                      <option key={sex.value} value={sex.value}>
                        {sex.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </details>
    </nav>
  );
};

import { Metadata } from "next";

const LINKS = [
  { href: "https://address.love/", text: "ADDress公式サイト" },
  { href: "https://twitter.com/amotarao", text: "問い合わせ: あもん" },
];

export default function Page() {
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
      <div className="px-20 text-center font-sans text-sm leading-6 tracking-wide opacity-80">
        <p>サービスの提供を終了しました。</p>
        <p>ドメインは 2027/7/30 まで有効です。</p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "ADDress予約状況カレンダー (非公式)",
};

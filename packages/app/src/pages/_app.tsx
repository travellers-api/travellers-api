import { Noto_Sans_JP } from '@next/font/google';
import type { AppProps } from 'next/app';
import '../styles/globals.scss';

/* eslint-disable-next-line new-cap */
const notoSansJp = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['japanese'],
  variable: '--font-serif',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={notoSansJp.variable}>
      <Component {...pageProps} />
    </div>
  );
}

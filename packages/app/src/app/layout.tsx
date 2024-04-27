import { Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.scss';

/* eslint-disable-next-line new-cap */
const notoSansJp = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja-JP">
      <head>
        <Script
          id="firebase"
          strategy="beforeInteractive"
          type="module"
          dangerouslySetInnerHTML={{
            __html: `// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyD2kRQJPJd_g8xM-5Y1RqYlGJXhoWFvQQY",
authDomain: "traveller-api-11b75.firebaseapp.com",
projectId: "traveller-api-11b75",
storageBucket: "traveller-api-11b75.appspot.com",
messagingSenderId: "219715990048",
appId: "1:219715990048:web:43d681da62e391d59cc245",
measurementId: "G-HBD8XE2F2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);`,
          }}
        />
      </head>
      <body className={notoSansJp.variable}>{children}</body>
    </html>
  );
}

export const revalidate = 60 * 60;

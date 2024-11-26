// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';
import localFont from "next/font/local";
import "./globals.css";
import Footer from "./components/Footer";
import { GlobalStateProvider } from './context/GlobalStateContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "FeelChat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalStateProvider>
          <div id="root">
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
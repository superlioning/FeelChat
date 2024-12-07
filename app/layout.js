// app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GlobalStateProvider } from './context/GlobalStateContext';
import BootstrapProvider from './providers/BootstrapProvider';

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
        <BootstrapProvider>
          <GlobalStateProvider>
            <div id="root">
              <Navbar />
              <main>{children}</main>
              <Footer />
            </div>
          </GlobalStateProvider>
        </BootstrapProvider>
      </body>
    </html>
  );
}
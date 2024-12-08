// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GlobalStateProvider } from "./context/GlobalStateContext";
import BootstrapProvider from "./providers/BootstrapProvider";

export const metadata = {
  title: "FeelChat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
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

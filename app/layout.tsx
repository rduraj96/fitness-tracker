import Navbar from "./(shared)/Navbar";
import "./globals.css";
import { Nunito } from "next/font/google";
import { Providers } from "./providers";
import { GlobalContextProvider } from "./Context/store";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Fitness Tracker",
  description: "General fitness tracker",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.className} flex h-100vh relative`}>
        <Providers>
          <Navbar />
          <GlobalContextProvider>{children}</GlobalContextProvider>
        </Providers>
      </body>
    </html>
  );
}

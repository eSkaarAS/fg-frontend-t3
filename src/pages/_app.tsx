import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className={GeistSans.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);

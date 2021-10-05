import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/index.css";
import "../styles/markdown.css";
import { GA_ID, pageview } from "../lib/gtag";

import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_ID) {
      return;
    }

    const handleRouteChange = (path: string) => {
      pageview(path);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    /* eslint-disable consistent-return */
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    /* eslint-enable consistent-return */
  }, [router.events]);

  return <Component {...pageProps} />;
}

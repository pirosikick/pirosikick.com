import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_ID } from "../lib/gtag";

const GAScript = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GA_ID || ""}');`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          {GA_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: GAScript,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

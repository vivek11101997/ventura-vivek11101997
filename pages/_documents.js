import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/fevicon.png" />
        </Head>
        <body>
          <Main />
          <div id="modal_overlays"></div>
          <NextScript />
          <Script src="./Script.js" strategy="beforeInteractive" />
          <Script
            src="https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/hyperverge-web-sdk@3.3.5/src/sdk.min.js"
            strategy="lazyOnload"
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

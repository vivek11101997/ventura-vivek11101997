import "../styles/Icomoon.css";
import "../styles/globals.css";
import "../styles/animate.min.css";
import { Provider } from "react-redux";
import { FlagsmithProvider } from "flagsmith/react";
import flagsmith from "flagsmith/isomorphic";
import { createContext, useReducer } from "react";
import Head from "next/head";
import store from "../Redux/store";
import { initialState, reducer } from "../Reducer/reducer";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
export const UserContext = createContext();

function MyApp({ Component, pageProps, flagsmithState }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <FlagsmithProvider flagsmith={flagsmith} serverState={flagsmithState}>
        <FpjsProvider
          loadOptions={{
            apiKey: process.env.FINGERPRINTJS_API_KEY,
            region: "ap",
          }}
        >
          <Provider store={store}>
            <UserContext.Provider value={{ state, dispatch }}>
              <Head>
                <title>Ventura</title>
                <link rel="shortcut icon" href="/images/fevicon.png" />
              </Head>

              <div id="modal_overlays"></div>
              <Component {...pageProps} />
            </UserContext.Provider>
          </Provider>
        </FpjsProvider>
      </FlagsmithProvider>
    </>
  );
}

MyApp.getInitialProps = async () => {
  await flagsmith.init({
    environmentID: process.env.FLAGSMITH_KEY,
    identity: "user",
    state: {},
  });
  return { flagsmithState: flagsmith.getState() };
};

export default MyApp;

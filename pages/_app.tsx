import Head from "next/head";
import { useRouter } from "next/router";
import { rgba } from "polished";
import { createGlobalStyle } from "styled-components";
import { SpotifyContext } from "../Components/SpotifyContext";

const APP = "/app";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    --border-radius: 0.5rem;
    --colors-opaque-dark: ${rgba("#4C5B5C", 0.8)};
    --colors-dark: #4C5B5C;
    --colors-yellow: #F9CB40;
    --colors-green: #BCED09;
    --colors-blue: #2F52E0;
    --colors-red: #FF715B;
    --box-shadow: 0px 5px 15px 0px ${rgba("#4C5B5C", 0.3)};
  }
`;

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <GlobalStyle />
      <Head>
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
      </Head>
      {router.asPath.startsWith(APP) ? (
        <SpotifyContext>
          <Component {...pageProps} />
        </SpotifyContext>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

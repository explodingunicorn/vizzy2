import Head from "next/head";
import { useRouter } from "next/router";
import { rgba, darken } from "polished";
import { createGlobalStyle } from "styled-components";
import { SpotifyContext } from "../Components/SpotifyContext";

const APP = "/app";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap');
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    --border-radius: 0.5rem;
    --colors-opaque-dark: ${rgba("#4C5B5C", 0.8)};
    --colors-very-opaque-dark: ${rgba("#4C5B5C", 0.6)};
    --colors-white: #F4F6F6;
    --colors-dark: #4C5B5C;
    --colors-yellow: #F9CB40;
    --colors-green: #BCED09;
    --colors-green-dark: ${darken(0.05, "#BCED09")};
    --colors-blue: #2F52E0;
    --colors-red: #FF715B;
    --box-shadow: 0px 5px 15px 0px ${rgba("#4C5B5C", 0.3)};
  }

  p, h1, h2, h3, h4 {
    font-family: 'Outfit', sans-serif;
    color: var(--colors-dark);
    margin: 0;
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

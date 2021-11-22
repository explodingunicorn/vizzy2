import { useRouter } from "next/router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { createSpotifyApi, createSpotifyAuthUrl } from "../utils/spotifyApi";
import { Modal } from "./Modal";

export interface SpotifyContextProvider {
  accessToken: string;
  setAccessToken: (token: string) => void;
  loading: boolean;
  spotifyApi: SpotifyWebApi;
  player: Spotify.Player | undefined;
  setPlayer: (player: Spotify.Player) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

const context = createContext<SpotifyContextProvider>({
  accessToken: "",
  setAccessToken: () => {},
  loading: true,
  spotifyApi: new SpotifyWebApi(),
  player: undefined,
  setPlayer: () => {},
  playing: false,
  setPlaying: () => {},
});

export const useSpotifyContext = () => {
  return useContext(context);
};

export const SpotifyContext = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [spotifyApi, setSpotifyApi] = useState(() => new SpotifyWebApi());
  const [player, setPlayer] = useState<Spotify.Player>();
  const [playing, setPlaying] = useState(false);
  const [modal, setModal] = useState(false);
  const spotifyAuthorizeUrl = useRef(createSpotifyAuthUrl());

  const tryAccessToken = async (token: string) => {
    console.log("Trying access token");
    const testApi = createSpotifyApi(token);
    const me = await testApi.getMe().then(
      (data) => {
        return data;
      },
      () => {
        return null;
      }
    );
    console.log(me);
    if (me) {
      setLoading(false);
      setSpotifyApi(testApi);
      setAccessToken(token);
      localStorage.setItem("accessKey", token);
    } else {
      setModal(true);
    }
  };

  useEffect(() => {
    const path = router.asPath;
    let accessToken;
    const splitPath = path.split("#access_token=");
    if (splitPath.length > 1) {
      accessToken = splitPath[1];
      tryAccessToken(accessToken);
      history.pushState("", document.title, window.location.pathname);
    } else {
      accessToken = localStorage.getItem("accessKey");
      if (accessToken) {
        tryAccessToken(accessToken);
      } else {
        setModal(true);
      }
    }
  }, []);

  return (
    <context.Provider
      value={{
        accessToken,
        setAccessToken: (token) => {
          setAccessToken(token);
        },
        loading,
        spotifyApi,
        player,
        setPlayer,
        playing,
        setPlaying,
      }}
    >
      {children}
      {modal && (
        <Modal onClose={() => {}}>
          <p>
            Looks like you need to login to spotify to continue:{" "}
            <a href={spotifyAuthorizeUrl.current}>Click here</a>
          </p>
        </Modal>
      )}
    </context.Provider>
  );
};

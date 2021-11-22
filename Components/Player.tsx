import { useEffect, useState } from "react";
import styled from "styled-components";
import { RiPlayFill, RiPauseFill } from "react-icons/ri";
import { useSpotifyContext } from "./SpotifyContext";

const StyledPlayer = styled.div`
  align-items: center;
  bottom: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  display: flex;
  justify-content: center;
  left: 2rem;
  padding: 1rem;
  position: fixed;
  box-shadow: var(--box-shadow);
`;

const PlayButton = styled.button`
  align-items: center;
  background-color: var(--colors-yellow);
  color: var(--colors-dark);
  display: flex;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  outline: none;
  border: none;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const Player = () => {
  const {
    accessToken,
    spotifyApi,
    setPlayer: setContextPlayer,
    playing,
    setPlaying,
  } = useSpotifyContext();
  const [spotifyPlayerLoaded, setSpotifyPlayerLoaded] = useState(false);
  const [player, setPlayer] = useState<Spotify.Player>(null);
  const [error, setError] = useState(false);

  const startPlayer = (token) => {
    const player = new Spotify.Player({
      name: "Web Playback SDK Quick Start Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    player.on("ready", ({ device_id }) => {
      spotifyApi.transferMyPlayback([device_id]).then(
        (res) => {
          console.log("Playback transferred");
        },
        (reason) => {
          console.error(reason);
        }
      );
      setPlayer(player);
      setContextPlayer(player);
      console.log("Player is ready to go");
    });

    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    player.addListener("initialization_error", ({ message }) => {
      if (!error) {
        setError(true);
      }
    });

    player.addListener("authentication_error", ({ message }) => {
      if (!error) {
        setError(true);
      }
    });

    player.addListener("account_error", ({ message }) => {
      if (!error) {
        setError(true);
      }
    });

    player.addListener("player_state_changed", (state) => {
      console.log("Player state changed", state);
      if (state) {
        setPlaying(!state.paused);
      }
    });

    player.connect();
  };

  useEffect(() => {
    if (accessToken && spotifyPlayerLoaded) {
      startPlayer(accessToken);
    }
  }, [accessToken, spotifyPlayerLoaded]);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      setSpotifyPlayerLoaded(true);
    };
  }, []);

  return (
    <>
      {player && (
        <StyledPlayer>
          <PlayButton
            onClick={() => {
              player.togglePlay();
            }}
          >
            {playing ? <RiPauseFill /> : <RiPlayFill />}
          </PlayButton>
        </StyledPlayer>
      )}
    </>
  );
};

import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  RiPlayFill,
  RiPauseFill,
  RiSkipForwardFill,
  RiSkipBackFill,
} from "react-icons/ri";
import { useSpotifyContext } from "./SpotifyContext";

const StyledPlayer = styled.div`
  align-items: center;
  bottom: 1rem;
  background-color: white;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: row;
  justify-content: center;
  left: 1rem;
  padding: 0.5rem;
  position: fixed;
  box-shadow: var(--box-shadow);
  z-index: 999;

  img {
    height: 75px;
    width: 75px;
    margin-right: 0.5rem;
  }
`;

const StyledControlContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledInfoContainer = styled.div`
  min-width: 100px;

  p:first-child {
    font-weight: 700;
  }

  p:last-of-type {
    font-size: 12px;
  }
`;

const StyledButtonContainer = styled.div`
  min-width: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  button {
    margin-right: 0.5rem;
  }

  button:last-child {
    margin-right: 0;
  }
`;

const MusicButton = styled.button<{ inverse?: boolean }>`
  align-items: center;
  background-color: ${(props) =>
    props.inverse ? "white" : "var(--colors-yellow)"};
  color: ${(props) =>
    props.inverse ? "var(--colors-yellow)" : "var(--colors-dark)"};
  display: flex;
  justify-content: center;
  height: 2rem;
  width: 2rem;
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
  const [songInfo, setSongInfo] = useState<Spotify.Track>(null);
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
          player.getCurrentState().then((state) => {
            if (state) {
              setSongInfo(state.track_window.current_track);
            }
          });
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
        setSongInfo(state.track_window.current_track);
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
      {player && songInfo && (
        <StyledPlayer>
          <img src={songInfo.album.images[0].url} />
          <StyledControlContainer>
            <StyledInfoContainer>
              <p>{songInfo.name}</p>
              <p>{songInfo.artists[0].name}</p>
            </StyledInfoContainer>
            <StyledButtonContainer>
              <MusicButton
                inverse
                onClick={() => {
                  player.previousTrack();
                }}
              >
                <RiSkipBackFill />
              </MusicButton>
              <MusicButton
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {playing ? <RiPauseFill /> : <RiPlayFill />}
              </MusicButton>
              <MusicButton
                inverse
                onClick={() => {
                  player.nextTrack();
                }}
              >
                <RiSkipForwardFill />
              </MusicButton>
            </StyledButtonContainer>
          </StyledControlContainer>
        </StyledPlayer>
      )}
    </>
  );
};

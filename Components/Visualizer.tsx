import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AudioAnalysisData, Segment } from "../utils/spotifyApi";
import { useSpotifyContext } from "./SpotifyContext";
import type p5 from "p5";
import { AudioAnalyzer, AudioData } from "../utils/AudioAnalyzer";
import dynamic from "next/dynamic";

const LiveEditor = dynamic(() => import("./Editor"));

interface p5Extended extends Omit<p5, "draw"> {
  draw: (audioData: AudioData) => void;
}

const VisualizerContainer = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
`;

const GregTheAudioAnalyzer = new AudioAnalyzer();

export default function Visualizer() {
  const { playing, player, spotifyApi } = useSpotifyContext();
  const [loadedPlayer, setLoadedPlayer] = useState<Spotify.Player>();
  const [trackId, setTrackId] = useState("");
  const [songData, setSongData] = useState<AudioAnalysisData>();
  const [canvas, setCanvas] = useState<p5Extended>();
  const [p5, setP5] = useState<any>();
  const drawFunc = useRef(eval("() => {}"));
  const visualizerRef = useRef<HTMLDivElement>(null);

  const getTrackData = async () => {
    const songData = await spotifyApi
      .getAudioAnalysisForTrack(trackId)
      .then((res) => {
        return res.body;
      });
    console.log(songData);
    setSongData(songData as AudioAnalysisData);
    GregTheAudioAnalyzer.setAudioData(songData as AudioAnalysisData);
  };

  useEffect(() => {
    if (player) {
      setLoadedPlayer(player);
      player.getCurrentState().then((state) => {
        if (state) {
          setTrackId(state.track_window.current_track.id);
        }
      });
      player.on("player_state_changed", (state) => {
        if (state) {
          setTrackId(state.track_window.current_track.id);
        }
      });
    }
  }, [player]);

  useEffect(() => {
    if (trackId) {
      GregTheAudioAnalyzer.reset();
      getTrackData();
    }
  }, [trackId]);

  useEffect(() => {
    let animFrame;
    if (songData && loadedPlayer && playing && canvas) {
      const getAudioData = () => {
        loadedPlayer.getCurrentState().then((value) => {
          if (value) {
            GregTheAudioAnalyzer.getAudioDataAtTime(value.position);
          }
          canvas.draw(GregTheAudioAnalyzer.currentAudioData);
        });
        animFrame = requestAnimationFrame(getAudioData);
      };
      animFrame = requestAnimationFrame(getAudioData);
    }
    return () => {
      if (animFrame) {
        cancelAnimationFrame(animFrame);
      }
    };
  }, [songData, loadedPlayer, playing, canvas]);

  const createCanvas = () => {
    const height = visualizerRef.current.clientHeight;
    const width = visualizerRef.current.clientWidth;
    if (canvas) {
      canvas.remove();
    }
    const sketch = (s: p5Extended) => {
      s.setup = () => {
        const canvas = s.createCanvas(width, height);
        canvas.parent(visualizerRef.current);
        s.noLoop();
      };

      s.draw = (data) => {
        drawFunc.current(
          {
            width: visualizerRef.current.clientWidth,
            height: visualizerRef.current.clientHeight,
            ...data,
          },
          s
        );
      };
    };
    const sketchInstance = new p5(sketch);
    sketchInstance.setup();
    setCanvas(sketchInstance);
  };

  useEffect(() => {
    if (visualizerRef.current && p5) {
      createCanvas();
    }
  }, [visualizerRef.current, p5]);

  useEffect(() => {
    const p5 = require("p5");
    setP5(() => p5);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (canvas) {
        canvas.resizeCanvas(
          visualizerRef.current.clientWidth,
          visualizerRef.current.clientHeight,
          true
        );
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [canvas, visualizerRef.current]);

  return (
    <VisualizerContainer id="bob-ross" ref={visualizerRef}>
      <LiveEditor
        onCodeChange={(code) => {
          console.log(code);
          drawFunc.current = eval(code);
        }}
      />
    </VisualizerContainer>
  );
}

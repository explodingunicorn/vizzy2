import dynamic from "next/dynamic";
import { Player } from "../Components/Player";

const Visualizer = dynamic(() => import("../Components/Visualizer"));

export default function App() {
  return (
    <div>
      <Player />
      <Visualizer />
    </div>
  );
}

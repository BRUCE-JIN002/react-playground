import { useContext } from "react";
import { PlaygroundContext } from "../contexts/PlaygroundContext";

export const usePlayGroundContext = () => useContext(PlaygroundContext);

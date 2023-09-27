import { useContext } from "react";
import TalentLayerContext from "../contexts/talentLayerContext";

export function useTalentLayer() {
  return useContext(TalentLayerContext);
}

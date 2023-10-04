import { useContext } from "react";
import TalentLayerContext from "../contexts/talentLayerContext";

export default function useTalentLayer() {
  return useContext(TalentLayerContext);
}

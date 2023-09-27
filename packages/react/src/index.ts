import TalentLayerContext from "./contexts/talentLayerContext";
import { TalentLayerProvider } from "./contexts/talentLayerContext";
import useTalentLayer from "./hooks/useTalentLayer";

export default {
  context: { TalentLayerContext, TalentLayerProvider },
  hooks: { useTalentLayer },
};

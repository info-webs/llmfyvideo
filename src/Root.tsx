import { Composition } from "remotion";
import { LLMFYAd } from "./LLMFYAd";
import { Explainer } from "./explainer/Explainer";
import { makeCalculateMetadata } from "./explainer/config";
import { DEFAULT_SCENES, SCENES } from "./explainer/registry";
import { totalFrames } from "./explainer/config";
import { VIDEO } from "./explainer/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LLMFYAd"
        component={LLMFYAd}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LLMFYExplainer"
        component={Explainer}
        durationInFrames={totalFrames(DEFAULT_SCENES)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ scenes: DEFAULT_SCENES }}
        calculateMetadata={makeCalculateMetadata(SCENES)}
      />
    </>
  );
};

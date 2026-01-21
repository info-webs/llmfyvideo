import { Composition } from "remotion";
import { LLMFYAd } from "./LLMFYAd";

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
    </>
  );
};

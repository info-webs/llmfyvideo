import { Composition } from "remotion";
import { LLMFYAd } from "./LLMFYAd";
import { LLMFYMotion60, MOTION60_DURATION, MOTION60_FPS } from "./LLMFYMotion60";

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
        id="LLMFYMotion60"
        component={LLMFYMotion60}
        durationInFrames={MOTION60_DURATION} // 60 seconds at 30fps
        fps={MOTION60_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import useAnimationStore, { SceneType } from "@/animationStore/animationStore";
import { warmupScene } from "@/utils/warmupScene";

/**
 * Prewarms a scene and reports it ready.
 *
 * Runs inside the `<Canvas>`, inside the same `<Suspense>` boundary as the
 * models, so its effect only fires once every asset the scene suspended on has
 * resolved. It then uploads the textures, compiles every program and renders
 * one throwaway frame — all while the loader curtain is still up, because the
 * curtain waits on the `isSceneReady` flag this sets.
 *
 * Before, this polled `gl.info` and declared the scene ready 500ms after the
 * first drawn frame, which said nothing about whether the remaining programs
 * had been compiled — they were compiled mid-scroll instead.
 */
export const useSceneReady = (sceneType: SceneType) => {
    const { gl, scene, camera } = useThree();
    const setIsSceneReady = useAnimationStore((state) => state.setIsSceneReady);
    const resetScene = useAnimationStore((state) => state.resetScene);
    const pendingWarmups = useAnimationStore((state) => state.scenes[sceneType].pendingWarmups);
    const [warmed, setWarmed] = useState(false);

    // Reset scene state when component mounts
    useEffect(() => {
      resetScene(sceneType);
    }, [resetScene, sceneType]);

    useEffect(() => {
      let cancelled = false;
      let firstFrame = 0;
      let secondFrame = 0;

      const prewarm = async () => {
        // Give sibling effects in this boundary (the shader assignment in
        // PlanetModel, the material tinting in ProductModel) a chance to run,
        // so we compile the variant the scene will actually draw with.
        await new Promise<void>((resolve) => {
          firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => resolve());
          });
        });
        if (cancelled) return;

        await warmupScene(gl, scene, camera);
        if (cancelled) return;

        setWarmed(true);
      };

      prewarm();

      return () => {
        cancelled = true;
        cancelAnimationFrame(firstFrame);
        cancelAnimationFrame(secondFrame);
      };
    }, [gl, scene, camera, sceneType]);

    // Ready means: everything this scene suspended on has resolved *and* every
    // deferred warmup it registered (the high-res earth swap) has finished.
    useEffect(() => {
      if (!warmed || pendingWarmups > 0) return;
      setIsSceneReady(sceneType, true);
    }, [warmed, pendingWarmups, setIsSceneReady, sceneType]);
};

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import useAnimationStore, { SceneType } from "@/animationStore/animationStore";

export const useSceneReady = (sceneType: SceneType) => {
    const { gl } = useThree();
    const setIsSceneReady = useAnimationStore((state) => state.setIsSceneReady);
    const resetScene = useAnimationStore((state) => state.resetScene);
  
    // Reset scene state when component mounts
    useEffect(() => {
      resetScene(sceneType);
    }, [resetScene, sceneType]);
  
    useEffect(() => {
      let interval: NodeJS.Timeout;
      
      const checkSceneReady = () => {
        const programCount = gl.info.programs?.length || 0;

        if (gl.info.render.frame > 0 && programCount > 0) {
          setTimeout(() => {
            setIsSceneReady(sceneType, true);
          }, 500)
          
          if (interval) clearInterval(interval);
        }
      };
  
      interval = setInterval(checkSceneReady, 100);
      return () => clearInterval(interval);
    }, [gl, setIsSceneReady, sceneType]);
};

import { useEffect, useState } from 'react';
import useAnimationStore, { SceneType } from '@/animationStore/animationStore';

export const useProgressiveLoading = (sceneType: SceneType) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isSceneReady = useAnimationStore((state) => state.scenes[sceneType].isSceneReady);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isSceneReady) {
      // Slow progress to 70% while scene is loading
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 70) {
            // Slow increment - reaches 70% in about 14 seconds (70 * 200ms)
            return Math.min(prev + 0.5, 70);
          }
          return prev;
        });
      }, 200);
    } else {
      // Fast progress from current position to 100% when scene is ready
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            // Fast increment - completes remaining 30% in about 1 second
            const increment = prev < 70 ? 15 : 10; // Faster if still below 70%
            const newProgress = Math.min(prev + increment, 100);
            
            if (newProgress >= 100) {
              // Hide loader after reaching 100%
              setTimeout(() => {
                setIsLoading(false);
              }, 300);
            }
            
            return newProgress;
          }
          return prev;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSceneReady]);

  // Reset when scene becomes not ready again
  useEffect(() => {
    if (!isSceneReady && progress === 100) {
      setProgress(0);
      setIsLoading(true);
    }
  }, [isSceneReady, progress]);

  return {
    progress,
    isLoading,
  };
};

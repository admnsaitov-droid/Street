import { useSceneReady } from '@/hooks/useSceneReady';
import { SceneType } from '@/animationStore/animationStore';

interface SceneReadyDetectorProps {
  sceneType: SceneType;
}

export const SceneReadyDetector = ({ sceneType }: SceneReadyDetectorProps) => {
  useSceneReady(sceneType);
  return null;
};

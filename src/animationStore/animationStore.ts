import { create } from 'zustand';

export type SceneType = 'distribution' | 'home' | 'product' | 'package';

interface SceneState {
  isSceneReady: boolean;
}

interface AnimationStore {
  scenes: Record<SceneType, SceneState>;
  setIsSceneReady: (sceneType: SceneType, value: boolean) => void;
  resetScene: (sceneType: SceneType) => void;
  getSceneState: (sceneType: SceneType) => SceneState;
}

const defaultSceneState: SceneState = {
  isSceneReady: false,
};

const useAnimationStore = create<AnimationStore>((set, get) => ({
  scenes: {
    distribution: { ...defaultSceneState },
    home: { ...defaultSceneState },
    product: { ...defaultSceneState },
    package: { ...defaultSceneState },
  },
  
  setIsSceneReady: (sceneType: SceneType, value: boolean) =>
    set((state) => ({
      scenes: {
        ...state.scenes,
        [sceneType]: {
          ...state.scenes[sceneType],
          isSceneReady: value,
        },
      },
    })),
    
  resetScene: (sceneType: SceneType) =>
    set((state) => ({
      scenes: {
        ...state.scenes,
        [sceneType]: { ...defaultSceneState },
      },
    })),
    
  getSceneState: (sceneType: SceneType) => get().scenes[sceneType],
}));

export default useAnimationStore;

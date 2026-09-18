import { create } from 'zustand';

export type SceneType = 'distribution' | 'home' | 'product' | 'package';

interface SceneState {
  isSceneReady: boolean;
}

interface AnimationStore {
  scenes: Record<SceneType, SceneState>;
  /**
   * Scenes the page currently on screen has declared it owns. The loader
   * curtain stays up until every one of them has finished prewarming, so
   * shader compilation and texture upload never land on a scroll boundary.
   */
  requiredScenes: SceneType[];
  setIsSceneReady: (sceneType: SceneType, value: boolean) => void;
  resetScene: (sceneType: SceneType) => void;
  getSceneState: (sceneType: SceneType) => SceneState;
  requireScene: (sceneType: SceneType) => void;
  releaseScene: (sceneType: SceneType) => void;
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

  requiredScenes: [],
  
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

  requireScene: (sceneType: SceneType) =>
    set((state) =>
      state.requiredScenes.includes(sceneType)
        ? state
        : { requiredScenes: [...state.requiredScenes, sceneType] }
    ),

  releaseScene: (sceneType: SceneType) =>
    set((state) => ({
      requiredScenes: state.requiredScenes.filter((type) => type !== sceneType),
    })),
}));

export default useAnimationStore;

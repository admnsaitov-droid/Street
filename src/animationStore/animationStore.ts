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
  /**
   * Above-the-fold media (anything passed `priority`) that the loader curtain
   * waits for. Without this the curtain lifted on a finished layout whose hero
   * slot was still a placeholder — the reveal happened, then the visitor
   * watched the LCP image arrive a second or two later.
   */
  requiredMedia: string[];
  readyMedia: string[];
  setIsSceneReady: (sceneType: SceneType, value: boolean) => void;
  resetScene: (sceneType: SceneType) => void;
  getSceneState: (sceneType: SceneType) => SceneState;
  requireScene: (sceneType: SceneType) => void;
  releaseScene: (sceneType: SceneType) => void;
  requireMedia: (id: string) => void;
  releaseMedia: (id: string) => void;
  markMediaReady: (id: string) => void;
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
  requiredMedia: [],
  readyMedia: [],
  
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

  requireMedia: (id: string) =>
    set((state) =>
      state.requiredMedia.includes(id) ? state : { requiredMedia: [...state.requiredMedia, id] }
    ),

  releaseMedia: (id: string) =>
    set((state) => ({
      requiredMedia: state.requiredMedia.filter((item) => item !== id),
      readyMedia: state.readyMedia.filter((item) => item !== id),
    })),

  markMediaReady: (id: string) =>
    set((state) =>
      state.readyMedia.includes(id) ? state : { readyMedia: [...state.readyMedia, id] }
    ),
}));

export default useAnimationStore;

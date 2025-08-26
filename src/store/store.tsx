import { create } from 'zustand';

interface LoadingStore {
  isFullyLoaded: boolean;
  setIsFullyLoaded: (value: boolean) => void;
  isSubmitSuccessful: boolean;
  setIsSubmitSuccessful: (value: boolean) => void;
  isSubmitError: boolean;
  setIsSubmitError: (value: boolean) => void;
  contentLoaded: boolean;
  setContentLoaded: (value: boolean) => void;
}

interface VideoPlayerStore {
  content: string | null;
  poster: string | null;
  contentType: 'image' | 'video' | null;
  isOpen: boolean;
  setContent: (content: string | null) => void;
  setPoster: (poster: string | null) => void;
  setContentType: (type: 'image' | 'video' | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  openImage: (imageUrl: string) => void;
  openVideo: (videoUrl: string, poster?: string) => void;
  closePlayer: () => void;
}

interface ColorStore {
  activeColor: {
    name: string
    color: string
  } | null

  setActiveColor: (color: {
    name: string
    color: string
  } | null) => void
}

export const useColorStore = create<ColorStore>((set, get) => ({
  activeColor: null,
  setActiveColor: (color: {
    name: string
    color: string
  } | null) => set({ activeColor: color }),
}));

const useLoadingStore = create<LoadingStore>((set, get) => ({
    isFullyLoaded: false,
    setIsFullyLoaded: (value: boolean) => set({ isFullyLoaded: value }),

    isSubmitSuccessful: false,
    setIsSubmitSuccessful: (value: boolean) => set({ isSubmitSuccessful: value }),

    isSubmitError: false,
    setIsSubmitError: (value: boolean) => set({ isSubmitError: value }),

    contentLoaded: false,
    setContentLoaded: (value: boolean) => set({ contentLoaded: value }),
}));

export const useVideoPlayerStore = create<VideoPlayerStore>((set, get) => ({
    content: null,
    poster: null,
    contentType: null,
    isOpen: false,
    setContent: (content: string | null) => set({ content }),
    setPoster: (poster: string | null) => set({ poster }),
    setContentType: (type: 'image' | 'video' | null) => set({ contentType: type }),
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    openImage: (imageUrl: string) => set({ 
        content: imageUrl,
        poster: null,
        contentType: 'image',
        isOpen: true 
    }),
    openVideo: (videoUrl: string, poster?: string) => set({ 
        content: videoUrl, 
        poster: poster || null, 
        contentType: 'video',
        isOpen: true 
    }),
    closePlayer: () => set({ 
        content: null, 
        poster: null, 
        contentType: null,
        isOpen: false 
    }),
}));

export default useLoadingStore;
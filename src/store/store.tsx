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
  currentCursor: {
    type: 'default' | 'hover';
  };
  setCurrentCursor: (cursor: { type: 'default' | 'hover' }) => void;
  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: (value: boolean) => void;
}

interface VideoPlayerStore {
  content: string | null;
  poster: string | null;
  contentType: 'image' | 'video' | null;
  isOpen: boolean;
  imageGallery: string[] | null;
  currentImageIndex: number;
  imageFit: 'contain' | 'cover';
  setContent: (content: string | null) => void;
  setPoster: (poster: string | null) => void;
  setContentType: (type: 'image' | 'video' | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  openImage: (imageUrl: string, gallery?: string[], options?: { imageFit?: 'contain' | 'cover' }) => void;
  openVideo: (videoUrl: string, poster?: string) => void;
  closePlayer: () => void;
  nextImage: () => void;
  previousImage: () => void;
}

interface ColorStore {
  activeMainColor: {
    name: string
    color: string
  } | null
  activeAccentColor: {
    name: string
    color: string
  } | null
  materialMainColor: {
    name: string
    color: string
  } | null
  materialAccentColor: {
    name: string
    color: string
  } | null
  colorMode: 'main' | 'accent'

  setActiveMainColor: (color: {
    name: string
    color: string
  } | null) => void
  setActiveAccentColor: (color: {
    name: string
    color: string
  } | null) => void
  setMaterialMainColor: (color: {
    name: string
    color: string
  } | null) => void
  setMaterialAccentColor: (color: {
    name: string
    color: string
  } | null) => void
  setColorMode: (mode: 'main' | 'accent') => void
  // Legacy support - maps to main color
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
  activeMainColor: null,
  activeAccentColor: null,
  materialMainColor: null,
  materialAccentColor: null,
  colorMode: 'main',
  activeColor: null, // Legacy support
  
  setActiveMainColor: (color: {
    name: string
    color: string
  } | null) => set({ activeMainColor: color, activeColor: color }),
  
  setActiveAccentColor: (color: {
    name: string
    color: string
  } | null) => set({ activeAccentColor: color }),
  
  setMaterialMainColor: (color: {
    name: string
    color: string
  } | null) => set({ materialMainColor: color }),
  
  setMaterialAccentColor: (color: {
    name: string
    color: string
  } | null) => set({ materialAccentColor: color }),
  
  setColorMode: (mode: 'main' | 'accent') => set({ colorMode: mode }),
  
  // Legacy support
  setActiveColor: (color: {
    name: string
    color: string
  } | null) => set({ activeMainColor: color, activeColor: color }),
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

    currentCursor: { type: 'default' },
    setCurrentCursor: (cursor: { type: 'default' | 'hover' }) => set({ currentCursor: cursor }),

    isMegaMenuOpen: false,
    setIsMegaMenuOpen: (value: boolean) => set({ isMegaMenuOpen: value }),
}));

export const useVideoPlayerStore = create<VideoPlayerStore>((set, get) => ({
    content: null,
    poster: null,
    contentType: null,
    isOpen: false,
    imageGallery: null,
    currentImageIndex: 0,
    imageFit: 'cover',
    setContent: (content: string | null) => set({ content }),
    setPoster: (poster: string | null) => set({ poster }),
    setContentType: (type: 'image' | 'video' | null) => set({ contentType: type }),
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    openImage: (imageUrl: string, gallery?: string[], options?: { imageFit?: 'contain' | 'cover' }) => {
        const imageList = gallery || [imageUrl];
        const currentIndex = imageList.findIndex(url => url === imageUrl);
        set({ 
            content: imageUrl,
            poster: null,
            contentType: 'image',
            isOpen: true,
            imageGallery: imageList,
            currentImageIndex: currentIndex >= 0 ? currentIndex : 0,
            imageFit: options?.imageFit ?? 'cover'
        });
    },
    openVideo: (videoUrl: string, poster?: string) => set({ 
        content: videoUrl, 
        poster: poster || null, 
        contentType: 'video',
        isOpen: true,
        imageGallery: null,
        currentImageIndex: 0
    }),
    closePlayer: () => set({ 
        content: null, 
        poster: null, 
        contentType: null,
        isOpen: false,
        imageGallery: null,
        currentImageIndex: 0,
        imageFit: 'cover'
    }),
    nextImage: () => {
        const { imageGallery, currentImageIndex } = get();
        if (imageGallery && imageGallery.length > 1) {
            const nextIndex = (currentImageIndex + 1) % imageGallery.length;
            set({ 
                content: imageGallery[nextIndex],
                currentImageIndex: nextIndex
            });
        }
    },
    previousImage: () => {
        const { imageGallery, currentImageIndex } = get();
        if (imageGallery && imageGallery.length > 1) {
            const prevIndex = currentImageIndex === 0 ? imageGallery.length - 1 : currentImageIndex - 1;
            set({ 
                content: imageGallery[prevIndex],
                currentImageIndex: prevIndex
            });
        }
    },
}));

export default useLoadingStore;
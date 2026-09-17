import { useEffect, useRef, useState } from 'react';
import { SceneType } from '@/animationStore/animationStore';
import { useProgressiveLoading } from './useProgressiveLoading';

interface LazySceneOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Mount + visibility control for a 3D scene.
 *
 * `shouldLoad` is true from the first render on purpose. The scene used to
 * mount only once its container was 100px from the viewport, which put WebGL
 * context creation, the GLTF fetch and Draco decode, the HDR environment load,
 * shader compilation and texture upload *on a scroll boundary* — the measured
 * cause of the first-scroll micro freezes (1.7–2.6s of blocked main thread).
 * Mounting at page load instead puts all of that behind the loader curtain,
 * which waits for it (see `useRequireScene` / `useSceneReady`).
 *
 * The observer still runs: `isInView` drives `frameloop`, so an off-screen
 * scene is mounted and warm but draws nothing.
 */
export const useLazyScene = (
  sceneType: SceneType,
  options: LazySceneOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '100px' } = options;

  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { progress, isLoading } = useProgressiveLoading(sceneType);

  // Setup intersection observer
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  return {
    containerRef,
    isInView,
    shouldLoad: true, // prewarmed behind the loader, never on a scroll boundary
    progress,
    isLoading,
  };
};

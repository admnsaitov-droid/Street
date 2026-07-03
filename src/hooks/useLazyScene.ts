import { useEffect, useRef, useState } from 'react';
import { SceneType } from '@/animationStore/animationStore';
import { useProgressiveLoading } from './useProgressiveLoading';

interface LazySceneOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useLazyScene = (
  sceneType: SceneType,
  options: LazySceneOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '100px' } = options;
  
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const { progress, isLoading } = useProgressiveLoading(sceneType);

  // Setup intersection observer
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Once the scene comes into view, mark it for loading
        if (entry.isIntersecting && !shouldLoad) {
          setShouldLoad(true);
        }
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
  }, [threshold, rootMargin, shouldLoad]);

  return {
    containerRef,
    isInView,
    shouldLoad, // Only true after scene has been visible once
    progress,
    isLoading,
  };
};

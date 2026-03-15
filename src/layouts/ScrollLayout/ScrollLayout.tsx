"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useScroll } from "./useScroll";
import { scrollTo } from "@/utils/scrollTo";
import { useLayoutState } from "../AssetsLoaderLayout/AssetsLoaderLayout";

declare global {
  interface Window {
    lenis: any;
  }
}

export const scrollSpeed = { current: 1 };

export function ScrollLayout({ children }: { children: React.ReactNode }) {
  // Server-safe rendering
  return (
    <div className="scroll-layout">
      {/* Static content that can be rendered on server */}
      <div className="scroll-layout-content">{children}</div>

      {/* Client-only functionality */}
      <ScrollController />
    </div>
  );
}

function ScrollController() {
  const isEnableScroll = useScroll((state) => state.isEnableScroll);
  const fullyLoaded = useLayoutState((state) => state.fullyLoaded);
  const [hash, setHash] = useState<string>("");
  const [lenis, setLenis] = useScroll((state) => [state.lenis, state.setLenis]);
  const pathname = usePathname();
  const savedPathname = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
    const lenis = new Lenis({
      smoothWheel: true,
      // syncTouch: true,
    });
    window.lenis = lenis;
    setLenis(lenis);

    const raf = (time: number) => {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  useEffect(() => {
    if (isEnableScroll) {
      lenis?.start();
      enableNativeScroll(true);
    } else {
      lenis?.stop();
      enableNativeScroll(false);
    }
  }, [isEnableScroll, lenis]);

  useEffect(() => {
    if (lenis && hash) {
      setTimeout(() => {
        scrollTo(hash, true);
      }, 300);
    }
  }, [lenis, hash, fullyLoaded]);

  useEffect(() => {
    if (savedPathname.current !== pathname) {
      savedPathname.current = pathname;
      if (pathname.includes("#")) {
        const hash = pathname.split("#").pop();
        if (hash) {
          setHash(hash);
        }
      }
    }
  }, [pathname, setHash]);

  return null; // This component doesn't render anything visible
}

let savedScrollY = 0;

const enableNativeScroll = (value: boolean) => {
  if (typeof document === "undefined") return;
  const body = document?.body;
  if (!body) return;
  if (!value) {
    savedScrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    /* Don't set overflow:hidden - it blocks touch scroll in nested overflow:auto (e.g. menu product list) */
  } else {
    body.style.removeProperty("position");
    body.style.removeProperty("top");
    body.style.removeProperty("left");
    body.style.removeProperty("right");
    window.scrollTo(0, savedScrollY);
  }
};

"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "@/layouts/ScrollLayout/useScroll";
import styled from "styled-components";
import { useWindowWidth } from "@react-hook/window-size";

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
//   backdrop-filter: blur(2px);
  background: rgba(3, 14, 28, 0.2);
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

type ScrollRevealWrapperProps = {
  children: React.ReactNode;
};

export const DynamicScrollRevealWrapper = ({ children }: ScrollRevealWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const translateYRef = useRef(0);
  const lenis = useScroll((state) => state.lenis);
  const [contentHeight, setContentHeight] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const width = useWindowWidth();
  const isMobile = width <= 576;

  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      if (containerRef.current) {
        const newHeight = containerRef.current.scrollHeight;
        setContentHeight(newHeight);
      }
    };

    const observer = new MutationObserver(updateHeight);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    updateHeight();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lenis || !wrapperRef.current || !containerRef.current) return;

    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    const elTop = wrapper.offsetTop;
    const viewportHeight = window.innerHeight;
    const footerHeight = viewportHeight * 0.2;

    const update = ({ scroll }: { scroll: number }) => {
      const distanceFromTop = scroll - elTop;

      if (contentHeight > viewportHeight) {
        if (distanceFromTop <= contentHeight - viewportHeight) {
          translateYRef.current = 0;
          setIsFooterVisible(false);
        } else {
          const extraScroll =
            distanceFromTop - (contentHeight - viewportHeight);
          const progress = Math.min(
            extraScroll / (viewportHeight - footerHeight),
            1
          );
          translateYRef.current = progress * (viewportHeight - footerHeight);
          setIsFooterVisible(true);
        }
      } else {
        if (
          distanceFromTop >= 0 &&
          distanceFromTop <= viewportHeight - footerHeight
        ) {
          const progress = Math.min(
            distanceFromTop / (viewportHeight - footerHeight),
            1
          );
          translateYRef.current = progress * (viewportHeight - footerHeight);
          setIsFooterVisible(
            distanceFromTop >= (viewportHeight - footerHeight) * 0.5
          );
        } else if (distanceFromTop < 0) {
          translateYRef.current = 0;
          setIsFooterVisible(false);
        } else {
          translateYRef.current = viewportHeight - footerHeight;
          setIsFooterVisible(true);
        }
      }

      container.style.transform = `translate3d(0, ${translateYRef.current}px, 0)`;
    };

    lenis.on("scroll", update);
    update({ scroll: lenis.scroll });

    return () => {
      lenis.off("scroll", update);
    };
  }, [lenis, contentHeight]);

  // Return early for mobile devices
  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          width: "100%",
          height: `${contentHeight}px`,
          zIndex: 0,
        }}
      >
        <div
          ref={containerRef}
          style={{
            height: "auto",
            position: "relative",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>
      <BlurOverlay className={isFooterVisible ? "visible" : ""} />
    </>
  );
};
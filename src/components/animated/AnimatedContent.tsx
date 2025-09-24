"use client";

import React, { Children, useMemo, useLayoutEffect, useState, useRef, useEffect } from "react";
import { animated, useInView } from "@react-spring/web";
import styled from "styled-components";
import { Spring } from "../Springs/Spring";

interface AnimationSettings {
  from?: Record<string, any>;
  to?: Record<string, any>;
  config?: Record<string, any>;
  delayStep?: number;
}

interface CellConfig {
  style?: React.CSSProperties;
  animation?: AnimationSettings;
  animationElement?: AnimationSettings;
  className?: string;
}

interface AnimatedGridProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  containerWrapperWordClassName?: string;
  styleRow?: React.CSSProperties;
  rowClassName?: string;
  style?: React.CSSProperties;
  debug?: boolean;
  cellConfigs?: { [key: string]: CellConfig };
  type?: "words" | "rows";
  animation?: AnimationSettings;
  animationElement?: AnimationSettings;
  once?: boolean;
  containerStyle?: React.CSSProperties;
  gap?: { horizontal?: string; vertical?: string };
  overflow?: boolean;
  elementAppearanceView?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

const MainContainer = styled.div<{ $isSpan?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  display: ${props => props.$isSpan ? 'inline-block' : 'block'};
`;

const MainContainerSpan = styled.span<{ $isSpan?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  display: inline-block;
`;

const MeasureContainer = styled.div<{ $gapH: string; $gapV: string; $isSpan?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: ${(p) => p.$gapV} ${(p) => p.$gapH};
  align-items: flex-start;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: -1;
  height: 0;
`;

const MeasureContainerSpan = styled.span<{ $gapH: string; $gapV: string; $isSpan?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: ${(p) => p.$gapV} ${(p) => p.$gapH};
  align-items: flex-start;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: -1;
  height: 0;
`;

const GridRow = styled.div<{ $debug?: boolean; $gapH: string; $gapV: string; $isSpan?: boolean }>`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  gap: ${(p) => p.$gapV} ${(p) => p.$gapH};
  align-items: flex-start;
  position: relative;
  ${(p) =>
    p.$debug &&
    `
    border: 2px solid rgba(0,255,0,0.5);
    background: rgba(0,255,0,0.1);
    padding: 0.25em;
  `}
`;

const GridRowSpan = styled.span<{ $debug?: boolean; $gapH: string; $gapV: string; $isSpan?: boolean }>`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  gap: ${(p) => p.$gapV} ${(p) => p.$gapH};
  align-items: flex-start;
  position: relative;
  ${(p) =>
    p.$debug &&
    `
    border: 2px solid rgba(0,255,0,0.5);
    background: rgba(0,255,0,0.1);
    padding: 0.25em;
  `}
`;

const WordContainer = styled.div`
  display: inline-flex;
  position: relative;
  flex-shrink: 0;
  white-space: nowrap;
`;

const WordContainerSpan = styled.span`
  display: inline-flex;
  position: relative;
  flex-shrink: 0;
  white-space: nowrap;
`;

const WordInnerContainer = styled.div<{ $overflow?: string }>`
  display: inline-flex;
  overflow: ${(p) => p.$overflow || "hidden"};
  position: relative;
  flex-shrink: 0;
  white-space: nowrap;
`;

const WordInnerContainerSpan = styled.span<{ $overflow?: string }>`
  display: inline-flex;
  overflow: ${(p) => p.$overflow || "hidden"};
  position: relative;
  flex-shrink: 0;
  white-space: nowrap;
`;

const AnimatedContent = styled(animated.div)`
  display: inline-block;
  white-space: nowrap;
  position: relative;
`;

const AnimatedContentSpan = styled(animated.span)`
  display: inline-block;
  white-space: nowrap;
  position: relative;
`;

const SAFETY_MARGIN = 15;

const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  children,
  className = "",
  containerClassName = "",
  containerWrapperWordClassName = '',
  styleRow = {},
  rowClassName = '',
  style = {},
  debug = false,
  cellConfigs = {},
  once = true,
  type = "words",
  overflow = true,
  animation = { from: { opacity: 1}, to: { opacity: 1}},
  animationElement,
  gap = { horizontal: "0.5em", vertical: "0.25em" },
  elementAppearanceView,
  tag = "div",
}) => {
  const [ref, inViewInternal] = useInView({ once, amount: 0.3 });
  const inView = typeof elementAppearanceView === "boolean" ? elementAppearanceView : inViewInternal;

  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [elementRows, setElementRows] = useState<number[][]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [elementWidths, setElementWidths] = useState<number[]>([]);

  const parseChildren = (isAnimated = false) => {
    let globalIndex = 0;
    const elementIdMap: { [index: number]: string | undefined } = {};

    const createAnimatedElement = (
      content: React.ReactNode,
      index: number,
      config: CellConfig = {},
      elementId?: string
    ) => {
      if (elementId) elementIdMap[index] = elementId;
      
      const WordContainerComponent = tag === "span" ? WordContainerSpan : WordContainer;
      const WordInnerContainerComponent = tag === "span" ? WordInnerContainerSpan : WordInnerContainer;
      const AnimatedContentComponent = tag === "span" ? AnimatedContentSpan : AnimatedContent;
      
      return (
        <WordContainerComponent
          key={`${isAnimated ? "animated" : "measure"}-${index}`}
          style={config.style}
          className={config.className}
          data-element-id={elementId}
        >
          <WordInnerContainerComponent className={containerWrapperWordClassName}>
            {isAnimated ? <AnimatedContentComponent>{content}</AnimatedContentComponent> : content}
          </WordInnerContainerComponent>
        </WordContainerComponent>
      );
    };

    const processText = (text: string, config: CellConfig = {}, elementId?: string) =>
      text
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => {
          const index = globalIndex++;
          return createAnimatedElement(word, index, config, elementId);
        });

const processNode = (node: React.ReactNode): React.ReactNode[] => {
    if (typeof node === "string") return processText(node);
    if (!React.isValidElement(node)) return [];
  
    const { id, children: nodeChildren, style: nodeStyle, className: nodeClassName, ...elementProps } = node.props;
    const config = id ? cellConfigs[id] || {} : {};
  
    const combinedStyle = {
      ...nodeStyle,
      ...config.style
    };
  
    const combinedClassName = [nodeClassName, config.className].filter(Boolean).join(' ');
  
    const combinedConfig = {
      ...config,
      style: combinedStyle,
      className: combinedClassName
    };
  
    if (React.isValidElement(node) && node.type === "br") {
      const BrWrapper = tag === "span" ? "span" : "div";
      return [
        <BrWrapper
          key={`br-${Math.random()}`}
          data-br
          style={{ width: "100%", display: "block", height: 0, padding: 0, margin: 0 }}
        />,
      ];
    }
  
    if (node.type === "a" || node.type === "img") {
      const index = globalIndex++;
      const content = React.cloneElement(node as React.ReactElement, {
        ...elementProps,
      });
      return [createAnimatedElement(content, index, combinedConfig, id)];
    }
  
    if (nodeChildren) {
      if (typeof nodeChildren === "string") return processText(nodeChildren, combinedConfig, id);
      return Children.toArray(nodeChildren).flatMap((child) => processNode(child));
    }
  
    const index = globalIndex++;
    const content = React.cloneElement(node as React.ReactElement, {
      ...elementProps,
    });
    return [createAnimatedElement(content, index, combinedConfig, id)];
  };
  
    const elements = Children.toArray(children).flatMap((child) => processNode(child));
    return isAnimated ? { elements, elementIdMap } : elements;
  };

  const rawElements = useMemo(() => parseChildren(false), [children, containerWrapperWordClassName, cellConfigs]) as React.ReactNode[];
  const animatedElements = useMemo(
    () => parseChildren(true),
    [children, containerWrapperWordClassName, cellConfigs]
  ) as { elements: React.ReactNode[]; elementIdMap: { [index: number]: string | undefined } };

  useLayoutEffect(() => {
    if (!measureRef.current || !containerRef.current) return;
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
    setElementWidths(Array.from(measureRef.current.children).map((el) => (el as HTMLElement).getBoundingClientRect().width));
  }, [rawElements.length, children, gap.horizontal, gap.vertical]);

  useEffect(() => {
    if (!containerWidth || elementWidths.length === 0) {
      setElementRows([]);
      return;
    }
    const rows: number[][] = [];
    let currentRow: number[] = [];
    let currentWidth = 0;
    const gapH = parseFloat(gap.horizontal || "0.5");
    const gapPx = isNaN(gapH) ? 8 : gapH * 16;

    elementWidths.forEach((width, idx) => {
      const addGap = currentRow.length > 0 ? gapPx : 0;
      if (currentWidth + width + addGap > containerWidth - SAFETY_MARGIN) {
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [idx];
        currentWidth = width;
      } else {
        currentRow.push(idx);
        currentWidth += width + addGap;
      }
    });
    if (currentRow.length > 0) rows.push(currentRow);
    setElementRows(rows);
  }, [containerWidth, elementWidths, gap.horizontal]);

  const animatedRows = useMemo(() => {
    if (elementRows.length === 0) return [];
    return elementRows.map((rowElementIndices, rowIndex) => {
      const GridRowComponent = tag === "span" ? GridRowSpan : GridRow;
      return (
        <GridRowComponent
          key={`row-${rowIndex}`}
          $debug={debug}
          $gapH={gap.horizontal || "0.5em"}
          $gapV={gap.vertical || "0.25em"}
          $isSpan={tag === "span"}
          className={rowClassName}
          style={styleRow}
        >
        {rowElementIndices.map((elementIndex) => {
          const element = animatedElements.elements[elementIndex];
          const elementId = animatedElements.elementIdMap[elementIndex];
          const config = elementId ? cellConfigs[elementId] : {};
          
          const wrapperAnimation = config?.animation || animation;
          const elementAnimation = config?.animationElement || animationElement;
          
          const delay =
            config?.animation?.delayStep ??
            (type === "rows" ? rowIndex * (animation.delayStep || 0) : elementIndex * (animation.delayStep || 0));

          const WrapperElement = tag === "span" ? "span" : "div";
          return (
            <WrapperElement key={`row-${rowIndex}-element-${elementIndex}-wrapper`}
                style={{
                  overflow: overflow ? 'hidden' : 'visible',
                }}
            >
            <Spring
              key={`row-${rowIndex}-element-${elementIndex}-wrapper`}
              tag={tag === "span" ? "span" : "div"}
              from={wrapperAnimation.from}
              to={wrapperAnimation.to}
              config={wrapperAnimation.config}
              delayIn={delay}
              enabled={inView}
              mode={once ? "once" : "always"}
              immediateOut={true}
            >
              <Spring
                tag={tag === "span" ? "span" : "div"}
                from={elementAnimation?.from}
                to={elementAnimation?.to}
                config={elementAnimation?.config}
                delayIn={delay}
                enabled={inView}
                mode={once ? "once" : "always"}
                immediateOut={true}
              >
                {element}
              </Spring>
            </Spring>
          </WrapperElement>
          );
        })}
        </GridRowComponent>
      );
    });
  }, [elementRows, animatedElements, animation, animationElement, cellConfigs, inView, once, debug, type, gap, tag]);

  useEffect(() => {
    if (!measureRef.current || !containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!measureRef.current || !containerRef.current) return;
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
      setElementWidths(Array.from(measureRef.current.children).map((el) => (el as HTMLElement).getBoundingClientRect().width));
    });
  
    observer.observe(containerRef.current);
  
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
      setElementWidths(Array.from(measureRef.current.children).map((el) => (el as HTMLElement).getBoundingClientRect().width));
    }
  
    return () => observer.disconnect();
  }, [rawElements.length, children, gap.horizontal, gap.vertical]);

  if (tag === "span") {
    return (
      <span ref={ref} style={{ position: "relative", width: "100%", boxSizing: "border-box" }}>
        <MainContainerSpan
          ref={containerRef}
          className={containerClassName}
          style={{ ...style, counterReset: debug ? "row-counter" : undefined }}
          $isSpan={true}
        >
          <MeasureContainerSpan className={className} ref={measureRef} $gapH={gap.horizontal || "0.5em"} $gapV={gap.vertical || "0.25em"} $isSpan={true}>
            {rawElements}
          </MeasureContainerSpan>
          {animatedRows}
        </MainContainerSpan>
      </span>
    );
  }
  
  return (
    <div ref={ref} style={{ position: "relative", width: "100%", boxSizing: "border-box" }}>
      <MainContainer
        ref={containerRef}
        className={containerClassName}
        style={{ ...style, counterReset: debug ? "row-counter" : undefined }}
      >
        <MeasureContainer className={className} ref={measureRef} $gapH={gap.horizontal || "0.5em"} $gapV={gap.vertical || "0.25em"}>
          {rawElements}
        </MeasureContainer>
        {animatedRows}
      </MainContainer>
    </div>
  );
};

export default AnimatedGrid;
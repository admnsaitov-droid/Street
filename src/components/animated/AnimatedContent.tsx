"use client";

import React, { Children, useMemo, useLayoutEffect, useState, useRef, useEffect } from "react";
import { animated, useInView } from "@react-spring/web";
import styled from "styled-components";
import { Spring } from "../Springs/Spring";
import { createRoot } from "react-dom/client";

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


const GridRow = styled.div<{ $debug?: boolean; $gapH: string; $gapV: string; $isSpan?: boolean }>`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
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
  display: inline;
  position: relative;
  white-space: pre;
`;

const WordContainerSpan = styled.span`
  display: inline;
  position: relative;
  white-space: pre;
`;

const WordInnerContainer = styled.div<{ $overflow?: string }>`
  display: inline;
  overflow: ${(p) => p.$overflow || "hidden"};
  position: relative;
  white-space: pre;
`;

const WordInnerContainerSpan = styled.span<{ $overflow?: string }>`
  display: inline;
  overflow: ${(p) => p.$overflow || "hidden"};
  position: relative;
  white-space: pre;
`;

const AnimatedContent = styled(animated.div)`
  display: inline;
  white-space: pre;
  position: relative;
`;

const AnimatedContentSpan = styled(animated.span)`
  display: inline;
  white-space: pre;
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

  const containerRef = useRef<HTMLDivElement>(null);

  const [elementRows, setElementRows] = useState<number[][]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [elementWidths, setElementWidths] = useState<number[]>([]);

  // Function to measure text using temporary DOM elements with actual styles
  const measureTextWidth = (text: string, extraStyle?: React.CSSProperties): number => {
    if (!containerRef.current) return 0;

    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'nowrap';
    tempDiv.style.top = '-9999px';
    tempDiv.style.left = '-9999px';
    tempDiv.style.pointerEvents = 'none';
    tempDiv.textContent = text;

    // Apply styles from the container to get accurate measurements
    const containerStyles = window.getComputedStyle(containerRef.current);
    tempDiv.style.fontFamily = containerStyles.fontFamily;
    tempDiv.style.fontSize = containerStyles.fontSize;
    tempDiv.style.fontWeight = containerStyles.fontWeight;
    tempDiv.style.fontStyle = containerStyles.fontStyle;
    tempDiv.style.letterSpacing = containerStyles.letterSpacing;
    tempDiv.style.textTransform = containerStyles.textTransform;

    // Override with element-specific styles so different fonts/weights are measured correctly
    if (extraStyle) {
      if (extraStyle.fontFamily) tempDiv.style.fontFamily = String(extraStyle.fontFamily);
      if (extraStyle.fontSize) tempDiv.style.fontSize = typeof extraStyle.fontSize === 'number' ? `${extraStyle.fontSize}px` : String(extraStyle.fontSize);
      if (extraStyle.fontWeight) tempDiv.style.fontWeight = String(extraStyle.fontWeight);
      if (extraStyle.fontStyle) tempDiv.style.fontStyle = String(extraStyle.fontStyle);
      if (extraStyle.letterSpacing) tempDiv.style.letterSpacing = String(extraStyle.letterSpacing);
      if (extraStyle.textTransform) tempDiv.style.textTransform = String(extraStyle.textTransform);
    }

    document.body.appendChild(tempDiv);
    const width = tempDiv.getBoundingClientRect().width;
    document.body.removeChild(tempDiv);

    return width;
  };

  // Function to extract text content from React elements
  const extractTextContent = (element: React.ReactNode): string => {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return element.toString();
    if (!React.isValidElement(element)) return '';
    
    if (element.props.children) {
      if (typeof element.props.children === 'string') {
        return element.props.children;
      }
      if (Array.isArray(element.props.children)) {
        return element.props.children.map(extractTextContent).join('');
      }
      return extractTextContent(element.props.children);
    }
    
    return '';
  };

  // Function to process text for measurement (same logic as processText but for measurement)
  const processTextForMeasurement = (text: string): string[] => {
    const words = text.split(/\s+/).filter(Boolean);
    return words.map((word) => word + ' ');
  };

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

  const processText = (text: string, config: CellConfig = {}, elementId?: string) => {
    const words = text.split(/\s+/).filter(Boolean);
    
    const processedWords = words.map((word) => {
      const index = globalIndex++;
      // Always add trailing space so adjacent spans don't collide (e.g. red + black text)
      const wordWithSpace = word + ' ';
      return { word, wordWithSpace, index };
    });
    
    return processedWords.map(({ wordWithSpace, index }) => 
      createAnimatedElement(wordWithSpace, index, config, elementId)
    );
  };

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

  const animatedElements = useMemo(
    () => parseChildren(true),
    [children, containerWrapperWordClassName, cellConfigs]
  ) as { elements: React.ReactNode[]; elementIdMap: { [index: number]: string | undefined } };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
    
    // Measure text elements using temporary DOM elements
    const measureElements = async () => {
      const widths: number[] = [];
      const elements = animatedElements.elements;
      
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (typeof element === 'string') {
          const processedWords = processTextForMeasurement(element);
          processedWords.forEach(word => {
            widths.push(measureTextWidth(word));
          });
        } else if (React.isValidElement(element)) {
          // Forced line break: give it container-sized width so it always starts a new row
          if ('data-br' in (element.props as any)) {
            widths.push(containerRef.current?.getBoundingClientRect().width ?? 999999);
          } else {
            const textContent = extractTextContent(element);
            const elementStyle = (element as React.ReactElement<{ style?: React.CSSProperties }>).props.style;
            if (textContent) {
              // Measure the full text (including trailing space) with the element's own font styles
              widths.push(measureTextWidth(textContent, elementStyle));
            } else {
              // Fallback: render into a temp DOM node to measure non-text elements
              const tempDiv = document.createElement('div');
              tempDiv.style.position = 'absolute';
              tempDiv.style.visibility = 'hidden';
              tempDiv.style.whiteSpace = 'nowrap';
              tempDiv.style.top = '-9999px';
              tempDiv.style.left = '-9999px';
              tempDiv.style.pointerEvents = 'none';

              if (containerRef.current) {
                const containerStyles = window.getComputedStyle(containerRef.current);
                tempDiv.style.fontFamily = containerStyles.fontFamily;
                tempDiv.style.fontSize = containerStyles.fontSize;
                tempDiv.style.fontWeight = containerStyles.fontWeight;
                tempDiv.style.fontStyle = containerStyles.fontStyle;
                tempDiv.style.letterSpacing = containerStyles.letterSpacing;
                tempDiv.style.textTransform = containerStyles.textTransform;
              }

              document.body.appendChild(tempDiv);

              try {
                const root = createRoot(tempDiv);
                root.render(element as React.ReactElement);
                await new Promise(resolve => setTimeout(resolve, 0));
                widths.push(tempDiv.getBoundingClientRect().width);
                root.unmount();
                document.body.removeChild(tempDiv);
              } catch (e) {
                widths.push(0);
                document.body.removeChild(tempDiv);
              }
            }
          }
        } else {
          widths.push(0);
        }
      }
      setElementWidths(widths);
    };

    measureElements();
  }, [animatedElements.elements.length, children]);

  useEffect(() => {
    if (!containerWidth || elementWidths.length === 0) {
      setElementRows([]);
      return;
    }
    const rows: number[][] = [];
    let currentRow: number[] = [];
    let currentWidth = 0;

    elementWidths.forEach((width, idx) => {
      if (currentWidth + width > containerWidth - SAFETY_MARGIN) {
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [idx];
        currentWidth = width;
      } else {
        currentRow.push(idx);
        currentWidth += width;
      }
    });
    if (currentRow.length > 0) rows.push(currentRow);
    setElementRows(rows);
  }, [containerWidth, elementWidths]);

  const animatedRows = useMemo(() => {
    if (elementRows.length === 0) return [];
    return elementRows.map((rowElementIndices, rowIndex) => {
      const GridRowComponent = tag === "span" ? GridRowSpan : GridRow;

      // If this row contains only a forced line-break (data-br), render it as a zero-height spacer
      const isBrRow =
        rowElementIndices.length === 1 &&
        React.isValidElement(animatedElements.elements[rowElementIndices[0]]) &&
        'data-br' in ((animatedElements.elements[rowElementIndices[0]] as React.ReactElement).props as any);

      if (isBrRow) {
        const BrTag = tag === "span" ? "span" : "div";
        return <BrTag key={`row-${rowIndex}-br`} style={{ display: 'block', height: 0, width: '100%', overflow: 'hidden' }} />;
      }

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
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
      
      // Re-measure elements when container resizes
      const measureElements = async () => {
        const widths: number[] = [];
        const elements = animatedElements.elements;
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];

          if (typeof element === 'string') {
            const processedWords = processTextForMeasurement(element);
            processedWords.forEach(word => {
              widths.push(measureTextWidth(word));
            });
          } else if (React.isValidElement(element)) {
            if ('data-br' in (element.props as any)) {
              widths.push(containerRef.current?.getBoundingClientRect().width ?? 999999);
            } else {
              const textContent = extractTextContent(element);
              const elementStyle = (element as React.ReactElement<{ style?: React.CSSProperties }>).props.style;
              if (textContent) {
                widths.push(measureTextWidth(textContent, elementStyle));
              } else {
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.visibility = 'hidden';
                tempDiv.style.whiteSpace = 'nowrap';
                tempDiv.style.top = '-9999px';
                tempDiv.style.left = '-9999px';
                tempDiv.style.pointerEvents = 'none';

                if (containerRef.current) {
                  const containerStyles = window.getComputedStyle(containerRef.current);
                  tempDiv.style.fontFamily = containerStyles.fontFamily;
                  tempDiv.style.fontSize = containerStyles.fontSize;
                  tempDiv.style.fontWeight = containerStyles.fontWeight;
                  tempDiv.style.fontStyle = containerStyles.fontStyle;
                  tempDiv.style.letterSpacing = containerStyles.letterSpacing;
                  tempDiv.style.textTransform = containerStyles.textTransform;
                }

                document.body.appendChild(tempDiv);

                try {
                  const root = createRoot(tempDiv);
                  root.render(element as React.ReactElement);
                  await new Promise(resolve => setTimeout(resolve, 0));
                  widths.push(tempDiv.getBoundingClientRect().width);
                  root.unmount();
                  document.body.removeChild(tempDiv);
                } catch (e) {
                  widths.push(0);
                  document.body.removeChild(tempDiv);
                }
              }
            }
          } else {
            widths.push(0);
          }
        }

        setElementWidths(widths);
      };
      
      measureElements();
    });
  
    observer.observe(containerRef.current);
  
    return () => observer.disconnect();
  }, [animatedElements.elements.length, children]);

  if (tag === "span") {
    return (
      <span ref={ref} style={{ position: "relative", width: "100%", boxSizing: "border-box" }}>
        <MainContainerSpan
          ref={containerRef}
          className={containerClassName}
          style={{ ...style, counterReset: debug ? "row-counter" : undefined }}
          $isSpan={true}
        >
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
        {animatedRows}
      </MainContainer>
    </div>
  );
};

export default AnimatedGrid;
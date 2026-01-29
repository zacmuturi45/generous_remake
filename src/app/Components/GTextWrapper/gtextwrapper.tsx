"use client";

import { useGSAP } from "@gsap/react";
import React, { RefObject, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(SplitText, ScrollTrigger);

export default function GTextWrapper({
  children,
  delay = 0,
  blockColor = "rgba(255, 255, 255, 0.9)",
  stagger = 0.15,
  duration = 0.75,
  svgRef,
  containsSvg = false,
  containsArrow = false,
}: {
  children: React.ReactNode;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
  svgRef?: RefObject<SVGSVGElement | null>;
  containsSvg?: boolean;
  containsArrow?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<any>(null);
  const lines = useRef<HTMLDivElement[]>([]);
  const blocks = useRef<HTMLDivElement[]>([]);
  const svgAnimationRef = useRef<gsap.core.Tween | null>(null);
  const lastWidthRef = useRef<number>(0);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const initializeAnimation = () => {
        // Clear previous splits and wrappers
        splitRefs.current?.forEach((split: any) => split?.revert());
        const wrappers = containerRef.current?.querySelectorAll(".g__text-line-wrapper");
        wrappers?.forEach((wrapper) => {
          if (wrapper.parentNode && wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.remove();
          }
        });

        splitRefs.current = [];
        lines.current = [];
        blocks.current = [];

        let elements = [];

        if (!containerRef.current) return;

        if (containerRef.current.hasAttribute("data-g_text-wrapper")) {
          elements = Array.from(containerRef.current.children);
        } else {
          elements = [containerRef.current];
        }

        elements.forEach((element) => {
          const el = element as HTMLElement;
          const split = SplitText.create(el, {
            type: "lines",
            linesClass: "g-text",
          });

          splitRefs.current?.push(split);

          split.lines.forEach((el) => {
            // Wrap the split lines in new div to be animated
            const line = el as HTMLDivElement;
            const wrapper = document.createElement("div");
            wrapper.className = "g__text-line-wrapper";
            const hasSvg = containsSvg && line.querySelector("svg");
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);

            // Block to reveal text
            const block = document.createElement("div");
            block.className = "gText_revealer";
            block.style.backgroundColor = blockColor;
            if (containsArrow) {
              block.setAttribute("data-has-svg", "true");
            }
            wrapper.appendChild(block);

            lines.current.push(line);
            blocks.current.push(block);
          });
        });

        gsap.set(blocks.current, { x: "-15%", transformOrigin: "right center" });

        const masterTimeline = gsap.timeline({
          paused: true,
          onReverseComplete: () => {
            // Reset SVG animation state when timeline fully reverses
            if (svgRef?.current) {
              svgRef.current.removeAttribute("data-svg-animated");
              // Reset SVG scale to hidden state
              gsap.set(svgRef.current, { scale: 0.5 });
            }
          },
          onStart: () => {
            // Reset animation state when timeline starts playing forward
            if (svgRef?.current) {
              svgRef.current.removeAttribute("data-svg-animated");
            }
          },
        });

        blocks.current.forEach((block, index) => {
          const line = lines.current[index];
          const hasSvg = containsSvg && line.querySelector("svg");

          // Add SVG animation callbacks if this line contains SVG
          if (hasSvg && svgRef?.current) {
            // Calculate when block will reach SVG position
            // Adjust the 0.7 value based on your animation timing
            // This represents when the block is about 70% through its reveal
            const svgTriggerTime = 0.05 + index * stagger + 0.7;

            // Forward animation: SVG scales up
            masterTimeline.add(() => {
              if (!svgRef.current!.getAttribute("data-svg-animated")) {
                svgRef.current!.setAttribute("data-svg-animated", "true");

                // Kill any existing SVG animation
                if (svgAnimationRef.current) {
                  svgAnimationRef.current.kill();
                }

                // Create new SVG animation
                svgAnimationRef.current = gsap.fromTo(
                  svgRef.current,
                  {
                    scale: 0.5,
                    opacity: 0.7,
                  },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    delay: 0.3,
                    onComplete: () => {
                      svgAnimationRef.current = null;
                    },
                  }
                );
              }
            }, svgTriggerTime);

            // Reverse animation: SVG scales down
            // Place this slightly earlier than the forward trigger for smooth reversal
            const reverseTriggerTime = svgTriggerTime - 0.05;
            masterTimeline.add(() => {
              // Only trigger reverse if we're going backward and SVG was animated
              const isReversing =
                masterTimeline.timeScale() < 0 ||
                masterTimeline.reversed() ||
                masterTimeline.progress() < svgTriggerTime;

              if (isReversing && svgRef.current!.getAttribute("data-svg-animated")) {
                svgRef.current!.setAttribute("data-svg-animated", "false");

                // Kill any existing SVG animation
                if (svgAnimationRef.current) {
                  svgAnimationRef.current.kill();
                }

                // Create reverse animation
                svgAnimationRef.current = gsap.to(svgRef.current, {
                  scale: 0.5,
                  opacity: 0.7,
                  duration: 0.4,
                  ease: "power2.in",
                  onComplete: () => {
                    svgAnimationRef.current = null;
                  },
                });
              }
            }, reverseTriggerTime);
          }

          // Block reveal animation
          masterTimeline.to(
            block,
            {
              scaleX: 0,
              duration: 1.85,
              ease: "circ.inOut",
            },
            0.05 + index * stagger
          );

          // Text slide-in animation
          masterTimeline.from(
            line,
            {
              x: "-15%",
              ease: "circ.inOut",
              duration: 0.6,
            },
            0.4 + index * stagger
          );
        });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 88%",
          end: "top 88%",
          animation: masterTimeline,
          onEnter: () => masterTimeline.play(),
          onEnterBack: () => masterTimeline.reverse(),
          // Optional: Add markers for debugging
          // markers: true,
        });
      };

      // Initial setup
      initializeAnimation();
      // Store initial width
      lastWidthRef.current = window.innerWidth;

      // Debounced resize handler with width-only check
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const currentWidth = window.innerWidth;

          // Only reinitialize if the WIDTH has changed
          // This prevents mobile address bar show/hide from triggering resets
          if (currentWidth !== lastWidthRef.current) {
            lastWidthRef.current = currentWidth;

            // Kill all ScrollTriggers associated with this container
            ScrollTrigger.getAll().forEach((trigger) => {
              if (trigger.trigger === containerRef.current) {
                trigger.kill();
              }
            });
            // Re-initialize
            initializeAnimation();
          }
        }, 250);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimer);

        // Clean up SVG animation
        if (svgAnimationRef.current) {
          svgAnimationRef.current.kill();
        }

        splitRefs.current?.forEach((split: any) => split?.revert());

        const wrappers = containerRef.current?.querySelectorAll(".g__text-line-wrapper");
        wrappers?.forEach((wrapper) => {
          if (wrapper.parentNode && wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.remove();
          }
        });

        // Clean up ScrollTriggers
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === containerRef.current) {
            trigger.kill();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [delay, blockColor, stagger, duration, containsSvg] }
  );

  return (
    <div ref={containerRef} data-g_text-wrapper>
      {children}
    </div>
  );
}

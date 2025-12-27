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
}: {
  children: React.ReactNode;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
  svgRef?: RefObject<SVGSVGElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<any>(null);
  const lines = useRef<HTMLDivElement[]>([]);
  const blocks = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRefs.current = [];
      lines.current = [];
      blocks.current = [];

      let elements = [];

      if (containerRef.current.hasAttribute("data-g_text-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        const el = element as HTMLElement;
        const split = SplitText.create(el, {
          type: "lines",
          linesClass: "g-text++",
        });

        splitRefs.current?.push(split);

        split.lines.forEach((el) => {
          // Wrap the split lines in new div to be animated
          const line = el as HTMLDivElement;
          const wrapper = document.createElement("div");
          wrapper.className = "g__text-line-wrapper";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);

          // Block to reveal text
          const block = document.createElement("div");
          block.className = "gText_revealer";
          block.style.backgroundColor = blockColor;
          wrapper.appendChild(block);

          lines.current.push(line);
          blocks.current.push(block);
        });
      });

      gsap.set(blocks.current, { x: "-18%", transformOrigin: "right center" });

      const masterTimeline = gsap.timeline({ paused: true });

      blocks.current.forEach((block, index) => {
        const line = lines.current[index];

        masterTimeline
          .to(
            block,
            {
              scaleX: 0.7,
              duration: 0.9,
              ease: "power2.in",
              onUpdate: function () {
                if (svgRef?.current) {
                  const lineRect = line.getBoundingClientRect();
                  const svgRect = svgRef.current.getBoundingClientRect();
                  const currentScaleX = gsap.getProperty(block, "scaleX") as number;
                  const blockVisibleWidth = lineRect.width * 1.3 * currentScaleX;
                  const blockRightEdge = lineRect.left + blockVisibleWidth;

                  if (blockRightEdge >= svgRect.left) {
                    gsap.fromTo(
                      svgRef.current,
                      {
                        scale: 0.5,
                      },
                      {
                        scale: 1,
                        duration: 0.5,
                        ease: "back.out(1.7)",
                        delay: 0.3,
                      }
                    );
                  }
                }
              },
            },
            0.05 + index * stagger
          )
          .to(
            block,
            {
              scaleX: 0,
              duration: 1.2,
              ease: "power2.out",
            },
            ">"
          )
          .from(
            line,
            {
              x: "-18%",
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
      });

      return () => {
        splitRefs.current.forEach((split: any) => split?.revert());

        const wrappers = containerRef.current?.querySelectorAll(".g__text-line-wrapper");
        wrappers?.forEach((wrapper) => {
          if (wrapper.parentNode && wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.remove();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [delay, blockColor, stagger, duration] }
  );

  return (
    <div ref={containerRef} data-g_text-wrapper>
      {children}
    </div>
  );
}

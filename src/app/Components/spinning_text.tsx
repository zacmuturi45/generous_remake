"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../css/index.css";

const CircularText: React.FC = () => {
  const textRef = useRef<SVGTextElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const arrowTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      // Create the rotation animation with GSAP
      animationRef.current = gsap.to(textRef.current, {
        rotation: 360,
        duration: 30,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    }

    return () => {
      // Cleanup animation on unmount
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (isHovering) {
      // Create arrow animation timeline
      const timeline = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          if (!isHovering) {
            timeline.pause();
          }
        },
      });

      timeline.set(".arrow-2", {
        y: -100,
      });

      // Arrow 1 moves down and fades out
      timeline.to(
        ".arrow-1",
        {
          y: 100,
          opacity: 0,
          duration: 0.8,
          ease: "circ.in",
        },
        0
      );

      // Arrow 2 fades in from top
      timeline.to(
        ".arrow-2",
        {
          y: 0,
          opacity: 0.8,
          duration: 1,
          ease: "circ.out",
        },
        0.5
      );

      timeline.set(
        ".arrow-1",
        {
          y: -100,
          opacity: 0,
        },
        1
      );

      // Arrow 2 moves down and fades out
      timeline.to(
        ".arrow-2",
        {
          y: 100,
          opacity: 0,
          duration: 0.8,
          ease: "circ.in",
        },
        1.5
      );

      // Arrow 1 fades in from top (loop back)
      timeline.to(
        ".arrow-1",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "circ.out",
        },
        2
      );

      arrowTimelineRef.current = timeline;
    } else {
      // Stop the arrow animation and center it
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.pause();

        gsap.to([".arrow-1", ".arrow-2"], {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "circ.out",
        });
      }
    }

    return () => {
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.kill();
      }
    };
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (animationRef.current) {
      gsap.to(animationRef.current, {
        timeScale: 10,
        duration: 0.5,
        ease: "circ.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (animationRef.current) {
      gsap.to(animationRef.current, {
        timeScale: 1,
        duration: 0.5,
        ease: "circ.out",
      });
    }
  };

  return (
    <div>
      <svg
        width={150}
        height={150}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: "relative" }}
      >
        <defs>
          <clipPath id="arrow-clip">
            <rect x="0" y="0" width="150" height="150" />
          </clipPath>
          <path id="curve" d="M 20 75 A 55 55 0 1 1 20 77" />
        </defs>

        {/* Arrow group FIRST - renders behind */}
        <g clipPath="url(#arrow-clip)">
          {/* Arrow 1 */}
          <g className="arrow-1" style={{ transformOrigin: "75px 75px" }}>
            {/* Right arm - more extended */}
            <path
              style={{
                fill: "none",
                stroke: "rgb(255, 255, 255)",
                strokeWidth: "3px",
                strokeLinejoin: "round",
              }}
              d="M 75 55 L 75 95 C 75.15 84.5 84 74 88 78"
            />
            {/* Left arm - more extended */}
            <path
              style={{
                fill: "none",
                stroke: "rgb(255, 255, 255)",
                strokeWidth: "3px",
                strokeLinejoin: "round",
              }}
              d="M 75 55 L 75 95 C 74.85 84.5 66 74 62 78"
            />
          </g>

          {/* Arrow 2 (initially hidden) */}
          <g className="arrow-2" style={{ transformOrigin: "75px 75px", opacity: 0 }}>
            {/* Right arm - more extended */}
            <path
              style={{
                fill: "none",
                stroke: "rgb(255, 255, 255)",
                strokeWidth: "3px",
                strokeLinejoin: "round",
              }}
              d="M 75 55 L 75 95 C 75.15 84.5 84 74 88 78"
            />
            {/* Left arm - more extended */}
            <path
              style={{
                fill: "none",
                stroke: "rgb(255, 255, 255)",
                strokeWidth: "3px",
                strokeLinejoin: "round",
              }}
              d="M 75 55 L 75 95 C 74.85 84.5 66 74 62 78"
            />
          </g>
        </g>

        {/* Text LAST - renders on top */}
        <text className="spin_text" ref={textRef}>
          <textPath href="#curve" textLength={340} lengthAdjust={"spacing"}>
            * SCROLL * SCROLL * SCROLL * SCROLL
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularText;

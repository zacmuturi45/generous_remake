"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../css/index.css";

const CircularText: React.FC<{ lenis?: any }> = ({ lenis }) => {
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
      // Start arrow at center
      timeline.set(".arrow", {
        y: 0,
        opacity: 1,
      });

      // Pause at center
      timeline.to({}, { duration: 0.3 }, 0);

      // Move down and fade out
      timeline.to(
        ".arrow",
        {
          y: 100,
          opacity: 0,
          duration: 0.7,
          ease: "circ.in",
        },
        0.3
      );

      // Pause before reset
      timeline.to({}, { duration: 0.2 }, 1);

      // Reset to top (instant)
      timeline.set(
        ".arrow",
        {
          y: -100,
          opacity: 0,
        },
        1.2
      );

      // Fade in and move down to center
      timeline.to(
        ".arrow",
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "circ.out",
        },
        1.2
      );

      arrowTimelineRef.current = timeline;
    } else {
      // Stop the arrow animation and center it
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.pause();
        gsap.to(".arrow", {
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
        timeScale: 5,
        duration: 0.5,
        ease: "circ.out",
      });
    }
  };

  const handleClick = () => {
    // Check if lenis exists and is ready
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(window.innerHeight, {
        duration: 1.2,
        // GSAP's circ.inOut easing
        easing: (t: number) => {
          return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
        },

        // Other easings

        // Current: circ.inOut
        // easing: (t: number) => {
        //   return t < 0.5
        //     ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        //     : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
        // }

        // // expo.inOut (very dramatic, slow start/end)
        // easing: (t: number) => {
        //   return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
        //     ? Math.pow(2, 20 * t - 10) / 2
        //     : (2 - Math.pow(2, -20 * t + 10)) / 2;
        // }

        // // power3.inOut (smooth, balanced)
        // easing: (t: number) => {
        //   return t < 0.5
        //     ? 4 * t * t * t
        //     : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // }

        // // power4.inOut (more aggressive than power3)
        // easing: (t: number) => {
        //   return t < 0.5
        //     ? 8 * t * t * t * t
        //     : 1 - Math.pow(-2 * t + 2, 4) / 2;
        // }

        // // back.inOut (slight overshoot at start/end)
        // easing: (t: number) => {
        //   const c1 = 1.70158;
        //   const c2 = c1 * 1.525;
        //   return t < 0.5
        //     ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        //     : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
        // }

        // // sine.inOut (gentle, natural feeling)
        // easing: (t: number) => {
        //   return -(Math.cos(Math.PI * t) - 1) / 2;
        // }

        // // Custom: smooth start, quick end
        // easing: (t: number) => {
        //   return t * t * (3 - 2 * t);
        // }
      });
    } else {
      // Fallback to native smooth scroll
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
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
        style={{ position: "relative", cursor: "pointer" }}
        onClick={handleClick}
      >
        <defs>
          <clipPath id="arrow-clip">
            <circle cx="75" cy="75" r="55" />
          </clipPath>
          <path id="curve" d="M 20 75 A 55 55 0 1 1 20 77" />
        </defs>

        {/* Arrow group - renders behind */}
        <g clipPath="url(#arrow-clip)">
          <g className="arrow" style={{ transformOrigin: "75px 75px" }}>
            {/* Right arm */}
            <path
              style={{
                fill: "none",
                stroke: "rgb(255, 255, 255)",
                strokeWidth: "3px",
                strokeLinejoin: "round",
              }}
              d="M 75 55 L 75 95 C 75.15 84.5 84 74 88 78"
            />
            {/* Left arm */}
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

        {/* Text - renders on top */}
        <text
          className="spin_text"
          ref={textRef}
          style={{
            fill: "white",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          <textPath href="#curve" textLength={340} lengthAdjust={"spacing"}>
            * SCROLL * SCROLL * SCROLL * SCROLL
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularText;

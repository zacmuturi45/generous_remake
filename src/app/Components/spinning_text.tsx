"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../css/index.css";

const CircularText: React.FC<{
  lenis?: any;
  rotatingText: string;
  backgroundColor: string;
  d1: string;
  d2: string;
  direction: number;
  scrollTarget: "next-section" | "top" | number;
}> = ({
  lenis,
  rotatingText = "* SCROLL * SCROLL * SCROLL * SCROLL",
  backgroundColor = "rgb(255, 255, 255)",
  d1,
  d2,
  direction,
  scrollTarget = "next-section",
}) => {
  const textRef = useRef<SVGTextElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const arrowTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const hasInitialBoost = useRef<boolean>(false);

  // Initial speed boost effect
  useEffect(() => {
    // Only run once on mount
    if (hasInitialBoost.current) return;

    const timer = setTimeout(() => {
      if (animationRef.current && window.innerWidth > 768) {
        // Create a timeline for the initial speed burst
        const boostTimeline = gsap.timeline();

        // Initial burst to very fast
        boostTimeline.to(animationRef.current, {
          timeScale: 15, // Even faster than hover
          duration: 0.4,
          ease: "power2.out",
        });

        // Slow down slightly but still faster than normal
        boostTimeline.to(animationRef.current, {
          timeScale: 8,
          duration: 0.4,
          ease: "power2.inOut",
        });

        // Return to normal speed
        boostTimeline.to(animationRef.current, {
          timeScale: 1,
          duration: 0.5,
          ease: "power2.in",
        });

        // Mark as boosted
        hasInitialBoost.current = true;
      }
    }, 250); // Small delay after mount

    return () => clearTimeout(timer);
  }, []);

  // Text rotation animation
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      if (textRef.current) {
        animationRef.current = gsap.to(textRef.current, {
          rotation: 360,
          duration: 30,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      }

      return () => {
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    });

    mm.add("(max-width: 768px)", () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.kill();
      }

      gsap.set(".arrow", {
        y: 0,
        opacity: 1,
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  // Handle hover speed change
  useEffect(() => {
    if (window.innerWidth > 768 && animationRef.current) {
      gsap.to(animationRef.current, {
        timeScale: isHovering ? 5 : 1,
        duration: 0.5,
        ease: "circ.out",
      });
    }
  }, [isHovering]);

  // Arrow animation effect
  useEffect(() => {
    if (window.innerWidth <= 768) return;

    if (isHovering) {
      const timeline = gsap.timeline({
        repeat: -1,
      });

      timeline.set(".arrow", {
        y: 0,
        opacity: 1,
      });

      timeline.to({}, { duration: 0.3 }, 0);

      timeline.to(
        ".arrow",
        {
          y: 100 * direction,
          opacity: 0,
          duration: 0.7,
          ease: "circ.in",
        },
        0.3
      );

      timeline.to({}, { duration: 0.2 }, 1);

      timeline.set(
        ".arrow",
        {
          y: -100 * direction,
          opacity: 0,
        },
        1.2
      );

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
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.kill();
      }
      gsap.to(".arrow", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "circ.out",
      });
    }

    return () => {
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.kill();
      }
    };
  }, [isHovering, direction]);

  const handleClick = () => {
    let targetPosition: number;

    // Determine scroll target
    if (scrollTarget === "next-section") {
      targetPosition = window.innerHeight;
    } else if (scrollTarget === "top") {
      targetPosition = 0;
    } else {
      targetPosition = scrollTarget;
    }

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetPosition, {
        duration: 1.2,
        easing: (t: number) => {
          return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
        },
      });
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setIsHovering(false);
    }
  };

  return (
    <div>
      <svg
        ref={svgRef}
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
                stroke: backgroundColor,
                strokeWidth: "3px",
                strokeLinejoin: "round",
              }}
              d={d1}
            />
            {/* Left arm */}
            <path
              style={{
                fill: "none",
                stroke: backgroundColor,
                strokeWidth: "3px",
                strokeLinejoin: "round",
              }}
              d={d2}
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
            {rotatingText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularText;

// Moved matchMedia() inside useEffect - Creating it on every render was causing issues
// Removed duplicate event listeners - The matchMedia was adding listeners AND you had inline React handlers
// Separated concerns - One effect for rotation, one for hover speed, one for arrow animation
// Fixed cleanup - Each effect properly cleans up its own animations

// This was causing an issue with the arrow direction. Previously with matchMedia() inside useEffect, the arrow wasn't changing direction from the prop it was using.

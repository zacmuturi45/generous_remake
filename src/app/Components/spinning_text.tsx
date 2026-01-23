"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../css/index.css";

const CircularText: React.FC<{ lenis?: any }> = ({ lenis }) => {
  const textRef = useRef<SVGTextElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const arrowTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const mm = gsap.matchMedia(); // Create matchMedia instance

  useEffect(() => {
    // Set up matchMedia breakpoints
    mm.add("(max-width: 768px)", () => {
      // Mobile: No animations, just setup for click
      console.log("Mobile mode: animations disabled");

      // Kill any existing animations
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.kill();
      }

      // Ensure arrow is visible and centered
      gsap.set(".arrow", {
        y: 0,
        opacity: 1,
      });

      return () => {
        // Cleanup when this breakpoint no longer matches
        console.log("Exiting mobile mode");
      };
    });

    mm.add("(min-width: 581px)", () => {
      // Desktop: Setup animations
      console.log("Desktop mode: animations enabled");

      if (textRef.current) {
        // Create the rotation animation with GSAP
        animationRef.current = gsap.to(textRef.current, {
          rotation: 360,
          duration: 30,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
          paused: false, // Ensure it's playing
        });
      }

      // Setup hover effects for desktop
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

      // Add event listeners for desktop
      const svg = document.querySelector("svg");
      if (svg) {
        svg.addEventListener("mouseenter", handleMouseEnter);
        svg.addEventListener("mouseleave", handleMouseLeave);
      }

      return () => {
        // Cleanup event listeners
        if (svg) {
          svg.removeEventListener("mouseenter", handleMouseEnter);
          svg.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    });

    return () => {
      // Cleanup all matchMedia listeners
      mm.revert();
    };
  }, []); // Empty dependency array - runs once on mount

  // Separate effect for arrow animation (desktop only)
  useEffect(() => {
    // Only run arrow animations on desktop
    if (window.innerWidth > 768) {
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

        timeline.set(".arrow", {
          y: 0,
          opacity: 1,
        });

        timeline.to({}, { duration: 0.3 }, 0);

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

        timeline.to({}, { duration: 0.2 }, 1);

        timeline.set(
          ".arrow",
          {
            y: -100,
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
    }

    return () => {
      if (arrowTimelineRef.current) {
        arrowTimelineRef.current.kill();
      }
    };
  }, [isHovering]);

  const handleClick = () => {
    // Check if lenis exists and is ready
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(window.innerHeight, {
        duration: 1.2,
        // GSAP's circ.inOut easing
        easing: (t: number) => {
          return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
        },
      });
    } else {
      // Fallback to native smooth scroll
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  // Simplified mouse handlers for desktop only
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

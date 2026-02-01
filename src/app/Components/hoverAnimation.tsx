import { useEffect, useRef, useState, ReactNode } from "react";
import gsap from "gsap";
import { HoverAnimationProps } from "./Types/gsap";

export function HoverAnimation({
  children,
  imageCount,
  textSelector = "p",
  imageSelector = "img",
  imageCycleInterval = 400,
  onVisibilityChange,
  textAnimationConfig = {
    opacity: 0,
    y: 3,
    duration: 0.5,
    ease: "power3.inOut",
    transformOrigin: "bottom center",
  },
  imageAnimationConfig = {
    scale: 1.05,
    duration: 1.2,
    ease: "power3.inOut",
  },
  className = "",
  transitionComplete = true,
}: HoverAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentZ, setCurrentZ] = useState<number>(0);
  const changeZInterval = useRef<any>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!transitionComplete) return;

    const container = containerRef.current;
    if (!container) return;

    // Create timeline
    let tl: gsap.core.Timeline;
    // const gs = gsap.timeline({ paused: true, repeat: -1 });
    const textElement = container.querySelector(textSelector);

    const createTimeline = () => {
      // Kill existing timeline if it exists
      if (tl) tl.kill();

      // Check screen size
      const isSmallScreen = window.matchMedia("(max-width: 579px)").matches;

      // Create new timeline
      tl = gsap.timeline({ paused: true });
      timelineRef.current = tl;

      // Only add the text animation if not a small screen
      if (!isSmallScreen && textElement) {
        tl.from(textElement, textAnimationConfig);
      }

      tl.to(imageSelector, imageAnimationConfig, "<").call(() => {
        changeZInterval.current = setInterval(() => {
          setCurrentZ((prev) => (prev + 1) % imageCount);
        }, imageCycleInterval);
      });
    };

    createTimeline();

    // Listen for screen size changes
    const mediaQuery = window.matchMedia("(max-width: 579px)");
    const handleResize = () => {
      createTimeline();
    };

    mediaQuery.addEventListener("change", handleResize);

    // Event handlers
    const handleMouseEnter = () => {
      onVisibilityChange?.(true, container);
      // gs.play();
      tl.play();
    };

    const handleMouseLeave = () => {
      onVisibilityChange?.(false);
      tl.reverse();
      // gs.pause();

      if (changeZInterval.current) {
        clearInterval(changeZInterval.current);
        changeZInterval.current = null;
      }
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);

      if (changeZInterval.current) {
        clearInterval(changeZInterval.current);
      }

      tl.kill();
      // gs.kill();
    };
  }, [
    imageCount,
    imageCycleInterval,
    textSelector,
    imageSelector,
    textAnimationConfig,
    imageAnimationConfig,
    onVisibilityChange,
    transitionComplete,
  ]);

  return (
    <div ref={containerRef} className={className} data-current-z={currentZ}>
      {children(currentZ)}
    </div>
  );
}

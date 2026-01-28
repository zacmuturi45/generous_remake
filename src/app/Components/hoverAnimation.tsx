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
}: HoverAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentZ, setCurrentZ] = useState<number>(0);
  const changeZInterval = useRef<any>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const gsRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create timeline
    const tl = gsap.timeline({ paused: true });
    // const gs = gsap.timeline({ paused: true, repeat: -1 });
    const textElement = container.querySelector(textSelector);

    timelineRef.current = tl;
    // gsRef.current = gs;

    tl.from(textElement, textAnimationConfig)
      .to(imageSelector, imageAnimationConfig, "<")
      .call(() => {
        changeZInterval.current = setInterval(() => {
          setCurrentZ((prev) => (prev + 1) % imageCount);
        }, imageCycleInterval);
      });

    // gs.to(".c2", { xPercent: 120, duration: 0.5, ease: "power2.in", delay: 1 }).to(
    //   ".c1",
    //   { x: 0, duration: 1, ease: "power2.out" },
    //   "-=0.1"
    // );

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
  ]);

  return (
    <div ref={containerRef} className={className} data-current-z={currentZ}>
      {children(currentZ)}
    </div>
  );
}

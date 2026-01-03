// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { UseHoverAnimationOptions } from "./Types/gsap";

// export function useHoverAnimation(options: UseHoverAnimationOptions = {}) {
//   const {
//     cursorSize = 96,
//     imageCycleInterval = 400,
//     imageCount = 4,
//     textSelector = ".tardy",
//     imageSelector = ".editorial",
//     textAnimationConfig = {
//       opacity: 0,
//       y: 3,
//       duration: 0.5,
//       ease: "power3.inOut",
//       transformOrigin: "bottom center",
//     },
//     imageAnimationConfig = {
//       scale: 1.05,
//       duration: 1,
//       ease: "power3.inOut",
//     },
//     arrowAnimationConfig = {
//       out: { xPercent: 120, duration: 0.5, ease: "power2.in", delay: 2 },
//       in: { x: 0, duration: 1, ease: "power2.out" },
//     },
//     containerRef,
//     cursorRef,
//     setIsVisible: setIsVisibleProp,
//   } = options;

//   //   const targetRef = useRef<HTMLDivElement>(null);
//   const [isVisible, setIsVisible] = useState<boolean>(false);
//   const [currentZ, setCurrentZ] = useState<number>(0);
//   const changeZInterval = useRef<any>(null);

//   useEffect(() => {
//     if (!containerRef || !cursorRef) return;
//     const cursor = cursorRef.current;
//     const targetDiv = containerRef.current;

//     if (!cursor || !targetDiv) return;

//     // GSAP Timelines
//     const tl = gsap.timeline({ paused: true });
//     const gs = gsap.timeline({ paused: true, repeat: -1 });

//     // Main hover animation
//     tl.from(textSelector, textAnimationConfig)
//       .to(imageSelector, imageAnimationConfig, "<")
//       .call(() => {
//         // Start image cycling when animation completes
//         changeZInterval.current = setInterval(() => {
//           setCurrentZ((prev) => (prev + 1) % imageCount);
//         }, imageCycleInterval);
//       });

//     // Cursor arrow animation
//     gs.to(".c2", arrowAnimationConfig.out).to(".c1", arrowAnimationConfig.in, "-=0.1");

//     // // Event Handlers
//     // const handleMouseMove = (e: MouseEvent) => {
//     //   cursor.style.left = `${e.clientX - cursorSize / 2}px`;
//     //   cursor.style.top = `${e.clientY - cursorSize / 2}px`;
//     // };

//     const handleMouseEnter = () => {
//       if (setIsVisibleProp) setIsVisibleProp(true);
//       tl.play();
//       gs.play();
//     };

//     const handleMouseLeave = () => {
//       if (setIsVisibleProp) setIsVisibleProp(false);
//       setIsVisible(false);
//       gs.pause();
//       tl.reverse();

//       // Clear interval when mouse leaves
//       if (changeZInterval.current) {
//         clearInterval(changeZInterval.current);
//         changeZInterval.current = null;
//       }
//     };

//     // Add event listeners
//     targetDiv.addEventListener("mouseenter", handleMouseEnter);
//     targetDiv.addEventListener("mouseleave", handleMouseLeave);
//     // window.addEventListener("mousemove", handleMouseMove);

//     // Cleanup
//     return () => {
//       targetDiv.removeEventListener("mouseenter", handleMouseEnter);
//       targetDiv.removeEventListener("mouseleave", handleMouseLeave);
//       //   window.removeEventListener("mousemove", handleMouseMove);

//       // Clear interval
//       if (changeZInterval.current) {
//         clearInterval(changeZInterval.current);
//       }

//       // Kill timelines
//       tl.kill();
//       gs.kill();
//     };
//   }, [
//     cursorSize,
//     imageCycleInterval,
//     imageCount,
//     textSelector,
//     imageSelector,
//     textAnimationConfig,
//     imageAnimationConfig,
//     arrowAnimationConfig,
//     containerRef,
//     cursorRef,
//   ]);

//   return {
//     cursorRef,
//     isVisible,
//     currentZ,
//   };
// }

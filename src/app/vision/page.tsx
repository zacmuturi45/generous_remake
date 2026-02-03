"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef, useState, useCallback } from "react";
import GTextWrapper from "../Components/GTextWrapper/gtextwrapper";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { quoteBottom, quoteTop } from "../../../public/assets";

gsap.registerPlugin(ScrollTrigger);

const mySvgDiv = (
  <div className="mysvgdiv">
    <p>La Marque au coeur</p>
    <div className="svg_container">
      <svg viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3c1.82 0 3.413.973 4.288 2.428l-1.714 1.029A3 3 0 1 0 12 15a2.998 2.998 0 0 0 2.573-1.456l1.715 1.028A4.999 4.999 0 0 1 7 12c0-2.76 2.24-5 5-5z"></path>
          </g>
        </g>
      </svg>

      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
            fill="#000000"
          ></path>
        </g>
      </svg>
    </div>
  </div>
);

const laMarqueText = "Le Coeur de notre expertise est la marque";

export default function Vision() {
  const mainContainer = useRef<HTMLDivElement>(null);
  const marqMainOneRef = useRef<HTMLDivElement>(null);
  const marqSecondOneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const vmContainerRef = useRef<HTMLDivElement>(null);
  const visionContainerRef = useRef<HTMLDivElement>(null);
  const textboxesContainer = useRef<HTMLDivElement>(null);
  const mainShaft2 = useRef<SVGPathElement>(null);
  const topShaft2 = useRef<SVGPathElement>(null);
  const bottomShaft2 = useRef<SVGPathElement>(null);
  const vision_text_containerRef = useRef<HTMLDivElement>(null);
  const lmqContainer = useRef<HTMLDivElement>(null);
  const la_marque_element = useRef<HTMLDivElement>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const animationFrameRef = useRef<{ frame1: number | null; frame2: number | null }>({
    frame1: null,
    frame2: null,
  });

  // Marquee animations with cleanup tracking
  useEffect(() => {
    const mainLineOne = marqMainOneRef.current?.querySelectorAll(".mysvgdiv");
    const mainLineTwo = marqSecondOneRef.current?.querySelectorAll("p");

    if (!mainLineOne?.length || !mainLineTwo?.length) return;

    let xPercent1 = 0;
    const animate1 = () => {
      if (xPercent1 <= -100) {
        xPercent1 = 0;
      }
      gsap.set(mainLineOne, { xPercent: xPercent1 });
      xPercent1 -= 0.1;
      animationFrameRef.current.frame1 = requestAnimationFrame(animate1);
    };

    let xPercent2 = 0;
    const animate2 = () => {
      if (xPercent2 <= -100) {
        xPercent2 = 0;
      }
      gsap.set(mainLineTwo, { xPercent: xPercent2 });
      xPercent2 -= 0.08;
      animationFrameRef.current.frame2 = requestAnimationFrame(animate2);
    };

    animationFrameRef.current.frame1 = requestAnimationFrame(animate1);
    animationFrameRef.current.frame2 = requestAnimationFrame(animate2);

    return () => {
      if (animationFrameRef.current.frame1) {
        cancelAnimationFrame(animationFrameRef.current.frame1);
      }
      if (animationFrameRef.current.frame2) {
        cancelAnimationFrame(animationFrameRef.current.frame2);
      }
    };
  }, []);

  // Video intersection observer
  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;

    if (!video || !container) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => {
            console.error("Video autoplay failed:", error);
          });
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (video) {
        video.pause();
      }
    };
  }, []);

  // Handle video load
  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  // GSAP entrance animations
  useGSAP(
    () => {
      const container = vmContainerRef.current;
      const marque = container?.querySelector(".vision_marquee_main");
      const marque2 = marqSecondOneRef.current;
      const vision = visionContainerRef.current;
      const vid = videoContainerRef.current;

      if (!container || !marque || !marque2 || !vision || !vid) return;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.from(vision, { y: 100, duration: 1 }, 0)
        .fromTo(
          vid,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        )
        .from(marque, { yPercent: 100, duration: 1.5 }, 0)
        .from(marque2, { yPercent: 100, duration: 1.5 }, 0);
    },
    { scope: vmContainerRef }
  );

  useGSAP(
    () => {
      const lmqElement = la_marque_element.current;
      if (!lmqElement) return;
      const splitUpElements = lmqElement.querySelectorAll(".up_lmq");

      gsap.to([splitUpElements], {
        y: 0,
        ease: "circ.inOut",
        duration: 1.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: lmqElement,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: la_marque_element }
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });
      const mainLength = mainShaft2.current?.getTotalLength();
      const topLength = topShaft2.current?.getTotalLength();
      const textboxes = gsap.utils.toArray(".tb_fade");
      const arrows = gsap.utils.toArray(".vision_orangeArrow");
      textboxes.forEach((box) => {
        const textbox = box as HTMLElement;
        gsap.to(textbox, {
          opacity: 0.05,
          transformOrigin: "top center",
          ease: "none",
          duration: 2,
          scrollTrigger: {
            trigger: textbox,
            start: "top 20%",
            end: "top 10%",
            scrub: true,
          },
        });
      });

      arrows.forEach((arrow) => {
        const svgElement = arrow as SVGSVGElement;
        const paths = svgElement.querySelectorAll("path");

        if (paths.length !== 3) return; //Ensure we have all 3 pahs

        const mainShaft = paths[0]; // Horizontal line
        const topShaft = paths[1]; // Top curve
        const bottomShaft = paths[2]; // Bottom curve

        const mainLength = mainShaft.getTotalLength();
        const topLength = topShaft.getTotalLength();
        const bottomLength = bottomShaft.getTotalLength();

        // Create a specific timeline for this specific arrow
        const tl = gsap.timeline({ paused: true });

        // Animate main horizontal shaft
        tl.fromTo(
          mainShaft,
          {
            strokeDasharray: mainLength,
            strokeDashoffset: mainLength,
          },
          {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "circ.inOut",
          },
          0
        );

        // Animate top and bottom curves
        tl.fromTo(
          [topShaft, bottomShaft],
          {
            strokeDasharray: topLength,
            strokeDashoffset: topLength,
          },
          {
            strokeDashoffset: 0,
            duration: 0.4,
            ease: "none",
          },
          0.5
        );

        // Create ScrollTrigger for this arrow
        ScrollTrigger.create({
          trigger: svgElement,
          start: "top 80%",
          end: "top 80%",
          animation: tl,
          onEnter: () => tl.play(),
          onEnterBack: () => tl.reverse(),
          // markers: true,
        });
      });
    },
    { scope: textboxesContainer }
  );

  useGSAP(
    () => {
      if (
        !la_marque_element ||
        !vision_text_containerRef.current ||
        !textboxesContainer.current ||
        !lmqContainer.current
      )
        return;

      const container = vision_text_containerRef.current;
      const textboxes = textboxesContainer.current;
      const lmq = lmqContainer.current;
      const lmqElement = la_marque_element.current;

      let pinTrigger: ScrollTrigger | null = null;

      const calculatePinEnd = () => {
        // Calculate the distance textboxes needs to scroll
        const textboxesHeight = textboxes.offsetHeight;
        const lmqHeight = lmqElement?.offsetHeight;
        return textboxesHeight - lmqHeight!;
      };

      const createPinTrigger = () => {
        if (window.innerWidth <= 1080) {
          if (pinTrigger) {
            pinTrigger.kill();
            pinTrigger = null;
          }
          return;
        }

        if (!pinTrigger) {
          pinTrigger = ScrollTrigger.create({
            trigger: container,
            start: "top 64px",
            end: () => `+=${calculatePinEnd()}`,
            pin: lmq,
            pinSpacing: false,
            invalidateOnRefresh: true,
            onRefresh: function (self) {
              // Dynamically update end position on refresh
              self.vars.end = `+=${calculatePinEnd()}`;
            },
            anticipatePin: 1,
            // markers: true
          });
        }
      };

      // Additionla manual refresh for safety
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          createPinTrigger();
          ScrollTrigger.refresh(true); // true = force recalculation
        }, 100);
      };

      // Initial creation
      createPinTrigger();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (pinTrigger) {
          pinTrigger.kill();
        }
        clearTimeout(resizeTimer);
      };
    },
    { scope: vision_text_containerRef }
  );

  return (
    <div className="vision_main" ref={mainContainer}>
      <div className="vision_container" ref={visionContainerRef}>
        {/* Vision Marquee */}
        <div className="vision-marquee">
          <div className="vmcontainer" ref={vmContainerRef}>
            <div className="vision_marquee_main" ref={marqMainOneRef}>
              {mySvgDiv}
              {mySvgDiv}
              {mySvgDiv}
            </div>
          </div>

          <div className="vmcontainer2">
            <div className="vision_marquee_second" ref={marqSecondOneRef}>
              {Array.from({ length: 5 }, (_, i) => (
                <p key={i}>
                  {laMarqueText}
                  <span className="dot"></span>
                </p>
              ))}
            </div>
          </div>
        </div>
        {/* End of Vision Marquee */}

        {/* Video section */}
        <div className="marq_video">
          <div className="marq_video_container" ref={videoContainerRef}>
            <video
              ref={videoRef}
              className="marq_video_player"
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedData={handleVideoLoad}
              aria-label="Brand showcase video"
            >
              <source src="/marquevid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isVideoLoaded && (
              <div className="marq_video__loader">
                <div className="loader-spinner" role="status" aria-label="Loading video"></div>
              </div>
            )}
          </div>
        </div>
        {/* End of Video section */}
      </div>

      <div className="vision_text_container">
        <div className="text_container" ref={vision_text_containerRef}>
          {/* Start GText Elements */}
          <div className="lmqContainer" ref={lmqContainer}>
            <div className="la__marque" ref={la_marque_element}>
              <div className="line">
                <span className="split_up up_lmq">LA MARQUE</span>
              </div>
              <div className="line au__coeur">
                <div className="split_up up_lmq">
                  <span className="split_up">AU COEUR</span>
                  <div className="la__marque_svg">
                    <svg viewBox="0 0 24 24" fill="#000000">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <path fill="none" d="M0 0h24v24H0z"></path>{" "}
                          <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3c1.82 0 3.413.973 4.288 2.428l-1.714 1.029A3 3 0 1 0 12 15a2.998 2.998 0 0 0 2.573-1.456l1.715 1.028A4.999 4.999 0 0 1 7 12c0-2.76 2.24-5 5-5z"></path>{" "}
                        </g>{" "}
                      </g>
                    </svg>

                    <svg viewBox="0 0 16 16" fill="none">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
                          fill="#000000"
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>

          <div className="textboxes" ref={textboxesContainer}>
            <div className="tb1">
              <h4 className="tb_fade">
                <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 41 28.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" stroke="#ea5b0c" strokeWidth="2.5" d="M0 14.9H41" />

                    <path
                      fill="none"
                      stroke="#ea5b0c"
                      strokeWidth="2.5"
                      d="M41 14.9c-10.8 0-18.6-9.7-18.6-14.9"
                    />

                    <path
                      fill="none"
                      stroke="#ea5b0c"
                      strokeWidth="2.5"
                      d="M41 14.8c-10 0-18.7 9-18.7 13.7"
                    />
                  </svg>
                </span>
                Des Strategies
              </h4>

              <div className="tbp">
                <p className="tb_fade">Generous accompagne les entreprises</p>
                <p className="tb_fade">marchés, les marques et leurs</p>
                <GTextWrapper>
                  <p className="tb_fade">écosystèmes. Ensemble nous</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">prendrons de la hauteur pour définir</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">votre plateforme stratégique qui sera</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">au cœur de votre territoire de Marque.</p>
                </GTextWrapper>
              </div>
            </div>

            <div className="tb1">
              <GTextWrapper containsArrow={true}>
                <h4 className="tb_fade">
                  <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                    <svg
                      className="vision_orangeArrow"
                      width={24}
                      height={24}
                      viewBox="0 0 41 28.5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" stroke="#ea5b0c" strokeWidth="2.5" d="M0 14.9H41" />

                      <path
                        fill="none"
                        stroke="#ea5b0c"
                        strokeWidth="2.5"
                        d="M41 14.9c-10.8 0-18.6-9.7-18.6-14.9"
                      />

                      <path
                        fill="none"
                        stroke="#ea5b0c"
                        strokeWidth="2.5"
                        d="M41 14.8c-10 0-18.7 9-18.7 13.7"
                      />
                    </svg>
                  </span>
                  Des Strategies
                </h4>
              </GTextWrapper>

              <div className="tbp">
                <GTextWrapper>
                  <p className="tb_fade">Pour Generous l&apos;identité est bien plus</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">qu&apos;un beau logo.</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">C&apos;est la conjugaison de l&apos;ensemble des</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">marqueurs qui fait battre son cœur.</p>
                </GTextWrapper>
              </div>
            </div>

            <div className="tb1">
              <GTextWrapper containsArrow={true}>
                <h4 className="tb_fade">
                  <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                    <svg
                      className="vision_orangeArrow"
                      width={24}
                      height={24}
                      viewBox="0 0 41 28.5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" stroke="#ea5b0c" strokeWidth="2.5" d="M0 14.9H41" />

                      <path
                        fill="none"
                        stroke="#ea5b0c"
                        strokeWidth="2.5"
                        d="M41 14.9c-10.8 0-18.6-9.7-18.6-14.9"
                      />

                      <path
                        fill="none"
                        stroke="#ea5b0c"
                        strokeWidth="2.5"
                        d="M41 14.8c-10 0-18.7 9-18.7 13.7"
                      />
                    </svg>
                  </span>
                  Des Strategies
                </h4>
              </GTextWrapper>
              <div className="tbp">
                <GTextWrapper>
                  <p className="tb_fade">Dessiner un plan, un aménagement ou</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">un beau mobilier.</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">Chez nous, par le design nous</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">proposerons toujours une expérience</p>
                </GTextWrapper>
                <GTextWrapper>
                  <p className="tb_fade">qui sera votre marque de fabrique.</p>
                </GTextWrapper>
              </div>
            </div>
          </div>
          {/* End GText Elements */}
        </div>
      </div>

      <div className="vision_quote">
        <div className="vision_quote_container">
          <h1>
            <span className="sp1">
              <Image src={quoteTop} width={48} height={48} alt="quoteTop" />
            </span>
            Le cœur fait tout,
          </h1>
          <h1>
            le reste est inutile
            <span className="sp2">
              <Image src={quoteBottom} width={48} height={48} alt="quoteTop" />
            </span>
          </h1>
          <p>Jean de la Fontaine</p>
        </div>
      </div>
    </div>
  );
}

// Key Improvements:
// 1. Performance Optimizations

// Added animationFrameRef to properly track and cancel animation frames
// Added .length check for NodeLists to prevent errors
// Used useCallback for handleVideoLoad to prevent unnecessary re-renders
// Removed redundant else if conditions in animation loops

// 2. Better Cleanup

// Properly tracks animation frame IDs for reliable cleanup
// Null checks before canceling frames
// Video pause in cleanup uses optional chaining

// 3. Code Quality

// Renamed videoContainer → videoContainerRef and visionContainer → visionContainerRef for consistency
// Removed unused ref marqMainOneRefTwo
// Added TypeScript type for IntersectionObserverInit
// Consolidated GSAP timeline defaults to reduce repetition

// 4. Accessibility

// Added aria-hidden="true" to decorative SVGs
// Added aria-label to video for screen readers
// Added role="status" and aria-label to loader spinner
// Added fallback text for video element

// 5. Removed Dependencies

// Video observer effect no longer depends on isVideoLoaded (unnecessary dependency)

// These changes make your code more robust, performant, and accessible!

// PREVIOUS CODE UN-OPTIMIZED CODE

// "use client";

// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import React, { useEffect, useRef, useState } from "react";

// const mySvgDiv = (
//   <div className="mysvgdiv">
//     <p>La Marque au coeur</p>
//     <div className="svg_container">
//       <svg viewBox="0 0 24 24" fill="#000000">
//         <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//         <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
//         <g id="SVGRepo_iconCarrier">
//           {" "}
//           <g>
//             {" "}
//             <path fill="none" d="M0 0h24v24H0z"></path>{" "}
//             <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3c1.82 0 3.413.973 4.288 2.428l-1.714 1.029A3 3 0 1 0 12 15a2.998 2.998 0 0 0 2.573-1.456l1.715 1.028A4.999 4.999 0 0 1 7 12c0-2.76 2.24-5 5-5z"></path>{" "}
//           </g>{" "}
//         </g>
//       </svg>

//       <svg viewBox="0 0 16 16" fill="none">
//         <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//         <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
//         <g id="SVGRepo_iconCarrier">
//           {" "}
//           <path
//             d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
//             fill="#000000"
//           ></path>{" "}
//         </g>
//       </svg>
//     </div>
//   </div>
// );

// const laMarqueText = "Le Coeur de notre expertise est la marque";

// export default function Vision() {
//   const mainContainer = useRef<HTMLDivElement>(null);
//   const marqMainOneRef = useRef<HTMLDivElement>(null);
//   const marqSecondOneRef = useRef<HTMLDivElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const videoContainer = useRef<HTMLDivElement>(null);
//   const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
//   const vmContainerRef = useRef<HTMLDivElement>(null);
//   const visionContainer = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const mainLineOne = marqMainOneRef.current?.querySelectorAll(".mysvgdiv");
//     const mainLineTwo = marqSecondOneRef.current?.querySelectorAll("p");

//     if (!mainLineOne || !mainLineTwo) return;

//     let xPercent1 = 0;
//     const animate1 = () => {
//       if (xPercent1 <= -100) {
//         xPercent1 = 0;
//       } else if (xPercent1 >= 100) {
//         xPercent1 = -100;
//       }
//       gsap.set(mainLineOne, { xPercent: xPercent1 });
//       xPercent1 -= 0.1;
//       requestAnimationFrame(animate1);
//     };

//     let xPercent2 = 0;
//     const animate2 = () => {
//       if (xPercent2 <= -100) {
//         xPercent2 = 0;
//       } else if (xPercent2 >= 100) {
//         xPercent2 = -100;
//       }
//       gsap.set(mainLineTwo, { xPercent: xPercent2 });
//       xPercent2 -= 0.08;
//       requestAnimationFrame(animate2);
//     };

//     const frame1 = requestAnimationFrame(animate1);
//     const frame2 = requestAnimationFrame(animate2);

//     return () => {
//       cancelAnimationFrame(frame1);
//       cancelAnimationFrame(frame2);
//     };
//   }, []);

//   useEffect(() => {
//     const video = videoRef.current;
//     const container = videoContainer.current;

//     if (!video || !container) return;

//     const observerOptions = {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0.5, // Play when 50% visible
//     };

//     const handleIntersection = (entries: IntersectionObserverEntry[]) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           video.play().catch((error) => {
//             console.error("Video autoplay failed:", error);
//           });
//         } else {
//           video.pause();
//         }
//       });
//     };

//     const observer = new IntersectionObserver(handleIntersection, observerOptions);
//     observer.observe(container);

//     return () => {
//       observer.disconnect();
//       video.pause();
//     };
//   }, [isVideoLoaded]);

//   useGSAP(
//     () => {
//       const container = vmContainerRef.current;
//       const marque = container?.querySelector(".vision_marquee_main");
//       const marque2 = marqSecondOneRef.current;
//       const vision = visionContainer.current;
//       if (!container || !marque || !marque2 || !vision) return;
//       const tl = gsap.timeline();

//       tl.from(
//         vision,
//         {
//           y: 100,
//           duration: 1,
//           ease: "power2.out",
//         },
//         0
//       )
//         .from(
//           marque,
//           {
//             yPercent: 100,
//             duration: 1.5,
//             ease: "power2.out",
//           },
//           0
//         )
//         .from(
//           marque2,
//           {
//             opacity: 0,
//             duration: 1,
//             ease: "power2.out",
//           },
//           0
//         );
//     },
//     { scope: vmContainerRef }
//   );

//   return (
//     <div className="vision_main" ref={mainContainer}>
//       <div className="vision_container" ref={visionContainer}>
//         {/* Vision Marquee */}
//         <div className="vision-marquee">
//           <div className="vmcontainer" ref={vmContainerRef}>
//             <div className="vision_marquee_main" ref={marqMainOneRef}>
//               {mySvgDiv} {mySvgDiv} {mySvgDiv}
//             </div>
//           </div>

//           <div className="vision_marquee_second" ref={marqSecondOneRef}>
//             {Array.from({ length: 5 }, (_, i) => (
//               <p key={i}>
//                 {laMarqueText}
//                 <span className="dot"></span>
//               </p>
//             ))}
//           </div>
//         </div>
//         {/* End of Vision Marquee */}

//         {/* Video section */}
//         <div className="marq_video">
//           <div className="marq_video_container" ref={videoContainer}>
//             <video
//               ref={videoRef}
//               className="marq_video_player"
//               loop
//               muted
//               playsInline
//               preload="metadata"
//               onLoadedData={() => setIsVideoLoaded(true)}
//             >
//               <source src="/marquevid.mp4" type="video/mp4" />
//             </video>
//             {!isVideoLoaded && (
//               <div className="marq_video__loader">
//                 <div className="loader-spinner"></div>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* End of Video section */}
//       </div>
//     </div>
//   );
// }

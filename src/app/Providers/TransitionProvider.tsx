import React, { useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";
import { useLinkContext } from "../Contexts/LinkContext";
import { ChildrenProps } from "../Components/Types/gsap";

export default function WipeTransition({ children }: ChildrenProps) {
  const wipeOverlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { clickedLink, setIsPanelActive } = useLinkContext();

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        if (!wipeOverlayRef.current || !textRef.current) {
          next();
          return;
        }

        // Set initial state
        gsap.set(wipeOverlayRef.current, { opacity: 1 });
        gsap.set(textRef.current, { y: 230 });

        // Create timeline
        const tl = gsap.timeline();

        // Animate overlay in
        tl.to(".wipeTransition", {
          background: "rgba(0, 0, 0, 0.95)",
          ease: "power2.out",
          duration: 0.65,
        })
          .fromTo(
            wipeOverlayRef.current,
            { y: "100%" },
            {
              y: "0%",
              duration: 1,
              ease: "circ.inOut",
              onComplete: () => {
                // Instantly hide mobile nav (it's covered by wipe overlay)
                const mobileNav = document.querySelector(".mobileNavMenu") as HTMLElement;
                if (mobileNav) {
                  gsap.set(mobileNav, { display: "none" });
                }
                // Trigger panel close (navbar will detect instant hide and skip animation)
                setIsPanelActive(false);
              },
            },
            0
          )
          // Text comes in
          .to(textRef.current, { y: 50, duration: 1.4, ease: "power2.out" }, 0.35)
          // Text goes out
          .to(textRef.current, { y: -230, duration: 1, ease: "circ.inOut" }, 1.3)
          .to(
            ".wipeTransition",
            {
              background: "rgba(0, 0, 0, 0)",
              duration: 0.3,
              ease: "power2.out",
            },
            1.6
          )
          .call(next, [], 1.8);

        return () => {
          tl.kill();
        };
      }}
      enter={(next) => {
        if (!wipeOverlayRef.current) {
          next();
          return;
        }

        // Fade out the overlay
        const exitAnimation = gsap.to(wipeOverlayRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "circ.inOut",
          onComplete: next,
        });

        return () => exitAnimation.kill();
      }}
    >
      <div className="wipeTransition">
        <div className="wipe-overlay" ref={wipeOverlayRef}>
          <div className="wipeHeader">
            <h1 ref={textRef}>{clickedLink}</h1>
          </div>
        </div>
      </div>
      {children}
    </TransitionRouter>
  );
}

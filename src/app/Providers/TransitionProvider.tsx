import React, { useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";
import { useLinkContext } from "../Contexts/LinkContext";
import { ChildrenProps } from "../Components/Types/gsap";

export default function WipeTransition({ children }: ChildrenProps) {
  const wipeOverlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { clickedLink } = useLinkContext();

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
        gsap.set(textRef.current, {
          y: 230,
        });

        // Create timeline
        const tl = gsap.timeline();

        // Animate overlay in
        tl.to(".wipeTransition", {
          background: "rgba(0, 0, 0, 0.9)",
          ease: "power2.out",
          duration: 0.65,
        })
          .fromTo(
            wipeOverlayRef.current,
            {
              y: "100%",
            },
            {
              y: "0%",
              duration: 1,
              ease: "circ.inOut",
            },
            0
          )
          // Text comes in
          .to(
            textRef.current,
            {
              y: 50,
              duration: 1.4,
              ease: "power2.out",
            },
            0.35
          )
          // Text goes out
          .to(
            textRef.current,
            {
              y: -230,
              duration: 1,
              ease: "circ.inOut",
              onUpdate: function () {
                // Start enter animation when text is 70% done sliding out
                if (this.progress() > 0.5 && !this.vars.triggered) {
                  this.vars.triggered = true;
                  next();
                }
              },
            },
            1.3
          )
          .to(".wipeTransition", { background: "rgba(0, 0, 0, 0)" }, "<");

        return () => {
          tl.kill();
        };
      }}
      enter={(next) => {
        if (!wipeOverlayRef.current) {
          next();
          return;
        }

        // Slide the overlay up and out
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

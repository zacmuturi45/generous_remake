"use client";

import React, { useRef } from "react";
import { arrow } from "../../../public/assets";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Button() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const arrow3Ref = useRef<HTMLImageElement>(null);
  const arrow1Ref = useRef<HTMLImageElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ paused: true });

    tl.to(arrow3Ref.current, {
      rotation: 90,
      duration: 0.2,
      ease: "power2.out",
    })
      .to(
        arrow3Ref.current,
        {
          x: 40,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "-=0.1"
      )
      .to(
        spanRef.current,
        {
          x: 30,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      )
      .to(
        arrow1Ref.current,
        {
          left: 10,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "<"
      );

    const button = buttonRef.current;

    const handleMouseEnter = () => tl.play();
    const handleMouseLeave = () => tl.reverse();

    button?.addEventListener("mouseenter", handleMouseEnter);
    button?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button?.removeEventListener("mouseenter", handleMouseEnter);
      button?.removeEventListener("mouseleave", handleMouseLeave);
    };
  });
  return (
    <div className="button" ref={buttonRef}>
      <Image ref={arrow1Ref} src={arrow} width={36} height={36} alt="svg_arrow" />
      <span ref={spanRef}>Notre Vision</span>
      <Image ref={arrow3Ref} src={arrow} width={36} height={36} alt="svg_arrow" />
    </div>
  );
}

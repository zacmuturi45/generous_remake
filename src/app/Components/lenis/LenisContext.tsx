"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "../Types/Gsap/gsap_plugins";
import gsap from "gsap";

interface LenisContextType {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType>({ lenis: null });

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenis must be used within Lenisprovider");
  }

  return context;
};

export const Lenisprovider = ({ children }: { children: ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenis(lenisInstance);

    lenisInstance.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove((time) => lenisInstance.raf(time * 1000));
    };
  }, []);

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>;
};

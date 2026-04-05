"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import "../css/index.css";
import {
  TextAnimator,
  blurAnimator,
  driftAnimator,
  slideUpAnimator,
  splitAllTitles,
} from "./TextAnimators";
import { CarouselProps } from "./Types/gsap";

// ── GSAP setup ────────────────────────────────────────────────────────────────

gsap.registerPlugin(SplitText, CustomEase);

CustomEase.create("hop", "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1");

// ── Helpers ───────────────────────────────────────────────────────────────────

function getImageSrc(src: string | { src: string }): string {
  return typeof src === "string" ? src : src.src;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ExtendedCarouselProps extends CarouselProps {
  autoplayDuration?: number;
  textAnimator?: TextAnimator;
}

export const CarouselTwo: React.FC<ExtendedCarouselProps> = ({
  items,
  autoplayDuration = 5000,
  textAnimator = slideUpAnimator,
}) => {
  // ── DOM refs ───────────────────────────────────────────────────────────────
  const slidesRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // ── State refs (no re-renders) ─────────────────────────────────────────────
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const autoplayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const scaleInTween = useRef<gsap.core.Tween | null>(null);
  const textElsRef = useRef<HTMLDivElement[]>([]);
  const splitCleanup = useRef<(() => void) | null>(null);

  // ── Dot UI sync ────────────────────────────────────────────────────────────

  function syncDots(index: number) {
    const dots = progressRef.current?.querySelectorAll(".carousel__progress-dot");
    dots?.forEach((dot, i) => {
      dot.classList.toggle("carousel__progress-dot--active", i === index);
    });
  }

  // ── Progress bar ───────────────────────────────────────────────────────────

  // Expands the correct dot and resets its fill to 0 — fires immediately
  function resetDot(nextIndex: number) {
    syncDots(nextIndex);
    const activeDot = progressRef.current?.querySelector(
      ".carousel__progress-dot--active .carousel__progress-fill"
    ) as HTMLElement | null;
    if (activeDot) gsap.set(activeDot, { width: "0%" });
  }

  // Starts the fill animation on the active dot — fires after clip-path lands
  function fillProgress() {
    const activeDot = progressRef.current?.querySelector(
      ".carousel__progress-dot--active .carousel__progress-fill"
    ) as HTMLElement | null;
    if (!activeDot) return;

    progressTween.current = gsap.to(activeDot, {
      width: "100%",
      duration: autoplayDuration / 1000,
      ease: "none",
      onComplete: () => {
        const next = (currentIndexRef.current + 1) % items.length;
        resetDot(next); // dot resets and expands immediately
        animateSlide(next); // transition starts
      },
    });
  }

  function stopProgress() {
    progressTween.current?.kill();
    progressTween.current = null;
    if (autoplayTimer.current) {
      clearTimeout(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }

  // ── Slide cleanup ──────────────────────────────────────────────────────────

  function cleanupSlides() {
    const imgs = slidesRef.current?.querySelectorAll<HTMLDivElement>(".img");
    if (imgs && imgs.length > 1) {
      for (let i = 0; i < imgs.length - 1; i++) imgs[i].remove();
    }
  }

  // ── Core animation ─────────────────────────────────────────────────────────

  function animateSlide(nextIndex: number) {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const slidesEl = slidesRef.current;
    if (!slidesEl) return;

    const viewportWidth = window.innerWidth;
    const slideOffset = Math.min(viewportWidth * 0.5, 300);

    const tl = gsap.timeline();

    // Current (outgoing) slide
    const currentSlide = slidesEl.querySelector<HTMLDivElement>(".img:last-child");
    const currentImg = currentSlide?.querySelector<HTMLImageElement>("img");

    // Kill the scaleIn tween on the outgoing image
    scaleInTween.current?.kill();
    scaleInTween.current = null;

    if (currentImg) {
      const darkEl = document.createElement("div");
      darkEl.style.cssText =
        "position:absolute;inset:0;background:#000;opacity:0;z-index:2;pointer-events:none;";
      currentSlide!.appendChild(darkEl);

      tl.to(darkEl, { opacity: 0.8, duration: 0.65, ease: "power2.in" }, 0);
      tl.to(currentImg, { x: -slideOffset, duration: 1.2, ease: "power4.inOut" }, 0);
    }

    // Build incoming slide
    const newContainer = document.createElement("div");
    newContainer.classList.add("img");

    const newImg = document.createElement("img");
    newImg.src = getImageSrc(items[nextIndex].src);
    newImg.alt = items[nextIndex].alt || `Slide ${nextIndex + 1}`;
    newImg.style.cssText = "width:100%;height:100%;object-fit:cover;will-change:transform;";

    gsap.set(newImg, { x: slideOffset, scale: 1.1 });

    // ScaleIn starts immediately — runs through the transition and beyond
    scaleInTween.current = gsap.to(newImg, {
      scale: 1,
      duration: 7,
      ease: "linear",
    });

    newContainer.appendChild(newImg);
    slidesEl.appendChild(newContainer);

    // Clip-path wipe — onComplete is the single source of truth for "transition done"
    tl.fromTo(
      newContainer,
      { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "circ.inOut",
        onComplete: () => {
          cleanupSlides();
          isAnimatingRef.current = false;
          currentIndexRef.current = nextIndex;
          fillProgress(); // bar starts filling only after slide has landed
        },
      },
      0.15
    );

    // Incoming image counter-moves to rest
    tl.to(newImg, { x: 0, duration: 1.5, ease: "hop" }, 0.15);

    // Text transition — fully delegated to the textAnimator
    const outgoingEl = textElsRef.current[currentIndexRef.current] ?? null;
    const incomingEl = textElsRef.current[nextIndex];

    if (incomingEl) {
      textAnimator({ incomingEl, outgoingEl, tl });
    }
  }

  // ── Manual dot navigation ──────────────────────────────────────────────────

  function goToSlide(index: number) {
    if (isAnimatingRef.current || index === currentIndexRef.current) return;
    stopProgress();
    resetDot(index); // expand new dot and clear fill immediately
    animateSlide(index);
  }

  // ── Mount ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const slidesEl = slidesRef.current;
    const overlayEl = overlayRef.current;
    const textContainerEl = textContainerRef.current;
    const progressEl = progressRef.current;

    if (!slidesEl || !overlayEl || !textContainerEl || !progressEl) return;

    // 1. Build text container elements for each slide
    textElsRef.current = [];
    items.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("carousel__text_container");

      const headerWrap = document.createElement("div");
      headerWrap.classList.add("carousel__header");

      const h1 = document.createElement("h1");
      h1.classList.add("title");
      h1.textContent = item.alt ?? "";

      const descWrap = document.createElement("div");
      descWrap.classList.add("carousel__description");

      const p = document.createElement("p");
      p.textContent = (item as any).text ?? "";

      headerWrap.appendChild(h1);
      descWrap.appendChild(p);
      wrapper.appendChild(headerWrap);
      wrapper.appendChild(descWrap);
      textContainerEl.appendChild(wrapper);

      textElsRef.current.push(wrapper);
    });

    // Right after building text container elements, before fonts.ready
    textElsRef.current.forEach((el) => {
      const h1 = el.querySelector<HTMLElement>(".title");
      if (h1) gsap.set(h1, { opacity: 0 });
    });

    document.fonts.ready.then(() => {
      const { revert } = splitAllTitles(textElsRef.current);
      splitCleanup.current = revert;
      // Now safe to make visible — words are split and CSS opacity:0 on .word takes over
      textElsRef.current.forEach((el) => {
        const h1 = el.querySelector<HTMLElement>(".title");
        if (h1) gsap.set(h1, { opacity: 1 });
      });
    });
    // 3. Build first slide image
    const firstContainer = document.createElement("div");
    firstContainer.classList.add("img");

    const firstImg = document.createElement("img");
    firstImg.src = getImageSrc(items[0].src);
    firstImg.alt = items[0].alt || "Slide 1";
    firstImg.style.cssText = "width:100%;height:100%;object-fit:cover;will-change:transform;";
    gsap.set(firstImg, { scale: 1.1 });

    firstContainer.appendChild(firstImg);
    slidesEl.appendChild(firstContainer);

    // 4. All four fire on the same frame as the entry animation
    scaleInTween.current = gsap.to(firstImg, {
      scale: 1,
      duration: autoplayDuration / 1000 + 2,
      ease: "linear",
    });

    // 5. Entry animation: overlay fades out, dots stagger in
    const dots = progressEl.querySelectorAll(".carousel__progress-dot");

    const entryTl = gsap.timeline({
      onComplete: () => {
        // Text animates in after the overlay clears
        const firstTextEl = textElsRef.current[0];
        if (firstTextEl) {
          const fakeTl = gsap.timeline();
          textAnimator({ incomingEl: firstTextEl, outgoingEl: null, tl: fakeTl });
          syncDots(0);
          resetDot(0);
          fillProgress();
        }
      },
    });

    entryTl
      .to(overlayEl, { backgroundColor: "rgba(0,0,0,0)", duration: 1, ease: "power1.in" }, 0)
      .fromTo(
        dots,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.inOut" },
        0.25
      );

    // 6. Cleanup on unmount
    return () => {
      stopProgress();
      scaleInTween.current?.kill();
      splitCleanup.current?.();

      textElsRef.current.forEach((el) => el.remove());
      textElsRef.current = [];

      slidesEl.querySelectorAll(".img").forEach((el) => el.remove());
    };
  }, []);

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="carousel">
      <div className="carousel__container">
        <div className="carousel__slides" ref={slidesRef}>
          <div className="darkOverlay" ref={overlayRef} />
        </div>
      </div>

      <div className="carousel__progress_container">
        {/* Text — imperative children injected here by useEffect */}
        <div className="carousel__text" ref={textContainerRef} />

        {/* Progress dots — React-rendered, static structure */}
        <div className="carousel__progress" ref={progressRef}>
          {items.map((_, index) => (
            <div key={index} className="carousel__progress-dot" onClick={() => goToSlide(index)}>
              <div className="carousel__progress-fill" />
            </div>
          ))}
        </div>
      </div>

      {/* SVG filter for blur-matrix glow on text */}
      <svg
        viewBox="0 0 0 0"
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter id="blur-matrix">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

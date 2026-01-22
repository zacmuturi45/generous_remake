import React, { useState, useEffect, useRef } from "react";
import "../css/index.css";
import { CarouselProps } from "./Types/gsap";
import Image from "next/image";
import gsap from "gsap";
import CircularText from "./spinning_text";

export const Carousel: React.FC<CarouselProps> = ({ items, autoplayDuration = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const isTransitioning = useRef(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const autoplayTimeout = useRef<NodeJS.Timeout | null>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);

  // document.addEventListener("visibilitychange", () => {
  //   if (!document.hidden) {
  //     const carousel = document.querySelector(".carousel");
  //     const cs = carousel as HTMLDivElement;
  //     if (cs) {
  //       cs.style.display = "none";
  //       cs.offsetHeight;
  //       cs.style.display = "";
  //     }
  //   }
  // });

  useEffect(() => {
    const dots = document.querySelectorAll(".carousel__progress-dot");
    const darkOverlay = overlay.current;
    if (!dots) return;

    const tl = gsap.timeline();

    tl.to(
      darkOverlay,
      {
        backgroundColor: "rgba(0, 0, 0, 0)",
        duration: 1,
        ease: "power1.in",
      },
      0
    ).fromTo(
      dots,
      {
        y: 15,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.inOut",
      }
    );
  }, []);

  const startProgress = () => {
    const fillElement = document.querySelector(
      `.carousel__progress-dot--active .carousel__progress-fill`
    ) as HTMLElement;

    if (!fillElement) return;

    // ✅ Reset to 0% first
    gsap.set(fillElement, { width: "0%" });

    progressTween.current = gsap.to(fillElement, {
      width: "100%",
      duration: autoplayDuration / 1000,
      ease: "none",
    });
  };
  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    if (autoplayTimeout.current) {
      clearTimeout(autoplayTimeout.current);
      autoplayTimeout.current = null;
    }
  };

  const goToNext = () => {
    if (isTransitioning.current) return;

    stopProgress();
    setPrevIndex(currentIndex);

    setTimeout(() => {
      isTransitioning.current = true;
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 500);

    setTimeout(() => {
      isTransitioning.current = false;
      setPrevIndex(null);
    }, 1900);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning.current || index === currentIndex) return;

    stopProgress();
    isTransitioning.current = true;
    setPrevIndex(currentIndex);

    setTimeout(() => {
      setCurrentIndex(index);
    }, 50);

    setTimeout(() => {
      isTransitioning.current = false;
      setPrevIndex(null);
    }, 1400);
  };

  useEffect(() => {
    startProgress();

    autoplayTimeout.current = setTimeout(() => {
      goToNext();
    }, autoplayDuration);

    return () => {
      stopProgress();
    };
  }, [currentIndex]);

  return (
    <div className="carousel">
      <div className="carousel__container">
        <div className="carousel__slides">
          <div className="darkOverlay" ref={overlay} />
          {items.map((item, index) => {
            const isActive = index === currentIndex;
            const isPrev = index === prevIndex;

            return (
              <div
                key={index}
                className={`carousel__slide ${
                  isActive ? "carousel__slide--active" : ""
                } ${isPrev ? "carousel__slide--prev" : ""} ${
                  isTransitioning ? "carousel__slide--transitioning" : ""
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt || `Slide ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="100vw"
                  quality={85}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel__progress_container">
        <div className="carousel__text">
          {items.map((item, index) => {
            const isActive = index === currentIndex;
            const isPrev = index === prevIndex;

            return (
              <div
                key={index}
                className={`carousel__text_container ${
                  isActive ? "carousel__text_container--active" : ""
                } ${isPrev ? "carousel__text_container--prev" : ""} ${
                  isTransitioning ? "carousel__text_container--transitioning" : ""
                }`}
              >
                <div className="carousel__header">
                  <h1
                    className={`${isActive ? "header--active" : ""} ${isPrev ? "header--prev" : ""}`}
                  >
                    {item.alt}
                  </h1>
                </div>
                <div className="carousel__description">
                  <p
                    className={`${isActive ? "description--active" : ""} ${isPrev ? "description--prev" : ""}`}
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Progress */}

        <div className="carousel__progress">
          {items.map((_, index) => (
            <div
              key={index}
              className={`carousel__progress-dot ${
                index === currentIndex ? "carousel__progress-dot--active" : ""
              }`}
              onClick={() => goToSlide(index)}
            >
              <div className="carousel__progress-fill" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

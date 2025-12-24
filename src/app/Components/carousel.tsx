import React, { useState, useEffect, useRef } from "react";
import "../css/index.css";
import { CarouselProps } from "./Types/gsap";
import Image from "next/image";
import { SplitText } from "../GSAP/gsap_plugins";
import gsap from "gsap";

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoplayDuration = 5000,
  transitionDuration = 1000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const isTransitioning = useRef(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const autoplayTimeout = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    setProgress(0);
    const startTime = Date.now();

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / autoplayDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
    }, 16);
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
                  priority={index === 0}
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
              <div
                className="carousel__progress-fill"
                style={{
                  width: index === currentIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

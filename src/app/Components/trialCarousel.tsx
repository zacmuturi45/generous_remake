"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Image, { StaticImageData } from "next/image";
import { CarouselProps, TrialCarouselProps } from "./Types/gsap";
import "../css/index.css";
// Mock types for demonstration

// Mock CircularText component
const CircularText = () => (
  <div
    style={{
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      color: "white",
    }}
  >
    SCROLL
  </div>
);

export const TrialCarousel: React.FC<TrialCarouselProps> = ({ items, autoplayDuration = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const isTransitioning = useRef<any>(false);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const autoplayTimeout = useRef<NodeJS.Timeout | null>(null);

  // Refs for GSAP animations
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const overlay = useRef<HTMLDivElement>(null);

  // Initial Mount Animation
  useEffect(() => {
    const firstSlide = slidesRef.current[0];
    const firstImage = imagesRef.current[0];
    const firstHeading = headingsRef.current[0];
    const firstDescription = descriptionsRef.current[0];
    const darkOverlay = overlay.current;
    const dots = document.querySelectorAll(".carousel__progress-dot");

    if (firstSlide && firstImage && firstHeading && firstDescription && darkOverlay && dots) {
      // Set initial states
      gsap.set(firstSlide, { x: "0%" });
      gsap.set(firstImage, { scale: 1.1 });
      gsap.set(firstHeading, { y: 120 });
      gsap.set(firstDescription, { opacity: 0 });
      // setTimeout(() => {
      //   setCurrentIndex(0);
      // }, 2500);

      // Hide all other slides
      slidesRef.current.forEach((slide, index) => {
        if (index !== 0 && slide) {
          gsap.set(slide, { x: "105%" });
        }
      });

      // Animate first slide in
      const timeline = gsap.timeline();

      timeline
        .to(
          darkOverlay,
          {
            backgroundColor: "rgba(0, 0, 0, 0)",
            duration: 1,
            ease: "power1.in",
          },
          0
        )
        .to(
          firstImage,
          {
            scale: 1,
            duration: 3,
            ease: "power4.out",
          },
          0
        )
        .to(
          firstHeading,
          {
            y: 0,
            opacity: 1,
            duration: 1.7,
            ease: "circ.inOut",
          },
          0.1
        )
        .fromTo(
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
          },
          0.5
        )
        .to(
          firstDescription,
          {
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          1.2
        );
    }
  }, []);

  // Progress Bar Animation
  const startProgress = () => {
    setProgress(0);

    progressTween.current = gsap.to(
      { value: 0 },
      {
        value: 100,
        duration: autoplayDuration / 1000,
        ease: "none",
        onUpdate: function () {
          setProgress(this.targets()[0].value);
        },
      }
    );
  };

  const stopProgress = () => {
    if (progressTween.current) {
      progressTween.current.kill();
    }
    if (autoplayTimeout.current) {
      clearTimeout(autoplayTimeout.current);
    }
  };

  // Main Transition animation
  // Main Transition animation
  const animateTransition = (fromIndex: number, toIndex: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const prevSlide = slidesRef.current[fromIndex];
    const prevImage = imagesRef.current[fromIndex];
    const prevHeading = headingsRef.current[fromIndex];
    const prevDescription = descriptionsRef.current[fromIndex];

    const nextSlide = slidesRef.current[toIndex];
    const nextImage = imagesRef.current[toIndex];
    const nextHeading = headingsRef.current[toIndex];
    const nextDescription = descriptionsRef.current[toIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        console.log(`✅ Animation complete for slide ${toIndex}`);
        isTransitioning.current = false;
      },
    });

    // PHASE 1: Text Out (0s - 0.5s)
    tl.to(prevHeading, { y: 120, duration: 0.5, ease: "power2.in" }, 0).to(
      prevDescription,
      { opacity: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // PHASE 2: Setup next slide
    gsap.set(nextSlide, { x: "105%", zIndex: 2 });
    gsap.set(nextImage, { scale: 1.1 });
    gsap.set(nextHeading, { y: 120 });
    gsap.set(nextDescription, { opacity: 0 });

    // PHASE 3: Next slide IN (0.8s - 1.8s)
    tl.to(nextSlide, { x: "0%", duration: 1, ease: "circ.inOut" }, 0.8);

    // PHASE 4: Prev slide OUT (1.5s - 1.7s)
    tl.to(prevSlide, { x: "105%", duration: 0.2 }, 1.65);

    // PHASE 5: New content IN
    tl.to(nextImage, { scale: 1, duration: 3, ease: "none" }, 1.8) // ✅ Changed from 4s to 3s
      .to(nextHeading, { y: 0, opacity: 1, duration: 0.8, ease: "circ.inOut" }, 1.8) // ✅ Faster, starts earlier
      .to(nextDescription, { opacity: 1, duration: 0.8, ease: "power2.out" }, 2.2); // ✅ Faster

    return tl;
  };

  // STEP 4: NAVIGATE TO NEXT SLIDE
  const goToNext = () => {
    if (isTransitioning.current) return;

    stopProgress();
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % items.length;
      animateTransition(prevIndex, nextIndex);
      return nextIndex; // ✅ Return new index
    });
  };

  // STEP 5: NAVIGATE TO SPECIFIC SLIDE
  const goToSlide = (index: number) => {
    if (isTransitioning.current || index === currentIndex) return;

    stopProgress();

    setCurrentIndex((prevIndex) => {
      animateTransition(prevIndex, index);
      return index; // ✅ Return new index
    });
  };

  // STEP 6: AUTOPLAY EFFECT
  useEffect(() => {
    if (currentIndex === 0 && !isTransitioning.current) {
      // SKIP AUTOPLAY SETUP ON INITIAL MOUNT (FIRST SLIDE ALREADY ANIMATED)
      startProgress();
      console.log(`INDEX 0 STARTED`);
      autoplayTimeout.current = setTimeout(() => {
        console.log(`FINISHED AND MOVING ON TO INDEX 1`);
        goToNext();
      }, autoplayDuration);
    } else if (currentIndex > 0) {
      startProgress();
      console.log(`STATE UPDATED FOR NEXT INDEX - ${currentIndex}`);
      autoplayTimeout.current = setTimeout(() => {
        goToNext();
        console.log(`2ND GOTONEXT CALLED - next index = ${currentIndex}`);
      }, autoplayDuration);
    }

    return () => {
      stopProgress();
    };
  }, [currentIndex]);

  return (
    <div className="carousel">
      <div className="carousel__container">
        <div className="carousel__slides">
          <div className="darkOverlay" ref={overlay} />
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                slidesRef.current[index] = el;
              }}
              className="carousel__slide"
            >
              <div className="carousel__image" />
              <Image
                src={item.src}
                alt={item.alt || `Slide ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
                className="slideImg"
                ref={(el) => {
                  imagesRef.current[index] = el;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="circular__text_container">
        <CircularText />
      </div>

      <div className="carousel__progress_container">
        <div className="carousel__text">
          {items.map((item, index) => (
            <div key={index} className="carousel__text_container">
              <div className="carousel__header">
                <h1
                  ref={(el) => {
                    headingsRef.current[index] = el;
                  }}
                >
                  {item.alt}
                </h1>
              </div>
              <div className="carousel__description">
                <p
                  ref={(el) => {
                    descriptionsRef.current[index] = el;
                  }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

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

// Demo

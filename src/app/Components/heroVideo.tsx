"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  // Handle video load
  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
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

  return (
    <div className="herovideo">
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
  );
}

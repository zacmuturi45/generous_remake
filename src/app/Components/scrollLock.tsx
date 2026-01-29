"use client";

import { useEffect, useRef } from "react";

export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef(0);
  const originalOverflowRef = useRef("");

  useEffect(() => {
    if (isLocked) {
      // 1. SAVE the current scroll position FIRST
      scrollPositionRef.current = window.scrollY;

      // 2. Save original overflow
      originalOverflowRef.current = window.getComputedStyle(document.body).overflow;

      // 3. Lock scroll
      document.body.style.overflow = "hidden";

      // 4. Check if iOS (needs special handling)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

      if (isIOS) {
        // iOS: use fixed positioning
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.width = "100%";
      } else {
        // Non-iOS: simpler approach
        // Add padding to prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        // Restore overflow
        document.body.style.overflow = originalOverflowRef.current;

        if (isIOS) {
          // Remove iOS styles
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
        } else {
          // Remove padding
          document.body.style.paddingRight = "";
        }

        // RESTORE to the saved position
        window.scrollTo(0, scrollPositionRef.current);
      };
    }
  }, [isLocked]);
}

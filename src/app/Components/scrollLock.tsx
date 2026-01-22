"use client";

// hooks/useScrollLock.ts
import { useEffect } from "react";

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isLocked) {
      // Lock scroll on body
      document.body.style.overflow = "hidden";

      // For iOS Safari - prevent bouncing
      document.body.style.position = "fixed";
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore original styles
        document.body.style.overflow = originalStyle;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // Restore scroll position for iOS
        const scrollY = document.body.style.top;
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      };
    }
  }, [isLocked]);
}

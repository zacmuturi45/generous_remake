"use client";

import { useEffect, useRef } from "react";

export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef(0);
  const originalOverflowRef = useRef("");

  useEffect(() => {
    if (isLocked) {
      // 1. Save the current scroll position
      scrollPositionRef.current = window.scrollY;

      // 2. Save original overflow
      originalOverflowRef.current = window.getComputedStyle(document.body).overflow;

      // 3. Lock scroll
      document.body.style.overflow = "hidden";

      // For ALL devices, just prevent scroll without changing body position
      // This is simpler and usually works better
      document.body.style.position = "relative";
      document.body.style.height = "100vh";
      document.body.style.overflowY = "hidden";

      return () => {
        // Restore all styles
        document.body.style.overflow = originalOverflowRef.current;
        document.body.style.position = "";
        document.body.style.height = "";
        document.body.style.overflowY = "";

        // Restore scroll position
        window.scrollTo(0, scrollPositionRef.current);
      };
    }
  }, [isLocked]);
}

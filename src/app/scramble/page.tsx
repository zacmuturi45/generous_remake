"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function rChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

function decodeRightToLeft(el: HTMLElement, scrambleDuration = 0.8, stagger = 0.06) {
  const text = el.textContent?.trim() ?? "";
  const chars = text.split("");
  const total = chars.length;

  // Build a span per character
  el.innerHTML = "";
  const spans: HTMLSpanElement[] = chars.map((ch) => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.textAlign = "center";
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
    return span;
  });

  // Second pass — lock each span to its measured width, then scramble
  spans.forEach((span, i) => {
    const ch = chars[i];
    if (ch === " ") return;
    // Lock width to what the final character naturally occupies
    span.style.width = span.offsetWidth + "px";
    span.textContent = rChar(); // now start scrambled
  });

  // Animate each non-space span
  // Rightmost character (total - 1) starts at delay 0
  // Leftmost character (0) starts last
  chars.forEach((ch, i) => {
    if (ch === " ") return;

    const delay = (total - 1 - i) * stagger;

    gsap.to(
      {},
      {
        duration: scrambleDuration,
        delay,
        ease: "none",
        onUpdate() {
          spans[i].textContent = rChar();
        },
        onComplete() {
          spans[i].textContent = ch;
        },
      }
    );
  });
}

export default function ScrambleText() {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!h1Ref.current) return;
    decodeRightToLeft(h1Ref.current);
  }, []);

  return (
    <div className="scramble">
      <div className="scramble_header">
        <h1 ref={h1Ref}>Scramble Text</h1>
      </div>
    </div>
  );
}

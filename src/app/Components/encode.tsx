"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type EncodeDecodeOptions = {
  duration?: number;
  charset?: string;
  stagger?: number;
};

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function encodeDecodeText(
  el: HTMLElement,
  { duration = 1.2, charset = DEFAULT_CHARSET, stagger = 0.04 }: EncodeDecodeOptions = {}
) {
  const originalText = el.textContent || "";
  const letters = originalText.split("");

  el.innerHTML = "";

  const spans: HTMLSpanElement[] = [];

  letters.forEach((letter) => {
    const span = document.createElement("span");

    if (letter === " ") {
      span.innerHTML = "&nbsp;";
    }

    el.appendChild(span);
    spans.push(span);
  });

  spans.forEach((span, i) => {
    const finalChar = letters[i];
    if (finalChar === " ") return;

    const delay = (spans.length - 1 - i) * stagger; // ← reversed

    gsap.to(
      {},
      {
        duration,
        delay,
        ease: "none",
        onUpdate() {
          span.textContent = charset[Math.floor(Math.random() * charset.length)];
        },
        onComplete() {
          span.textContent = finalChar;
        },
      }
    );
  });
}

export const EncodeDecodeText: React.FC = () => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    encodeDecodeText(textRef.current, {
      duration: 1.4,
      stagger: 0.05,
    });
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        fontSize: "120px",
        fontWeight: 600,
        fontFamily: "sans-serif",
        letterSpacing: "0.05em",
      }}
    >
      <h1 ref={textRef}>FOREST IMAGE</h1>
    </div>
  );
};

export default EncodeDecodeText;

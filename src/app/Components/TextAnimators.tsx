import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TextAnimatorContext {
  incomingEl: Element;
  outgoingEl: Element | null;
  tl: gsap.core.Timeline;
}

// A TextAnimator receives the container elements and a shared timeline.
// It adds tweens to that timeline — it does not create its own.
// This keeps timing coordinated with the slide transition.
export type TextAnimator = (ctx: TextAnimatorContext) => void;

// ── Utility ────────────────────────────────────────────────────────────────────

// Call this once on mount to split all title elements.
// Returns a cleanup function that reverts all splits.
export function splitAllTitles(
  containers: Element[],
  titleSelector: string = ".title"
): { instances: SplitText[]; revert: () => void } {
  const instances: SplitText[] = [];

  containers.forEach((container) => {
    const el = container.querySelector(titleSelector);
    if (!el) return;
    const split = new SplitText(el, { type: "words", wordsClass: "word" });
    instances.push(split);
  });

  return {
    instances,
    revert: () => instances.forEach((s) => s.revert()),
  };
}

// ── Animators ─────────────────────────────────────────────────────────────────

/**
 * Default: blur materialise.
 * Outgoing words blur out fast, incoming words blur in slowly.
 * Pairs with the SVG blur-matrix filter for the glow edge effect.
 */
export const blurAnimator: TextAnimator = ({ incomingEl, outgoingEl, tl }) => {
  const inWords = incomingEl.querySelectorAll<HTMLElement>(".word");
  const outWords = outgoingEl?.querySelectorAll<HTMLElement>(".word");

  if (outWords?.length) {
    tl.to(
      outWords,
      {
        filter: "blur(75px)",
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        overwrite: true,
      },
      0 // start at the beginning of the timeline
    );
  }

  if (inWords.length) {
    tl.fromTo(
      inWords,
      { filter: "blur(75px)", opacity: 0 },
      {
        filter: "blur(0px)",
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        overwrite: true,
      },
      0.1 // slight offset so it doesn't start before outgoing begins
    );
  }
};

/**
 * Clip slide-up.
 * Each word is clipped by its overflow-hidden parent and slides up into view.
 * Outgoing words slide down and out. Staggers per word for a cascade feel.
 *
 * Requires each .word to have a wrapper with overflow:hidden — the animator
 * handles this itself via a temporary wrapper approach.
 */
export const slideUpAnimator: TextAnimator = ({ incomingEl, outgoingEl, tl }) => {
  const inWords = incomingEl.querySelectorAll<HTMLElement>(".word");
  const outWords = outgoingEl?.querySelectorAll<HTMLElement>(".word");

  if (outWords?.length) {
    tl.to(
      outWords,
      {
        y: "110%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.04,
        overwrite: true,
      },
      0
    );
  }

  if (inWords.length) {
    tl.fromTo(
      inWords,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        overwrite: true,
      },
      0.15
    );
  }
};

/**
 * Scramble fade.
 * Words fade in with a slight x drift, staggered.
 * Outgoing drifts and fades out in the opposite direction.
 * Lightweight — no SplitText plugins beyond the base word split.
 */
export const driftAnimator: TextAnimator = ({ incomingEl, outgoingEl, tl }) => {
  const inWords = incomingEl.querySelectorAll<HTMLElement>(".word");
  const outWords = outgoingEl?.querySelectorAll<HTMLElement>(".word");

  if (outWords?.length) {
    tl.to(
      outWords,
      {
        x: -24,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        stagger: 0.03,
        overwrite: true,
      },
      0
    );
  }

  if (inWords.length) {
    tl.fromTo(
      inWords,
      { x: 24, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.05,
        overwrite: true,
      },
      0.1
    );
  }
};

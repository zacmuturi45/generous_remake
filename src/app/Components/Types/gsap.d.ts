import { StaticImageData } from "next/image";
import { ReactNode, RefObject } from "react";

interface CommandMap {
  play: () => void;
  pause: () => void;
  restart: () => void;
  repeat: () => void;
  reverse: () => void;
}
type Command = keyof CommandMap;

interface CarouselItem {
  type: "image" | "video";
  src: string | StaticImageData;
  alt?: string;
  text?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoplayDuration?: number;
  transitionDuration?: number;
  lenis: any;
}

interface UseHoverAnimationOptions {
  cursorSize?: number;
  imageCycleInterval?: number;
  imageCount?: number;
  textSelector?: string;
  imageSelector?: string;
  textAnimationConfig?: gsap.TweenVars;
  imageAnimationConfig?: gsap.TweenVars;
  arrowAnimationConfig?: {
    out: gsap.TweenVars;
    in: gsap.TweenVars;
  };
  containerRef?: RefObject<HTMLDivElement | null>;
  cursorRef?: RefObject<HTMLDivElement | null>;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
}

interface HoverAnimationProps {
  children: (currentZ: number) => ReactNode;
  imageCount: number;
  textSelector?: string;
  imageSelector?: string;
  imageCycleInterval?: number;
  onVisibilityChange?: (visible: boolean, container?: Element) => void;
  textAnimationConfig?: gsap.TweenVars;
  imageAnimationConfig?: gsap.TweenVars;
  className?: string;
}

interface TrialCarouselItem {
  src: StaticImageData;
  alt: string;
  text: string;
  id: string;
}

interface TrialCarouselProps {
  items: TrialCarouselItem[];
  autoplayDuration?: number;
  transitionDuration?: number;
}

import { StaticImageData } from "next/image";

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

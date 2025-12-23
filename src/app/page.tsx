"use client";

import gsap from "gsap";
import "./css/index.css";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { vogue, vogue2, vogue3, vogue4 } from "../../public/assets";
import { CarouselItem } from "./Components/Types/gsap";
import { Carousel } from "./Components/carousel";

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const carouselItems: CarouselItem[] = [
    {
      type: "image",
      src: vogue,
      alt: "Mountain landscape",
      text: "Beware The Fountain",
    },
    {
      type: "image",
      src: vogue2,
      alt: "Forest path",
      text: "Mundo Deportivo",
    },
    {
      type: "image",
      src: vogue3,
      alt: "Ocean sunset",
      text: "Caliente Ferrari",
    },
    {
      type: "image",
      src: vogue4,
      alt: "Mountain peaks",
      text: "Sigrum Sipurum",
    },
    {
      type: "image",
      src: vogue,
      alt: "Mountain landscape",
      text: "Let It be",
    },
    {
      type: "image",
      src: vogue2,
      alt: "Forest path",
      text: "Cleora Falciporum",
    },
    {
      type: "image",
      src: vogue3,
      alt: "Ocean sunset",
      text: "Vindigo Montana",
    },
  ];

  useGSAP(() => {}, { scope: container });

  return (
    <div className="main_container" ref={container}>
      <Carousel items={carouselItems} />
    </div>
  );
}

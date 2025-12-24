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
      text: "Beware the fountain where dreams gather slowly and whispers guide travelers toward hidden truths",
    },
    {
      type: "image",
      src: vogue2,
      alt: "Forest path",
      text: "Mundo Deportivo explores passion discipline teamwork legacy moments that define legendary sporting excellence worldwide",
    },
    {
      type: "image",
      src: vogue3,
      alt: "Ocean sunset",
      text: "Caliente Ferrari represents speed precision Italian heritage engineering mastery and timeless automotive desire",
    },
    {
      type: "image",
      src: vogue4,
      alt: "Mountain peaks",
      text: "Sigrum Sipurum evokes mystery ancient symbols forgotten rituals and stories carried across generations",
    },
    {
      type: "image",
      src: vogue,
      alt: "Mountain landscape",
      text: "Let it be a quiet reminder that patience clarity and acceptance often unlock deeper peace",
    },
    {
      type: "image",
      src: vogue2,
      alt: "Forest path",
      text: "Cleora Falciporum sounds like an arcane spell echoing through forgotten libraries of lost empires",
    },
    {
      type: "image",
      src: vogue3,
      alt: "Ocean sunset",
      text: "This supporting text provides context balance clarity narrative flow and subtle emotional reinforcement",
    },
    {
      type: "image",
      src: vogue4,
      alt: "vogue image",
      text: "Supporting text here adds meaning perspective visual harmony and guides viewer attention effectively",
    },
  ];

  useGSAP(() => {}, { scope: container });

  return (
    <div className="main_container" ref={container}>
      <Carousel items={carouselItems} />
    </div>
  );
}

"use client";

import gsap from "gsap";
import "./css/index.css";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Image, { StaticImageData } from "next/image";
import {
  editorial1,
  editorial2,
  editorial3,
  editorial4,
  graph1,
  graph2,
  graph3,
  hm1,
  hm2,
  hm3,
  hm4,
  hm5,
  marble1,
  marble2,
  marble3,
  newton1,
  newton3,
  newtwon2,
  nyc1,
  nyc2,
  nyc3,
  office1,
  office2,
  office3,
  office4,
  t1,
  t2,
  t3,
  t4,
  t5,
  vine1,
  vine2,
  vine3,
  vogue,
  vogue2,
  vogue3,
  vogue4,
  whitearrow,
  wood1,
  wood3,
  zao1,
  zao2,
  zao3,
} from "../../public/assets";
import { CarouselItem } from "./Components/Types/gsap";
import { Carousel } from "./Components/carousel";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GTextWrapper from "./Components/GTextWrapper/gtextwrapper";
import { GSDevTools } from "gsap/GSDevTools";
import Button from "./Components/button";
import { HoverAnimation } from "./Components/hoverAnimation";
import { useRouter } from "next/navigation";
import CircularText from "./Components/spinning_text";
import { useLenis } from "./Components/lenis/LenisContext";
import { CarouselTwo } from "./Components/carouselTwo";

gsap.registerPlugin(ScrollTrigger, GSDevTools);

const imgArray = [editorial1, editorial2, editorial3, editorial4];
const imgArray2 = [newton1, newtwon2, newton3];
const imgArray3 = [zao1, zao2, zao3];
const imgArray4 = [vine1, vine2, vine3];
const imgArray5 = [marble1, marble2, marble3];
const threeImages = [
  { img1: nyc1, img2: nyc2, img3: nyc3, title: "Comet Meetings" },
  { img1: wood1, img2: nyc2, img3: wood3, title: "CEB" },
  { img1: graph1, img2: graph2, img3: graph3, title: "Centrakor" },
];

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const laMarque = useRef<HTMLDivElement>(null);
  const mainShaft = useRef<SVGPathElement>(null);
  const topShaft = useRef<SVGPathElement>(null);
  const bottomShaft = useRef<SVGPathElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGSVGElement>(null);
  const firstText = useRef<HTMLParagraphElement>(null);
  const secondText = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const thirdText = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);
  const router = useRouter();
  const cursorTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const { lenis } = useLenis();

  // Set this to true after your transition completes
  useEffect(() => {
    const timer = setTimeout(() => setTransitionComplete(true), 1500); // Match your transition duration
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true, repeat: -1 });
    const c1 = document.querySelector(".c1");
    const c2 = document.querySelector(".c2");

    if (!c1 || !c2) return;

    tl.to(".c2", {
      xPercent: 120,
      duration: 0.5,
      ease: "power2.in",
      delay: 1,
    }).to(
      ".c1",
      {
        x: 0,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.1"
    );

    cursorTimelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!cursorTimelineRef.current) return;

    if (cursorVisible) {
      cursorTimelineRef.current.play();
    } else {
      cursorTimelineRef.current.pause();
      gsap.set([".c1", ".c2"], { clearProps: "all" });
    }
  }, [cursorVisible]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const size = 96;
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX - size / 2}px`;
      cursor.style.top = `${e.clientY - size / 2}px`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // // Text Animation
  let xPercent = 0;
  let direction = -1;

  useGSAP(() => {
    if (!transitionComplete) return;

    gsap.set([firstText.current, secondText.current, thirdText.current], {
      yPercent: 100,
    });

    gsap.to([firstText.current, secondText.current, thirdText.current], {
      yPercent: 0,
      ease: "power3.inOut",
      duration: 1.3,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".marquee",
        start: "top 90%",
        once: true,
      },
    });
  }, [transitionComplete]);

  useGSAP(() => {
    // Create a ScrollTrigger that controls the marquee direction
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        // Set direction based on scroll direction
        direction = self.direction;
      },
    });
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (xPercent <= -100) {
        xPercent = 0;
      } else if (xPercent > 0) {
        xPercent = -100;
      }
      gsap.set(firstText.current, { xPercent: xPercent });
      gsap.set(secondText.current, { xPercent: xPercent });
      gsap.set(thirdText.current, { xPercent: xPercent });
      xPercent += 0.15 * direction;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Add cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // // Arrow SVG Animation
  useGSAP(() => {
    if (!transitionComplete) return;

    const tl = gsap.timeline({ paused: true });
    const mainLength = mainShaft.current?.getTotalLength();
    const topLength = topShaft.current?.getTotalLength();
    const textboxes = gsap.utils.toArray(".fades");
    textboxes.forEach((box) => {
      const textbox = box as HTMLElement;
      gsap.to(textbox, {
        opacity: 0.05,
        transformOrigin: "top center",
        ease: "none",
        duration: 2,
        scrollTrigger: {
          trigger: textbox,
          start: "top 35%",
          end: "top 25%",
          scrub: true,
        },
      });
    });

    tl.fromTo(
      mainShaft.current,
      {
        strokeDasharray: mainLength,
        strokeDashoffset: mainLength!,
      },
      {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "circ.inOut",
      },
      0
    );

    tl.fromTo(
      [topShaft.current, bottomShaft.current],
      {
        strokeDasharray: topLength,
        strokeDashoffset: topLength!,
      },
      {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: "none",
      },
      0.5
    );

    // Trigger arrow animation when it comes into view
    ScrollTrigger.create({
      trigger: "#orangeArrow",
      start: "top 88%",
      end: "top 88%",
      animation: tl,
      onEnter: () => tl.play(),
      onEnterBack: () => tl.reverse(),
    });

    // GSDevTools.create({ animation: tl });
  }, [transitionComplete]);

  // CAROUSEL ARRAY ITEMS
  const carouselItems: CarouselItem[] = [
    {
      type: "image",
      src: hm1,
      alt: "Mountain landscape",
      text: "Beware the fountain where dreams gather slowly and whispers guide travelers toward hidden truths",
    },
    {
      type: "image",
      src: hm2,
      alt: "Forest path",
      text: "Mundo Deportivo explores passion discipline teamwork legacy moments that define legendary sporting excellence worldwide",
    },
    {
      type: "image",
      src: hm3,
      alt: "Ocean sunset",
      text: "Caliente Ferrari represents speed precision Italian heritage engineering mastery and timeless automotive desire",
    },
    {
      type: "image",
      src: hm4,
      alt: "Nusa Dua",
      text: "Sigrum Sipurum evokes mystery ancient symbols forgotten rituals and stories carried across generations",
    },
    {
      type: "image",
      src: hm5,
      alt: "Mountain landscape",
      text: "Let it be a quiet reminder that patience clarity and acceptance often unlock deeper peace",
    },
    {
      type: "image",
      src: hm1,
      alt: "Forest path",
      text: "Cleora Falciporum sounds like an arcane spell echoing through forgotten libraries of lost empires",
    },
    {
      type: "image",
      src: hm2,
      alt: "Ocean sunset",
      text: "This supporting text provides context balance clarity narrative flow and subtle emotional reinforcement",
    },
    {
      type: "image",
      src: hm3,
      alt: "vogue image",
      text: "Supporting text here adds meaning perspective visual harmony and guides viewer attention effectively",
    },
  ];

  // HERO PARALLAX & DARK OVERLAY
  useGSAP(
    () => {
      gsap.to(".hero_carousel_container", {
        y: 200,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero_section",
          start: "top top",
          end: "bottom 10%",
          scrub: 1,
        },
      });

      gsap.to(".overlay", {
        background: "rgb(0, 0, 0, 1)",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero_section",
          start: "top top",
          end: "bottom 20%",
          scrub: 1,
        },
      });
    },
    { scope: container }
  );

  // LA MARQUE SPLIT UP & BOX PARALLAX
  useGSAP(() => {
    const splitUp = gsap.utils.toArray(".split_up");
    const px = gsap.utils.toArray(".px");

    if (!splitUp) return;

    gsap.to([splitUp], {
      y: 0,
      ease: "circ.inOut",
      duration: 1.3,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".la__marque",
        start: "top 90%",
        once: true,
      },
    });

    // BOX PARALLAX EFFECT
    px.forEach((img) => {
      const image = img as HTMLImageElement;
      gsap.to(image, {
        top: 0,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
  });

  return (
    <div className="main_container" ref={container}>
      <div
        ref={cursorRef}
        className={`custom-cursor`}
        style={{
          scale: cursorVisible ? 1 : 0,
          transition: "scale 0.5s cubic-bezier(0.78, 0, 0.22, 1)",
        }}
      >
        <Image src={whitearrow} width={36} height={36} alt="svg_arrow" className="c1" />
        <Image src={whitearrow} width={36} height={36} alt="svg_arrow" className="c2" />
      </div>
      <section className="hero_section">
        <div className="overlay" />
        <div className="hero_carousel_container">
          {/* <Carousel lenis={lenis} items={carouselItems} /> */}
          <CarouselTwo lenis={lenis} items={carouselItems} />
          <div className="circular__text_container">
            {/* <CircularText
              lenis={lenis}
              rotatingText="* SCROLL * SCROLL * SCROLL * SCROLL"
              backgroundColor="rgb(255, 255, 255)"
              direction={1}
              d1="M 75 55 L 75 95 C 75.15 84.5 84 74 88 78"
              d2="M 75 55 L 75 95 C 74.85 84.5 66 74 62 78"
              scrollTarget={"next-section"}
            /> */}
          </div>
        </div>
      </section>

      <section id="about" className="about" ref={laMarque}>
        <div className="la__marque">
          <div className="line">
            <span className="split_up">LA MARQUE</span>
          </div>
          <div className="line au__coeur">
            <span className="split_up">AU COEUR</span>
            <div className="la__marque_svg split_up">
              <svg viewBox="0 0 24 24" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g>
                    {" "}
                    <path fill="none" d="M0 0h24v24H0z"></path>{" "}
                    <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3c1.82 0 3.413.973 4.288 2.428l-1.714 1.029A3 3 0 1 0 12 15a2.998 2.998 0 0 0 2.573-1.456l1.715 1.028A4.999 4.999 0 0 1 7 12c0-2.76 2.24-5 5-5z"></path>{" "}
                  </g>{" "}
                </g>
              </svg>

              <svg viewBox="0 0 16 16" fill="none">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
                    fill="#000000"
                  ></path>{" "}
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="wipe__inText">
          <div className="textbox_one text_box">
            <p className="fades fd">La marque au cœur de la</p>

            <p className="fades fd">stratégie, de l&apos;identité,</p>

            <GTextWrapper
              svgRef={dotRef}
              containsSvg={true}
              transitionComplete={transitionComplete}
            >
              <p className="fades">
                du design
                <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                  <svg ref={dotRef} id="dot" viewBox="0 0 16 16" fill="none">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <circle cx="8" cy="8" r="8" fill="#000000"></circle>
                    </g>
                  </svg>
                </span>{" "}
                Pour
              </p>
            </GTextWrapper>

            <GTextWrapper>
              <p className="fades">Generous c&apos;est la</p>
            </GTextWrapper>

            <GTextWrapper>
              <p className="fades">conjugaison de tous les</p>
            </GTextWrapper>

            <GTextWrapper>
              <p className="fades">marqueurs qui fait</p>
            </GTextWrapper>

            <GTextWrapper
              svgRef={heartRef}
              containsSvg={true}
              transitionComplete={transitionComplete}
            >
              <p className="fades">
                battre le coeur{" "}
                <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                  <svg ref={heartRef} id="heart" viewBox="0 0 16 16" fill="none">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
                        fill="#000000"
                      ></path>
                    </g>
                  </svg>
                </span>{" "}
                de la
              </p>
            </GTextWrapper>

            <GTextWrapper>
              <p>marque.</p>
            </GTextWrapper>
          </div>

          <div className="textbox_two text_box">
            <GTextWrapper containsArrow={true} transitionComplete={transitionComplete}>
              <p id="arrow__p">
                <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                  <svg
                    id="orangeArrow"
                    width={24}
                    height={24}
                    viewBox="0 0 41 28.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      ref={mainShaft}
                      fill="none"
                      stroke="#ea5b0c"
                      strokeWidth="3"
                      d="M0 14.9H41"
                    />

                    <path
                      ref={topShaft}
                      fill="none"
                      stroke="#ea5b0c"
                      strokeWidth="3"
                      d="M41 14.9c-10.8 0-18.6-9.7-18.6-14.9"
                    />

                    <path
                      ref={bottomShaft}
                      fill="none"
                      stroke="#ea5b0c"
                      strokeWidth="3"
                      d="M41 14.8c-10 0-18.7 9-18.7 13.7"
                    />
                  </svg>
                </span>
                Faire de l&apos;experience
              </p>
            </GTextWrapper>

            <GTextWrapper>
              <p>une marque de fabrique</p>
            </GTextWrapper>

            <GTextWrapper>
              <p>et generer beaucoup</p>
            </GTextWrapper>

            <GTextWrapper>
              <p>d&apos;emotion</p>
            </GTextWrapper>
            <div className="wipe__button">
              <Button />
            </div>
          </div>
        </div>
      </section>
      <div className="marquee">
        <div ref={textRef} className="marquee__text">
          <p ref={firstText}>
            WORK <span></span>
          </p>
          <p ref={secondText}>
            WORK <span></span>
          </p>
          <p ref={thirdText}>
            WORK <span></span>
          </p>
        </div>
      </div>

      <HoverAnimation
        imageCount={imgArray.length}
        imageSelector=".editorial"
        onVisibilityChange={setCursorVisible}
        className="mitwit"
        transitionComplete={transitionComplete}
      >
        {(currentZ) => (
          <>
            <div className="box3_box1">
              <div className="text_box">
                <h4>Tardy Decor</h4>
                <p className="tardy">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, odit deleniti,
                  ullam deserunt aspernatur ipsam reiciendis laudantium architecto earum, facere
                </p>
              </div>
              <div className="img_box">
                {imgArray.map((img, i) => (
                  <Image
                    key={`editorial${i}`}
                    src={img}
                    width={80}
                    height={80}
                    className="px editorial"
                    alt={`editorial${i + 1}`}
                    unoptimized
                    style={currentZ === i ? { zIndex: 2 } : { zIndex: 1 }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </HoverAnimation>

      <div className="zao__section">
        <HoverAnimation
          imageCount={imgArray2.length}
          imageSelector=".newtonImage"
          onVisibilityChange={setCursorVisible}
          className="zaoMain zaoOne"
          transitionComplete={transitionComplete}
        >
          {(currentZ) => (
            <>
              <div className="img_box">
                {imgArray2.map((img, i) => (
                  <Image
                    key={`newton${i}`}
                    src={img}
                    width={80}
                    height={80}
                    className="px newtonImage"
                    alt={`newton${i + 1}`}
                    unoptimized
                    style={currentZ === i ? { zIndex: 2 } : { zIndex: 1 }}
                  />
                ))}
              </div>
              <div className="zao_textboxOne">
                <h4>Newton Offices</h4>
                <p className="zao_p">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, odit deleniti,
                  ullam deserunt aspernatur ipsam reiciendis laudantium architecto earum, facere
                </p>
              </div>
            </>
          )}
        </HoverAnimation>

        <HoverAnimation
          imageCount={imgArray3.length}
          imageSelector=".zaoImage"
          onVisibilityChange={setCursorVisible}
          className="zaoMain zaoTwo"
          transitionComplete={transitionComplete}
        >
          {(currentZ) => (
            <>
              <div className="zao">
                <div className="img_box">
                  {imgArray3.map((img, i) => (
                    <Image
                      key={`zao${i}`}
                      src={img}
                      width={80}
                      height={80}
                      className="px zaoImage"
                      alt={`zao${i + 1}`}
                      unoptimized
                      style={currentZ === i ? { zIndex: 2 } : { zIndex: 1 }}
                    />
                  ))}
                </div>
                <div className="zao_textboxOne">
                  <h4>Newton Offices</h4>
                  <p className="zao_pTwo">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, odit deleniti,
                    ullam deserunt aspernatur ipsam reiciendis laudantium architecto earum
                  </p>
                </div>
              </div>
            </>
          )}
        </HoverAnimation>
      </div>

      <div className="three_images">
        <div className="three_images_container">
          {threeImages.map((imgObj, i) => (
            <HoverAnimation
              imageCount={3}
              imageSelector={`.threeImg${imgObj.title.slice(0, 2)}`}
              key={i}
              onVisibilityChange={setCursorVisible}
              className="three"
              transitionComplete={transitionComplete}
            >
              {(currentZ) => (
                <>
                  <div className="threeImgBox" onClick={() => router.push("./trial")}>
                    <Image
                      src={imgObj.img1}
                      width={80}
                      height={80}
                      alt="image"
                      className={`px threeImg threeImg${imgObj.title.slice(0, 2)}`}
                      unoptimized
                      style={currentZ === 0 ? { zIndex: 2 } : { zIndex: 1 }}
                    />
                    <Image
                      src={imgObj.img2}
                      width={80}
                      height={80}
                      alt="image"
                      className={`px threeImg threeImg${imgObj.title.slice(0, 2)}`}
                      unoptimized
                      style={currentZ === 1 ? { zIndex: 2 } : { zIndex: 1 }}
                    />
                    <Image
                      src={imgObj.img3}
                      width={80}
                      height={80}
                      alt="image"
                      className={`px threeImg threeImg${imgObj.title.slice(0, 2)}`}
                      unoptimized
                      style={currentZ === 2 ? { zIndex: 2 } : { zIndex: 1 }}
                    />
                  </div>

                  <div className="threeTextBox">
                    <h4>{imgObj.title}</h4>
                    <p className="three">
                      {" "}
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, odit deleniti,
                      ullam deserunt aspernatur ipsam reiciendis laudantium architecto earum, facere
                    </p>
                  </div>
                </>
              )}
            </HoverAnimation>
          ))}
        </div>
      </div>

      <div className="zao__section">
        <HoverAnimation
          imageCount={imgArray4.length}
          imageSelector=".zaoImage"
          onVisibilityChange={setCursorVisible}
          className="zaoMain zaoTwo"
          transitionComplete={transitionComplete}
        >
          {(currentZ) => (
            <>
              <div className="zao">
                <div className="img_box">
                  {imgArray4.map((img, i) => (
                    <Image
                      key={`zao${i}`}
                      src={img}
                      width={80}
                      height={80}
                      className="px zaoImage"
                      alt={`zao${i + 1}`}
                      unoptimized
                      style={currentZ === i ? { zIndex: 2 } : { zIndex: 1 }}
                    />
                  ))}
                </div>
                <div className="zao_textboxOne">
                  <h4>Ad Vini</h4>
                  <p className="zao_pTwo">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, odit deleniti,
                    ullam deserunt aspernatur ipsam reiciendis laudantium architecto earum, facere
                    distinctio nisi expedita veritatis? Veritatis quia quam iste ipsa non!
                  </p>
                </div>
              </div>
            </>
          )}
        </HoverAnimation>

        <HoverAnimation
          imageCount={imgArray5.length}
          imageSelector=".newtonImage"
          onVisibilityChange={setCursorVisible}
          className="zaoMain zaoOne"
          transitionComplete={transitionComplete}
        >
          {(currentZ) => (
            <>
              <div className="img_box">
                {imgArray5.map((img, i) => (
                  <Image
                    key={`newton${i}`}
                    src={img}
                    width={80}
                    height={80}
                    className="px newtonImage"
                    alt={`newton${i + 1}`}
                    unoptimized
                    style={currentZ === i ? { zIndex: 2 } : { zIndex: 1 }}
                  />
                ))}
              </div>
              <div className="zao_textboxOne">
                <h4>Club Francais du Vin</h4>
                <p className="zao_p">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, odit deleniti,
                  ullam deserunt aspernatur ipsam reiciendis laudantium architecto earum, facere
                  distinctio nisi expedita veritatis? Veritatis quia quam iste ipsa non!
                </p>
              </div>
            </>
          )}
        </HoverAnimation>
      </div>

      <div className="lastLast">
        <HoverAnimation
          imageCount={3}
          imageSelector=".lastImage"
          onVisibilityChange={setCursorVisible}
          className="lastSection"
          transitionComplete={transitionComplete}
        >
          {(currentZ) => (
            <>
              <div className="lastImgBox">
                {imgArray.map((img, i) => (
                  <Image
                    src={img}
                    width={80}
                    height={80}
                    alt={`img_${i}`}
                    unoptimized
                    key={i}
                    className="px lastImage"
                    style={currentZ === i ? { zIndex: 2 } : { zIndex: 1 }}
                  />
                ))}
              </div>
              <div className="lastTextBox">
                <h4>Ad Nauseam</h4>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, asperiores rerum.
                  Facilis sint, velit suscipit laboriosam similique consectetur tempore commodi.
                </p>
              </div>
            </>
          )}
        </HoverAnimation>
      </div>
    </div>
  );
}

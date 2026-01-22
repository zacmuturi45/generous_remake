"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { arrow, plus } from "../../../public/assets";
import gsap from "gsap";
import CircularText from "./spinning_text";
import AnimatedLink from "./footerArrow";
import { useGSAP } from "@gsap/react";

const marquee1 = ["Comet", "Extia", "Advini", "Caliceo"];
const marquee2 = ["Kilo Shop", "LOreal", "Tailor Corner", "Les Fermes De Gally", "Newton Offices"];
const marquee3 = ["Vignobles De La Vallée Du Rhône", "Wellpharma", "Revol"];

export default function Footer() {
  const mq1Ref = useRef<HTMLDivElement>(null);
  const mq2Ref = useRef<HTMLDivElement>(null);
  const mq3Ref = useRef<HTMLDivElement>(null);
  const bonjourRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const creds = document.querySelector(".creditsMain");
      const credits = document.querySelectorAll(".flipCredits");
      const container = creditsRef.current;
      if (!creds || !credits || !container) return;
      const tl = gsap.timeline({ paused: true });
      gsap.set(credits, { yPercent: 90 });

      tl.to(creds, { opacity: 0 }).to(credits, {
        yPercent: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power3.inOut",
        stagger: 0.1,
      });

      container.addEventListener("mouseenter", () => tl.play());
      container.addEventListener("mouseleave", () => tl.reverse());

      return () => {
        container.removeEventListener("mouseenter", () => tl.play());
        container.removeEventListener("mouseleave", () => tl.reverse());
      };
    },
    { scope: creditsRef }
  );

  useGSAP(
    () => {
      const lines = bonjourRef.current?.querySelectorAll(".line");
      const container = bonjourRef.current;
      const bin = container?.querySelectorAll(".bin");
      if (!lines || !container) return;

      gsap.set(lines, { transformOrigin: "right center" });

      const handleMouseEnter = () => {
        // Kill any ongoing animations on these elements
        gsap.killTweensOf(lines);

        gsap.to(lines, {
          width: "100%",
          duration: 0.5,
          ease: "circ.inOut",
          stagger: 0.3,
        });
      };

      const handleMouseLeave = () => {
        // Kill any ongoing animations on these elements
        gsap.killTweensOf(lines);

        // Create a fresh timeline for the exit animation
        const tl = gsap.timeline();
        tl.to(lines, {
          xPercent: 100,
          duration: 0.3,
          ease: "power3.inOut",
          stagger: 0.1,
        }).set(lines, { width: 0, xPercent: 0 });
      };

      bin?.forEach((bn) => {
        bn.addEventListener("mouseenter", handleMouseEnter);
        bn.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          bn.removeEventListener("mouseenter", handleMouseEnter);
          bn.removeEventListener("mouseleave", handleMouseLeave);
          gsap.killTweensOf(lines);
        };
      });
    },
    { scope: bonjourRef }
  );

  useEffect(() => {
    const line1 = mq1Ref.current;
    const line2 = mq2Ref.current;
    const line3 = mq3Ref.current;

    if (!line1 || !line2 || !line3) return;

    const line1Texts = line1.querySelectorAll(".ftOne");
    const line2Texts = line2.querySelectorAll(".ftTwo");
    const line3Texts = line3.querySelectorAll(".ftThree");

    let xPercent1 = 0;
    const animate1 = () => {
      if (xPercent1 <= -100) {
        xPercent1 = 0;
      } else if (xPercent1 >= 100) {
        xPercent1 = -100;
      }
      gsap.set(line1Texts, { xPercent: xPercent1 });
      xPercent1 -= 0.05;
      requestAnimationFrame(animate1);
    };

    let xPercent2 = 0;
    const animate2 = () => {
      if (xPercent2 >= 0) {
        xPercent2 = -100;
      } else if (xPercent2 <= -100) {
        xPercent2 = 0;
      }
      gsap.set(line2Texts, { xPercent: xPercent2 });
      xPercent2 += 0.01;
      requestAnimationFrame(animate2);
    };

    let xPercent3 = 0;
    const animate3 = () => {
      if (xPercent3 <= -100) {
        xPercent3 = 0;
      } else if (xPercent3 >= 100) {
        xPercent3 = -100;
      }
      gsap.set(line3Texts, { xPercent: xPercent3 });
      xPercent3 -= 0.015;
      requestAnimationFrame(animate3);
    };

    const frame1 = requestAnimationFrame(animate1);
    const frame2 = requestAnimationFrame(animate2);
    const frame3 = requestAnimationFrame(animate3);

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      cancelAnimationFrame(frame3);
    };
  }, []);

  return (
    <section className="footer_main">
      <div className="footerMarquee">
        <div className="mq1 mq" ref={mq1Ref}>
          <div className="ftOne mqItem">
            {marquee1.map((item, i) => (
              <div key={i} className="mqItem">
                <p>{item}</p>
                <Image src={plus} width={80} height={80} alt="plus" className="plus" />
              </div>
            ))}
          </div>
          <div className="ftOne mqItem">
            {marquee1.map((item, i) => (
              <div key={i} className="mqItem">
                <p>{item}</p>
                <Image src={plus} width={80} height={80} alt="plus" className="plus" />
              </div>
            ))}
          </div>
        </div>
        <div className="mq2 mq" ref={mq2Ref}>
          <div className="ftTwo mqItem">
            {marquee2.map((item, i) => (
              <div key={i} className="mqItem">
                <p>{item}</p>
                <Image src={plus} width={80} height={80} alt="plus" className="plus" />
              </div>
            ))}
          </div>
          <div className="ftTwo mqItem">
            {marquee2.map((item, i) => (
              <div key={i} className="mqItem">
                <p>{item}</p>
                <Image src={plus} width={80} height={80} alt="plus" className="plus" />
              </div>
            ))}
          </div>
        </div>
        <div className="mq1 mq" ref={mq3Ref}>
          <div className="ftThree mqItem">
            {marquee3.map((item, i) => (
              <div key={i} className="mqItem">
                <p>{item}</p>
                <Image src={plus} width={80} height={80} alt="plus" className="plus" />
              </div>
            ))}
          </div>
          <div className="ftThree mqItem">
            {marquee3.map((item, i) => (
              <div key={i} className="mqItem">
                <p>{item}</p>
                <Image src={plus} width={80} height={80} alt="plus" className="plus" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footerSectionTwo">
        <div className="footerSectionTwoContainer">
          <div className="sectOne">
            <div className="sectOneMenu">
              <div className="menu__one">
                <div>
                  <span>Menu</span>
                </div>
                <div className="menu_items">
                  <div>
                    <AnimatedLink text="Work" />
                  </div>
                  <div>
                    <AnimatedLink text="Vision" />
                  </div>
                  <div>
                    <AnimatedLink text="L'Agence" />
                  </div>
                  <div>
                    <AnimatedLink text="Contact" />
                  </div>
                </div>
              </div>
              <div className="menu__two">
                <span>Nous suivre</span>
                <div>
                  <AnimatedLink text="Instagram" className="fortyFive" />
                </div>
                <div>
                  <AnimatedLink text="Linkedin" className="fortyFive" />
                </div>
              </div>
            </div>

            <div className="sectOneBonjour" ref={bonjourRef}>
              <div>
                <p className="bin">Niaje@</p>
                <div className="line"></div>
              </div>
              <div>
                <p className="bin">builtinnairobi.com</p>
                <div className="line"></div>
              </div>
            </div>
            <div className="sectOneAddress">
              <span>Address</span>
              <AnimatedLink text="Europa Towers - Westlands, Nairobi" className="fortyFive" />
              <span>Telephone</span>
              <p>+254 707 486 258</p>
            </div>
            <div className="sectOneCredits">
              <AnimatedLink text="Legal" />
              <AnimatedLink text="Cookie Policy" />
              <div className="credits" ref={creditsRef}>
                <p style={{ color: "rgb(91, 91, 91)" }}>
                  :
                  <span className="creditsMain" style={{ color: "rgb(255, 255, 255)" }}>
                    Credits
                  </span>
                </p>
                <div className="flipContainer">
                  <p className="flipCredits">
                    <span>Art Direction</span>
                    <span className="to">Gichuhi Isaac</span>
                  </p>
                  <p className="flipCredits">
                    <span>Design</span>
                    <span className="to">Gichuhi Isaac</span>
                  </p>
                  <p className="flipCredits">
                    <span>Development</span>
                    <span className="to">Gichuhi Isaac</span>
                  </p>
                </div>
              </div>
              <p style={{ color: "rgb(91, 91, 91)" }}>©BuiltInNairobi</p>
            </div>
          </div>

          <div className="sectTwo">
            <CircularText />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GSDevTools } from "../GSAP/gsap_plugins";
import { useScrollLock } from "./scrollLock";

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUp, setIsUp] = useState(false);
  const lastScrollY = useRef<number>(0);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const preRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const menuTextRef = useRef<HTMLHeadingElement>(null); // Add ref for Menu text

  useScrollLock(isPanelActive);

  const linkArray = [
    { link: "Work", id: "ln12", href: "/" },
    { link: "Vision", id: "ln22", href: "/" },
    { link: "L'agence", id: "ln32", href: "/" },
    { link: "Contact", id: "ln42", href: "/" },
  ];

  useEffect(() => {
    if (isPanelActive) {
      // Opening animation
      const tl = gsap.timeline();

      tl.set(menuTextRef.current, { x: 80 })
        .fromTo(
          preRef.current,
          {
            x: "100%",
            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 33% 100%)", // Fully clipped
          },
          {
            x: "0%",
            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)", // Partially revealed
            duration: 1.8,
            ease: "expo.inOut",
          }
        )
        // Add Menu text animation with inertia effect
        .fromTo(
          menuTextRef.current,
          {
            x: 80, // Start from the right
            opacity: 0.5,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1.5,
            ease: "back.out(1.2)", // This creates the overshoot/inertia effect
          },
          "-=0.6" // Start slightly after the panel begins moving
        )
        .fromTo(
          afterRef.current,
          {
            x: "100%",
            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 21% 100%)", // Same as preRef's end state
          },
          {
            x: "0%",
            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)", // Fully revealed
            duration: 1.8,
            ease: "expo.inOut",
          },
          "-=1.5"
        );
    } else {
      // Closing animation - add text fade out with momentum
      const tl = gsap.timeline();

      // Animate menu text out first with inertia
      tl.to(menuTextRef.current, {
        x: -60,
        opacity: 0,
        skewX: -10,
        duration: 0.8,
        ease: "power3.in",
      })
        .to(
          afterRef.current,
          {
            x: "100%",
            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 21% 100%)", // Back to angled
            duration: 1.75,
            ease: "power4.in",
          },
          "-=0.2"
        )
        .to(
          preRef.current,
          {
            x: "100%",
            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 100% 100%)", // Fully clipped
            duration: 1.75,
            ease: "power4.in",
          },
          "-=0.4"
        );
    }
  }, [isPanelActive]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolling up or down
      if (currentScrollY > lastScrollY.current) {
        console.log(`last: ${lastScrollY.current}, current: ${currentScrollY}`);
        // Scrolling down
        setIsUp(true);
      } else {
        // Scrolling up
        setIsUp(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, selector = ".linkline") => {
    const line = e.currentTarget.querySelector(selector);
    gsap.to(line, {
      left: "0%",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>, selector = ".linkline") => {
    const line = e.currentTarget.querySelector(selector);
    gsap.to(line, {
      left: "100%",
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(line, { left: "-100%" });
      },
    });
  };

  return (
    <div className={`navbar ${isUp || isPanelActive ? "navbarUp" : ""}`} ref={containerRef}>
      <div className="whitediv" />

      {isPanelActive && (
        <div className="mobileNavMenu">
          <div className="mobileNavMenu__pre pre" ref={preRef}>
            <h4 ref={menuTextRef}>Menu</h4> {/* Add ref here */}
          </div>
          <div className="mobileNavMenu__after pre" ref={afterRef}>
            <div className="afterContainer">
              <div className="afterContainer__one">
                <h4>Menu</h4>
              </div>
              <div className="afterContainer__two">
                {linkArray.map((link, i) => (
                  <div key={link.id} className="afterContainer__links">
                    <div className="linkLink">
                      <Link
                        href={link.href}
                        className="afterLinks"
                        onMouseEnter={(e) => handleMouseEnter(e, ".linklater")}
                        onMouseLeave={(e) => handleMouseLeave(e, ".linklater")}
                      >
                        {link.link}
                        <span className={`linklater ${isUp ? "linkblack" : ""}`}></span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="copyright">© Built In Nairobi 2026</div>
            </div>
          </div>
        </div>
      )}
      <div className="navContainer">
        <div className="logo">
          <h4>Carousel</h4>
        </div>

        <div className="nav_links_container">
          <div className="main_nav_links">
            {linkArray.map((link) => (
              <div key={link.id} className="link_div">
                <Link
                  href={link.href}
                  className="nav_links"
                  onMouseEnter={(e) => handleMouseEnter(e, ".linkline")}
                  onMouseLeave={(e) => handleMouseLeave(e, ".linkline")}
                >
                  {link.link}
                  <span className={`linkline ${isUp ? "linkblack" : ""}`}></span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mobilenav">
            <h4 onClick={() => setIsPanelActive(!isPanelActive)}>
              {isPanelActive ? "Close" : "Menu"}{" "}
              <span className={`mobilenavline ${isPanelActive ? "mobilenavlineblack" : ""}`}></span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

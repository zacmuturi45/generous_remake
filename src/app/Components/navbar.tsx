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
  const [isPanelVisible, setIsPanelVisible] = useState(false); // Add this state to control visibility
  const preRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const menuTextRef = useRef<HTMLHeadingElement>(null); // Add ref for Menu text
  const afterCont = useRef<HTMLDivElement>(null);
  const [playNavAnimation, setPlayNavAnimation] = useState<boolean>(false);

  // Hamburger refs
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useScrollLock(isPanelActive);

  const linkArray = [
    { link: "Work", id: "ln12", href: "/" },
    { link: "Vision", id: "ln22", href: "/" },
    { link: "L'agence", id: "ln32", href: "/" },
    { link: "Contact", id: "ln42", href: "/" },
  ];

  const handlePanelClose = () => {
    setIsPanelActive(false);
    // We don't immediately hide the panel - let the animation play first
  };

  useEffect(() => {
    if (isPanelActive) {
      // Show the panel first
      setIsPanelVisible(true);
      const mobNav = document.querySelector(".mobileNavMenu");
      const gl = gsap.timeline();
      // Step 1: Scale out hamburger bars (top first, then bottom)
      gl.to(topBarRef.current, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.3,
        ease: "power2.inOut",
      }).to(
        bottomBarRef.current,
        {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.3,
          ease: "power2.inOut",
        },
        "-=0.15"
      ); // Stagger by starting 0.15s before previous ends

      // Use a small timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const motionNavs = document.querySelectorAll(".motionNav");
        const tl = gsap.timeline();
        gsap.set(mobNav, { opacity: 1 });

        // Step 2: Menu slides in
        tl.set(menuTextRef.current, { x: 80 })
          .set([motionNavs], { x: 200, opacity: 0 }) // Set BOTH x and opacity
          .fromTo(
            preRef.current,
            {
              x: "100%",
              clipPath: "polygon(0 0, 100% 0%, 100% 100%, 33% 100%)", // Fully clipped
            },
            {
              x: "0%",
              clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)", // Partially revealed
              duration: 1.5,
              ease: "power4.inOut",
            }
          )
          // Add Menu text animation with inertia effect
          .fromTo(
            menuTextRef.current,
            {
              x: 100, // Start from the right
              opacity: 0.5,
            },
            {
              x: 0,
              opacity: 1,
              duration: 1.6,
              ease: "power2.out", // This creates the overshoot/inertia effect
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
              ease: "power4.inOut",
            },
            "-=1.8"
          )
          // Animate x position first (without opacity)
          .to(
            [motionNavs],
            {
              x: 0,
              duration: 3,
              ease: "power2.out",
              stagger: 0.07,
            },
            "-=1.7"
          )
          // Then animate opacity separately with different stagger
          .to(
            [motionNavs],
            {
              opacity: 0.8,
              duration: 1,
              ease: "power2.out",
              stagger: {
                each: 0.08, // Larger stagger for opacity (top to bottom)
                from: "start", // First element starts first
              },
            },
            "-=2.3" // Start slightly after x animation begins
          )
          // Step 3: After menu is fully in, animate X bars
          // Transform hamburger bars into X
          .set(
            [topBarRef.current, bottomBarRef.current],
            {
              backgroundColor: "rgb(0, 0, 0)",
              top: "50%",
              transformOrigin: "top center",
            },
            "-=2"
          )
          .fromTo(
            topBarRef.current,
            {
              scaleX: 0,
              rotation: 45,
            },
            {
              scaleX: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=1.8"
          )
          .fromTo(
            bottomBarRef.current,
            {
              scaleX: 0,
              rotation: -45,
            },
            {
              scaleX: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=2" // Stagger the second bar
          );
      }, 450);

      return () => clearTimeout(timer);
    } else if (isPanelVisible) {
      // Panel is visible but active state is false - play closing animation
      const motionNavs = document.querySelectorAll(".motionNav");

      // Closing animation - add text fade out with momentum
      const tl = gsap.timeline({
        onComplete: () => {
          // After animation completes, hide the panel from DOM
          setIsPanelVisible(false);
          gsap.set([topBarRef.current, bottomBarRef.current], {
            rotation: 0,
            backgroundColor: "#fff",
            transformOrigin: "left center",
          });
          // Reset hamburger bars to original state
          gsap.to([topBarRef.current, bottomBarRef.current], {
            scaleX: 1,
            backgroundColor: "#fff",
            stagger: 0.2,
          });
          gsap.set(topBarRef.current, { top: "20px" });
        },
      });

      // Step 1: Prepare preRef to cover afterRef
      // Reset preRef to its starting position (fully clipped from LEFT)
      // Animate X bars out
      tl.to([topBarRef.current, bottomBarRef.current], {
        scaleX: 0,
        duration: 0.3,
        ease: "power2.in",
        stagger: 0.1,
      })

        // Close menu panel
        .set(preRef.current, {
          x: "0%",
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          zIndex: 2,
        })
        // Step 2: Animate preRef's clipPath to expand from LEFT to RIGHT and cover everything
        .to(preRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Expand from left to cover entire screen
          duration: 1,
          ease: "power4.inOut",
        })

        // Step 3: Fade out content as it gets covered (starts during clipPath animation)
        .to(
          [menuTextRef.current, ...motionNavs],
          {
            opacity: 0,
            x: 30, // Move slightly right as it fades (mirror of opening)
            duration: 0.6,
            ease: "power2.in",
            stagger: 0.08,
          },
          "-=0.5" // Start during the clipPath expansion
        )

        // Step 4: Move afterRef to the right (behind the now-covering preRef)
        .to(
          afterRef.current,
          {
            x: "100%",
            duration: 0.9,
            ease: "circ.inOut",
          },
          "-=1.3" // Start slightly after clipPath begins expanding
        )

        // Step 5: Finally, slide preRef out to the right
        .to(
          preRef.current,
          {
            x: "100%",
            duration: 0.8,
            ease: "circ.inOut",
          },
          "-=1" // Start slightly before afterRef completely exits
        );
    }
  }, [isPanelActive, isPanelVisible]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // Check if page has scrolled past idealHeight
      const heroInView = currentScrollY < heroHeight;
      setPlayNavAnimation(heroInView);

      // Only run the up/down animation when hero is in view
      if (heroInView) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setIsUp(true);
        } else {
          // Scrolling up in hero section
          setIsUp(false);
        }
      } else {
        // When past hero section, ensure navbar is visible (not moved up)
        setIsUp(true);
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
    <div className={`navbar ${isUp ? "navbarUp" : ""}`} ref={containerRef}>
      <div className="whitediv" />

      {isPanelVisible && (
        <div className="mobileNavMenu">
          <div className="mobileNavMenu__pre pre" ref={preRef}>
            <h3 id="preheader" ref={menuTextRef}>
              Menu
            </h3>
            {/* Add ref here */}
          </div>
          <div className="mobileNavMenu__after pre" ref={afterRef}>
            <div className="afterContainer" ref={afterCont}>
              <div className="afterContainer__one motionNav">
                <h4>Menu</h4>
              </div>
              <div className="afterContainer__two">
                {linkArray.map((link, i) => (
                  <div key={link.id} className="afterContainer__links motionNav">
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
          <h4 style={isPanelActive ? { color: "black" } : {}}>Carousel</h4>
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

          <div
            className="mobilenav"
            ref={hamburgerRef}
            onClick={() => (isPanelActive ? handlePanelClose() : setIsPanelActive(true))}
          >
            <div className="hamburger-bar hamburger-bar-top" ref={topBarRef}></div>
            <div className="hamburger-bar hamburger-bar-bottom" ref={bottomBarRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

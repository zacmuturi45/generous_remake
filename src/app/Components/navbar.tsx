"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GSDevTools } from "../GSAP/gsap_plugins";
import { useScrollLock } from "./scrollLock";
import { linkArray, linkBlack, linkWhite } from "../../../public/assets";
import { useLinkContext } from "../Contexts/LinkContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUp, setIsUp] = useState(false);
  const lastScrollY = useRef<number>(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false); // Add this state to control visibility
  const preRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const menuTextRef = useRef<HTMLHeadingElement>(null); // Add ref for Menu text
  const afterCont = useRef<HTMLDivElement>(null);
  const { setClickedLink, setIsPanelActive, isPanelActive } = useLinkContext();
  const [logoBlack, setLogoBlack] = useState<boolean>(false);
  const pathname = usePathname();

  const handleLinkClick = (linkName: string) => {
    setClickedLink(linkName);
  };

  const handlePanelOpen = () => {
    setIsPanelActive(true);
    setLogoBlack(true);
  };

  // Hamburger refs
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useScrollLock(isPanelActive);

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
        duration: 0.24,
        ease: "power2.inOut",
      }).to(
        bottomBarRef.current,
        {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.24,
          ease: "power2.inOut",
        },
        "-=0.12"
      );

      // Use a small timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const motionNavs = document.querySelectorAll(".motionNav");
        const tl = gsap.timeline();
        gsap.set(mobNav, { opacity: 1 });

        // Step 2: Menu slides in
        tl.set(menuTextRef.current, { x: 80 })
          .set([motionNavs], { x: 200, opacity: 0 })
          .set(menuTextRef.current, { x: 100, opacity: 0.5 })
          .fromTo(
            preRef.current,
            {
              x: "100%",
              clipPath: "polygon(0 0, 100% 0%, 100% 100%, 33% 100%)",
            },
            {
              x: "0%",
              clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease: "power4.inOut",
            }
          )
          .to(
            menuTextRef.current,
            {
              x: 0,
              opacity: 1,
              duration: 1.28,
              ease: "power2.out",
            },
            "-=0.48"
          )
          .fromTo(
            afterRef.current,
            {
              x: "100%",
              clipPath: "polygon(0 0, 100% 0%, 100% 100%, 21% 100%)",
            },
            {
              x: "0%",
              clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.8,
              ease: "power4.inOut",
            },
            "-=1.44"
          )
          .to(
            [motionNavs],
            {
              x: 0,
              duration: 2.4,
              ease: "power2.out",
              stagger: 0.056,
            },
            "-=1.36"
          )
          .to(
            [motionNavs],
            {
              opacity: 0.8,
              duration: 0.8,
              ease: "power2.out",
              stagger: {
                each: 0.064,
                from: "start",
              },
            },
            "-=1.84"
          )
          .set(
            [topBarRef.current, bottomBarRef.current],
            {
              backgroundColor: "rgb(0, 0, 0)",
              top: "50%",
              transformOrigin: "top center",
            },
            "-=1.6"
          )
          .fromTo(
            topBarRef.current,
            {
              scaleX: 0,
              rotation: 45,
            },
            {
              scaleX: 1,
              duration: 0.32,
              ease: "power2.out",
            },
            "-=1.44"
          )
          .fromTo(
            bottomBarRef.current,
            {
              scaleX: 0,
              rotation: -45,
            },
            {
              scaleX: 1,
              duration: 0.32,
              ease: "power2.out",
            },
            "-=1.6"
          );
      }, 360);

      return () => clearTimeout(timer);
    } else if (isPanelVisible) {
      // Check if mobile nav was instantly hidden by WipeTransition
      const mobileNav = document.querySelector(".mobileNavMenu") as HTMLElement;

      if (mobileNav && mobileNav.style.display === "none") {
        // Panel was instantly hidden - just reset without animation
        setIsPanelVisible(false);
        setLogoBlack(false);
        gsap.set([topBarRef.current, bottomBarRef.current], {
          rotation: 0,
          backgroundColor: isUp ? "rgb(0, 0, 0)" : "#fff",
          transformOrigin: "left center",
          scaleX: 1,
        });
        gsap.set(topBarRef.current, { top: "20px" });
        gsap.set(mobileNav, { display: "block" }); // Reset for next open
        return;
      }

      // Panel is visible but active state is false - play closing animation
      // This happens when user manually closes via X button
      const motionNavs = document.querySelectorAll(".motionNav");

      const tl = gsap.timeline({
        onComplete: () => {
          // After animation completes, hide the panel from DOM
          setIsPanelVisible(false);
          setLogoBlack(false);
          gsap.set([topBarRef.current, bottomBarRef.current], {
            rotation: 0,
            backgroundColor: isUp ? "rgb(0, 0, 0)" : "#fff",
            transformOrigin: "left center",
          });
          // Reset hamburger bars to original state
          gsap.to([topBarRef.current, bottomBarRef.current], {
            scaleX: 1,
            backgroundColor: isUp ? "rgb(0, 0, 0)" : "#fff",
            stagger: 0.2,
          });
          gsap.set(topBarRef.current, { top: "20px" });
        },
      });

      // Animate X bars out
      tl.to([topBarRef.current, bottomBarRef.current], {
        scaleX: 0,
        duration: 0.24,
        ease: "power2.in",
        stagger: 0.08,
      })
        .set(preRef.current, {
          x: "0%",
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          zIndex: 2,
        })
        .to(preRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "power4.inOut",
        })
        .to(
          [menuTextRef.current, ...motionNavs],
          {
            opacity: 0,
            x: 30,
            duration: 0.48,
            ease: "power2.in",
            stagger: 0.064,
          },
          "-=0.4"
        )
        .to(
          afterRef.current,
          {
            x: "100%",
            duration: 0.72,
            ease: "circ.inOut",
          },
          "-=1.04"
        )
        .to(
          preRef.current,
          {
            x: "100%",
            duration: 0.64,
            ease: "circ.inOut",
          },
          "-=0.8"
        );
    }
  }, [isPanelActive, isPanelVisible, isUp]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsUp(true);
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // Check if page has scrolled past idealHeight
      const heroInView = currentScrollY < heroHeight;

      // Check if on homepage
      if (pathname === "/") {
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
      } else {
        setIsUp(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

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
                        onClick={() => handleLinkClick(link.link)}
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
        <Link href={"/"} className="logo" onClick={() => setClickedLink("Home")}>
          {isUp || logoBlack ? (
            <Image src={linkBlack} width={124} height={124} alt="linkBlack" />
          ) : (
            <Image src={linkWhite} width={124} height={124} alt="linkWhite" />
          )}
          {/* <h4 style={isPanelActive ? { color: "black" } : {}}>Carousel</h4> */}
        </Link>

        <div className="nav_links_container">
          <div className="main_nav_links">
            {linkArray.map((link) => (
              <div key={link.id} className="link_div">
                <Link
                  href={link.href}
                  className="nav_links"
                  onMouseEnter={(e) => handleMouseEnter(e, ".linkline")}
                  onMouseLeave={(e) => handleMouseLeave(e, ".linkline")}
                  onClick={() => handleLinkClick(link.link)}
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
            onClick={() => (isPanelActive ? handlePanelClose() : handlePanelOpen())}
          >
            <div
              className="hamburger-bar hamburger-bar-top"
              style={isUp ? { backgroundColor: "black" } : {}}
              ref={topBarRef}
            ></div>
            <div
              className="hamburger-bar hamburger-bar-bottom"
              style={isUp ? { backgroundColor: "black" } : {}}
              ref={bottomBarRef}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

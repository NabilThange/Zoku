"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/dist/Flip";
import { SplitText } from "gsap/dist/SplitText";
import Image from "next/image";
import Link from "next/link";

// ✅ Register plugins at module level — safe in "use client" files
gsap.registerPlugin(Flip, SplitText);

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // ✅ Scoped gsap context — all animations auto-cleaned on unmount
    const ctx = gsap.context(() => {
      // ─── Text Splitting ────────────────────────────────────────────────
      const setupTextSplitting = () => {
        const textElements = hero.querySelectorAll("h1, h2, p, a, .cta-wrapper a");
        textElements.forEach((element) => {
          SplitText.create(element, {
            type: "lines",
            linesClass: "line",
          });
          const lines = element.querySelectorAll(".line");
          lines.forEach((line) => {
            const textContent = line.textContent || "";
            line.innerHTML = `<span>${textContent}</span>`;
          });
        });
      };

      // ─── Counter Digits ────────────────────────────────────────────────
      const createCounterDigits = () => {
        const counter1 = hero.querySelector(".counter-1");
        const counter2 = hero.querySelector(".counter-2");
        const counter3 = hero.querySelector(".counter-3");
        if (!counter1 || !counter2 || !counter3) return;

        // Counter 1: shows "0" → "1"
        const num0 = document.createElement("div");
        num0.className = "num";
        num0.textContent = "0";
        counter1.appendChild(num0);

        const num1 = document.createElement("div");
        num1.className = "num num1offset1";
        num1.textContent = "1";
        counter1.appendChild(num1);

        // Counter 2: 0–9 then 0 again
        for (let i = 0; i <= 10; i++) {
          const numDiv = document.createElement("div");
          numDiv.className = i === 1 ? "num num1offset2" : "num";
          numDiv.textContent = i === 10 ? "0" : String(i);
          counter2.appendChild(numDiv);
        }

        // Counter 3: 0–9 cycling × 3 then 0
        for (let i = 0; i < 30; i++) {
          const numDiv = document.createElement("div");
          numDiv.className = "num";
          numDiv.textContent = String(i % 10);
          counter3.appendChild(numDiv);
        }

        const finalNum = document.createElement("div");
        finalNum.className = "num";
        finalNum.textContent = "0";
        counter3.appendChild(finalNum);
      };

      // ─── Counter Animation ─────────────────────────────────────────────
      const animateCounter = (
        counter: Element,
        duration: number,
        delay = 0
      ) => {
        const firstNum = counter.querySelector(".num") as HTMLElement | null;
        if (!firstNum) return;

        const numHeight = firstNum.clientHeight;
        if (!numHeight) return;

        const totalDistance =
          (counter.querySelectorAll(".num").length - 1) * numHeight;

        gsap.to(counter, {
          y: -totalDistance,
          duration,
          delay,
          ease: "power2.inOut",
        });
      };

      // ─── Image Flip Animation ──────────────────────────────────────────
      const animateImages = () => {
        const images = hero.querySelectorAll(".img");
        images.forEach((img) => img.classList.remove("animate-out"));

        const state = Flip.getState(images);
        images.forEach((img) => img.classList.add("animate-out"));

        const mainTimeline = gsap.timeline();
        mainTimeline.add(
          Flip.from(state, {
            duration: 1,
            stagger: 0.1,
            ease: "power3.inOut",
          })
        );

        images.forEach((img, index) => {
          const scaleTimeline = gsap.timeline();
          scaleTimeline
            .to(img, { scale: 2.5, duration: 0.45, ease: "power3.in" }, 0.025)
            .to(img, { scale: 1, duration: 0.45, ease: "power3.out" }, 0.5);
          mainTimeline.add(scaleTimeline, index * 0.1);
        });

        return mainTimeline;
      };

      // ─── Init ──────────────────────────────────────────────────────────
      setupTextSplitting();
      createCounterDigits();

      const counter1 = hero.querySelector(".counter-1");
      const counter2 = hero.querySelector(".counter-2");
      const counter3 = hero.querySelector(".counter-3");

      if (counter1 && counter2 && counter3) {
        animateCounter(counter3, 2.5);
        animateCounter(counter2, 3);
        animateCounter(counter1, 2, 1.5);
      }

      // ─── Main Timeline ─────────────────────────────────────────────────
      const tl = gsap.timeline();

      gsap.set(hero.querySelectorAll(".img"), { scale: 0 });

      tl.to(".hero-bg", {
        scaleY: "100%",
        duration: 3,
        ease: "power2.inOut",
        delay: 0.25,
      });

      tl.to(
        ".img",
        {
          scale: 1,
          duration: 1,
          stagger: 0.125,
          ease: "power3.out",
        },
        "<"
      );

      tl.to(".counter", {
        opacity: 0,
        duration: 0.3,
        ease: "power3.out",
        delay: 0.3,
        onStart: () => {
          animateImages();
        },
      });

      tl.to(".sidebar .divider", {
        scaleY: "100%",
        duration: 1,
        ease: "power3.inOut",
        delay: 1.25,
      });

      tl.to(
        ["nav .divider", ".site-info .divider"],
        {
          scaleX: "100%",
          duration: 1,
          stagger: 0.5,
          ease: "power3.inOut",
        },
        "<"
      );

      tl.to(
        ".logo",
        {
          scale: 1,
          duration: 1,
          ease: "power4.inOut",
        },
        "<"
      );

      tl.to(
        [
          ".logo-name a span",
          ".links a span, .links p span",
          ".cta a span",
        ],
        {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.5,
        },
        "<"
      );

      tl.to(
        [".contact-btn", ".cta-wrapper a"],
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        ">"
      );

      tl.to(
        [
          ".header h1 span",
          ".header .cta-wrapper span",
          ".site-info span",
        ],
        {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        },
        "<"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg: var(--color-cream);
          --fg: var(--color-ink);
          --loader-bg: var(--color-cream-deep);
          --stroke: var(--color-border);
        }

        /* ✅ Must be global — injected by SplitText at runtime */
        .line {
          overflow: hidden;
        }

        .line span {
          position: relative;
          display: block;
          transform: translateY(125%);
          will-change: transform;
        }

        /* ✅ Must be global — injected by createCounterDigits at runtime */
        .num {
          /* inherits font-size/line-height from .counter */
        }

        .num1offset1 {
          position: relative;
          right: -5px;
        }

        .num1offset2 {
          position: relative;
          right: -2px;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        h1 {
          font-family: var(--font-display);
          font-size: 6rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--color-ink);
        }

        h2 {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.02rem;
          line-height: 1.1;
          color: var(--color-ink);
        }

        a, p {
          font-family: var(--font-sans);
          color: var(--fg);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          overflow: hidden;
          line-height: 1;
        }

        .divider {
          background-color: var(--stroke);
        }

        /* ✅ THE FIX: .img position MUST live in CSS, not inline styles */
        .images-container .img {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          width: 20%;
          aspect-ratio: 5/3;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .images-container .img.animate-out {
          top: unset;
          left: unset;
          bottom: 1.5rem;
          right: 1.5rem;
        }

        .contact-btn:hover {
          background-color: var(--color-gold);
          color: var(--color-white) !important;
          border-color: var(--color-gold);
        }

        @media (max-width: 1000px) {
          h1 {
            font-size: 2.5rem;
            letter-spacing: -0.05rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          nav .links {
            display: none;
          }

          .images-container .img {
            width: 30%;
          }

          .header {
            top: 25%;
            width: calc(100% - 12.5rem);
          }

          .site-info {
            width: calc(100% - 12.5rem);
            right: unset;
            left: 7.5rem;
          }
        }
      `}</style>

      <section
        ref={heroRef}
        className="hero"
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          backgroundColor: "var(--bg)",
          overflow: "hidden",
        }}
      >
        <div
          className="hero-bg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "var(--loader-bg)",
            transformOrigin: "bottom",
            transform: "scaleY(0%)",
          }}
        />

        {/* ── Counter ── */}
        <div
          className="counter"
          style={{
            position: "fixed",
            right: "3rem",
            bottom: "2rem",
            display: "flex",
            height: "120px",
            fontSize: "120px",
            lineHeight: "150px",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            WebkitTextStroke: "2px var(--fg)",
            clipPath: "polygon(0 0, 100% 0, 100% 120px, 0 120px)",
          }}
        >
          <div className="counter-1 digit" style={{ position: "relative", top: "-15px" }} />
          <div className="counter-2 digit" style={{ position: "relative", top: "-15px" }} />
          <div className="counter-3 digit" style={{ position: "relative", top: "-15px" }} />
        </div>

        {/* ── Images ── */}
        <div
          className="images-container"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {[
            "/crispy-golden-samosas.png",
            "/flavorful-chicken-biryani.png",
            "/paneer-tikka.png",
            "/masala-dosa.png",
            "/veg-fried-rice.png",
            "/paneer-butter-masala.png",
            "/elegant-tea-cup.png",
            "/delicious-food-item.png",
            "/crispy-golden-samosas.png",
            "/flavorful-chicken-biryani.png",
            "/paneer-tikka.png",
            "/masala-dosa.png",
            "/veg-fried-rice.png",
            "/paneer-butter-masala.png",
            "/elegant-tea-cup.png",
            "/img15.png"
          ].map((src, index) => (
            <div key={index} className="img">
              <Image
                src={src}
                alt="Food"
                fill
                style={{ objectFit: "cover" }}
                priority={index <= 5}
              />
            </div>
          ))}
        </div>

        {/* ── Nav ── */}
        <nav
          style={{
            position: "relative",
            width: "100%",
            height: "5rem",
            padding: "1.5rem 1.5rem 1.5rem 7.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="logo-name">
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: "700",
                letterSpacing: "-0.05rem",
                color: "var(--color-ink)",
              }}
            >
              ZOKU
            </Link>
          </div>

          <div
            className="nav-items"
            style={{ display: "flex", alignItems: "center", gap: "7.5rem" }}
          >
            <div
              className="links"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Link href="/menu">Menu</Link>
              <p>/</p>
              <Link href="/trucks">Trucks</Link>
              <p>/</p>
              <Link href="/about">About</Link>
            </div>

            <div className="cta">
              <Link
                href="/app"
                className="contact-btn"
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid var(--fg)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05rem",
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  lineHeight: "1",
                  opacity: 0,
                }}
              >
                Order Now
              </Link>
            </div>
          </div>

          <div
            className="divider"
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "1px",
              transformOrigin: "left",
              transform: "scaleX(0%)",
            }}
          />
        </nav>

        {/* ── Sidebar ── */}
        <div
          className="sidebar"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "5rem",
            height: "100svh",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            className="logo"
            style={{
              width: "2rem",
              aspectRatio: "1",
              transform: "scale(0)",
              position: "relative",
            }}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <div
            className="divider"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "1px",
              height: "100svh",
              transformOrigin: "top",
              transform: "scaleY(0%)",
            }}
          />
        </div>

        {/* ── Header ── */}
        <div
          className="header"
          style={{
            position: "absolute",
            top: "40%",
            left: "7.5rem",
            transform: "translateY(-50%)",
            width: "60%",
          }}
        >
          <h1>Life begins after flavour</h1>

          <div className="cta-wrapper" style={{ marginTop: "2.5rem" }}>
            <Link
              href="/app"
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                backgroundColor: "var(--color-ink)",
                color: "var(--color-cream)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-sans)",
                fontWeight: "600",
                textDecoration: "none",
                fontSize: "1.125rem",
                position: "relative",
                opacity: 0,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Order Now →
            </Link>
          </div>
        </div>

        {/* ── Site Info ── */}
        <div
          className="site-info"
          style={{
            position: "absolute",
            right: "1.5rem",
            top: "60%",
            transform: "translateY(-50%)",
            width: "20%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h2>Premium fast-casual food truck. Bold flavors, crafted with intention.</h2>

          <div
            className="divider"
            style={{
              width: "100%",
              height: "1px",
              transformOrigin: "left",
              transform: "scaleX(0%)",
            }}
          />

          <div
            className="site-info-copy"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <p>Fresh ingredients.</p>
            <p>Bold flavors.</p>
            <p>Zero compromise.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "4rem 7.5rem 2rem",
          backgroundColor: "var(--loader-bg)",
          borderTop: "1px solid var(--stroke)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "var(--color-ink)",
              }}
            >
              ZOKU
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                opacity: 0.7,
                lineHeight: "1.6",
                color: "var(--color-ink-soft)",
              }}
            >
              Premium fast-casual food truck bringing bold flavors and fresh ingredients to your campus.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "var(--color-ink)",
              }}
            >
              Menu
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <li>
                <Link
                  href="/app"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Order Now
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Full Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/trucks"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Our Trucks
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "var(--color-ink)",
              }}
            >
              About
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <li>
                <Link
                  href="/about"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/locations"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "var(--color-ink)",
              }}
            >
              Legal
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <li>
                <Link
                  href="/privacy"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  style={{
                    fontFamily: "var(--font-sans)",
                    opacity: 0.7,
                    textDecoration: "none",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid var(--stroke)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              opacity: 0.6,
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            © 2025 Zoku. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link
              href="https://instagram.com"
              style={{
                fontFamily: "var(--font-sans)",
                opacity: 0.6,
                textDecoration: "none",
                color: "var(--color-ink-muted)",
              }}
            >
              Instagram
            </Link>
            <Link
              href="https://twitter.com"
              style={{
                fontFamily: "var(--font-sans)",
                opacity: 0.6,
                textDecoration: "none",
                color: "var(--color-ink-muted)",
              }}
            >
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

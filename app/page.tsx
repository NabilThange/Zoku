"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedList } from "@/components/magicui/animated-list"
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import { useEffect, useRef, useCallback, memo, useState } from "react"

interface Item {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

let notifications = [
  {
    name: "Order delivered",
    description: "Priya just loved her Butter Chicken! 😋",
    time: "2m ago",
    icon: "🚀",
    color: "#FF6B35",
  },
  {
    name: "5⭐ rating received",
    description: "Students can't stop raving about Cantio!",
    time: "5m ago",
    icon: "⭐",
    color: "#FFB800",
  },
  {
    name: "Craving satisfied",
    description: "Rahul's Samosa addiction = cured ✨",
    time: "8m ago",
    icon: "😍",
    color: "#00C9A7",
  },
  {
    name: "Zero queue time",
    description: "Another happy customer skipped the line!",
    time: "12m ago",
    icon: "⚡",
    color: "#1E86FF",
  },
]

notifications = Array.from({ length: 3 }, () => notifications).flat()

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-out hover:scale-[1.02] focus-within:scale-[1.02]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        "focus-within:outline-2 focus-within:outline-[#FF6B35] focus-within:outline-offset-2"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden min-w-0">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-base truncate">{name}</span>
            <span className="mx-1 flex-shrink-0">·</span>
            <span className="text-xs text-gray-500 flex-shrink-0">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60 line-clamp-2 leading-relaxed">{description}</p>
        </div>
      </div>
    </figure>
  )
}

// Final optimized video component
const OptimizedVideoPlayer = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  // Intersection observer for initial play only
  useEffect(() => {
    if (typeof window === "undefined" || hasPlayed) return
    const vid = videoRef.current
    if (!vid || !("IntersectionObserver" in window)) return
    
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasPlayed) {
        vid.play().then(() => {
          setHasPlayed(true)
        }).catch(() => {})
      }
    }, { 
      threshold: 0.25,
      rootMargin: "10% 0px"
    })
    
    io.observe(vid)
    return () => io.disconnect()
  }, [hasPlayed])

  // Handle video end - prevent restart
  const handleVideoEnd = useCallback(() => {
    setHasPlayed(true)
  }, [])

  // Handle autoplay failures gracefully
  const handleVideoError = useCallback(() => {
    const vid = videoRef.current
    if (vid && !hasPlayed) {
      vid.muted = true
      vid.play().then(() => {
        setHasPlayed(true)
      }).catch(() => {})
    }
  }, [hasPlayed])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div 
        className="bg-white rounded-lg shadow-lg border border-gray-200/60 overflow-hidden backdrop-blur-sm video-container"
        style={{
          aspectRatio: "16/9",
        }}
      >
        <video
          ref={videoRef}
          className="hero-video w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="/video/cantiohrs1_poster.jpg"
          width={896}
          height={504}
          volume={0}
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          aria-label="Cantio demo video"
          style={{
            willChange: 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)'
          }}
        >
          {/* Mobile-optimized sources - compressed without audio */}
          <source 
            src="/cantiohrs1_mobile.webm" 
            type="video/webm; codecs=vp9" 
            media="(max-width: 768px)" 
          />
          <source 
            src="/cantiohrs1_mobile.mp4" 
            type='video/mp4; codecs="avc1.42E01E"' 
            media="(max-width: 768px)" 
          />
          {/* Desktop sources - compressed without audio */}
          <source 
            src="/cantiohrs1.webm" 
            type="video/webm; codecs=vp9" 
          />
          <source 
            src="/cantiohrs1.mp4" 
            type='video/mp4; codecs="avc1.64001F"' 
          />
          <p>Your browser doesn't support HTML5 video. <a href="/cantiohrs1.mp4">Download the video</a>.</p>
        </video>
      </div>
    </div>
  )
})

OptimizedVideoPlayer.displayName = "OptimizedVideoPlayer"

function AnimatedListDemo({
  className,
}: {
  className?: string
}) {
  return (
    <div className={cn(
      "relative flex w-full flex-col overflow-hidden p-2", 
      "h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]",
      className
    )}>
      <AnimatedList delay={2500}>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80"></div>
    </div>
  )
}

export default function LandingPage() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
    }
    setVh()
    window.addEventListener("resize", setVh)
    window.addEventListener("orientationchange", setVh)
    return () => {
      window.removeEventListener("resize", setVh)
      window.removeEventListener("orientationchange", setVh)
    }
  }, [])

  return (
    <div className="bg-[#FAF8F5] relative overflow-hidden" style={{
      /* CSS Custom Properties for Spacing */
      '--space-xs': 'clamp(0.75rem, 2vw, 1rem)',
      '--space-sm': 'clamp(1rem, 3vw, 1.5rem)',
      '--space-md': 'clamp(1.5rem, 4vw, 2rem)',
      '--space-lg': 'clamp(2rem, 6vw, 3rem)',
      '--space-xl': 'clamp(3rem, 8vw, 5rem)',
      '--hero-padding-top': 'clamp(0.5rem, 2vh, 1rem)',
      '--hero-padding-bottom': 'clamp(0.5rem, 2vh, 1rem)',
      '--hero-gap': 'clamp(0.75rem, 2vh, 1rem)',
    } as React.CSSProperties}>
      {/* Animated Grid Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <AnimatedGridPattern
          numSquares={60}
          maxOpacity={0.12}
          duration={5}
          repeatDelay={2}
          width={60}
          height={60}
          strokeDasharray={[2, 8]}
          className={cn(
            "w-full h-full",
            "[mask-image:radial-gradient(800px_circle_at_50%_50%,white,transparent)]",
            "transform rotate-12 scale-110",
          )}
        />
      </div>

      {/* Hero Section - Fixed Height for Laptops */}
      <section
        className="relative z-10 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12"
        style={{ 
          minHeight: "calc(var(--vh, 1vh) * 100)",
          height: "clamp(100vh, 100vh, 85vh)",
          paddingTop: "var(--hero-padding-top)",
          paddingBottom: "var(--hero-padding-bottom)"
        }}
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col justify-center items-center h-full">
          <div 
            className="text-center w-full hero-content" 
            style={{ 
              gap: "var(--hero-gap)", 
              display: "flex", 
              flexDirection: "column",
              maxWidth: "100%"
            }}
          >
            {/* Hero Title - Mobile Big, Tablet/Desktop Normal */}
            <div style={{ gap: "var(--space-lg)", display: "flex", flexDirection: "column" }}>
              <h1
                className="font-bold leading-tight tracking-tight text-[#2D3748] px-2"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
                  lineHeight: "1.1",
                  marginTop: "clamp(0rem, 1vh, 0.5rem)",
                  marginBottom: "clamp(0.5rem, 1vh, 1rem)",
                }}
              >
                Your Campus.
                <br />
                <span className="text-[#FF6B35]">Your Cravings.</span>
              </h1>

              <p
                className="text-[#718096] leading-relaxed max-w-2xl mx-auto px-4 hero-description"
                style={{
                  fontSize: "clamp(1.125rem, 3vw, 1.125rem)",
                  lineHeight: "1.6",
                  marginBottom: "clamp(0.25rem, 1vh, 0.5rem)",
                }}
              >
                Multiple food trucks. One platform. Pre-order from your favorite trucks, skip the queue, and grab your food fresh off the grill.
              </p>
            </div>

            {/* Optimized Video Component */}
            <OptimizedVideoPlayer />

            {/* CTA Button - Normal Size for Larger Screens */}
            <div className="mt-4">
              <Button
                size="lg"
                className="bg-[#FF6B35] hover:bg-[#E55A2B] border-none text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg focus:outline-2 focus:outline-[#FF6B35] focus:outline-offset-2 focus:ring-0 w-full sm:w-auto shadow-md rounded-xl font-semibold"
                style={{ 
                  minHeight: "clamp(56px, 6vh, 48px)",
                  padding: "clamp(1rem, 2vw, 1rem) clamp(2rem, 4vw, 2rem)",
                  fontSize: "clamp(1.125rem, 2.5vw, 1.125rem)",
                  minWidth: "clamp(280px, 40vw, 260px)",
                  maxWidth: "300px",
                  margin: "0 auto"
                }}
                onClick={() => (window.location.href = "/onboarding")}
              >
                Start Ordering
                <ArrowRight 
                  className="ml-2 flex-shrink-0" 
                  style={{ 
                    width: "clamp(18px, 2vw, 18px)",
                    height: "clamp(18px, 2vw, 18px)" 
                  }} 
                />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section
        className="relative z-10 flex items-center justify-center"
        style={{ 
          minHeight: "clamp(600px, calc(var(--vh, 1vh) * 90), 900px)",
          padding: "var(--space-xl) var(--space-sm)"
        }}
      >
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>

        <div className="max-w-7xl mx-auto relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: "var(--space-xl)" }}>
            {/* Left Content */}
            <div className="text-center lg:text-left" style={{ gap: "var(--space-lg)", display: "flex", flexDirection: "column" }}>
              <h2
                className="font-semibold text-[#2D3748] leading-tight"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  lineHeight: "1.2",
                }}
              >
                See What's Happening
                <br />
                <span className="text-[#FF6B35]">Right Now</span>
              </h2>

              <p
                className="text-[#718096] leading-relaxed"
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                  lineHeight: "1.6",
                }}
              >
                Join hundreds of students already ordering smart. Watch live as orders are placed, payments confirmed,
                and meals picked up in real-time.
              </p>

              {/* Stats Grid */}
              <div 
                className="grid grid-cols-1 xs:grid-cols-2 max-w-md mx-auto lg:mx-0 mt-8"
                style={{ gap: "var(--space-md)" }}
              >
                <div className="text-center lg:text-left p-6 bg-white/70 rounded-xl backdrop-blur-sm shadow-lg border border-white/50 transition-all duration-200 ease-out hover:bg-white/90 hover:shadow-xl">
                  <div
                    className="font-bold text-[#FF6B35] mb-2"
                    style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)" }}
                  >
                    500+
                  </div>
                  <div 
                    className="font-semibold text-[#718096]"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                  >
                    Orders Today
                  </div>
                </div>
                <div className="text-center lg:text-left p-6 bg-white/70 rounded-xl backdrop-blur-sm shadow-lg border border-white/50 transition-all duration-200 ease-out hover:bg-white/90 hover:shadow-xl">
                  <div
                    className="font-bold text-[#FF6B35] mb-2"
                    style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)" }}
                  >
                    2min
                  </div>
                  <div 
                    className="font-semibold text-[#718096]"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                  >
                    Avg Wait
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Animated List */}
            <div className="relative w-full">
              <AnimatedListDemo className="rounded-xl border border-gray-200/40 bg-white/70 backdrop-blur-md shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mobile-First Styles */}
      <style jsx>{`
        @media (max-width: 359px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
        
        @media (min-width: 360px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        /* Mobile Portrait Optimization */
        @media (max-width: 480px) and (orientation: portrait) {
          .hero-content {
            transform: scale(1);
            gap: clamp(1.5rem, 5vh, 3rem) !important;
          }
        }
        
        /* Mobile Landscape Optimization */
        @media (max-width: 768px) and (orientation: landscape) {
          section:first-of-type {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          .hero-content {
            gap: clamp(1rem, 3vh, 2rem) !important;
          }
        }
        
        /* Tablet and Desktop - No Scaling, Move Description Up, Much Tighter Spacing */
        @media (min-width: 769px) {
          .hero-content {
            transform: scale(1);
            gap: 0.75rem !important;
          }
          
          .hero-description {
            margin-top: -0.75rem !important;
            margin-bottom: 0.25rem !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
          
          button:hover {
            transform: none !important;
          }
        }
        
        /* Enhanced Mobile Touch Targets */
        @media (max-width: 768px) {
          button {
            min-height: 48px !important;
          }
          
          .hero-content button {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        
        /* Improved Text Readability on Small Screens */
        @media (max-width: 640px) {
          h1 {
            letter-spacing: -0.02em;
          }
          
          p {
            text-align: center !important;
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Video Performance Optimizations */
        .hero-video {
          display: block;
          will-change: opacity, transform;
          contain: paint layout;
          transform: translateZ(0);
        }

        .video-container {
          contain: layout style paint;
          isolation: isolate;
        }

        /* Connection-aware preloading */
        @media (connection: slow-2g), (connection: 2g) {
          .hero-video {
            preload: none !important;
          }
        }

        /* High-DPI optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .hero-video {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: optimize-contrast;
          }
        }
      `}</style>
    </div>
  )
}

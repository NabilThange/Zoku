"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const onboardingPages = [
  {
    id: 1,
    title: "Work Within Your",
    titleHighlight: "Favorite Place With",
    titleEnd: "Ease And Fun",
    subtitle: "Never forget to keep track of your professional accomplishments with our app!",
  },
  {
    id: 2,
    title: "Stay Organized",
    titleHighlight: "With Our Team", 
    subtitle: "Understand the contributions our colleagues make to our team",
  },
  {
    id: 3,
    title: "Get Notified When",
    titleHighlight: "Work Happens",
    subtitle: "Take control of notifications, work faster live or on your own time",
  },
]

// Video animation components
const VideoAnimation1 = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        className="w-full max-w-md h-auto object-contain"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/food.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="w-full h-32 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg flex items-center justify-center">
          <span className="text-orange-800">Animation Loading...</span>
        </div>
      </video>
    </div>
  );
};

// Second page video animation
const VideoAnimation2 = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        className="w-full max-w-md h-auto object-contain"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/food2.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
          <span className="text-blue-800">Animation Loading...</span>
        </div>
      </video>
    </div>
  );
};

// Third page video animation
const VideoAnimation3 = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        className="w-full max-w-md h-auto object-contain"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/food3.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="w-full h-32 bg-gradient-to-br from-green-200 to-green-300 rounded-lg flex items-center justify-center">
          <span className="text-green-800">Animation Loading...</span>
        </div>
      </video>
    </div>
  );
};

// Animation renderer
const AnimationRenderer = ({ currentPage }) => {
  switch(currentPage) {
    case 0:
      return <VideoAnimation1 />;
    case 1:
      return <VideoAnimation2 />;
    case 2:
      return <VideoAnimation3 />;
    default:
      return <VideoAnimation1 />;
  }
};

// Fully responsive wavy bottom section with image placeholder
const CurvedBottomSection = ({ currentPage, nextPage, onboardingPages }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 lg:h-36">
      <div className="relative w-full h-full overflow-hidden">
        {/* First wavy layer - lightest opacity */}
        <svg
          className="absolute bottom-0 w-full"
          style={{ height: '140%' }}
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,300 L0,200 Q150,150 300,180 Q450,210 600,170 Q750,130 900,160 Q1050,190 1200,150 L1200,300 Z" 
            fill="rgba(75, 85, 99, 0.15)" 
          />
        </svg>

        {/* Second wavy layer - medium opacity */}
        <svg
          className="absolute bottom-0 w-full"
          style={{ height: '120%' }}
          viewBox="0 0 1200 260"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,260 L0,180 Q200,120 400,150 Q600,180 800,140 Q1000,100 1200,130 L1200,260 Z" 
            fill="rgba(75, 85, 99, 0.4)" 
          />
        </svg>

        {/* Main wavy layer - full opacity grey */}
        <svg
          className="absolute bottom-0 w-full"
          style={{ height: '100%' }}
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,220 L0,160 Q100,100 250,130 Q400,160 550,120 Q700,80 850,110 Q1000,140 1200,100 L1200,220 Z" 
            fill="#4A5568" 
          />
        </svg>

        {/* Responsive next button - positioned in bottom section */}
        <button
          onClick={nextPage}
          className="absolute z-30 flex items-center justify-center transition-all duration-200 
                     hover:scale-110 active:scale-95"
          style={{
            right: '20px',
            bottom: '20px',
            width: '48px',
            height: '48px',
          }}
        >
          <ArrowRight 
            className="text-white" 
            size={20}
            strokeWidth={2.5} 
          />
        </button>
      </div>
    </div>
  )
}

// Image that sticks to bottom-right of screen
const BottomRightImage = () => {
  return (
    <div className="fixed bottom-0 z-20" style={{ right: '-25px' , bottom: '-25px' }}>
      <div
        className="rounded-tl-lg overflow-hidden"
        style={{ 
          width: '140px',
          height: '170px',
        }}
      >
        <img 
          src="/crvon.png" 
          alt="CR Von" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

// Separate component for text content
const TextContent = ({ currentPageData, currentPage, onboardingPages }) => {
  return (
    <div className="relative z-20 bg-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
      {/* Enhanced curved separator using CSS */}
      <div className="absolute top-0 left-0 right-0 -mt-4 sm:-mt-6 md:-mt-8">
        {/* First separation curve */}
        <div 
          className="w-full bg-orange-100 opacity-20"
          style={{
            height: '30px',
            borderRadius: '0 0 50% 50% / 0 0 15px 15px',
            transform: 'scaleX(1.1)',
          }}
        />
        
        {/* Second separation curve */}
        <div 
          className="absolute top-3 left-0 w-full bg-orange-100 opacity-40"
          style={{
            height: '25px',
            borderRadius: '0 0 60% 40% / 0 0 12px 12px',
            transform: 'scaleX(1.05)',
          }}
        />
        
        {/* Main white curve */}
        <div 
          className="absolute top-5 left-0 w-full bg-white"
          style={{
            height: '20px',
            borderRadius: '0 0 70% 30% / 0 0 10px 10px',
          }}
        />
      </div>

      <div className="pt-4 sm:pt-6 md:pt-8 lg:pt-10">
        <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-3 md:mb-4 leading-tight text-gray-800">
          {currentPageData.title}
          {currentPageData.titleHighlight && (
            <>
              {" "}
              <span className="text-amber-500">{currentPageData.titleHighlight}</span>
            </>
          )}
          {currentPageData.titleEnd && (
            <>
              <br />
              <span className="text-gray-800">{currentPageData.titleEnd}</span>
            </>
          )}
        </h1>

        <p className="text-gray-600 text-base sm:text-base leading-relaxed mb-4 sm:mb-4 md:mb-6 pr-8">
          {currentPageData.subtitle}
        </p>

        {/* Page indicators */}
        <div className="flex space-x-2 mb-3 sm:mb-4">
          {onboardingPages.map((_, index) => (
            <div
              key={index}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === currentPage ? "16px" : "6px",
                height: "6px",
                backgroundColor: index === currentPage ? "#F59E0B" : "#D1D5DB",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const router = useRouter()

  const nextPage = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      // Redirect to login page after last onboarding page
      router.push("/auth/login")
    }
  }

  const skip = () => {
    // Skip directly to login page
    router.push("/auth/login")
  }

  const currentPageData = onboardingPages[currentPage]

  return (
    <div className="h-screen bg-gray-600 relative overflow-hidden">
      {/* Enhanced background with multiple curved lines */}
      <div className="absolute inset-0" style={{ backgroundColor: "#6B7280" }}>
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 800">
          <path
            d="M50,80 Q150,40 250,80 Q350,120 450,80"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          <path
            d="M-50,150 Q100,100 200,140 Q300,180 450,140"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <path
            d="M100,220 Q200,180 300,220 Q400,260 500,220"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.2"
          />
          <path
            d="M0,300 Q120,250 240,290 Q360,330 480,290"
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />
          <path
            d="M80,380 Q180,340 280,380 Q380,420 480,380"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.3"
          />
          <path
            d="M-30,460 Q120,410 270,450 Q420,490 550,450"
            fill="none"
            stroke="rgba(255,255,255,0.11)"
            strokeWidth="1"
          />
          <path
            d="M60,540 Q160,500 260,540 Q360,580 460,540"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.4"
          />
          <path
            d="M120,620 Q220,580 320,620 Q420,660 520,620"
            fill="none"
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="1.1"
          />
        </svg>
      </div>

      {/* Main container */}
      <div className="h-full p-1 sm:p-2">
        <div className="relative w-full h-full bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
          {/* Skip button */}
          <button
            onClick={skip}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-30 
                       px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold text-gray-600 
                       hover:text-gray-800 transition-colors duration-200 bg-transparent border-none"
          >
            Skip
          </button>

          {/* Image section with enhanced curves */}
          <div className="relative h-3/4 sm:h-4/6">
            <div className="absolute inset-0 rounded-t-lg sm:rounded-t-xl overflow-hidden">
              {/* Multi-layered gradient background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, 
                       #F5E6D3 0%, 
                       #F0D9C4 25%, 
                       #EDD1B5 50%, 
                       #E8C8A6 75%, 
                       #E3BF97 100%)`,
                }}
              ></div>

              {/* Curved overlay patterns */}
              <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
                  <path
                    d="M0,100 Q100,50 200,100 Q300,150 400,100 L400,200 Q300,150 200,200 Q100,250 0,200 Z"
                    fill="rgba(255,255,255,0.1)"
                  />
                  <path
                    d="M0,250 Q100,200 200,250 Q300,300 400,250 L400,350 Q300,300 200,350 Q100,400 0,350 Z"
                    fill="rgba(255,255,255,0.08)"
                  />
                </svg>
              </div>

              {/* Animation content - Video components */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-full h-full flex items-center justify-center">
                  <AnimationRenderer currentPage={currentPage} />
                </div>
              </div>

              {/* Enhanced decorative elements - smaller and fewer for mobile */}
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 w-4 h-4 sm:w-6 sm:h-6 opacity-15 transform hover:rotate-45 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M3 3h18v18H3z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute top-12 sm:top-16 right-4 sm:right-6 w-3 h-3 sm:w-4 sm:h-4 opacity-15 animate-pulse">
                <div className="w-full h-full border-2 border-gray-600 rounded-full"></div>
              </div>
              <div className="absolute bottom-6 sm:bottom-10 left-8 sm:left-12 w-3 h-3 sm:w-4 sm:h-4 opacity-15 transform hover:scale-110 transition-transform duration-200">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M12 2L2 7h20l-10-5zM2 17h20v5H2v-5z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="relative flex flex-col h-1/4 sm:h-2/6">
            <div className="flex-1">
              <TextContent
                currentPageData={currentPageData}
                currentPage={currentPage}
                onboardingPages={onboardingPages}
              />
            </div>
            <CurvedBottomSection currentPage={currentPage} nextPage={nextPage} onboardingPages={onboardingPages} />
          </div>
        </div>
      </div>

      {/* Bottom-right image placeholder - always fixed to screen corner */}
      <BottomRightImage />
    </div>
  )
}

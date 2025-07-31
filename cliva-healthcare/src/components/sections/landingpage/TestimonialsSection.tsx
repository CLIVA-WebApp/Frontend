"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    name: "John Doe",
    username: "@john_doe",
    text: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
  },
  {
    name: "Jane Smith",
    username: "@jane_smith",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, explicabo.",
  },
  {
    name: "Alex Brown",
    username: "@alex_brown",
    text: "Consectetur adipisicing elit. Fugit, alias suscipit placeat illo aut enim!",
  },
  {
    name: "Alex Brown",
    username: "@alex_brown",
    text: "Consectetur adipisicing elit. Fugit, alias suscipit placeat illo aut enim!",
  },
];

const StarRatingSVG = () => (
  <svg viewBox="0 0 120 24" className="w-24 h-6 fill-yellow-400">
    {[0, 24, 48, 72, 96].map((x) => (
      <polygon
        key={x}
        transform={`translate(${x}, 0)`}
        points="12,0 15,8 24,9 17,15 19,24 12,19 5,24 7,15 0,9 9,8"
      />
    ))}
  </svg>
);

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 4000);
  }, [isPaused]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = undefined;
    }
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (container) {
      const cardWidth = container.children[0].clientWidth + 24; // including margin
      container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setCurrentIndex(index);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const nextIndex =
      direction === "left"
        ? (currentIndex - 1 + testimonials.length) % testimonials.length
        : (currentIndex + 1) % testimonials.length;
    scrollToIndex(nextIndex);
    // Stop auto-play when user manually navigates
    setIsAutoPlaying(false);
    stopAutoPlay();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll("right");
    } else if (e.key === " ") {
      e.preventDefault();
      setIsAutoPlaying(!isAutoPlaying);
    }
  };

  // Auto-play effects
  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    
    return () => stopAutoPlay();
  }, [isAutoPlaying, isPaused, startAutoPlay, stopAutoPlay]);

  // Update scroll position when currentIndex changes
  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  // Pause on window blur, resume on focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scroll("right");
    } else if (isRightSwipe) {
      scroll("left");
    }
  };

  return (
    <section 
      className="relative w-full bg-[#1D567C] py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Customer testimonials"
    >
      {/* Title */}
      <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
        See why users love CLIVA
      </h2>

      {/* Carousel */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:scale-110 transition z-10"
          aria-label="Previous testimonial"
        >
          &lt;
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth px-10 gap-6 scrollbar-hide"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`min-w-[300px] md:min-w-[360px] max-w-sm snap-center bg-white rounded-xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-105 ${
                index === currentIndex ? 'ring-2 ring-blue-300' : ''
              }`}
              role="article"
              aria-label={`Testimonial from ${t.name}`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-400" />
                <div>
                  <h3 className="text-xl font-bold">{t.name}</h3>
                  <p className="text-gray-500">{t.username}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{t.text}</p>
              <StarRatingSVG />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:scale-110 transition z-10"
          aria-label="Next testimonial"
        >
          &gt;
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              scrollToIndex(idx);
              setIsAutoPlaying(false);
              stopAutoPlay();
            }}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              idx === currentIndex ? "bg-blue-300 scale-125" : "bg-gray-300"
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && !isPaused && (
        <div className="flex justify-center mt-4">
          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full animate-pulse"
              style={{
                animation: 'progress 4s linear infinite'
              }}
            />
          </div>
        </div>
      )}

      {/* Accessibility announcement for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing testimonial {currentIndex + 1} of {testimonials.length}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Maximize2, Volume2, VolumeX, Play } from "lucide-react";

const plans = [
  {
    name: "FREE",
    price: 0,
    features: ["7 simulations per week", "Simulate user's registered district"],
    icon: "https://c.animaapp.com/7YfctCCD/img/user--6--1@2x.png",
  },
  {
    name: "PRO",
    price: 10,
    features: [
      "Unlimited simulation and PDF export",
      "All free features",
      "Simulate user's registered city",
    ],
    icon: "https://c.animaapp.com/7YfctCCD/img/crown--2--1@2x.png",
  },
  {
    name: "ENTERPRISE",
    price: 25,
    features: ["Simulate anywhere", "All pro features", "Chatbot support"],
    icon: "https://c.animaapp.com/7YfctCCD/img/enterprise-1@2x.png",
  },
];

const PricingPlans: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto play/pause when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current && !isZoomed && !isTransitioning) {
            if (entry.isIntersecting) {
              videoRef.current.play();
              setIsPaused(false);
            } else {
              videoRef.current.pause();
              setIsPaused(true);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [isZoomed, isTransitioning]);

  // Sync time between videos continuously
  useEffect(() => {
    const syncTime = () => {
      if (videoRef.current && !isZoomed && !isTransitioning) {
        setCurrentTime(videoRef.current.currentTime);
      } else if (modalVideoRef.current && isZoomed && !isTransitioning) {
        setCurrentTime(modalVideoRef.current.currentTime);
      }
    };

    const interval = setInterval(syncTime, 100); // Update every 100ms for smooth sync
    return () => clearInterval(interval);
  }, [isZoomed, isTransitioning]);

  // Toggle play/pause on click
  const handleVideoClick = () => {
    if (isTransitioning) return;
    
    const activeVideo = isZoomed ? modalVideoRef.current : videoRef.current;
    if (!activeVideo) return;

    if (activeVideo.paused) {
      activeVideo.play();
      setIsPaused(false);
    } else {
      activeVideo.pause();
      setIsPaused(true);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
    }
  };

  // Zoom In with smooth sync
  const handleZoomIn = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Get current state from main video
    if (videoRef.current) {
      const wasPlaying = !videoRef.current.paused;
      const currentVideoTime = videoRef.current.currentTime;
      
      setCurrentTime(currentVideoTime);
      videoRef.current.pause();
      
      // Start modal transition
      setIsZoomed(true);
      setTimeout(() => {
        setModalVisible(true);
        
        // Wait a bit more for modal video to be ready
        setTimeout(() => {
          if (modalVideoRef.current) {
            modalVideoRef.current.currentTime = currentVideoTime;
            modalVideoRef.current.muted = isMuted;
            
            // Resume playing if it was playing before
            if (wasPlaying) {
              modalVideoRef.current.play().then(() => {
                setIsPaused(false);
                setIsTransitioning(false);
              }).catch(() => {
                setIsPaused(true);
                setIsTransitioning(false);
              });
            } else {
              setIsPaused(true);
              setIsTransitioning(false);
            }
          } else {
            setIsTransitioning(false);
          }
        }, 100);
      }, 20);
    } else {
      setIsTransitioning(false);
    }
  };

  // Zoom Out with smooth sync
  const handleZoomOut = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Get current state from modal video
    if (modalVideoRef.current) {
      const wasPlaying = !modalVideoRef.current.paused;
      const currentVideoTime = modalVideoRef.current.currentTime;
      
      setCurrentTime(currentVideoTime);
      modalVideoRef.current.pause();
      
      // Start fade out
      setModalVisible(false);
      
      // Wait for fade-out animation
      setTimeout(() => {
        setIsZoomed(false);
        
        // Sync main video and resume
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = currentVideoTime;
            videoRef.current.muted = isMuted;
            
            if (wasPlaying) {
              videoRef.current.play().then(() => {
                setIsPaused(false);
                setIsTransitioning(false);
              }).catch(() => {
                setIsPaused(true);
                setIsTransitioning(false);
              });
            } else {
              setIsPaused(true);
              setIsTransitioning(false);
            }
          } else {
            setIsTransitioning(false);
          }
        }, 50);
      }, 300);
    } else {
      setIsTransitioning(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-[#1D567C] py-16">
      <div className="max-w-7xl mx-auto px-4 text-center mb-[50px]">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
          What you can do with CLIVA
        </h2>

        {/* Video Container */}
        <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg mb-16">
          <video
            ref={videoRef}
            src="/videos/demo.mp4"
            muted={isMuted}
            controls={false}
            className="w-full h-auto rounded-xl cursor-pointer"
            onClick={handleVideoClick}
            onTimeUpdate={(e) => {
              if (!isZoomed && !isTransitioning) {
                setCurrentTime(e.currentTarget.currentTime);
              }
            }}
            onPause={() => !isTransitioning && setIsPaused(true)}
            onPlay={() => !isTransitioning && setIsPaused(false)}
          ></video>

          {/* Smooth overlay when paused */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isPaused && !isTransitioning ? "opacity-100 bg-black/40" : "opacity-0 pointer-events-none"
            }`}
            onClick={handleVideoClick}
          >
            <Play className="w-16 h-16 text-white" />
          </div>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            disabled={isTransitioning}
            className="absolute bottom-4 left-4 bg-black/60 p-2 rounded-full hover:bg-black/80 transition disabled:opacity-50"
          >
            {isMuted ? (
              <VolumeX className="text-white w-5 h-5" />
            ) : (
              <Volume2 className="text-white w-5 h-5" />
            )}
          </button>

          {/* Zoom button */}
          <button
            onClick={handleZoomIn}
            disabled={isTransitioning}
            className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full hover:bg-black/80 transition disabled:opacity-50"
          >
            <Maximize2 className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Pricing Title */}
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-12">
          Choose your plan!
        </h3>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {plans.map((plan, index) => (
            <div
            key={plan.name}
            className={`bg-white rounded-xl shadow-lg p-6 flex flex-col 
                border-2 border-transparent
                transition-transform duration-500 ease-in-out
                hover:scale-110 hover:border-[#FBB917]
                ${index === 1 ? "scale-105" : ""}`}
            >
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#fbb91740] flex items-center justify-center">
                <img src={plan.icon} alt={plan.name} className="w-10 h-10" />
            </div>

            {/* Name */}
            <h4 className="text-2xl font-bold text-black text-center">{plan.name}</h4>

            {/* Price */}
            <div className="text-4xl font-bold text-black mt-4 text-center">
                ${plan.price}
                <span className="text-lg font-normal text-gray-500">/mo</span>
            </div>

            <hr className="border-t border-gray-300 mt-6 w-[100%] mx-auto" />

            {/* Features */}
            <ul className="text-black text-base space-y-2 mt-4 mb-8">
                {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center justify-start gap-2 mt-4">
                    <img
                    src="https://c.animaapp.com/7YfctCCD/img/check-list-3-2@2x.png"
                    alt="check"
                    className="w-5 h-5"
                    />
                    {feature}
                </li>
                ))}
            </ul>

            {/* Button */}
            <button className="mt-auto w-[75%] py-2 bg-[#FBB917] rounded-lg font-bold text-black hover:bg-[#e0a815] transition mx-auto mb-4">
                Subscribe
            </button>
            </div>
        ))}
        </div>

      </div>

      {/* Smooth Zoomed Video Modal */}
      {isZoomed && (
        <div
          className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`relative max-w-6xl w-full px-4 transform transition-transform duration-300 ${
              modalVisible ? "scale-100" : "scale-95"
            }`}
          >
            <video
              ref={modalVideoRef}
              src="/videos/demo.mp4"
              muted={isMuted}
              controls
              className="w-full h-auto rounded-xl"
              onTimeUpdate={(e) => {
                if (isZoomed && !isTransitioning) {
                  setCurrentTime(e.currentTarget.currentTime);
                }
              }}
              onPause={() => !isTransitioning && setIsPaused(true)}
              onPlay={() => !isTransitioning && setIsPaused(false)}
              onLoadedData={() => {
                if (modalVideoRef.current && !isTransitioning) {
                  modalVideoRef.current.currentTime = currentTime;
                }
              }}
            ></video>
            <button
              onClick={handleZoomOut}
              disabled={isTransitioning}
              className="absolute top-6 right-9 bg-black/60 p-3 rounded-full hover:bg-black/80 transition disabled:opacity-50"
            >
              <X className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PricingPlans;
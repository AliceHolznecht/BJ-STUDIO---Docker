// hero.jsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useCallback, useMemo, useContext } from "react";
import VideoPreview from "./VideoPreview";
import { PreloadContext } from "../context/PreloadContext"; // 1. CRUCIAL IMPORT

gsap.registerPlugin(ScrollTrigger);

// CONFIGURATION
const VIDEOS = [
  { id: 1, src: "/videos/hero-1.mp4" },
  { id: 2, src: "/videos/hero-2.mp4" },
  { id: 3, src: "/videos/hero-3.mp4" },
  { id: 4, src: "/videos/hero-4.mp4" },
];
const TOTAL_VIDEOS = VIDEOS.length;

const Hero = () => {
  // REFS
  const heroRef = useRef(null);
  const containerARef = useRef(null);
  const containerBRef = useRef(null);
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const previewVideoRef = useRef(null);

  // STATE
  // 2. GET THE PRELOADED ASSETS FROM THE GLOBAL CONTEXT
  const loadedAssets = useContext(PreloadContext);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(1);
  const [containerAVideoIndex, setContainerAVideoIndex] = useState(1);
  const [containerBVideoIndex, setContainerBVideoIndex] = useState(2);
  const [activeContainer, setActiveContainer] = useState('A'); 
  const [isAnimating, setIsAnimating] = useState(false);

  // MEMOIZED HANDLERS & VALUES
  const handleMiniVideoClick = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const nextIndex = (currentVideoIndex % TOTAL_VIDEOS) + 1;
    setCurrentVideoIndex(nextIndex);
    
    if (activeContainer === 'A') {
      setContainerBVideoIndex(nextIndex);
    } else {
      setContainerAVideoIndex(nextIndex);
    }
  }, [currentVideoIndex, activeContainer, isAnimating]);

  const handlePreviewMouseEnter = useCallback(() => {
    previewVideoRef.current?.play().catch(() => {});
  }, []);

  const handlePreviewMouseLeave = useCallback(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
      previewVideoRef.current.currentTime = 0;
    }
  }, []);

  // 3. HELPER FUNCTION TO LOOK UP THE BLOB URL
  // This function takes a video ID, finds its original path, and returns the preloaded blob URL.
  const getVideoSrc = useCallback((index) => {
    const originalSrc = VIDEOS.find(v => v.id === index)?.src;
    return loadedAssets[originalSrc] || ""; // Fallback to empty string if not found
  }, [loadedAssets]);

  const previewVideoIndex = useMemo(() => (currentVideoIndex % TOTAL_VIDEOS) + 1, [currentVideoIndex]);

  // GSAP ANIMATION LOGIC
  useGSAP(() => {
    if (!isAnimating) {
      gsap.set(containerARef.current, { 
        visibility: 'visible',
        scale: 1,
        zIndex: activeContainer === 'A' ? 10 : 5,
      });
      gsap.set(containerBRef.current, { 
        visibility: activeContainer === 'B' ? 'visible' : 'hidden',
        scale: 1,
        zIndex: activeContainer === 'B' ? 10 : 5,
      });
    }

    const videos = gsap.utils.toArray(heroRef.current.querySelectorAll("video"));
    const playVideos = () => videos.forEach((v) => v.play?.().catch(() => {}));
    const pauseVideos = () => videos.forEach((v) => v.pause?.());

    ScrollTrigger.create({
      trigger: heroRef.current, start: "top bottom", end: "bottom top",
      onEnter: playVideos, onEnterBack: playVideos, onLeave: pauseVideos, onLeaveBack: pauseVideos,
    });

    gsap.fromTo("#video-frame",
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", borderRadius: "0px" },
      {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%", ease: "power1.inOut",
        scrollTrigger: { trigger: "#video-frame", start: "center center", end: "bottom center", scrub: true },
      }
    );

    if (isAnimating) {
      const growingContainer = activeContainer === 'A' ? containerBRef.current : containerARef.current;
      const shrinkingContainer = activeContainer === 'A' ? containerARef.current : containerBRef.current;
      const growingVideo = activeContainer === 'A' ? videoBRef.current : videoARef.current;

      if (growingVideo) {
        growingVideo.currentTime = 0;
        growingVideo.play().catch(() => {});
      }
      
      const transitionTL = gsap.timeline({
        onComplete: () => {
          const newActiveContainer = activeContainer === 'A' ? 'B' : 'A';
          setActiveContainer(newActiveContainer);
          gsap.set(shrinkingContainer, { visibility: 'hidden' });
          setIsAnimating(false);
        }
      });

      transitionTL
        .set(growingContainer, { visibility: 'visible', scale: 0.3, width: '16rem', height: '16rem', zIndex: 20, transformOrigin: 'center center', rotation: -5 })
        .to(growingContainer, { rotation: 0, duration: 0.3, ease: "power2.out" })
        .to(growingContainer, { scale: 1.1, duration: 0.4, ease: "power2.out" }, "-=0.1")
        .to(growingContainer, { width: '100%', height: '100%', duration: 0.6, ease: "power2.inOut" }, "-=0.3")
        .to(growingContainer, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, "-=0.2");
      
      if (previewVideoRef.current) {
        gsap.fromTo(previewVideoRef.current, 
          { scale: 0, rotation: -10, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.6)", delay: 0.3 }
        );
      }
    }
  }, { 
    dependencies: [isAnimating, activeContainer, currentVideoIndex],
    scope: heroRef, 
    revertOnUpdate: true 
  });

  // RENDER
  return (
    <div ref={heroRef} className="relative h-dvh w-screen overflow-x-hidden">
      <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
        <div>
          {/* Video Preview */}
          <div className="absolute-center absolute z-50 cursor-pointer">
            <VideoPreview
              ref={previewVideoRef}
              // 4. USE THE HELPER FUNCTION TO SET THE PRELOADED SRC
              videoSrc={getVideoSrc(previewVideoIndex)}
              onClick={handleMiniVideoClick}
              onMouseEnter={handlePreviewMouseEnter}
              onMouseLeave={handlePreviewMouseLeave}
            />
          </div>

          {/* Container A */}
          <div ref={containerARef} className="absolute-center absolute size-full">
            <video
              ref={videoARef}
              src={getVideoSrc(containerAVideoIndex)}
              autoPlay loop muted playsInline aria-hidden="true"
              className="size-full object-cover object-center"
            />
          </div>

          {/* Container B */}
          <div ref={containerBRef} className="absolute-center absolute size-full">
            <video
              ref={videoBRef}
              src={getVideoSrc(containerBVideoIndex)}
              autoPlay loop muted playsInline aria-hidden="true"
              className="size-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* Overlay Text Content */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-100">E<b>x</b>perie<b>n</b>ce</h1>
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">Redefi<b>n</b>e</h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100"></p>
          </div>
        </div>
      </div>
      
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black" aria-hidden="true">E<b>x</b>perie<b>n</b><b>c</b>e</h1>
    </div>
  );
};

export default Hero;
import { useState, useEffect, useRef, useCallback } from "react";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Story from "./components/Story";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import GlobalLoader from "./components/GlobalLoader";
import { PreloadContext } from "./context/PreloadContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { ReactLenis } from 'lenis/react';

// ─────────────────────────── ASSET MANIFEST ─────────────────────────────────

const soundtracks = {
  hero: "/audio/hero-theme.wav",
  about: "/audio/about-theme.wav",
  story: "/audio/features-theme.wav",
  contact: "/audio/contact-theme.wav",
};

const ALL_ASSETS = [
  // Critical assets
  { type: 'image', src: '/img/logo.png' },
  { type: 'video', src: '/videos/hero-1.mp4' },
  { type: 'video', src: '/videos/hero-2.mp4' },
  { type: 'video', src: '/videos/hero-3.mp4' },
  { type: 'video', src: '/videos/hero-4.mp4' },
  { type: 'audio', src: soundtracks.hero },

  // Secondary assets
  { type: 'audio', src: soundtracks.about },
  { type: 'audio', src: soundtracks.story },
  { type: 'audio', src: soundtracks.contact },
  ...Array.from({ length: 48 }, (_, i) => ({ type: 'image', src: `/img/about${i + 1}.jpg` })),
];

// ───────────────────────────────────────────────────────────────────────────

const processAssetList = async (assetList, onProgress) => {
  const totalAssets = assetList.length;
  let loadedCount = 0;
  const assetPromises = [];
  const newBlobUrls = {};

  const updateProgress = () => {
    loadedCount++;
    if (onProgress) {
        onProgress((loadedCount / totalAssets) * 100);
    }
  };

  assetList.forEach(asset => {
    let promise;
    if (asset.type === 'image') {
      promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = asset.src;
        img.onload = () => { updateProgress(); resolve(); };
        img.onerror = () => { updateProgress(); reject(new Error(`Failed to load image: ${asset.src}`)); };
      });
    } else { // 'video' or 'audio'
      promise = fetch(asset.src)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.blob();
        })
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          newBlobUrls[asset.src] = blobUrl;
          updateProgress();
        })
        .catch(error => {
          console.error(`Error loading ${asset.type} ${asset.src}:`, error);
          updateProgress();
        });
    }
    assetPromises.push(promise);
  });

  await Promise.allSettled(assetPromises);
  return newBlobUrls;
};

function App() {
  const [currentPage, setCurrentPage] = useState("hero");
  const [isPreloading, setIsPreloading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedAssets, setLoadedAssets] = useState({});
  const blobUrlsRef = useRef({});
  const lenisRef = useRef(null);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    
    gsap.ticker.add(update);
    lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);


  // Preload assets and set the preloading flag.
  useEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    let isCancelled = false;
    const preloadAllAssets = async () => {
      const handleProgress = (value) => {
        if (!isCancelled) setProgress(value);
      };

      const allBlobUrls = await processAssetList(ALL_ASSETS, handleProgress);

      if (!isCancelled) {
        setLoadedAssets(allBlobUrls);
        blobUrlsRef.current = allBlobUrls;
        setIsPreloading(false); // Signal that preloading is complete

        setTimeout(() => {
          ScrollTrigger.refresh(true); // Refresh GSAP after a short delay
        }, 100);
      }
    };

    preloadAllAssets();

    return () => {
      isCancelled = true;
      Object.values(blobUrlsRef.current).forEach(url => URL.revokeObjectURL(url));
    };
  }, []); 

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (lenis) {
        document.body.style.overflow = 'hidden';
        lenis.stop();
    }
  }, [lenisRef.current]); 


  const handleLoaderHidden = useCallback(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    document.body.style.overflow = 'auto';
    lenis.scrollTo(0, { immediate: true, force: true });
    lenis.start();
  }, [lenisRef]); 


  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ 
        autoRaf: false, 
        lerp: 0.1,
        wheelMultiplier: 1, 
        duration: 1.5,
        anchors: true 
      }}
    >
      <PreloadContext.Provider value={loadedAssets}>
        {/* Pass the callback function as a prop to the loader */}
        <GlobalLoader
          progress={progress}
          isPreloading={isPreloading}
          onHidden={handleLoaderHidden}
        />
        <main
          className="relative min-h-screen w-screen overflow-x-hidden transition-opacity duration-500"
          style={{ opacity: isPreloading ? 0 : 1 }}
        >
          <NavBar soundtrack={soundtracks[currentPage]} />
          <div onMouseEnter={() => setCurrentPage("hero")}><Hero /></div>
          <div onMouseEnter={() => setCurrentPage("about")}><About /></div>
          <div onMouseEnter={() => setCurrentPage("story")}><Story /></div>
          <div onMouseEnter={() => setCurrentPage("experience")}><Experience /></div>
          <div onMouseEnter={() => setCurrentPage("contact")}><Contact /></div>
          <Footer />
        </main>
      </PreloadContext.Provider>
    </ReactLenis>
  );
}

export default App;
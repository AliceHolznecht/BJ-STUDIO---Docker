import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import AnimatedTitle from "./AnimatedTitle";


gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" });

const images = Array.from({ length: 17 }, (_, i) => `img/about${i + 1}.jpg`);

const About = () => {
  const main = useRef();
  const imageElementRef = useRef();
  useLayoutEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useGSAP(() => {
    const q = gsap.utils.selector(main.current);
    
    const imageContainer = q('[data-image-container="main"]');
    const imageElement = imageElementRef.current;
    const clipContainer = q("#clip");
    const leftText = q('[data-text-container="left"]');
    const rightText = q('[data-text-container="right"]');

    // --- SETUP ---
    gsap.set(clipContainer, { perspective: 3000 });
    gsap.set(imageContainer, {
      rotationY: 40,
      rotationX: 15,
      scale: 1.2,
      transformOrigin: "50% 50%",
      transformStyle: "preserve-3d",
      force3D: true,
    });
    gsap.set([leftText, rightText], { opacity: 0, y: 20 });

    // --- MAIN SCROLL-PIN TIMELINE ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: clipContainer,
        start: "top top",
        end: "+=9000",
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onRefresh: (self) => {
            const frameIndex = Math.round(self.progress * (images.length -1));
            if(images[frameIndex]) {
                 imageElement.src = images[frameIndex];
            }
        }
      },
    });
    
    tl.to(imageContainer, {
        rotationY: 15, rotationX: 5, scale: 1.1,
        duration: 3, ease: "power3.out",
      })
      .to(leftText, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "<0.5")
      .addLabel("text1-out", "+=2")
      .to(leftText, { opacity: 0, y: -20, duration: 1.5, ease: "power2.in" }, "text1-out")
      .to(rightText, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "text1-out")
      .addLabel("text2-out", "+=2")
      .to(rightText, { opacity: 0, y: -20, duration: 1.5, ease: "power2.in" }, "text2-out")
      .addLabel("zoom", "-=1")
      .to(imageContainer, {
        rotationY: 0, rotationX: 0, scale: 4, borderRadius: "20%",
        duration: 4, ease: "power4.inOut",
      }, "zoom")
      .to({}, { duration: tl.duration() * 0.2 });


    // --- IMAGE SEQUENCE SCROLL ---
    const frame = { index: 0 };
    gsap.to(frame, {
      index: images.length - 1,
      snap: "index",
      ease: "none",
      scrollTrigger: {
        trigger: clipContainer,
        start: "top top",
        end: "+=4500",
        scrub: 1,
      },
      onUpdate: () => {
        const newIndex = Math.round(frame.index);
        if (imageElement && images[newIndex]) {
          imageElement.src = images[newIndex];
        }
      },
    });

  }, { scope: main }); 

  return (
    <div id="about" className="min-h-screen w-screen" ref={main}>
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5 px-4">
        <p className="font-general text-sm font-medium uppercase md:text-[11px]">
          Welcome to BJ STUDIO
        </p>
        <AnimatedTitle
          title="We <b>h</b>elp br<b>a</b>nds <b>c</b>reate <br />digit<b>a</b>l experien<b>c</b>es"
          containerClass="mt-5 !text-black text-center"
        />
      </div>

      <div id="clip">
        <div data-text-container="left" className="text-container left-10 w-1/4">
          <p className="font-general text-lg font-medium uppercase">
            BJ STUDIO is a digital production studio that brings your ideas to life through visually captivating designs and interactive experiences.
          </p>
        </div>
        <div data-image-container="main" className="about-image">
          {/* Add a ref to the image element */}
          <img
            ref={imageElementRef}
            src={images[0]}
            alt="About frame"
            className="w-full h-full object-cover object-center rounded-2xl"
          />
        </div>
        <div data-text-container="right" className="text-container right-10 w-1/4">
          <p className="font-general text-lg font-medium uppercase">
            At BJ STUDIO, we don't follow trends for the sake of it. We believe in a different approach - one that's centered around you, your audience, and the art of creating a memorable, personalized experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
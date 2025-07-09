import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Experience = () => {

  const mainRef = useRef(null);
  const panelsContainerRef = useRef(null);
  

  const slide1HeadingRef = useRef(null);
  const slide1SubheadingRef = useRef(null);
  const slide1ParagraphRef = useRef(null);
  const slide1AccentRef = useRef(null);
  
 
  const slide2IntroRef = useRef(null);
  const slide2ThinkingTitleRef = useRef(null);
  const slide2ThinkingTextRef = useRef(null);
  const slide2MakingTitleRef = useRef(null);
  const slide2MakingTextRef = useRef(null);
  const slide2FloatingTextRef = useRef(null);
  
 
  const slide3TitleRef = useRef(null);
  const slide3DescRef = useRef(null);
  const slide3ListRef = useRef(null);
  const slide3AccentTextRef = useRef(null);

  useEffect(() => {
   
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".panel", panelsContainerRef.current);

      const contentPanels = panels.length - 1; 
      
      const panelsTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: mainRef.current,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (contentPanels - 1), 
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
          },
          end: () => "+=" + (mainRef.current.offsetWidth * panels.length * 2.5), 
        },
      });

      if (slide1HeadingRef.current) {
        const headingSplit = new SplitText(slide1HeadingRef.current, { type: "chars" });
        gsap.from(headingSplit.chars, {
          opacity: 0,
          y: 100,
          rotation: 15,
          scale: 0.5,
          stagger: 0.05,
          scrollTrigger: {
            trigger: panels[1],
            containerAnimation: panelsTween,
            start: "left 90%",
            end: "left 40%",
            scrub: true,
          },
        });
      }

      if (slide1SubheadingRef.current && slide1AccentRef.current) {
        const subSplit = new SplitText(slide1SubheadingRef.current, { type: "words" });
        const accentSplit = new SplitText(slide1AccentRef.current, { type: "chars" });
        gsap.from([...subSplit.words, ...accentSplit.chars], {
          opacity: 0,
          x: -50,
          rotation: -10,
          stagger: 0.03,
          scrollTrigger: {
            trigger: panels[1],
            containerAnimation: panelsTween,
            start: "left 70%",
            end: "left 20%",
            scrub: true,
          },
        });
      }

      if (slide1ParagraphRef.current) {
        const paraSplit = new SplitText(slide1ParagraphRef.current, { type: "lines" });
        gsap.from(paraSplit.lines, {
          opacity: 0,
          x: 100,
          rotation: 5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: panels[1],
            containerAnimation: panelsTween,
            start: "left 50%",
            end: "right 80%",
            scrub: true,
          },
        });
      }

      if (slide2IntroRef.current) {
        const introSplit = new SplitText(slide2IntroRef.current, { type: "words" });
        gsap.from(introSplit.words, {
          opacity: 0,
          y: -30,
          rotation: 8,
          scale: 0.8,
          stagger: 0.04,
          scrollTrigger: {
            trigger: panels[2],
            containerAnimation: panelsTween,
            start: "left 90%",
            end: "left 40%",
            scrub: true,
          },
        });
      }

      if (slide2ThinkingTitleRef.current && slide2ThinkingTextRef.current) {
        const thinkingTitleSplit = new SplitText(slide2ThinkingTitleRef.current, { type: "chars" });
        const thinkingTextSplit = new SplitText(slide2ThinkingTextRef.current, { type: "lines" });
        gsap.from([...thinkingTitleSplit.chars, ...thinkingTextSplit.lines], {
          opacity: 0,
          x: -80,
          rotation: -15,
          stagger: 0.02,
          scrollTrigger: {
            trigger: panels[2],
            containerAnimation: panelsTween,
            start: "left 70%",
            end: "left 10%",
            scrub: true,
          },
        });
      }

      if (slide2MakingTitleRef.current && slide2MakingTextRef.current) {
        const makingTitleSplit = new SplitText(slide2MakingTitleRef.current, { type: "chars" });
        const makingTextSplit = new SplitText(slide2MakingTextRef.current, { type: "lines" });
        gsap.from([...makingTitleSplit.chars, ...makingTextSplit.lines], {
          opacity: 0,
          x: 80,
          rotation: 15,
          stagger: 0.02,
          scrollTrigger: {
            trigger: panels[2],
            containerAnimation: panelsTween,
            start: "left 50%",
            end: "right 90%",
            scrub: true,
          },
        });
      }

      if (slide2FloatingTextRef.current) {
        const floatingSplit = new SplitText(slide2FloatingTextRef.current, { type: "words" });
        gsap.from(floatingSplit.words, {
          opacity: 0,
          y: 50,
          rotation: -8,
          scale: 1.2,
          stagger: 0.05,
          scrollTrigger: {
            trigger: panels[2],
            containerAnimation: panelsTween,
            start: "left 30%",
            end: "right 70%",
            scrub: true,
          },
        });
      }
      
      if (slide3TitleRef.current) {
        const titleSplit = new SplitText(slide3TitleRef.current, { type: "chars" });
        gsap.from(titleSplit.chars, {
          opacity: 0,
          y: -100,
          rotation: 20,
          scale: 0.3,
          stagger: 0.03,
          scrollTrigger: {
            trigger: panels[3],
            containerAnimation: panelsTween,
            start: "left 95%",
            end: "left 50%", 
            scrub: true,
          },
        });
      }

      if (slide3DescRef.current) {
        const descSplit = new SplitText(slide3DescRef.current, { type: "lines" });
        gsap.from(descSplit.lines, {
          opacity: 0,
          x: -120,
          rotation: -12,
          stagger: 0.08,
          scrollTrigger: {
            trigger: panels[3],
            containerAnimation: panelsTween,
            start: "left 85%",
            end: "center center", 
            scrub: true,
          },
        });
      }

      if (slide3ListRef.current) {
        const listItems = gsap.utils.toArray("li", slide3ListRef.current);
        gsap.from(listItems, {
          opacity: 0,
          x: 100,
          y: (i) => i * 10,
          rotation: (i) => (i % 2 === 0 ? 5 : -5),
          stagger: 0.06,
          scrollTrigger: {
            trigger: panels[3],
            containerAnimation: panelsTween,
            start: "left 70%",
            end: "center 70%", 
            scrub: true,
          },
        });
      }

      if (slide3AccentTextRef.current) {
        const accentSplit = new SplitText(slide3AccentTextRef.current, { type: "words" });
        gsap.from(accentSplit.words, {
          opacity: 0,
          y: 80,
          rotation: 25,
          scale: 0.7,
          stagger: 0.04,
          scrollTrigger: {
            trigger: panels[3],
            containerAnimation: panelsTween,
            start: "left 60%",
            end: "center 80%", 
            scrub: true,
          },
        });
      }

      gsap.set(panels[3], {
        scrollTrigger: {
          trigger: panels[3],
          containerAnimation: panelsTween,
          start: "center center",
          end: "right left",
          onUpdate: (self) => {
            if (self.progress > 0.8) {
              const slowFactor = 1 - ((self.progress - 0.8) * 2.5);
              gsap.set(panels[3], { x: `${slowFactor}%` });
            }
          },
        },
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mainRef}
      id="experience"
      className="relative min-h-screen w-screen text-black flex flex-col justify-center overflow-hidden"
    >
    
      <h1 className="special-font hero-heading absolute bottom-5 right-5 z-20 pointer-events-none">
        S<b>T</b>UDI<b>O</b>
      </h1>
      <div className="absolute left-5 sm:left-10 top-24 z-20 pointer-events-none">
        <h1 className="special-font hero-heading">
          B<b>J</b>
        </h1>
      </div>

  
      <div ref={panelsContainerRef} className="flex h-screen w-[600vw]">
        
      
        <section className="panel w-screen h-full"></section>

      
        <section className="panel w-screen h-full flex items-center justify-center p-10 relative overflow-hidden">
          <div className="w-full h-full relative">
            
       
            <div className="absolute top-[15%] left-[10%] transform -rotate-12">
              <h2 ref={slide1HeadingRef} className="font-general text-4xl sm:text-6xl lg:text-8xl font-black uppercase leading-none tracking-tight">
                Redefine
              </h2>
            </div>
            
         
            <div className="absolute top-[25%] right-[20%] transform rotate-6">
              <h3 ref={slide1SubheadingRef} className="font-general text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide">
                Experience
              </h3>
            </div>
            
          
            <div className="absolute top-[50%] left-[5%] transform -rotate-90 origin-left">
              <span ref={slide1AccentRef} className="font-general text-lg sm:text-xl font-medium tracking-[0.3em] uppercase">
                with love
              </span>
            </div>
            
           
            <div className="absolute bottom-[20%] right-[15%] max-w-md transform rotate-3">
              <p ref={slide1ParagraphRef} className="font-general text-base sm:text-lg font-medium leading-relaxed text-right">
                We are BJ STUDIO, combining our skills to craft digital products,
                experiences, and art—embracing diversity as a source of
                enrichment at every turn. We approach our work with the time it
                truly deserves, knowing that each day brings an opportunity to
                add a touch of beauty to the world.
              </p>
            </div>

          
            <div className="absolute top-[60%] left-[50%] w-32 h-px bg-black transform rotate-45 opacity-30"></div>
            <div className="absolute bottom-[40%] left-[30%] w-24 h-px bg-black transform -rotate-12 opacity-20"></div>
          </div>
        </section>

       
        <section className="panel w-screen h-full flex items-center justify-center p-10 relative overflow-hidden">
          <div className="w-full h-full relative">
            
          
            <div className="absolute top-[10%] left-[25%] max-w-lg transform -rotate-2">
              <p ref={slide2IntroRef} className="font-general text-lg sm:text-xl font-medium leading-relaxed text-center">
                We begin each time with a connection, a human connection. By
                sharing ideas, we lay the foundations for tailor made projects,
                finding genuinely creative and functional solutions.
              </p>
            </div>

          
            <div className="absolute top-[35%] left-[5%] max-w-xs transform -rotate-6">
              <h3 ref={slide2ThinkingTitleRef} className="font-general font-black text-2xl sm:text-3xl mb-6 uppercase tracking-wider">
                THINKING
              </h3>
              <p ref={slide2ThinkingTextRef} className="font-general text-sm sm:text-base font-medium leading-relaxed">
                Our experience and many brainstorming are the starting point for
                designing long-lasting solutions. Thinking, for us, is not an
                abstract word, but the gateway to a creative language.
              </p>
            </div>

           
            <div className="absolute bottom-[25%] right-[8%] max-w-xs transform rotate-4">
              <h3 ref={slide2MakingTitleRef} className="font-general font-black text-2xl sm:text-3xl mb-6 uppercase tracking-wider">
                MAKING
              </h3>
              <p ref={slide2MakingTextRef} className="font-general text-sm sm:text-base font-medium leading-relaxed">
                We create and develop concrete experiences following our
                knowledge, our intuition and the needs of the customer,
                showing how each brand can develop upwards.
              </p>
            </div>

           
            <div className="absolute bottom-[10%] left-[40%] transform rotate-12">
              <span ref={slide2FloatingTextRef} className="font-general text-xl sm:text-2xl font-bold uppercase tracking-[0.2em]">
                Creative Process
              </span>
            </div>

           
            <div className="absolute top-[70%] left-[60%] w-40 h-px bg-black transform rotate-30 opacity-25"></div>
            <div className="absolute top-[20%] right-[35%] w-20 h-px bg-black transform -rotate-45 opacity-20"></div>
          </div>
        </section>

      
        <section className="panel w-screen h-full flex items-center justify-center p-10 relative overflow-hidden">
          <div className="w-full h-full relative">
            
           
            <div className="absolute top-[8%] right-[25%] transform rotate-12">
              <h2 ref={slide3TitleRef} className="font-general text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-[0.1em]">
                SERVICES
              </h2>
            </div>

           
            <div className="absolute top-[40%] left-[8%] max-w-sm transform -rotate-8">
              <p ref={slide3DescRef} className="font-general text-base sm:text-lg font-medium leading-relaxed">
                We help brands and individuals create digital experiences. Every
                day, we brainstorm and craft optimal solutions from diverse
                viewpoints, enabling brands to tell their stories in a way that
                truly reflects their essence.
              </p>
            </div>

           
            <div className="absolute top-[25%] right-[15%] max-w-sm">
              <ul ref={slide3ListRef} className="space-y-3 font-general text-base sm:text-lg font-medium">
                <li className="transform hover:translate-x-2 transition-transform duration-300 border-l-2 border-black pl-4 -rotate-1">
                  Creative Direction
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 pl-8 rotate-2">
                  Web design
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 border-l-2 border-black pl-4 -rotate-1">
                  Graphic design
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 pl-6 rotate-1">
                  Brand design
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 border-l-2 border-black pl-4 -rotate-2">
                  Content Production
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 pl-10 rotate-3">
                  Development
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 border-l-2 border-black pl-4 -rotate-1">
                  Prototypes
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 pl-8 rotate-2">
                  Photography & Films
                </li>
                <li className="transform hover:translate-x-2 transition-transform duration-300 border-l-2 border-black pl-4 -rotate-3">
                  Motion design
                </li>
              </ul>
            </div>

           
            <div className="absolute bottom-[15%] left-[45%] transform rotate-6">
              <span ref={slide3AccentTextRef} className="font-general text-lg font-bold uppercase tracking-[0.3em]">
                What we offer
              </span>
            </div>

          
            <div className="absolute top-[60%] left-[25%] w-48 h-px bg-black transform rotate-25 opacity-15"></div>
            <div className="absolute bottom-[45%] right-[40%] w-32 h-px bg-black transform -rotate-35 opacity-20"></div>
            <div className="absolute top-[85%] right-[60%] w-20 h-px bg-black transform rotate-60 opacity-10"></div>
          </div>
        </section>

      
        <section className="panel w-screen h-full"></section>

      </div>
    </div>
  );
};

export default Experience;
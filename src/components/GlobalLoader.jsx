import { useState, useEffect } from 'react';

const GlobalLoader = ({ progress, isPreloading, onHidden }) => {
  const [isHiding, setIsHiding] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    if (progress >= 100 && !isPreloading) {
      const hideTimer = setTimeout(() => {
        setIsHiding(true);
      }, 500);

      const destroyTimer = setTimeout(() => {
        setIsDestroyed(true);
        if (onHidden) {
          onHidden();
        }
      }, 1500); 

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(destroyTimer);
      };
    }
  }, [progress, isPreloading, onHidden]);
  
  if (isDestroyed) {
    return null;
  }

  return (
    <>
      <div
        className={`
          fixed inset-0 z-[200] bg-black
          transition-opacity duration-1000 ease-in-out
          ${isHiding ? 'opacity-0' : 'opacity-100'}
        `}
      />
      <div
        className={`
          flex-center fixed inset-0 z-[201]
          transition-all duration-1000 ease-in-out
          ${isHiding ? 'opacity-0 blur-2xl contrast-200 scale-110' : 'opacity-100 blur-0 contrast-100 scale-100'}
        `}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <img src="/img/logo.png" alt="Loading..." className="h-15 w-15 animate-pulse" />
          <div className="relative font-light text-white text-[clamp(3rem,20vw,8rem)]">
            <span className="special-font tracking-tighter tabular-nums">{Math.round(progress)}</span>
            <span className="special-font absolute top-4 -right-8 text-3xl opacity-50">%</span>
          </div>
          <p className="font-robert-regular text-sm tracking-widest text-white">PREPARING THE EXPERIENCE</p>
        </div>
      </div>
    </>
  );
};

export default GlobalLoader;
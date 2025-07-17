// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\hooks\useScrollProgress.ts
import { useState, useEffect } from 'react';
import { SCROLL_CONFIG } from '../LandingPage.constants';

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maskOpacity, setMaskOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * SCROLL_CONFIG.animationDelay), 1);

      setScrollProgress(progress);

      // 更新遮罩透明度
      if (progress > SCROLL_CONFIG.fadeOutThreshold) {
        const fadeProgress = (progress - SCROLL_CONFIG.fadeOutThreshold) / SCROLL_CONFIG.fadeOutDuration;
        setMaskOpacity(Math.max(0, 1 - fadeProgress));
      } else {
        setMaskOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始调用

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollProgress, maskOpacity };
};
// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\hooks\useScrollProgress.ts
import { useState, useEffect } from 'react';
import { SCROLL_CONFIG } from '../LandingPage.constants';

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maskOpacity, setMaskOpacity] = useState(1);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const maxScrollY = documentHeight - windowHeight;
          
          // 限制滚动进度在合理范围内，防止快速滚动造成的异常值
          const rawProgress = Math.min(scrollY / (windowHeight * SCROLL_CONFIG.animationDelay), 1);
          const clampedProgress = Math.max(0, Math.min(1, rawProgress));

          setScrollProgress(clampedProgress);

          // 更新遮罩透明度 - 添加缓动和边界保护
          if (clampedProgress > SCROLL_CONFIG.fadeOutThreshold) {
            const fadeProgress = (clampedProgress - SCROLL_CONFIG.fadeOutThreshold) / SCROLL_CONFIG.fadeOutDuration;
            const clampedFadeProgress = Math.max(0, Math.min(1, fadeProgress));
            setMaskOpacity(Math.max(0, 1 - clampedFadeProgress));
          } else {
            setMaskOpacity(1);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始调用

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollProgress, maskOpacity };
};
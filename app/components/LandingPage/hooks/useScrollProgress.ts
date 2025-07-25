// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\hooks\useScrollProgress.ts
import { useState, useEffect } from 'react';
import { SCROLL_CONFIG } from '../LandingPage.config';

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maskOpacity, setMaskOpacity] = useState(1);

  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // 仅在滚动位置显著变化时更新（减少不必要的计算）
          if (Math.abs(scrollY - lastScrollY) > 1) {
            lastScrollY = scrollY;
            const windowHeight = window.innerHeight;
            
            // 使用更长的滚动距离来实现更平滑的动画
            const rawProgress = Math.min(scrollY / (windowHeight * SCROLL_CONFIG.animationDelay), 1);
            const clampedProgress = Math.max(0, Math.min(1, rawProgress));

            // 批量更新状态
            setScrollProgress(clampedProgress);

            // 更新遮罩透明度
            if (clampedProgress > SCROLL_CONFIG.fadeOutThreshold) {
              const fadeProgress = (clampedProgress - SCROLL_CONFIG.fadeOutThreshold) / SCROLL_CONFIG.fadeOutDuration;
              const clampedFadeProgress = Math.max(0, Math.min(1, fadeProgress));
              setMaskOpacity(Math.max(0, 1 - clampedFadeProgress));
            } else {
              setMaskOpacity(1);
            }
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
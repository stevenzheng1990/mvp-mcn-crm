// app/components/LandingPage/hooks/useOptimizedScroll.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { SCROLL_CONFIG } from '../LandingPage.config';

export const useOptimizedScroll = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maskOpacity, setMaskOpacity] = useState(1);
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  // 平滑插值函数
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // 动画循环
  const animate = useCallback(() => {
    // 平滑过渡到目标值
    currentProgress.current = lerp(currentProgress.current, targetProgress.current, 0.1);
    
    // 只有在值有显著变化时才更新状态
    if (Math.abs(currentProgress.current - scrollProgress) > 0.001) {
      setScrollProgress(currentProgress.current);
      
      // 计算遮罩透明度
      if (currentProgress.current > SCROLL_CONFIG.fadeOutThreshold) {
        const fadeProgress = (currentProgress.current - SCROLL_CONFIG.fadeOutThreshold) / SCROLL_CONFIG.fadeOutDuration;
        const clampedFadeProgress = Math.max(0, Math.min(1, fadeProgress));
        setMaskOpacity(Math.max(0, 1 - clampedFadeProgress));
      } else {
        setMaskOpacity(1);
      }
    }
    
    rafId.current = requestAnimationFrame(animate);
  }, [scrollProgress]);

  useEffect(() => {
    // 使用节流的滚动处理
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // 计算目标进度
        const rawProgress = Math.min(scrollY / (windowHeight * SCROLL_CONFIG.animationDelay), 1);
        targetProgress.current = Math.max(0, Math.min(1, rawProgress));
        
        lastScrollY.current = scrollY;
      }, 10); // 10ms 节流
    };

    // 启动动画循环
    rafId.current = requestAnimationFrame(animate);
    
    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    handleScroll(); // 初始调用

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [animate]);

  return { scrollProgress, maskOpacity };
};
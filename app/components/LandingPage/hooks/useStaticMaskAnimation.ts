// app/components/LandingPage/hooks/useStaticMaskAnimation.ts
import { useState, useEffect, useRef } from 'react';

export const useStaticMaskAnimation = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [shouldHideMask, setShouldHideMask] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      // 立即暂停动画
      setIsScrolling(true);
      
      // 清除之前的定时器
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // 检查是否应该隐藏遮罩
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setShouldHideMask(scrollY > windowHeight * 0.8);
      
      // 滚动停止后恢复动画
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  return { isScrolling, shouldHideMask };
};
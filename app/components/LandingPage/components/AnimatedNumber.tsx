// app/components/LandingPage/components/AnimatedNumber.tsx
import React, { useEffect, useState, useRef } from 'react';
import { AnimatedNumberProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value, 
  delay = 0, 
  duration = 2000,
  inView = true 
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number>();
  
  // 解析值，支持百分比、金额、比例等格式
  const parseValue = (val: string) => {
    const match = val.match(/^([\d.]+)(.*)$/);
    if (!match) return { number: 0, suffix: val };
    
    return {
      number: parseFloat(match[1]),
      suffix: match[2] || ''
    };
  };
  
  useEffect(() => {
    if (!inView || hasAnimated) return;
    
    const { number: targetNumber, suffix } = parseValue(value);
    
    // 如果不是数字，直接显示
    if (isNaN(targetNumber)) {
      setDisplayValue(value);
      return;
    }
    
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime - delay;
      
      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeOutQuart = (t: number): number => {
        return 1 - Math.pow(1 - t, 4);
      };
      
      const easedProgress = easeOutQuart(progress);
      const currentValue = startValue + (targetNumber - startValue) * easedProgress;
      
      // 格式化显示值
      const formattedValue = value.includes('.') 
        ? currentValue.toFixed(1)
        : Math.round(currentValue).toString();
      
      setDisplayValue(formattedValue + suffix);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, delay, duration, inView, hasAnimated]);
  
  return (
    <span 
      className="animated-number"
      style={{
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
        transition: `opacity ${DESIGN_TOKENS.animation.duration.slow} ease`,
        opacity: inView ? 1 : 0,
      }}
    >
      {displayValue}
    </span>
  );
};

export default AnimatedNumber;
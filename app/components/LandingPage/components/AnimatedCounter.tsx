// app/components/LandingPage/components/AnimatedCounter.tsx
import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  inView?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2000,
  inView = false 
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!inView || hasAnimated) return;

    // 解析数值和单位
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const [, numStr, suffix] = match;
    const targetNum = parseFloat(numStr);
    const isDecimal = numStr.includes('.');
    const decimalPlaces = isDecimal ? numStr.split('.')[1].length : 0;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // 使用缓动函数
      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
      const easedProgress = easeOutQuart(progress);
      
      const currentValue = targetNum * easedProgress;
      const formattedValue = isDecimal 
        ? currentValue.toFixed(decimalPlaces)
        : Math.floor(currentValue).toString();
      
      setDisplayValue(formattedValue + suffix);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
        setDisplayValue(value); // 确保最终显示准确的值
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [value, duration, inView, hasAnimated]);

  return <span>{displayValue}</span>;
};

export default AnimatedCounter;
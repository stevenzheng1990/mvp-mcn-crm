import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * GSAP优化版声波动画组件 - 保持所有原始效果，提升性能和流畅度
 */
const AudioWaveAnimation = () => {
  // ========== 配置参数区域 ==========
  const CONFIG = {
    // 基础视觉配置
    opacity: 0.96,
    background: 'transparent',
    
    // 条形配置
    barSpacing: 18,              
    barWidthRatio: 0.5,          
    minBarCount: 220,             
    
    // 高度配置
    maxHeightRatio: 0.95,        
    minHeight: 4,                
    
    // 缩放配置
    zoomConfig: {
      minZoom: 0.3,              
      maxZoom: 3.5,              
      sensitivity: 0.008,        
      mouseZoomBoost: 0,       
    },
    
    // 鼠标交互
    mouseInfluenceRadius: 140,   
    mouseBoostRatio: 0.7,       
    
    // 波动参数（真实频谱效果）
    waveFlow: {
      speed: 0.003,               
      primaryFreq: 0.08,         
      secondaryFreq: 0.15,       
      tertiaryFreq: 0.23,        
      asymmetryFactor: 0.3,      
      randomness: 0.15,          
    },
    
    // 颜色配置 - 偏暖的淡灰色
    colorRange: {
      r: { min: 209, max: 226 },
      g: { min: 208, max: 225 }, 
      b: { min: 204, max: 221 }
    },
    // 鼠标附近的高亮颜色
    mouseColorRange: {
      r: { min: 200, max: 236 },
      g: { min: 195, max: 234 },
      b: { min: 188, max: 221 }
    },
    opacityRange: {
      min: 0.2,                 
      max: 0.5                   
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const zoomRef = useRef<number>(CONFIG.zoomConfig.minZoom);
  const opacityRef = useRef<number>(1);
  const randomOffsetsRef = useRef<Array<{
    phase: number;
    amplitude: number;
    frequency: number;
  }>>([]);

  // GSAP优化：使用 gsap.ticker 替代 requestAnimationFrame
  const tickerRef = useRef<(() => void) | null>(null);
  
  // 性能优化：缓存计算结果
  const cachedValuesRef = useRef<{
    barPositions: number[];
    barWidths: number[];
    lastCanvasWidth: number;
    lastBarCount: number;
  }>({
    barPositions: [],
    barWidths: [],
    lastCanvasWidth: 0,
    lastBarCount: 0
  });

  // 初始化随机偏移
  useEffect(() => {
    randomOffsetsRef.current = Array(CONFIG.minBarCount * 2).fill(0).map(() => ({
      phase: Math.random() * Math.PI * 2,
      amplitude: 0.5 + Math.random() * 0.5,
      frequency: 0.5 + Math.random() * 1.5
    }));
  }, []);

  // 处理滚动事件 - GSAP优化版
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollProgress = Math.min(scrollY / (windowHeight * 2), 1);
    
    // 使用GSAP来平滑更新值
    gsap.to(zoomRef, {
      current: CONFIG.zoomConfig.minZoom + 
        (CONFIG.zoomConfig.maxZoom - CONFIG.zoomConfig.minZoom) * 
        (1 - Math.pow(1 - scrollProgress, 3)),
      duration: 0.3,
      ease: "power2.out"
    });
    
    gsap.to(opacityRef, {
      current: Math.max(0.1, 1 - scrollProgress * 0.8),
      duration: 0.3,
      ease: "power2.out"
    });
  }, [CONFIG.zoomConfig.minZoom, CONFIG.zoomConfig.maxZoom]);

  // 鼠标事件处理 - GSAP优化版
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;
    
    // 使用GSAP平滑鼠标跟踪
    gsap.to(mouseRef.current, {
      x: newX,
      y: newY,
      duration: 0.15,
      ease: "power2.out"
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    // 使用GSAP平滑移出效果
    gsap.to(mouseRef.current, {
      x: -1000,
      y: -1000,
      duration: 0.8,
      ease: "power2.out"
    });
  }, []);

  // 性能优化：缓存计算条形位置
  const updateBarCache = useCallback((canvasWidth: number, barCount: number) => {
    if (cachedValuesRef.current.lastCanvasWidth === canvasWidth && 
        cachedValuesRef.current.lastBarCount === barCount) {
      return; // 已缓存，无需重计算
    }

    const spacing = canvasWidth / barCount;
    const barWidth = spacing * CONFIG.barWidthRatio;
    
    cachedValuesRef.current.barPositions = [];
    cachedValuesRef.current.barWidths = [];
    
    for (let i = 0; i < barCount; i++) {
      const x = i * spacing + (spacing - barWidth) / 2;
      cachedValuesRef.current.barPositions.push(x);
      cachedValuesRef.current.barWidths.push(barWidth);
    }
    
    cachedValuesRef.current.lastCanvasWidth = canvasWidth;
    cachedValuesRef.current.lastBarCount = barCount;
  }, [CONFIG.barWidthRatio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置高DPI支持
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // GSAP优化的动画函数
    const animate = () => {
      const canvasWidth = canvas.width / dpr;
      const canvasHeight = canvas.height / dpr;
      
      if (canvasWidth === 0 || canvasHeight === 0) return;

      // 清除画布
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 计算条形数量和缓存位置
      const barCount = Math.max(CONFIG.minBarCount, Math.floor(canvasWidth / CONFIG.barSpacing));
      updateBarCache(canvasWidth, barCount);
      
      const enhancedZoom = zoomRef.current;
      const maxBarHeight = canvasHeight * CONFIG.maxHeightRatio * enhancedZoom;
      const baseY = canvasHeight * 0.5;
      
      // 时间偏移用于波向右流动
      const timeOffset = timeRef.current * CONFIG.waveFlow.speed;
      
      // 性能优化：批量处理绘制操作
      ctx.save();
      
      // 绘制每个声波条
      for (let i = 0; i < barCount; i++) {
        const x = cachedValuesRef.current.barPositions[i];
        const barWidth = cachedValuesRef.current.barWidths[i];
        const barCenterX = x + barWidth / 2;
        
        // 计算鼠标影响（优化：减少sqrt计算）
        let mouseInfluence = 0;
        if (mouseRef.current.x >= 0 && mouseRef.current.x <= canvasWidth && 
            mouseRef.current.y >= 0 && mouseRef.current.y <= canvasHeight) {
          const dx = barCenterX - mouseRef.current.x;
          const dy = baseY - mouseRef.current.y;
          const distanceSquared = dx * dx + dy * dy;
          const radiusSquared = CONFIG.mouseInfluenceRadius * CONFIG.mouseInfluenceRadius;
          
          if (distanceSquared < radiusSquared) {
            mouseInfluence = Math.max(0, 1 - distanceSquared / radiusSquared);
          }
        }
        
        // 获取随机参数
        const randomData = randomOffsetsRef.current[i % randomOffsetsRef.current.length];
        
        // 波形计算（真实频谱效果）
        const normalizedIndex = i / barCount;
        
        // 性能优化：减少三角函数计算
        const baseFreq = normalizedIndex * Math.PI;
        const timeOffsetFactor = timeOffset * 8;
        
        // 主波形
        const primaryWave = Math.sin(baseFreq * 6 - timeOffsetFactor + randomData.phase) * randomData.amplitude;
        
        // 次波形
        const secondaryWave = Math.sin(baseFreq * 12 - timeOffset * 12) * 0.4;
        
        // 第三波形（高频）
        const tertiaryWave = Math.sin(baseFreq * 24 - timeOffset * 16) * 0.2;
        
        // 随机扰动
        const randomWave = Math.sin(timeRef.current * 0.05 * randomData.frequency + randomData.phase) * CONFIG.waveFlow.randomness;
        
        // 非对称调制
        const asymmetry = Math.sin(baseFreq * 3 + timeOffset * 4) * CONFIG.waveFlow.asymmetryFactor;
        
        // 组合波形
        const combinedWave = (primaryWave + secondaryWave + tertiaryWave + randomWave) * (1 + asymmetry);
        
        // 归一化到 0-1 范围
        const normalizedWave = Math.max(0, (combinedWave + 2) / 4);
        
        // 计算高度
        const baseHeight = CONFIG.minHeight + (maxBarHeight - CONFIG.minHeight) * normalizedWave;
        const mouseBoost = mouseInfluence * maxBarHeight * CONFIG.mouseBoostRatio;
        const finalHeight = Math.max(CONFIG.minHeight, baseHeight + mouseBoost);
        
        // 计算上下分配（不对称但都有合理分布）
        const asymmetryBias = 0.6;
        const dynamicRatio = 0.3 + Math.abs(Math.sin(i * 0.3 + timeOffset * 3)) * 0.4;
        
        const upwardHeight = finalHeight * (asymmetryBias + (1 - asymmetryBias) * dynamicRatio);
        const downwardHeight = finalHeight * (1 - asymmetryBias) * (1 + dynamicRatio);
        
        // 颜色和透明度计算
        const intensity = normalizedWave + mouseInfluence * 0.4;
        const opacity = (CONFIG.opacityRange.min + 
          intensity * (CONFIG.opacityRange.max - CONFIG.opacityRange.min)) * opacityRef.current;
        
        // 根据鼠标影响选择颜色
        let r, g, b;
        if (mouseInfluence > 0.3) {
          // 鼠标附近使用更亮的颜色
          const colorMix = mouseInfluence;
          r = Math.floor(
            CONFIG.colorRange.r.min * (1 - colorMix) + CONFIG.mouseColorRange.r.min * colorMix +
            intensity * (CONFIG.mouseColorRange.r.max - CONFIG.mouseColorRange.r.min) * colorMix
          );
          g = Math.floor(
            CONFIG.colorRange.g.min * (1 - colorMix) + CONFIG.mouseColorRange.g.min * colorMix +
            intensity * (CONFIG.mouseColorRange.g.max - CONFIG.mouseColorRange.g.min) * colorMix
          );
          b = Math.floor(
            CONFIG.colorRange.b.min * (1 - colorMix) + CONFIG.mouseColorRange.b.min * colorMix +
            intensity * (CONFIG.mouseColorRange.b.max - CONFIG.mouseColorRange.b.min) * colorMix
          );
        } else {
          // 正常颜色
          r = Math.floor(CONFIG.colorRange.r.min + intensity * (CONFIG.colorRange.r.max - CONFIG.colorRange.r.min));
          g = Math.floor(CONFIG.colorRange.g.min + intensity * (CONFIG.colorRange.g.max - CONFIG.colorRange.g.min));
          b = Math.floor(CONFIG.colorRange.b.min + intensity * (CONFIG.colorRange.b.max - CONFIG.colorRange.b.min));
        }
        
        // 绘制主条形（向上）
        const adjustedOpacity = opacity * (1 + mouseInfluence * 0.5);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(adjustedOpacity, 1)})`;
        ctx.fillRect(x, baseY - upwardHeight, barWidth, upwardHeight);
        
        // 绘制向下的部分
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(adjustedOpacity * 0.85, 1)})`;
        ctx.fillRect(x, baseY, barWidth, downwardHeight);
        
        // 添加微妙的高光效果
        if (intensity > 0.7 || mouseInfluence > 0.5) {
          const highlightOpacity = Math.max(
            (intensity - 0.7) * 0.3,
            mouseInfluence * 0.4
          ) * opacityRef.current;
          ctx.fillStyle = `rgba(255, 250, 245, ${highlightOpacity})`;
          ctx.fillRect(x, baseY - upwardHeight, barWidth, Math.max(2, upwardHeight * 0.05));
        }
        
        // 鼠标附近的暖色光晕效果
        if (mouseInfluence > 0.1) {
          const glowOpacity = mouseInfluence * 0.2 * opacityRef.current;
          const glowR = 255;
          const glowG = 235 - (mouseInfluence * 20);
          const glowB = 200 - (mouseInfluence * 40);
          ctx.fillStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${glowOpacity})`;
          ctx.fillRect(x - 2, baseY - upwardHeight - 3, barWidth + 4, upwardHeight + downwardHeight + 6);
        }
      }
      
      ctx.restore();
      timeRef.current += 1;
    };

    // 使用GSAP的ticker系统替代requestAnimationFrame
    // 这提供了更好的性能和同步
    tickerRef.current = animate;
    gsap.ticker.add(animate);

    // 事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      
      // 清理GSAP ticker和timeline
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [handleScroll, handleMouseMove, handleMouseLeave, updateBarCache, CONFIG]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        opacity: CONFIG.opacity,
        background: CONFIG.background,
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default AudioWaveAnimation;
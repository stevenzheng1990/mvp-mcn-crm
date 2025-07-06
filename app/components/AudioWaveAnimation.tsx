import React, { useEffect, useRef, useCallback } from 'react';

/**
 * 优化版声波动画组件 - 波形向右流动，通过长短变化展现震动质感
 */
const AudioWaveAnimation: React.FC = () => {
  // ========== 配置参数区域 ==========
  const CONFIG = {
    // 基础视觉配置
    opacity: 0.3,
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0a0a0a 100%)',
    
    // 条形配置
    barSpacing: 18,              // 条形基础间距
    barWidthRatio: 0.6,          // 条形宽度占间距的比例
    minBarCount: 120,             // 最少条形数量
    
    // 高度配置
    maxHeightRatio: 0.85,        // 最大高度占画布高度的比例
    minHeight: 8,                // 最小条形高度
    
    // 缩放配置
    zoomConfig: {
      minZoom: 0.3,              // 最小缩放比例（镜头最远）
      maxZoom: 3.5,              // 最大缩放比例（镜头最近）
      sensitivity: 0.005,        // 滚动敏感度
      mouseZoomBoost: 0.0,       // 鼠标悬停时的额外缩放
    },
    
    // 鼠标交互
    mouseInfluenceRadius: 220,   // 鼠标影响半径
    mouseBoostRatio: 0.35,       // 鼠标影响的高度增幅
    
    // 波动参数（向右流动）
    waveFlow: {
      speed: 0.008,               // 波向右流动的速度
      primaryFreq: 0.08,         // 主波频率
      secondaryFreq: 0.15,       // 次波频率
      lengthVariation: 0.6,      // 长短变化幅度
    },
    
    // 颜色配置
    colorRange: {
      min: 100,                  // 最小灰度值
      max: 220                   // 最大灰度值
    },
    opacityRange: {
      min: 0.18,                 // 最小透明度
      max: 0.5                   // 最大透明度
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef<number>(CONFIG.zoomConfig.minZoom);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // 计算滚动进度（0-1之间）
    const scrollProgress = Math.min(scrollY / (windowHeight * 1.5), 1);
    
    // 计算目标缩放比例
    const targetZoom = CONFIG.zoomConfig.minZoom + 
      scrollProgress * (CONFIG.zoomConfig.maxZoom - CONFIG.zoomConfig.minZoom);
    
    // 直接设置缩放值，不使用平滑过渡（测试用）
    zoomRef.current = targetZoom;
    
    // 调试信息
    console.log('Scroll Y:', scrollY, 'Progress:', scrollProgress, 'Zoom:', targetZoom);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2
      };
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // 添加事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 主动画函数
    const animate = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // 应用缩放效果
      const currentZoom = zoomRef.current;
      
      // 鼠标悬停增强缩放
      const centerDistance = Math.sqrt(
        Math.pow(mouseRef.current.x - canvasWidth / 2, 2) + 
        Math.pow(mouseRef.current.y - canvasHeight / 2, 2)
      );
      const mouseZoomFactor = Math.max(0, 1 - centerDistance / (canvasWidth * 0.25));
      const enhancedZoom = currentZoom + mouseZoomFactor * CONFIG.zoomConfig.mouseZoomBoost;
      
      // 计算缩放后的条形参数
      const scaledSpacing = CONFIG.barSpacing / enhancedZoom;
      const barCount = Math.max(CONFIG.minBarCount, Math.floor(canvasWidth / scaledSpacing));
      const barWidth = (canvasWidth / barCount) * CONFIG.barWidthRatio;
      const spacing = canvasWidth / barCount;
      const maxBarHeight = canvasHeight * CONFIG.maxHeightRatio * enhancedZoom; // 重要：高度也要缩放
      const centerY = canvasHeight / 2;
      
      // 时间偏移用于波向右流动
      const timeOffset = timeRef.current * CONFIG.waveFlow.speed;
      
      // 绘制每个声波条
      for (let i = 0; i < barCount; i++) {
        const x = i * spacing + (spacing - barWidth) / 2;
        const barCenterX = x + barWidth / 2;
        
        // 计算鼠标影响
        const distanceToMouse = Math.sqrt(
          Math.pow(barCenterX - mouseRef.current.x, 2) + 
          Math.pow(centerY - mouseRef.current.y, 2)
        );
        const mouseInfluence = Math.max(0, 
          (CONFIG.mouseInfluenceRadius - distanceToMouse) / CONFIG.mouseInfluenceRadius
        );
        
        // 波形向右流动的计算
        // 关键：用 i * frequency - timeOffset 让波向右流动
        const normalizedIndex = i / barCount;
        
        // 主波形（向右流动）
        const primaryWave = Math.sin(
          normalizedIndex * Math.PI * 6 - timeOffset * 8
        );
        
        // 次波形（不同频率，增加复杂度）
        const secondaryWave = Math.sin(
          normalizedIndex * Math.PI * 12 - timeOffset * 12
        ) * 0.5;
        
        // 长短变化波（这是震动质感的核心）
        const lengthWave = Math.sin(
          normalizedIndex * Math.PI * 8 - timeOffset * 10
        ) * CONFIG.waveFlow.lengthVariation;
        
        // 组合波形
        const combinedWave = primaryWave + secondaryWave + lengthWave;
        
        // 归一化到 0-1 范围
        const normalizedWave = Math.max(0, (combinedWave + 2) / 4);
        
        // 计算最终高度（长短变化体现震动质感）
        const baseHeight = CONFIG.minHeight + (maxBarHeight - CONFIG.minHeight) * normalizedWave;
        const mouseBoost = mouseInfluence * maxBarHeight * CONFIG.mouseBoostRatio;
        const finalHeight = Math.max(CONFIG.minHeight, baseHeight + mouseBoost);
        
        const barY = centerY - finalHeight / 2;
        
        // 颜色和透明度计算
        const intensity = normalizedWave + mouseInfluence * 0.4;
        const opacity = CONFIG.opacityRange.min + 
          intensity * (CONFIG.opacityRange.max - CONFIG.opacityRange.min);
        
        const grayValue = Math.floor(
          CONFIG.colorRange.min + intensity * (CONFIG.colorRange.max - CONFIG.colorRange.min)
        );
        
        // 绘制主条形
        ctx.fillStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${opacity})`;
        ctx.fillRect(x, barY, barWidth, finalHeight);
        
        // 添加高光效果（对于较高的条形）
        if (intensity > 0.7) {
          const highlightOpacity = (intensity - 0.7) * 0.4;
          ctx.fillStyle = `rgba(255, 255, 255, ${highlightOpacity})`;
          ctx.fillRect(x, barY, barWidth, Math.max(2, finalHeight * 0.05));
        }
        
        // 鼠标附近的光晕效果
        if (mouseInfluence > 0.2) {
          const glowOpacity = mouseInfluence * 0.15;
          ctx.fillStyle = `rgba(180, 180, 255, ${glowOpacity})`;
          // 绘制稍宽一点的背景光晕
          ctx.fillRect(x - 1, barY - 2, barWidth + 2, finalHeight + 4);
        }
      }

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    // 启动动画
    animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleScroll]);

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
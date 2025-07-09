import React, { useEffect, useRef, useCallback } from 'react';

/**
 * 优化版声波动画组件 - 真实音波频谱效果
 */
const AudioWaveAnimation = () => {
  // ========== 配置参数区域 ==========
  const CONFIG = {
    // 基础视觉配置
    opacity: 1,
    background: 'transparent',
    
    // 条形配置
    barSpacing: 12,              
    barWidthRatio: 0.5,          
    minBarCount: 280,             
    
    // 高度配置
    maxHeightRatio: 1,        
    minHeight: 1,                
    
    // 缩放配置
    zoomConfig: {
      minZoom: 0.25,              
      maxZoom: 6,              
      sensitivity: 0.002,        
      mouseZoomBoost: 0,       
    },
    
    // 鼠标交互
    mouseInfluenceRadius: 140,   // 增大影响半径
    mouseBoostRatio: 0.65,       // 增强高度影响
    
    // 波动参数（真实频谱效果）
    waveFlow: {
      speed: 0.001,               
      primaryFreq: 0.02,         
      secondaryFreq: 0.15,       
      tertiaryFreq: 0.23,        
      asymmetryFactor: 0.3,      
      randomness: 0.15,          
    },
    
    // 颜色配置 - 偏暖的淡灰色
    colorRange: {
      r: { min: 189, max: 219 },
      g: { min: 188, max: 216 }, 
      b: { min: 172, max: 201 }
    },
    // 鼠标附近的高亮颜色
    mouseColorRange: {
      r: { min: 200, max: 236 }, // 更亮的暖白色
      g: { min: 194, max: 234 },
      b: { min: 192, max: 227 }
    },
    opacityRange: {
      min: 0.25,                 
      max: 0.55                   
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 }); // 初始位置在屏幕外
  const zoomRef = useRef<number>(CONFIG.zoomConfig.minZoom);
  const opacityRef = useRef<number>(1);
  const randomOffsetsRef = useRef<Array<{
    phase: number;
    amplitude: number;
    frequency: number;
  }>>([]);

  // 初始化随机偏移
  useEffect(() => {
    randomOffsetsRef.current = Array(CONFIG.minBarCount * 2).fill(0).map(() => ({
      phase: Math.random() * Math.PI * 2,
      amplitude: 0.5 + Math.random() * 0.5,
      frequency: 0.5 + Math.random() * 1.5
    }));
  }, []);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollProgress = Math.min(scrollY / (windowHeight * 1.5), 1);
    const targetZoom = CONFIG.zoomConfig.minZoom + 
      scrollProgress * (CONFIG.zoomConfig.maxZoom - CONFIG.zoomConfig.minZoom);
    zoomRef.current = targetZoom;
    
    // 计算透明度：滚动到底部时降低20%
    const baseOpacity = 1;
    const opacityReduction = 0.2;
    opacityRef.current = baseOpacity - (scrollProgress * opacityReduction);
  }, [CONFIG.zoomConfig.minZoom, CONFIG.zoomConfig.maxZoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 不再重置鼠标位置
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // 鼠标离开窗口时重置位置
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 主动画函数
    const animate = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // 应用缩放效果
      const currentZoom = zoomRef.current;
      
      // 鼠标悬停增强缩放（只在鼠标真正在画布内时才生效）
      let enhancedZoom = currentZoom;
      if (mouseRef.current.x >= 0 && mouseRef.current.x <= canvasWidth && 
          mouseRef.current.y >= 0 && mouseRef.current.y <= canvasHeight) {
        const centerDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - canvasWidth / 2, 2) + 
          Math.pow(mouseRef.current.y - canvasHeight / 2, 2)
        );
        const mouseZoomFactor = Math.max(0, 1 - centerDistance / (canvasWidth * 0.25));
        enhancedZoom = currentZoom + mouseZoomFactor * CONFIG.zoomConfig.mouseZoomBoost;
      }
      
      // 计算条形参数（数量保持不变）
      const barCount = Math.max(CONFIG.minBarCount, Math.floor(canvasWidth / CONFIG.barSpacing));
      const spacing = canvasWidth / barCount;
      const barWidth = spacing * CONFIG.barWidthRatio;
      const maxBarHeight = canvasHeight * CONFIG.maxHeightRatio * enhancedZoom;
      const baseY = canvasHeight * 0.5; // 居中
      
      // 时间偏移用于波向右流动
      const timeOffset = timeRef.current * CONFIG.waveFlow.speed;
      
      // 绘制每个声波条
      for (let i = 0; i < barCount; i++) {
        const x = i * spacing + (spacing - barWidth) / 2;
        const barCenterX = x + barWidth / 2;
        
        // 计算鼠标影响（只在鼠标在画布内时生效）
        let mouseInfluence = 0;
        if (mouseRef.current.x >= 0 && mouseRef.current.x <= canvasWidth && 
            mouseRef.current.y >= 0 && mouseRef.current.y <= canvasHeight) {
          const distanceToMouse = Math.sqrt(
            Math.pow(barCenterX - mouseRef.current.x, 2) + 
            Math.pow(baseY - mouseRef.current.y, 2)
          );
          mouseInfluence = Math.max(0, 
            (CONFIG.mouseInfluenceRadius - distanceToMouse) / CONFIG.mouseInfluenceRadius
          );
        }
        
        // 获取随机参数
        const randomData = randomOffsetsRef.current[i % randomOffsetsRef.current.length];
        
        // 波形计算（真实频谱效果）
        const normalizedIndex = i / barCount;
        
        // 主波形
        const primaryWave = Math.sin(
          normalizedIndex * Math.PI * 6 - timeOffset * 8 + randomData.phase
        ) * randomData.amplitude;
        
        // 次波形
        const secondaryWave = Math.sin(
          normalizedIndex * Math.PI * 12 - timeOffset * 12
        ) * 0.55;
        
        // 第三波形（高频）
        const tertiaryWave = Math.sin(
          normalizedIndex * Math.PI * 24 - timeOffset * 16
        ) * 0.2;
        
        // 随机扰动
        const randomWave = Math.sin(
          timeRef.current * 0.08 * randomData.frequency + randomData.phase
        ) * CONFIG.waveFlow.randomness;
        
        // 非对称调制
        const asymmetry = Math.sin(normalizedIndex * Math.PI * 3 + timeOffset * 4) * CONFIG.waveFlow.asymmetryFactor;
        
        // 组合波形
        const combinedWave = (primaryWave + secondaryWave + tertiaryWave + randomWave) * (1 + asymmetry);
        
        // 归一化到 0-1 范围
        const normalizedWave = Math.max(0, (combinedWave + 2) / 4);
        
        // 计算高度
        const baseHeight = CONFIG.minHeight + (maxBarHeight - CONFIG.minHeight) * normalizedWave;
        const mouseBoost = mouseInfluence * maxBarHeight * CONFIG.mouseBoostRatio;
        const finalHeight = Math.max(CONFIG.minHeight, baseHeight + mouseBoost);
        
        // 计算上下分配（不对称但都有合理分布）
        const asymmetryBias = 0.6; // 60%向上，40%向下
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
        const adjustedOpacity = opacity * (1 + mouseInfluence * 0.5); // 鼠标附近更不透明
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
        
        // 鼠标附近的暖色光晕效果（更明显）
        if (mouseInfluence > 0.1) {
          const glowOpacity = mouseInfluence * 0.2 * opacityRef.current;
          const glowR = 255;
          const glowG = 235 - (mouseInfluence * 20);
          const glowB = 200 - (mouseInfluence * 40);
          ctx.fillStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${glowOpacity})`;
          ctx.fillRect(x - 2, baseY - upwardHeight - 3, barWidth + 4, upwardHeight + downwardHeight + 6);
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
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleScroll, CONFIG.barSpacing, CONFIG.minBarCount, CONFIG.barWidthRatio, 
      CONFIG.maxHeightRatio, CONFIG.minHeight, CONFIG.zoomConfig.mouseZoomBoost,
      CONFIG.mouseInfluenceRadius, CONFIG.mouseBoostRatio, CONFIG.waveFlow.speed,
      CONFIG.waveFlow.randomness, CONFIG.waveFlow.asymmetryFactor,
      CONFIG.opacityRange.min, CONFIG.opacityRange.max,
      CONFIG.colorRange, CONFIG.mouseColorRange]);

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
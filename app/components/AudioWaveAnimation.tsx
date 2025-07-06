import React, { useEffect, useRef } from 'react';

/**
 * 声波动画组件 - 所有配置参数都在此文件内调整
 */
const AudioWaveAnimation: React.FC = () => {
  // ========== 配置参数区域 - 在这里调整所有动画效果 ==========
  
  // 视觉效果配置
  const CONFIG = {
    // Canvas 不透明度
    opacity: 0.3,
    
    // 背景渐变色
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0a0a0a 100%)',
    
    // 条形配置
    barSpacing: 18,              // 条形间距基数（影响条形数量）
    barWidthRatio: 0.6,          // 条形宽度占间距的比例
    minBarCount: 90,             // 最少条形数量
    
    // 高度配置
    maxHeightRatio: 0.9,        // 最大高度占画布高度的比例
    minHeight: 4,                // 最小条形高度（像素）
    
    // 鼠标交互
    mouseInfluenceRadius: 220,   // 鼠标影响半径（像素）
    mouseBoostRatio: 0.35,        // 鼠标影响的高度增幅比例
    mouseInfluencePower: 1.8,    // 鼠标影响的衰减曲线
    
    // 动画速度
    animationSpeed: 1.2,           // 整体动画速度倍数
    waveSpeed: {
      low: 0.01,               // 低频波速度
      mid: 0.014,               // 中频波速度
      high: 0.016,              // 高频波速度
      sub: 0.012                // 次低频波速度
    },
    
    // 颜色和透明度
    colorRange: {
      min: 80,                  // 最小灰度值 (0-255)
      max: 220                  // 最大灰度值 (0-255)
    },
    opacityRange: {
      min: 0.14,                // 最小透明度 (0-1)
      max: 0.45                 // 最大透明度 (0-1)
    },
    
    // 频谱特征
    spectrum: {
      lowFreqThreshold: 0.25,    // 低频区域阈值
      midFreqStart: 0.4,        // 中频起始点
      midFreqEnd: 0.65,          // 中频结束点
      highFreqThreshold: 0.8,   // 高频区域阈值
      noiseLevel: 0.01          // 噪声级别
    },
    
    // 视觉效果
    effects: {
      enableBackground: true,    // 启用背景层效果
      backgroundOpacity: 0.2,    // 背景层透明度倍数
      enableGlow: true,          // 启用光效
      glowOpacity: 0.15,         // 光效透明度倍数
      enableHighlight: true,     // 启用高光效果
      highlightThreshold: 0.45,   // 高光触发阈值
      highlightOpacity: 0.15     // 高光透明度倍数
    }
  };
  
  // ========== 以下为组件逻辑，通常不需要修改 ==========
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 初始化鼠标位置为画布中心
      mouseRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2
      };
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标移动事件处理 - 监听整个文档而不是 canvas
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // 使用 document 而不是 canvas 来监听鼠标移动
    document.addEventListener('mousemove', handleMouseMove);

    // 动画函数
    const animate = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // 计算条形数量和尺寸
      const barCount = Math.max(CONFIG.minBarCount, Math.floor(canvasWidth / CONFIG.barSpacing));
      const barWidth = (canvasWidth / barCount) * CONFIG.barWidthRatio;
      const spacing = canvasWidth / barCount;
      const maxBarHeight = canvasHeight * CONFIG.maxHeightRatio;
      const centerY = canvasHeight / 2;
      
      // 绘制每个频谱条
      for (let i = 0; i < barCount; i++) {
        const x = i * spacing + (spacing - barWidth) / 2;
        const barCenterX = x + barWidth / 2;
        
        // 计算鼠标影响
        const distanceToMouse = Math.sqrt(
          Math.pow(barCenterX - mouseRef.current.x, 2) + 
          Math.pow(centerY - mouseRef.current.y, 2)
        );
        const mouseInfluence = Math.max(0, CONFIG.mouseInfluenceRadius - distanceToMouse) / CONFIG.mouseInfluenceRadius;
        const smoothMouseInfluence = Math.pow(mouseInfluence, CONFIG.mouseInfluencePower);
        
        // 模拟音频频谱特征
        const normalizedIndex = i / barCount;
        
        // 低频增强（左侧）
        const lowFreqBoost = normalizedIndex < CONFIG.spectrum.lowFreqThreshold 
          ? (CONFIG.spectrum.lowFreqThreshold - normalizedIndex) * 2 
          : 0;
        
        // 中频区域（中间）
        const midFreqBoost = normalizedIndex > CONFIG.spectrum.midFreqStart && 
                           normalizedIndex < CONFIG.spectrum.midFreqEnd 
          ? 0.8 
          : 0;
        
        // 高频衰减（右侧）
        const highFreqDecay = normalizedIndex > CONFIG.spectrum.highFreqThreshold 
          ? Math.pow(1 - normalizedIndex, 2) 
          : 1;
        
        // 组合多个正弦波创建复杂波形
        const basePhase = i * 0.08;
        const lowWave = Math.sin(timeRef.current * CONFIG.waveSpeed.low * CONFIG.animationSpeed + basePhase) * (0.7 + lowFreqBoost);
        const midWave = Math.sin(timeRef.current * CONFIG.waveSpeed.mid * CONFIG.animationSpeed + basePhase * 1.3) * (0.5 + midFreqBoost);
        const highWave = Math.sin(timeRef.current * CONFIG.waveSpeed.high * CONFIG.animationSpeed + basePhase * 2.1) * (0.3 * highFreqDecay);
        const subWave = Math.sin(timeRef.current * CONFIG.waveSpeed.sub * CONFIG.animationSpeed + basePhase * 0.7) * 0.2;
        
        // 添加随机噪声
        const noise = (Math.random() - 0.5) * CONFIG.spectrum.noiseLevel;
        
        // 组合所有波形
        const combinedWave = lowWave + midWave + highWave + subWave + noise;
        const normalizedWave = Math.max(0, (combinedWave + 2) / 4);
        
        // 计算最终高度
        const baseHeight = CONFIG.minHeight + (maxBarHeight - CONFIG.minHeight) * normalizedWave;
        const mouseBoost = smoothMouseInfluence * maxBarHeight * CONFIG.mouseBoostRatio;
        const finalHeight = Math.max(CONFIG.minHeight, baseHeight + mouseBoost);
        
        const barY = centerY - finalHeight / 2;
        
        // 计算颜色和透明度
        const intensity = normalizedWave + smoothMouseInfluence * 0.4;
        const baseOpacity = CONFIG.opacityRange.min + intensity * (CONFIG.opacityRange.max - CONFIG.opacityRange.min);
        const depthOpacity = 0.15 + (finalHeight / maxBarHeight) * 0.2;
        const finalOpacity = Math.min(baseOpacity, depthOpacity);
        
        // 灰度值计算
        const grayValue = Math.floor(CONFIG.colorRange.min + intensity * (CONFIG.colorRange.max - CONFIG.colorRange.min));
        const color = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${finalOpacity})`;
        
        // 绘制主条形
        ctx.fillStyle = color;
        ctx.fillRect(x, barY, barWidth, finalHeight);
        
        // 背景层效果（增加深度感）
        if (CONFIG.effects.enableBackground && finalHeight > CONFIG.minHeight * 2) {
          const bgOpacity = finalOpacity * CONFIG.effects.backgroundOpacity;
          ctx.fillStyle = `rgba(120, 120, 120, ${bgOpacity})`;
          ctx.fillRect(x - 1, barY + 2, barWidth + 2, finalHeight);
        }
        
        // 鼠标附近的光效
        if (CONFIG.effects.enableGlow && smoothMouseInfluence > 0.1) {
          const glowOpacity = smoothMouseInfluence * CONFIG.effects.glowOpacity;
          ctx.fillStyle = `rgba(200, 200, 200, ${glowOpacity})`;
          ctx.fillRect(x, barY, barWidth, finalHeight);
        }
        
        // 顶部高光效果
        if (CONFIG.effects.enableHighlight && 
            intensity > CONFIG.effects.highlightThreshold && 
            finalHeight > CONFIG.minHeight * 3) {
          const highlightHeight = Math.max(1, finalHeight * 0.03);
          ctx.fillStyle = `rgba(255, 255, 255, ${(intensity - CONFIG.effects.highlightThreshold) * CONFIG.effects.highlightOpacity})`;
          ctx.fillRect(x, barY, barWidth, highlightHeight);
        }
      }

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // 空依赖数组，因为所有配置都是静态的

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
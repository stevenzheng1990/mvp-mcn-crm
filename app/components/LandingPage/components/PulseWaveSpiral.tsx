import React, { useRef, useEffect } from 'react';

interface PulseWaveSpiralProps {
  inView?: boolean;
  className?: string;
}

const PulseWaveSpiral: React.FC<PulseWaveSpiralProps> = ({ 
  inView = false, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // 可调整参数 - 动画配置
  const ANIMATION_CONFIG = {
    // 中心点尺寸（像素）
    CENTER_POINT_SIZE: 4, // 
    // 中心点透明度
    CENTER_POINT_OPACITY: 0.6,
    // 点的基础尺寸（像素）
    POINT_SIZE: 4, //
    // 基础旋转速度
    BASE_ROTATION_SPEED: 0.01,
    // 每层旋转速度增量
    ROTATION_SPEED_INCREMENT: 0.01,
    // 整体旋转速度缩放因子
    ROTATION_SPEED_SCALE: 1, 
    // 螺旋臂偏移因子
    SPIRAL_ARM_OFFSET_FACTOR: 1,
    // 脉冲幅度（像素）
    PULSE_AMPLITUDE: 12,
    // 脉冲速度
    PULSE_SPEED: 1,
    // 脉冲相位偏移因子
    PULSE_PHASE_OFFSET_FACTOR: 22,
    // 基础透明度
    BASE_OPACITY: 0.01,
    // 透明度变化范围
    OPACITY_RANGE: 0.2, 
    // 脉冲阈值（用于颜色切换）
    PULSE_THRESHOLD: 0.3,
    // 蓝色调影响强度
    BLUE_INFLUENCE_FACTOR: 0.7,
    // 颜色值调整（RGB）
    COLOR_ADJUST: {
      RED: -40,
      GREEN: -30,
      BLUE: 70
    },
    // 脉冲波螺旋层配置
    DOT_RINGS: [
      { radius: 19, count: 5 },   
      { radius: 38, count: 9 },   
      { radius: 75, count: 18 },  
      { radius: 94, count: 23 }, 
      { radius: 113, count: 27 },
      { radius: 131, count: 32 }, 
      { radius: 150, count: 36 },
      { radius: 169, count: 41 }, 
      { radius: 188, count: 45 }, 
      { radius: 206, count: 50 }, 
      { radius: 225, count: 54 },
      { radius: 244, count: 59 }, 
      { radius: 263, count: 63 }, 
      { radius: 281, count: 68 }, 
      { radius: 300, count: 72 }, 
      { radius: 319, count: 77 }, 
      { radius: 338, count: 81 }, 
      { radius: 356, count: 86 },
      { radius: 375, count: 90 },
      { radius: 394, count: 95 },
      { radius: 413, count: 99 }
    ]
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const CANVAS_WIDTH = canvas.width / (window.devicePixelRatio || 1);
    const CANVAS_HEIGHT = canvas.height / (window.devicePixelRatio || 1);
    
    // 单色填充函数
    const MONOCHROME_FILL = (opacity: number) => `rgba(80, 80, 80, ${opacity})`;

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    let time = 0;
    let lastTime = 0;
    
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 只在inView时绘制动画
      if (inView) {
        // 中心点
        ctx.beginPath();
        ctx.arc(centerX, centerY, ANIMATION_CONFIG.CENTER_POINT_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = MONOCHROME_FILL(ANIMATION_CONFIG.CENTER_POINT_OPACITY);
        ctx.fill();

        ANIMATION_CONFIG.DOT_RINGS.forEach((ring, ringIndex) => {
          const ringRotationSpeed = (ANIMATION_CONFIG.BASE_ROTATION_SPEED + ringIndex * ANIMATION_CONFIG.ROTATION_SPEED_INCREMENT) * ANIMATION_CONFIG.ROTATION_SPEED_SCALE;
          for (let i = 0; i < ring.count; i++) {
            const baseAngle = (i / ring.count) * Math.PI * 2;
            const spiralArmOffset = (ring.radius / 15) * ANIMATION_CONFIG.SPIRAL_ARM_OFFSET_FACTOR;
            const angle = baseAngle + time * ringRotationSpeed + spiralArmOffset;
            const pulsePhase =
              time * ANIMATION_CONFIG.PULSE_SPEED - ring.radius / ANIMATION_CONFIG.PULSE_PHASE_OFFSET_FACTOR + (i / ring.count) * Math.PI;
            const radiusPulse = Math.sin(pulsePhase) * ANIMATION_CONFIG.PULSE_AMPLITUDE;
            const currentRadius = ring.radius + radiusPulse;
            const x = centerX + Math.cos(angle) * currentRadius;
            const y = centerY + Math.sin(angle) * currentRadius;
            const opacityWave =
              ANIMATION_CONFIG.BASE_OPACITY + ((Math.sin(pulsePhase - Math.PI / 4) + 1) / 2) * ANIMATION_CONFIG.OPACITY_RANGE;

            // 计算脉冲强度用于颜色混合
            const pulseInfluence = Math.abs(radiusPulse) / ANIMATION_CONFIG.PULSE_AMPLITUDE; // 0-1
            const isPulsing = pulseInfluence > ANIMATION_CONFIG.PULSE_THRESHOLD;
            
            ctx.beginPath();
            ctx.arc(x, y, ANIMATION_CONFIG.POINT_SIZE, 0, Math.PI * 2);
            
            // 根据脉冲状态选择颜色
            if (isPulsing) {
              const blueInfluence = pulseInfluence * ANIMATION_CONFIG.BLUE_INFLUENCE_FACTOR;
              ctx.fillStyle = `rgba(${80 + ANIMATION_CONFIG.COLOR_ADJUST.RED * blueInfluence}, ${80 + ANIMATION_CONFIG.COLOR_ADJUST.GREEN * blueInfluence}, ${80 + ANIMATION_CONFIG.COLOR_ADJUST.BLUE * blueInfluence}, ${opacityWave})`;
            } else {
              ctx.fillStyle = MONOCHROME_FILL(opacityWave);
            }
            
            ctx.fill();
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // 立即开始动画
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [inView]);

  return (
    <canvas
      ref={canvasRef}
      className={`pulse-wave-spiral ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        opacity: inView ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default PulseWaveSpiral;
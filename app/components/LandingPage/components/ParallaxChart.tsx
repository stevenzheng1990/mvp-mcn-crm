// app/components/LandingPage/components/ParallaxChart.tsx
import React, { useEffect, useRef, useState } from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface MultiSeriesData {
  name: string;
  data: ChartData[];
  color?: string;
}

interface ParallaxChartProps {
  data?: ChartData[];
  multiSeriesData?: MultiSeriesData[];
  type: 'area' | 'lines' | 'bars' | 'bubble' | 'radial';
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
  height?: number;
  theme?: 'light' | 'dark';
}

const ParallaxChart: React.FC<ParallaxChartProps> = ({
  data = [],
  multiSeriesData,
  type,
  title,
  subtitle,
  inView = false,
  delay = 0,
  height = 500,
  theme = 'light'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 动画激活
  useEffect(() => {
    if (inView && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, delay, isAnimated]);

  // 鼠标视差效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas 动画绘制 - 优化性能
  useEffect(() => {
    if (!canvasRef.current || !isAnimated) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // 设置 Canvas 大小
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    let animationId: number;
    let progress = 0;
    const targetProgress = 1;
    const animationSpeed = 0.03; // 加快动画速度

    const animate = () => {
      // 使用缓动函数让动画更流畅
      progress += (targetProgress - progress) * animationSpeed;
      
      // 清除画布
      ctx.fillStyle = theme === 'light' ? '#fafafa' : '#1a1a1a';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // 根据类型绘制图表
      if (type === 'area' && multiSeriesData) {
        drawAreaChart(ctx, canvas.offsetWidth, canvas.offsetHeight, progress);
      } else if (type === 'lines' && multiSeriesData) {
        drawLinesChart(ctx, canvas.offsetWidth, canvas.offsetHeight, progress);
      }

      // 不重复播放，动画完成后停止
      if (progress < 0.995) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const drawAreaChart = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
      const padding = 60;
      const chartWidth = width - 2 * padding;
      const chartHeight = height - 2 * padding;

      multiSeriesData?.forEach((series, seriesIndex) => {
        const points = series.data.map((item, index) => {
          const x = padding + (index / (series.data.length - 1)) * chartWidth;
          const y = height - padding - (item.value / 100000) * chartHeight * progress;
          return { x, y };
        });

        // 绘制区域
        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding);
        
        // 使用贝塞尔曲线创建平滑路径
        points.forEach((point, i) => {
          if (i === 0) {
            ctx.lineTo(point.x, point.y);
          } else {
            const prevPoint = points[i - 1];
            const cpx = (prevPoint.x + point.x) / 2;
            ctx.bezierCurveTo(cpx, prevPoint.y, cpx, point.y, point.x, point.y);
          }
        });
        
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.closePath();
        
        // 渐变填充
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `${series.color || '#3b82f6'}40`);
        gradient.addColorStop(1, `${series.color || '#3b82f6'}00`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 绘制线条
        ctx.beginPath();
        points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            const prevPoint = points[i - 1];
            const cpx = (prevPoint.x + point.x) / 2;
            ctx.bezierCurveTo(cpx, prevPoint.y, cpx, point.y, point.x, point.y);
          }
        });
        ctx.strokeStyle = series.color || '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    };

    const drawLinesChart = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
      const padding = 80;
      const chartWidth = width - 2 * padding;
      const chartHeight = height - 2 * padding;

      // 绘制优化的网格
      ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      for (let i = 0; i <= 6; i++) {
        const y = padding + (i / 6) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 计算所有数据的最大值用于统一缩放
      const allValues = multiSeriesData?.flatMap(s => s.data.map(d => d.value)) || [];
      const maxValue = Math.max(...allValues) * 1.1;

      multiSeriesData?.forEach((series, seriesIndex) => {
        // 数据点采样优化 - 当数据点过多时进行采样
        const dataPoints = series.data.length > 50 ? 
          series.data.filter((_, i) => i % Math.ceil(series.data.length / 50) === 0) : 
          series.data;
        
        const points = dataPoints.map((item, index) => {
          const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
          const y = height - padding - (item.value / maxValue) * chartHeight * progress;
          return { x, y, value: item.value, label: item.label };
        });

        // 使用贝塞尔曲线绘制平滑线条
        ctx.beginPath();
        ctx.strokeStyle = series.color || '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 设置阴影效果
        ctx.shadowColor = series.color || '#3b82f6';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            const prevPoint = points[i - 1];
            const cpx = (prevPoint.x + point.x) / 2;
            ctx.quadraticCurveTo(prevPoint.x + (cpx - prevPoint.x) * 0.5, prevPoint.y, cpx, (prevPoint.y + point.y) / 2);
            ctx.quadraticCurveTo(cpx + (point.x - cpx) * 0.5, point.y, point.x, point.y);
          }
        });
        ctx.stroke();
        
        // 清除阴影
        ctx.shadowBlur = 0;

        // 只在关键点绘制数据点（减少绘制数量）
        const keyPoints = points.filter((_, i) => 
          i === 0 || 
          i === points.length - 1 || 
          i % Math.max(1, Math.floor(points.length / 8)) === 0
        );
        
        keyPoints.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.strokeStyle = series.color || '#3b82f6';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      // 绘制Y轴标签
      ctx.fillStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'right';
      
      for (let i = 0; i <= 6; i++) {
        const y = padding + (i / 6) * chartHeight;
        const value = ((6 - i) / 6) * maxValue;
        ctx.fillText(value > 1000 ? `${(value / 1000).toFixed(0)}K` : value.toFixed(0), padding - 10, y + 4);
      }
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAnimated, multiSeriesData, type, theme]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        perspective: '2000px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(60px)',
        transition: `all 1.4s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
      }}
    >
      {/* 标题区域 */}
      {(title || subtitle) && (
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          transform: `translateZ(${mousePos.y * 30}px) rotateX(${mousePos.y * -5}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease-out',
        }}>
          {title && (
            <h3 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: '300',
              color: theme === 'light' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: theme === 'light' ? 'rgba(60, 60, 60, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: '400',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 图表容器 - 减少视差移动幅度以提升性能 */}
      <div style={{
        position: 'relative',
        background: theme === 'light' 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 248, 248, 0.95))'
          : 'linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(30, 30, 30, 0.95))',
        borderRadius: '32px',
        padding: '3rem',
        boxShadow: theme === 'light'
          ? '0 30px 80px rgba(0, 0, 0, 0.08)'
          : '0 30px 80px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        transform: `translateZ(${mousePos.x * 20}px) rotateY(${mousePos.x * 2}deg) rotateX(${mousePos.y * -1}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          filter: 'blur(60px)',
          opacity: 0.5,
          pointerEvents: 'none',
        }} />

        {/* Canvas 图表 */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: `${height}px`,
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* 图例 - 网格布局 */}
        {multiSeriesData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
            transform: `translateZ(20px)`,
          }}>
            {multiSeriesData.map((series, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: theme === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                opacity: isAnimated ? 1 : 0,
                transform: isAnimated ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                transition: `all 0.5s ease ${index * 0.08 + 1}s`,
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: series.color || '#3b82f6',
                  boxShadow: `0 0 15px ${series.color || '#3b82f6'}30`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.9rem',
                  color: theme === 'light' ? 'rgba(60, 60, 60, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {series.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParallaxChart;
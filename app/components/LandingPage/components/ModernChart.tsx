// app/components/LandingPage/components/ModernChart.tsx
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

interface ModernChartProps {
  data: ChartData[];
  multiSeriesData?: MultiSeriesData[];
  type: 'bar' | 'line' | 'donut' | 'radialProgress' | 'multiLine' | 'comparisonBar';
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
  maxValue?: number;
  showPercentage?: boolean;
  className?: string;
}

const CHART_COLORS = {
  deepBlue: '#1e40af',    // 更深的蓝色，增强对比
  lightBlue: '#3b82f6',   // 标准蓝
  purple: '#7c3aed',      // 更饱和的紫色
  pinkPurple: '#c026d3',  // 更鲜明的粉紫色
  pink: '#db2777'         // 更深的粉红色
};

const ModernChart: React.FC<ModernChartProps> = ({
  data,
  multiSeriesData,
  type,
  title,
  subtitle,
  inView = false,
  delay = 0,
  maxValue,
  showPercentage = false,
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (inView && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, delay, isAnimated]);

  const getColorByIndex = (index: number): string => {
    const colors = Object.values(CHART_COLORS);
    return colors[index % colors.length];
  };

  const getMaxValue = () => {
    if (maxValue) return maxValue;
    return Math.max(...data.map(item => item.value));
  };

  const renderBarChart = () => {
    // 设置合适的最大值来增强视觉效果
    const dataMax = Math.max(...data.map(item => item.value));
    const max = maxValue || Math.ceil(dataMax * 0.8); // 减少基数，让柱子更高
    
    return (
      <div className="bar-chart" style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: 'clamp(1rem, 3vw, 2rem)',
        height: '400px', // 增加高度
        padding: '2rem 0',
        width: '100%',
        justifyContent: 'space-around'
      }}>
        {data.map((item, index) => {
          const height = Math.max((item.value / max) * 100, 15); // 确保最小高度15%
          const color = item.color || getColorByIndex(index);
          
          return (
            <div key={index} style={{ 
              flex: '1 1 0',
              maxWidth: '80px',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151',
                minHeight: '1.5rem'
              }}>
                {showPercentage ? `${item.value}%` : item.value}
              </div>
              <div style={{
                width: '100%',
                maxWidth: '70px', // 稍微增加宽度
                height: `${isAnimated ? height : 0}%`,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${color}60`,
                borderRadius: '12px 12px 0 0',
                transition: `height 1.8s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.15}s`,
                minHeight: '12px',
                boxShadow: `0 8px 32px ${color}20, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* 玻璃质感内部渐变 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(180deg, ${color}30 0%, ${color}60 50%, ${color}80 100%)`,
                  borderRadius: '10px 10px 0 0'
                }} />
                
                {/* 高光效果 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '30%',
                  background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)`,
                  borderRadius: '8px 8px 0 0',
                  opacity: isAnimated ? 1 : 0,
                  transition: `opacity 1s ease ${index * 0.15 + 1.5}s`
                }} />
                
                {/* 边缘光晕 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: `1px solid ${color}40`,
                  borderRadius: '10px 10px 0 0',
                  boxShadow: `inset 0 0 20px ${color}20`
                }} />
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: '1.3',
                wordBreak: 'break-word',
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => {
    // 优化数据范围和坐标系
    const dataMax = Math.max(...data.map(item => item.value));
    const dataMin = Math.min(...data.map(item => item.value));
    const range = dataMax - dataMin;
    const max = dataMax + range * 0.1; // 增加10%的上边距
    const min = Math.max(0, dataMin - range * 0.1); // 增加10%的下边距，但不低于0
    
    const width = 500; // 更大的宽度
    const height = 250; // 更大的高度
    const padding = 40;
    
    const points = data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((item.value - min) / (max - min)) * (height - 2 * padding);
      return { x, y, value: item.value, label: item.label };
    });
    
    const pathD = points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '');
    
    // 创建网格线
    const gridLines = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = padding + (i / steps) * (height - 2 * padding);
      gridLines.push(y);
    }
    
    return (
      <div className="line-chart" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        width: '100%'
      }}>
        <svg width={width} height={height} style={{ overflow: 'visible', maxWidth: '100%' }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={CHART_COLORS.deepBlue} />
              <stop offset="33%" stopColor={CHART_COLORS.lightBlue} />
              <stop offset="66%" stopColor={CHART_COLORS.purple} />
              <stop offset="100%" stopColor={CHART_COLORS.pink} />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={CHART_COLORS.lightBlue} stopOpacity="0.2" />
              <stop offset="100%" stopColor={CHART_COLORS.lightBlue} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* 网格线 */}
          {gridLines.map((y, index) => (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* 面积填充 */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#areaGradient)"
            opacity={isAnimated ? 1 : 0}
            style={{
              transition: 'opacity 1s ease 0.5s'
            }}
          />
          
          {/* 线条 */}
          <path
            d={pathD}
            stroke="url(#lineGradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray={isAnimated ? "0" : "1000"}
            strokeDashoffset={isAnimated ? "0" : "1000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'stroke-dasharray 2s ease-out, stroke-dashoffset 2s ease-out'
            }}
          />
          
          {/* 数据点 */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="white"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                opacity={isAnimated ? 1 : 0}
                style={{
                  transition: `opacity 0.6s ease ${index * 0.1 + 1.2}s`
                }}
              />
              {/* 数据值标签 */}
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fontSize="0.875rem"
                fontWeight="600"
                fill="#374151"
                opacity={isAnimated ? 1 : 0}
                style={{
                  transition: `opacity 0.6s ease ${index * 0.1 + 1.4}s`
                }}
              >
                {point.value.toLocaleString()}
              </text>
            </g>
          ))}
        </svg>
        
        {/* X轴标签 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          width: `${width - 2 * padding}px`,
          fontSize: '0.875rem',
          color: '#6b7280',
          fontWeight: '500'
        }}>
          {data.map((item, index) => (
            <span key={index} style={{ textAlign: 'center' }}>{item.label}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 80; // 更大的半径
    const strokeWidth = 20; // 更厚的环
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    
    let cumulativePercentage = 0;
    
    return (
      <div className="donut-chart" style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '3rem',
        width: '100%',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <svg width={radius * 2} height={radius * 2}>
            <defs>
              {data.map((_, index) => {
                const color1 = getColorByIndex(index);
                const color2 = getColorByIndex((index + 1) % Object.keys(CHART_COLORS).length);
                return (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color1} />
                    <stop offset="100%" stopColor={color2} />
                  </linearGradient>
                );
              })}
            </defs>
            
            {/* 背景环 */}
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage / 100 * circumference;
              
              const result = (
                <circle
                  key={index}
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  stroke={getColorByIndex(index)} // 使用纯色，增强对比
                  strokeWidth={strokeWidth}
                  strokeDasharray={isAnimated ? strokeDasharray : '0 1000'}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  transform={`rotate(-90 ${radius} ${radius})`}
                  strokeLinecap="round"
                  style={{
                    transition: `stroke-dasharray 1.5s ease ${index * 0.3}s`,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              );
              
              cumulativePercentage += percentage;
              return result;
            })}
          </svg>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '1.75rem', // 使用现有字体大小
              fontWeight: 'bold', 
              color: '#374151' 
            }}>
              {total}
            </div>
            <div style={{ 
              fontSize: '0.875rem', // 使用现有字体大小
              color: '#6b7280' 
            }}>
              总计
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          minWidth: '200px'
        }}>
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                fontSize: '0.875rem', // 使用现有字体大小
                opacity: isAnimated ? 1 : 0,
                transform: isAnimated ? 'translateX(0)' : 'translateX(-20px)',
                transition: `all 0.6s ease ${index * 0.1 + 1}s`
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: getColorByIndex(index),
                  flexShrink: 0
                }} />
                <div style={{ 
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {item.label}
                  </span>
                  <span style={{ 
                    color: '#6b7280',
                    fontSize: '0.75rem', // 使用现有字体大小
                    fontWeight: '600'
                  }}>
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRadialProgress = () => {
    if (data.length === 0) return null;
    
    const item = data[0]; // Single value for radial progress
    const radius = 50;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const percentage = maxValue ? (item.value / maxValue) * 100 : item.value;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return (
      <div className="radial-progress" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ position: 'relative' }}>
          <svg width={radius * 2} height={radius * 2}>
            <defs>
              <linearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={CHART_COLORS.deepBlue} />
                <stop offset="50%" stopColor={CHART_COLORS.purple} />
                <stop offset="100%" stopColor={CHART_COLORS.pink} />
              </linearGradient>
            </defs>
            
            {/* Background circle */}
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress circle */}
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              stroke="url(#radialGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={isAnimated ? strokeDasharray : '0 1000'}
              strokeDashoffset={0}
              fill="transparent"
              transform={`rotate(-90 ${radius} ${radius})`}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dasharray 2s cubic-bezier(0.23, 1, 0.32, 1)',
                filter: 'drop-shadow(0 4px 8px rgba(30, 64, 175, 0.2))'
              }}
            />
            
            {/* 动态光晕效果 */}
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              stroke="url(#radialGradient)"
              strokeWidth={strokeWidth + 4}
              strokeDasharray={isAnimated ? strokeDasharray : '0 1000'}
              strokeDashoffset={0}
              fill="transparent"
              transform={`rotate(-90 ${radius} ${radius})`}
              strokeLinecap="round"
              opacity={isAnimated ? 0.3 : 0}
              style={{
                transition: 'stroke-dasharray 2s cubic-bezier(0.23, 1, 0.32, 1) 0.2s, opacity 1s ease 0.5s'
              }}
            />
          </svg>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
              {showPercentage ? `${Math.round(percentage)}%` : item.value}
            </div>
          </div>
        </div>
        
        {item.label && (
          <div style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            textAlign: 'center'
          }}>
            {item.label}
          </div>
        )}
      </div>
    );
  };

  const renderMultiLineChart = () => {
    if (!multiSeriesData || multiSeriesData.length === 0) return null;
    
    // 计算所有系列的数据范围
    const allValues = multiSeriesData.flatMap(series => series.data.map(item => item.value));
    const dataMax = Math.max(...allValues);
    const dataMin = Math.min(...allValues);
    const range = dataMax - dataMin;
    const max = dataMax + range * 0.1;
    const min = Math.max(0, dataMin - range * 0.1);
    
    const width = 600;
    const height = 300;
    const padding = 50;
    
    // 假设所有系列具有相同的X轴标签
    const xLabels = multiSeriesData[0].data.map(item => item.label);
    
    return (
      <div className="multi-line-chart" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        width: '100%'
      }}>
        <svg width={width} height={height} style={{ overflow: 'visible', maxWidth: '100%' }}>
          <defs>
            {multiSeriesData.map((series, seriesIndex) => (
              <linearGradient key={seriesIndex} id={`multiGradient-${seriesIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={series.color || getColorByIndex(seriesIndex)} />
                <stop offset="100%" stopColor={series.color || getColorByIndex(seriesIndex)} stopOpacity="0.7" />
              </linearGradient>
            ))}
          </defs>
          
          {/* 网格线 */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding + (i / 4) * (height - 2 * padding);
            const value = max - ((i / 4) * (max - min));
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="0.75rem"
                  fill="#6b7280"
                >
                  {Math.round(value).toLocaleString()}
                </text>
              </g>
            );
          })}
          
          {/* 多条折线 */}
          {multiSeriesData.map((series, seriesIndex) => {
            const points = series.data.map((item, index) => {
              const x = padding + (index / (series.data.length - 1)) * (width - 2 * padding);
              const y = height - padding - ((item.value - min) / (max - min)) * (height - 2 * padding);
              return { x, y, value: item.value };
            });
            
            const pathD = points.reduce((path, point, index) => {
              const command = index === 0 ? 'M' : 'L';
              return `${path} ${command} ${point.x} ${point.y}`;
            }, '');
            
            const seriesColor = series.color || getColorByIndex(seriesIndex);
            
            return (
              <g key={seriesIndex}>
                {/* 面积填充 */}
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                  fill={`url(#multiGradient-${seriesIndex})`}
                  opacity={isAnimated ? 0.1 : 0}
                  style={{
                    transition: `opacity 1s ease ${0.5 + seriesIndex * 0.2}s`
                  }}
                />
                
                {/* 线条 */}
                <path
                  d={pathD}
                  stroke={seriesColor}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={isAnimated ? "0" : "1000"}
                  strokeDashoffset={isAnimated ? "0" : "1000"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transition: `stroke-dasharray 2s ease-out ${seriesIndex * 0.3}s, stroke-dashoffset 2s ease-out ${seriesIndex * 0.3}s`
                  }}
                />
                
                {/* 数据点 */}
                {points.map((point, pointIndex) => (
                  <circle
                    key={pointIndex}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="white"
                    stroke={seriesColor}
                    strokeWidth="3"
                    opacity={isAnimated ? 1 : 0}
                    style={{
                      transition: `opacity 0.6s ease ${seriesIndex * 0.3 + pointIndex * 0.1 + 1.2}s`
                    }}
                  />
                ))}
              </g>
            );
          })}
        </svg>
        
        {/* X轴标签 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          width: `${width - 2 * padding}px`,
          fontSize: '0.875rem',
          color: '#6b7280',
          fontWeight: '500'
        }}>
          {xLabels.map((label, index) => (
            <span key={index} style={{ textAlign: 'center' }}>{label}</span>
          ))}
        </div>
        
        {/* 图例 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          {multiSeriesData.map((series, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.6s ease ${index * 0.1 + 2}s`
            }}>
              <div style={{
                width: '16px',
                height: '3px',
                backgroundColor: series.color || getColorByIndex(index),
                borderRadius: '2px'
              }} />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                {series.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparisonBarChart = () => {
    if (!multiSeriesData || multiSeriesData.length === 0) return null;
    
    // 找到所有系列中的最大值来正确设置比例
    const allValues = multiSeriesData.flatMap(series => series.data.map(item => item.value));
    const dataMax = Math.max(...allValues);
    const chartHeight = 350; // 图表总高度
    
    // 假设所有系列具有相同的X轴标签
    const xLabels = multiSeriesData[0].data.map(item => item.label);
    const barWidth = 60; // 柱子宽度
    const groupGap = 60; // 组间距
    
    return (
      <div className="comparison-bar-chart" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        width: '100%',
        padding: '2rem 0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: `${groupGap}px`,
          height: `${chartHeight + 100}px`,
          padding: '2rem 0',
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          {xLabels.map((label, labelIndex) => (
            <div key={labelIndex} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                height: `${chartHeight}px`,
                justifyContent: 'center'
              }}>
                {multiSeriesData.map((series, seriesIndex) => {
                  const item = series.data[labelIndex];
                  // 正确计算高度：使用像素而不是百分比
                  const heightPx = Math.max((item.value / dataMax) * chartHeight, 20);
                  const color = series.color || getColorByIndex(seriesIndex);
                  
                  return (
                    <div key={seriesIndex} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        minHeight: '1.2rem',
                        opacity: isAnimated ? 1 : 0,
                        transform: isAnimated ? 'translateY(0)' : 'translateY(-10px)',
                        transition: `all 0.8s ease ${labelIndex * 0.1 + seriesIndex * 0.05 + 0.8}s`,
                        whiteSpace: 'nowrap',
                        textAlign: 'center'
                      }}>
                        {showPercentage ? `${item.value}%` : item.value.toLocaleString()}
                      </div>
                      <div style={{
                        width: `${barWidth}px`,
                        height: `${isAnimated ? heightPx : 0}px`,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${color}80`,
                        borderRadius: '8px 8px 0 0',
                        transition: `height 1.5s cubic-bezier(0.23, 1, 0.32, 1) ${labelIndex * 0.15 + seriesIndex * 0.08}s`,
                        boxShadow: `0 8px 24px ${color}25, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* 玻璃质感内部渐变 */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(180deg, ${color}40 0%, ${color}60 50%, ${color}80 100%)`,
                          borderRadius: '6px 6px 0 0'
                        }} />
                        
                        {/* 高光效果 */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '15%',
                          right: '15%',
                          height: '30%',
                          background: `linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)`,
                          borderRadius: '4px 4px 0 0',
                          opacity: isAnimated ? 1 : 0,
                          transition: `all 1s ease ${labelIndex * 0.15 + seriesIndex * 0.08 + 1}s`
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                textAlign: 'center',
                fontWeight: '600',
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '120px',
                lineHeight: '1.3'
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        
        {/* 图例 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          {multiSeriesData.map((series, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.6s ease ${index * 0.1 + 1.5}s`
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: series.color || getColorByIndex(index),
                borderRadius: '3px'
              }} />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                {series.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'multiLine':
        return renderMultiLineChart();
      case 'comparisonBar':
        return renderComparisonBarChart();
      case 'donut':
        return renderDonutChart();
      case 'radialProgress':
        return renderRadialProgress();
      default:
        return renderBarChart();
    }
  };

  return (
    <div 
      ref={chartRef}
      className={`modern-chart ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.8s ease ${delay}s`,
        maxWidth: '100%',
        width: '100%',
        boxSizing: 'border-box',
        padding: '2rem 0',
      }}
    >
      {title && (
        <div style={{ 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: 'clamp(1.4rem, 3.5vw, 2.45rem)', // 使用heading字体大小
            fontWeight: '300', // 使用light字重
            color: '#374151',
            margin: '0 0 0.5rem 0'
          }}>
            {title}
          </h4>
          {subtitle && (
            <p style={{ 
              fontSize: 'clamp(0.84rem, 1.75vw, 1.26rem)', // 使用body字体大小
              color: '#6b7280',
              margin: 0,
              fontWeight: '300'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {renderChart()}
    </div>
  );
};

export default ModernChart;
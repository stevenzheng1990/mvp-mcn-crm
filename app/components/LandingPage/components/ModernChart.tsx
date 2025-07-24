// app/components/LandingPage/components/ModernChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

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
  type: 'bar' | 'line' | 'donut' | 'radialProgress' | 'multiLine' | 'comparisonBar' | 'dualLine';
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
  maxValue?: number;
  showPercentage?: boolean;
  className?: string;
}

const CHART_COLORS = {
  primary: 'rgb(76, 113, 224)',     // 主色调
  secondary: 'rgb(76, 113, 224)',   // 副色调
  accent: '#06b6d4',      // 强调色
  success: '#10b981',     // 成功色
  warning: '#f59e0b',     // 警告色
  error: '#ef4444',       // 错误色
  gray: '#6b7280'         // 灰色
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
      setIsAnimated(true);
    }
  }, [inView, isAnimated]);

  const getColorByIndex = (index: number): string => {
    const colors = Object.values(CHART_COLORS);
    return colors[index % colors.length];
  };

  const renderDualLineChart = () => {
    if (!multiSeriesData || multiSeriesData.length !== 2) return null;
    
    const width = 800;
    const height = 400;
    const padding = 60;
    
    // 两个系列分别计算范围
    const series1Data = multiSeriesData[0].data;
    const series2Data = multiSeriesData[1].data;
    
    const series1Max = Math.max(...series1Data.map(d => d.value));
    const series1Min = Math.min(...series1Data.map(d => d.value));
    const series2Max = Math.max(...series2Data.map(d => d.value));
    const series2Min = Math.min(...series2Data.map(d => d.value));
    
    const xLabels = series1Data.map(item => item.label);
    
    return (
      <div className="dual-line-chart" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4rem',
        width: '100%',
        padding: '4rem 0',
        perspective: '1200px'
      }}>
        <div style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          borderRadius: 0,
          padding: '2rem 0',
          boxShadow: 'none',
          transform: 'rotateX(2deg)',
          transformStyle: 'preserve-3d'
        }}>
          <svg width={width} height={height} style={{ overflow: 'visible', maxWidth: '100%' }}>
            <defs>
              <linearGradient id="dualGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity="0.8" />
                <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="dualGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity="0.8" />
                <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity="0.4" />
              </linearGradient>
              <filter id="glow1">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow2">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* 精简网格线 */}
            {[0, 1, 2, 3, 4].map(i => {
              const y = padding + (i / 4) * (height - 2 * padding);
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                  strokeDasharray={i === 0 || i === 4 ? "none" : "2,4"}
                />
              );
            })}
            
            {/* 第一条线（粉丝数）*/}
            {(() => {
              const points = series1Data.map((item, index) => {
                const x = padding + (index / (series1Data.length - 1)) * (width - 2 * padding);
                const y = height - padding - ((item.value - series1Min) / (series1Max - series1Min)) * (height - 2 * padding);
                return { x, y, value: item.value };
              });
              
              const pathD = points.reduce((path, point, index) => {
                const command = index === 0 ? 'M' : 'L';
                return `${path} ${command} ${point.x} ${point.y}`;
              }, '');
              
              return (
                <g>
                  {/* 面积填充 */}
                  <path
                    d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                    fill="url(#dualGradient1)"
                    opacity={isAnimated ? 0.3 : 0}
                    style={{
                    }}
                  />
                  
                  {/* 线条 */}
                  <path
                    d={pathD}
                    stroke={CHART_COLORS.primary}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={isAnimated ? "0" : "2000"}
                    strokeDashoffset={isAnimated ? "0" : "2000"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow1)"
                    style={{
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
                        stroke={CHART_COLORS.primary}
                        strokeWidth="3"
                        opacity={isAnimated ? 1 : 0}
                        style={{
                        }}
                      />
                      <text
                        x={point.x}
                        y={point.y - 15}
                        textAnchor="middle"
                        fontSize={DESIGN_TOKENS.typography.level5.fontSize}
                        fontWeight={DESIGN_TOKENS.typography.level5.fontWeight}
                        fill={CHART_COLORS.primary}
                        opacity={isAnimated ? 1 : 0}
                        style={{
                        }}
                      >
                        {point.value}W
                      </text>
                    </g>
                  ))}
                </g>
              );
            })()}
            
            {/* 第二条线（赞藏比）*/}
            {(() => {
              const points = series2Data.map((item, index) => {
                const x = padding + (index / (series2Data.length - 1)) * (width - 2 * padding);
                const y = height - padding - ((item.value - series2Min) / (series2Max - series2Min)) * (height - 2 * padding);
                return { x, y, value: item.value };
              });
              
              const pathD = points.reduce((path, point, index) => {
                const command = index === 0 ? 'M' : 'L';
                return `${path} ${command} ${point.x} ${point.y}`;
              }, '');
              
              return (
                <g>
                  {/* 面积填充 */}
                  <path
                    d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                    fill="url(#dualGradient2)"
                    opacity={isAnimated ? 0.2 : 0}
                    style={{
                    }}
                  />
                  
                  {/* 线条 */}
                  <path
                    d={pathD}
                    stroke={CHART_COLORS.secondary}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={isAnimated ? "0" : "2000"}
                    strokeDashoffset={isAnimated ? "0" : "2000"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow2)"
                    style={{
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
                        stroke={CHART_COLORS.secondary}
                        strokeWidth="3"
                        opacity={isAnimated ? 1 : 0}
                        style={{
                        }}
                      />
                      <text
                        x={point.x}
                        y={point.y + 25}
                        textAnchor="middle"
                        fontSize={DESIGN_TOKENS.typography.level5.fontSize}
                        fontWeight={DESIGN_TOKENS.typography.level5.fontWeight}
                        fill={CHART_COLORS.secondary}
                        opacity={isAnimated ? 1 : 0}
                        style={{
                        }}
                      >
                        {point.value}%
                      </text>
                    </g>
                  ))}
                </g>
              );
            })()}
            
            {/* Y轴标签 - 左侧（粉丝数）*/}
            <text
              x={padding - 40}
              y={padding}
              textAnchor="middle"
              fontSize={DESIGN_TOKENS.typography.level5.fontSize}
              fontWeight={DESIGN_TOKENS.typography.level5.fontWeight}
              fill={CHART_COLORS.primary}
              transform={`rotate(-90 ${padding - 40} ${padding})`}
            >
              粉丝数量（万）
            </text>
            
            {/* Y轴标签 - 右侧（赞藏比）*/}
            <text
              x={width - padding + 40}
              y={padding}
              textAnchor="middle"
              fontSize={DESIGN_TOKENS.typography.level5.fontSize}
              fontWeight={DESIGN_TOKENS.typography.level5.fontWeight}
              fill={CHART_COLORS.secondary}
              transform={`rotate(90 ${width - padding + 40} ${padding})`}
            >
              赞藏比（%）
            </text>
          </svg>
          
          {/* X轴标签 - 只显示关键节点 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            width: `${width - 2 * padding}px`,
            margin: '1rem auto 0',
            fontSize: DESIGN_TOKENS.typography.level5.fontSize,
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: DESIGN_TOKENS.typography.level5.fontWeight
          }}>
            {xLabels.map((label, index) => {
              // 只显示关键节点的标签
              const shouldShow = index === 0 || index === 3 || index === 6 || index === 9 || index === xLabels.length - 1;
              return (
                <span 
                  key={index} 
                  style={{ 
                    textAlign: 'center',
                    opacity: shouldShow && isAnimated ? 1 : 0,
                    transform: isAnimated ? 'translateY(0)' : 'translateY(10px)',
                    visibility: shouldShow ? 'visible' : 'hidden'
                  }}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
        
        {/* 极简视差图例 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4rem',
          flexWrap: 'wrap',
          transform: 'translateZ(50px)'
        }}>
          {multiSeriesData.map((series, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? 'translateY(0) rotateX(0deg)' : 'translateY(30px) rotateX(15deg)',
              transformStyle: 'preserve-3d'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: index === 0 ? CHART_COLORS.primary : CHART_COLORS.secondary,
                borderRadius: '50%',
                opacity: 0.6
              }} />
              <span style={{
                fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                color: 'rgba(80, 80, 80, 0.6)',
                fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                letterSpacing: '0.02em',
                textAlign: 'center'
              }}>
                {series.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderMultiLineChart = () => {
    if (!multiSeriesData || multiSeriesData.length === 0) return null;
    
    const width = 800;
    const height = 400;
    const padding = 60;
    
    // 计算所有系列的数据范围
    const allValues = multiSeriesData.flatMap(series => series.data.map(item => item.value));
    const dataMax = Math.max(...allValues);
    const dataMin = Math.min(...allValues);
    const range = dataMax - dataMin;
    const max = dataMax + range * 0.1;
    const min = Math.max(0, dataMin - range * 0.1);
    
    const xLabels = multiSeriesData[0].data.map(item => item.label);
    
    return (
      <div className="multi-line-chart" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4rem',
        width: '100%',
        padding: '4rem 0',
        perspective: '1200px'
      }}>
        <div style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          borderRadius: 0,
          padding: '2rem 0',
          boxShadow: 'none',
          transform: 'rotateX(2deg)',
          transformStyle: 'preserve-3d'
        }}>
          <svg width={width} height={height} style={{ overflow: 'visible', maxWidth: '100%' }}>
            <defs>
              {multiSeriesData.map((series, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={series.color || getColorByIndex(index)} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={series.color || getColorByIndex(index)} stopOpacity="0.4" />
                </linearGradient>
              ))}
              <filter id="multiGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
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
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                    strokeDasharray={i === 0 || i === 4 ? "none" : "2,4"}
                  />
                  <text
                    x={padding - 15}
                    y={y + 4}
                    textAnchor="end"
                    fontSize={DESIGN_TOKENS.typography.level5.fontSize}
                    fill="rgba(255, 255, 255, 0.6)"
                    fontWeight={DESIGN_TOKENS.typography.level5.fontWeight}
                  >
                    {(value / 1000).toFixed(0)}K
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
                    fill={`url(#gradient-${seriesIndex})`}
                    opacity={isAnimated ? 0.15 : 0}
                    style={{
                    }}
                  />
                  
                  {/* 线条 */}
                  <path
                    d={pathD}
                    stroke={seriesColor}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={isAnimated ? "0" : "2000"}
                    strokeDashoffset={isAnimated ? "0" : "2000"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#multiGlow)"
                    style={{
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
                      strokeWidth="2"
                      opacity={isAnimated ? 1 : 0}
                      style={{
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
            margin: '1rem auto 0',
            fontSize: DESIGN_TOKENS.typography.level5.fontSize,
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: DESIGN_TOKENS.typography.level5.fontWeight
          }}>
            {xLabels.map((label, index) => (
              <span 
                key={index} 
                style={{ 
                  textAlign: 'center',
                  opacity: isAnimated ? 1 : 0,
                  transform: isAnimated ? 'translateY(0)' : 'translateY(10px)',
                }}
              >
                {label}
              </span>
            ))}
          </div>
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
              transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
            }}>
              <div style={{
                width: '20px',
                height: '3px',
                backgroundColor: series.color || getColorByIndex(index),
                borderRadius: '2px',
                boxShadow: `0 0 6px ${(series.color || getColorByIndex(index))}40`
              }} />
              <span style={{
                fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                color: 'rgba(80, 80, 80, 0.8)',
                fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                letterSpacing: '0.01em'
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
      case 'dualLine':
        return renderDualLineChart();
      case 'multiLine':
        return renderMultiLineChart();
      default:
        return <div>Chart type not implemented yet</div>;
    }
  };

  return (
    <div 
      ref={chartRef}
      className={`modern-chart ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        maxWidth: '100%',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {title && (
        <div style={{ 
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: DESIGN_TOKENS.typography.level3.fontSize,
            fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
            lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
            color: 'rgba(80, 80, 80, 0.9)',
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h4>
          {subtitle && (
            <p style={{ 
              fontSize: DESIGN_TOKENS.typography.fontSize.body,
              color: 'rgba(80, 80, 80, 0.6)',
              margin: 0,
              fontWeight: '400',
              lineHeight: 1.6,
              letterSpacing: '0.01em'
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
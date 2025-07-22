// app/components/LandingPage/components/DataChart.tsx
import React from 'react';

interface DataPoint {
  month: string;
  粉丝增长: number;
  互动率: number;
  平均播放: number;
  月收入: number;
}

interface DataChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
}

const DataChart: React.FC<DataChartProps> = ({
  data,
  title,
  subtitle,
  inView = false,
  delay = 0,
}) => {
  // 计算关键指标
  const metrics = {
    totalGrowth: ((data[data.length - 1]?.粉丝增长 - data[0]?.粉丝增长) / data[0]?.粉丝增长 * 100).toFixed(1),
    avgEngagement: (data.reduce((acc, d) => acc + d.互动率, 0) / data.length).toFixed(1),
    peakRevenue: Math.max(...data.map(d => d.月收入)),
    growthRate: ((data[data.length - 1]?.月收入 - data[0]?.月收入) / data[0]?.月收入 * 100).toFixed(0),
  };

  return (
    <div style={{
      width: '100%',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `all 0.8s ease ${delay}s`,
    }}>
      {/* 标题区域 */}
      {(title || subtitle) && (
        <div style={{ marginBottom: '3rem' }}>
          {title && (
            <h3 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.45rem)',
              fontWeight: '700',
              color: 'rgba(80, 80, 80, 0.9)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{
              fontSize: 'clamp(0.84rem, 1.75vw, 1.26rem)',
              color: 'rgba(80, 80, 80, 0.6)',
              fontWeight: '400',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 关键指标卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '3rem',
      }}>
        <MetricCard
          label="粉丝总增长"
          value={`${metrics.totalGrowth}%`}
          color="#3b82f6"
          inView={inView}
          delay={delay + 0.1}
        />
        <MetricCard
          label="平均互动率"
          value={`${metrics.avgEngagement}%`}
          color="#8b5cf6"
          inView={inView}
          delay={delay + 0.2}
        />
        <MetricCard
          label="峰值月收入"
          value={`¥${metrics.peakRevenue}K`}
          color="#10b981"
          inView={inView}
          delay={delay + 0.3}
        />
        <MetricCard
          label="收入增长率"
          value={`${metrics.growthRate}%`}
          color="#f59e0b"
          inView={inView}
          delay={delay + 0.4}
        />
      </div>

      {/* 数据表格 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '2rem',
        overflowX: 'auto',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(80, 80, 80, 0.1)' }}>
              <th style={headerStyle}>时间</th>
              <th style={headerStyle}>粉丝数(万)</th>
              <th style={headerStyle}>互动率(%)</th>
              <th style={headerStyle}>播放量(万)</th>
              <th style={headerStyle}>月收入(千)</th>
              <th style={headerStyle}>增长率</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const prevRevenue = index > 0 ? data[index - 1].月收入 : row.月收入;
              const growthRate = ((row.月收入 - prevRevenue) / prevRevenue * 100).toFixed(1);
              
              return (
                <tr key={index} style={{
                  borderBottom: '1px solid rgba(80, 80, 80, 0.05)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.5s ease ${delay + 0.5 + index * 0.02}s`,
                }}>
                  <td style={cellStyle}>{row.month}</td>
                  <td style={cellStyle}>{row.粉丝增长.toFixed(1)}</td>
                  <td style={cellStyle}>{row.互动率.toFixed(1)}</td>
                  <td style={cellStyle}>{row.平均播放.toFixed(1)}</td>
                  <td style={cellStyle}>{row.月收入.toFixed(1)}</td>
                  <td style={{
                    ...cellStyle,
                    color: parseFloat(growthRate) > 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600',
                  }}>
                    {index === 0 ? '-' : `+${growthRate}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 简单的可视化 */}
      <div style={{
        marginTop: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
      }}>
        <SimpleLineChart
          data={data}
          dataKey="粉丝增长"
          title="粉丝增长趋势"
          color="#3b82f6"
          inView={inView}
          delay={delay + 1}
        />
        <SimpleLineChart
          data={data}
          dataKey="月收入"
          title="收入增长趋势"
          color="#10b981"
          inView={inView}
          delay={delay + 1.2}
        />
      </div>
    </div>
  );
};

// 指标卡片组件
const MetricCard: React.FC<{
  label: string;
  value: string;
  color: string;
  inView: boolean;
  delay: number;
}> = ({ label, value, color, inView, delay }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    borderTop: `3px solid ${color}`,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    transition: `all 0.6s ease ${delay}s`,
  }}>
    <p style={{
      fontSize: '0.85rem',
      color: 'rgba(80, 80, 80, 0.6)',
      marginBottom: '0.5rem',
    }}>
      {label}
    </p>
    <p style={{
      fontSize: '1.8rem',
      fontWeight: '700',
      color: color,
      margin: 0,
    }}>
      {value}
    </p>
  </div>
);

// 简单折线图组件
const SimpleLineChart: React.FC<{
  data: DataPoint[];
  dataKey: keyof DataPoint;
  title: string;
  color: string;
  inView: boolean;
  delay: number;
}> = ({ data, dataKey, title, color, inView, delay }) => {
  const maxValue = Math.max(...data.map(d => Number(d[dataKey])));
  const minValue = Math.min(...data.map(d => Number(d[dataKey])));
  const range = maxValue - minValue;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '1.5rem',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.8s ease ${delay}s`,
    }}>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: 'rgba(80, 80, 80, 0.9)',
        marginBottom: '1rem',
      }}>
        {title}
      </h4>
      
      <svg width="100%" height="150" viewBox="0 0 400 150">
        {/* 网格线 */}
        {[0, 1, 2, 3].map(i => (
          <line
            key={i}
            x1="0"
            y1={40 + i * 30}
            x2="400"
            y2={40 + i * 30}
            stroke="rgba(80, 80, 80, 0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* 数据线 */}
        <path
          d={data.map((d, i) => {
            const x = (i / (data.length - 1)) * 380 + 10;
            const y = 130 - ((Number(d[dataKey]) - minValue) / range) * 90;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          style={{
            strokeDasharray: inView ? '0' : '1000',
            strokeDashoffset: inView ? '0' : '1000',
            transition: `stroke-dasharray 1.5s ease ${delay + 0.2}s, stroke-dashoffset 1.5s ease ${delay + 0.2}s`,
          }}
        />
        
        {/* 数据点 */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 380 + 10;
          const y = 130 - ((Number(d[dataKey]) - minValue) / range) * 90;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.3s ease ${delay + 0.5 + i * 0.05}s`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// 样式常量
const headerStyle: React.CSSProperties = {
  padding: '1rem',
  textAlign: 'left',
  fontWeight: '600',
  color: 'rgba(80, 80, 80, 0.8)',
  fontSize: '0.85rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const cellStyle: React.CSSProperties = {
  padding: '1rem',
  textAlign: 'left',
  color: 'rgba(80, 80, 80, 0.7)',
};

export default DataChart;
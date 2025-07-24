// app/components/LandingPage/components/SimpleCard.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createGlassStyles } from '../LandingPage.styles';

interface SimpleCardProps {
  title: string;
  subtitle?: string;
  data: {
    label: string;
    value: string;
    description?: string;
  }[];
  color?: string;
  inView?: boolean;
  index?: number;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  subtitle,
  data,
  color = '#2563eb',
  inView = true,
  index = 0
}) => {
  return (
    <div style={{
      padding: '3rem 2.5rem',
      borderRadius: '1.5rem',
      ...createGlassStyles(false),
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      minHeight: '500px',
      display: 'flex',
      flexDirection: 'column',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transitionDelay: `${0.2 + index * 0.15}s`,
    }}
    onMouseEnter={(e) => {
      const card = e.currentTarget as HTMLDivElement;
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      const card = e.currentTarget as HTMLDivElement;
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
    }}
    >
      {/* 头部 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.8rem',
          fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
          marginBottom: '0.5rem',
          color: DESIGN_TOKENS.colors.text.primary,
          lineHeight: 1.2,
        }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{
            fontSize: '1rem',
            color: DESIGN_TOKENS.colors.text.secondary,
            lineHeight: 1.6,
            marginBottom: '0',
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* 数据展示 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{
            padding: '1.5rem',
            background: `${color}08`,
            borderRadius: '12px',
            border: `1px solid ${color}20`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: DESIGN_TOKENS.colors.text.secondary,
                marginBottom: '0.5rem'
              }}>
                {item.label}
              </div>
              {item.description && (
                <div style={{
                  fontSize: '0.8rem',
                  color: DESIGN_TOKENS.colors.text.tertiary,
                  lineHeight: 1.4
                }}>
                  {item.description}
                </div>
              )}
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: color,
              textAlign: 'right',
              minWidth: '80px'
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleCard;
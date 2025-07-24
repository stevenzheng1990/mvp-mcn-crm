// app/components/LandingPage/components/CreatorBenefitCard.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createGlassStyles } from '../LandingPage.styles';

interface CreatorBenefitCardProps {
  title: string;
  description: string;
  metrics?: {
    value: string;
    label: string;
  }[];
  highlight?: string;
  index: number;
  inView: boolean;
}

const CreatorBenefitCard: React.FC<CreatorBenefitCardProps> = ({
  title,
  description,
  metrics,
  highlight,
  index,
  inView
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
      justifyContent: 'space-between',
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
      {/* 头部区域 */}
      <div>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
          marginBottom: '1.5rem',
          color: DESIGN_TOKENS.colors.text.primary,
          lineHeight: 1.2,
        }}>
          {title}
        </h3>
        
        <p style={{
          fontSize: '1.1rem',
          color: DESIGN_TOKENS.colors.text.secondary,
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}>
          {description}
        </p>

        {/* 高亮信息 */}
        {highlight && (
          <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            marginBottom: '2rem',
          }}>
            <p style={{
              fontSize: '1rem',
              fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
              color: '#2563eb',
              margin: 0,
              textAlign: 'center',
            }}>
              {highlight}
            </p>
          </div>
        )}
      </div>

      {/* 底部指标区域 */}
      {metrics && metrics.length > 0 && (
        <div style={{
          marginTop: 'auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(metrics.length, 2)}, 1fr)`,
            gap: '1.5rem',
            padding: '1.5rem 0',
            borderTop: '1px solid rgba(107, 114, 128, 0.1)',
          }}>
            {metrics.map((metric, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                  color: '#2563eb',
                  marginBottom: '0.5rem',
                }}>
                  {metric.value}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: DESIGN_TOKENS.colors.text.secondary,
                }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorBenefitCard;
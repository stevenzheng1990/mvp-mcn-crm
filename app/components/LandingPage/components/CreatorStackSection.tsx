// app/components/LandingPage/components/CreatorStackSection.tsx
'use client';

import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

// 独立的创作者赋能ScrollStack组件，完全隔离
const CreatorStackSection: React.FC = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 10
    }}>
      {/* 标题固定在顶部，不受滚动影响 */}
      <div style={{
        position: 'absolute',
        top: '5vh',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 2000,
        maxWidth: '800px',
        width: '90%'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 2.45rem)',
          fontWeight: 700,
          marginBottom: '1rem',
          color: 'rgba(80, 80, 80, 0.95)',
        }}>
          创作者赋能
        </h2>
        <p style={{
          fontSize: 'clamp(0.84rem, 1.75vw, 1.26rem)',
          color: 'rgba(80, 80, 80, 0.7)',
        }}>
          共创价值，共享成长
        </p>
      </div>

      {/* 完全独立的ScrollStack */}
      <ScrollStack
        itemDistance={120}
        itemScale={0.04}
        itemStackDistance={35}
        stackPosition="25%"
        scaleEndPosition="15%"
        baseScale={0.88}
      >
        <ScrollStackItem>
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#2563eb' }}>
              收益最大化
            </h3>
            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              通过专业团队支持和资源整合，帮助创作者实现收入的显著提升，提供多样化的变现渠道和优质商务合作机会。
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>+42%</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>平均月收入提升</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>5K-50K</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>单次合作报价</div>
              </div>
            </div>
          </div>
        </ScrollStackItem>
        
        <ScrollStackItem>
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#2563eb' }}>
              专业成长
            </h3>
            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              提供全方位的专业培训和个人发展支持，包括内容创作技巧、流量增长策略、设备支持等，助力创作者全面提升专业能力。
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>15.8%</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>平均粉丝月增长</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>+85%</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>互动效果提升</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>2.1篇</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>月均爆款内容</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>96%</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>品牌匹配成功率</div>
              </div>
            </div>
          </div>
        </ScrollStackItem>
        
        <ScrollStackItem>
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#2563eb' }}>
              品质商务
            </h3>
            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              精选优质品牌合作资源，严格筛选合作项目，确保每次合作都能为创作者带来价值，建立长期稳定的合作关系。
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>3-5个</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>月均合作机会</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>92%</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>创作者满意度</div>
              </div>
            </div>
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </div>
  );
};

export default CreatorStackSection;
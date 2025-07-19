// app/components/LandingPage/components/IconSystem.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// 直接连接图标
export const DirectIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M8 7h8m-8 5h8m-8 5h8M6 3v18M18 3v18" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 数据分析图标
export const DataIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 12l3-3 4 4 5-5 6 6M21 21H3V3" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 全球化图标
export const GlobalIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth}/>
    <path 
      d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round"
    />
  </svg>
);

// 服务图标
export const ServiceIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth={strokeWidth}/>
    <path 
      d="M3 9h18M9 3v18" 
      stroke={color} 
      strokeWidth={strokeWidth}
    />
  </svg>
);

// 收益增长图标
export const GrowthIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 21l6-6m0 0l4 4m-4-4v6m0-6h6M21 3l-6 6m0 0l-4-4m4 4V3m0 6h-6" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 支持图标
export const SupportIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth}/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth}/>
    <path 
      d="M12 3v6m0 6v6M3 12h6m6 0h6" 
      stroke={color} 
      strokeWidth={strokeWidth}
    />
  </svg>
);

// 品牌合作图标
export const BrandIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14l-6-4.5h7.5L12 2z" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinejoin="round"
    />
  </svg>
);

// 团队服务图标
export const TeamIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth={strokeWidth}/>
    <path 
      d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round"
    />
  </svg>
);

// 图标映射
export const iconMap = {
  direct: DirectIcon,
  data: DataIcon,
  global: GlobalIcon,
  service: ServiceIcon,
  growth: GrowthIcon,
  support: SupportIcon,
  brand: BrandIcon,
  team: TeamIcon,
};

export type IconName = keyof typeof iconMap;
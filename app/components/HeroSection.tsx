import React, { useEffect, useState } from 'react';

interface HeroSectionProps {
  language: 'zh' | 'en';
  isVisible: boolean;
  CONFIG: any;
  content: {
    zh: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
    };
    en: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
    };
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ language, isVisible, CONFIG, content }) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // 分阶段触发动画
      const timers: NodeJS.Timeout[] = [];
      
      timers.push(
        setTimeout(() => setAnimationStage(1), 100), // 标题动画
        setTimeout(() => setAnimationStage(2), 400), // 副标题动画
        setTimeout(() => setAnimationStage(3), 700), // 描述文字动画
        setTimeout(() => setAnimationStage(4), 1000) // 滚动指示器动画
      );

      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      setAnimationStage(0);
    }
  }, [isVisible]);

  // 动画样式类
  const getAnimationClass = (stage: number) => {
    return animationStage >= stage 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8';
  };

  // 文字渐变动画效果
  const textGradientAnimation = animationStage >= 1 
    ? 'animate-gradient-x' 
    : '';

  return (
    <section className={`${CONFIG.layout.positions.relative} min-h-screen ${CONFIG.layout.flex.center} ${CONFIG.spacing.sections.hero}`}>
      <div className={`${CONFIG.spacing.containers.maxWidth['5xl']} ${CONFIG.spacing.containers.margin} text-center`}>
        <div 
          data-animate="hero"
          className={`scroll-element ${isVisible ? 'visible' : ''}`}
        >
          {/* 主标题 - 带渐变动画 */}
          <h1 
            className={`
              ${CONFIG.typography.sizes['4xl']} 
              ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['6xl']} 
              ${CONFIG.breakpoints.screens.lg}${CONFIG.typography.sizes['7xl']} 
              ${CONFIG.typography.weights.bold} 
              ${CONFIG.spacing.margins.mb[10]} 
              ${CONFIG.spacing.padding.py[8]} 
              bg-gradient-to-r from-black via-gray-800 to-gray-600 
              bg-clip-text text-transparent 
              ${CONFIG.typography.tracking.tight} 
              custom-title-height
              transition-all duration-1000 ease-out
              ${getAnimationClass(1)}
              ${textGradientAnimation}
              bg-[length:200%_auto]
            `}
          >
            {content[language].hero.title}
          </h1>

          {/* 副标题 - 淡入上移动画 */}
          <p 
            className={`
              ${CONFIG.typography.sizes.xl} 
              ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['2xl']} 
              text-gray-600 
              ${CONFIG.spacing.margins.mb[8]} 
              ${CONFIG.typography.weights.light} 
              ${CONFIG.typography.leading.relaxed} 
              ${CONFIG.spacing.containers.maxWidth['4xl']} 
              ${CONFIG.spacing.containers.margin}
              transition-all duration-1000 delay-300 ease-out
              ${getAnimationClass(2)}
            `}
          >
            {content[language].hero.subtitle}
          </p>

          {/* 描述文字 - 分段动画 */}
          <p 
            className={`
              ${CONFIG.typography.sizes.lg} 
              text-gray-700 
              ${CONFIG.spacing.margins.mb[12]} 
              ${CONFIG.typography.weights.light} 
              ${CONFIG.typography.leading.relaxed} 
              max-w-3xl 
              ${CONFIG.spacing.containers.margin}
              transition-all duration-1000 delay-600 ease-out
              ${getAnimationClass(3)}
            `}
          >
            <span 
              className={`
                gold-gradient 
                ${CONFIG.typography.weights.medium}
                inline-block
                ${animationStage >= 3 ? 'animate-pulse-subtle' : ''}
              `}
            >
              {content[language].hero.description.split(' × ')[0]}
            </span>
            <span className="inline-block mx-2 transition-opacity duration-500 delay-700">
              {' × '}
            </span>
            <span 
              className={`
                gold-gradient-dark 
                ${CONFIG.typography.weights.medium}
                inline-block
                ${animationStage >= 3 ? 'animate-pulse-subtle animation-delay-200' : ''}
              `}
            >
              {content[language].hero.description.split(' × ')[1]}
            </span>
            <span className="inline-block mx-2 transition-opacity duration-500 delay-900">
              {' × '}
            </span>
            <span 
              className={`
                gold-gradient 
                ${CONFIG.typography.weights.medium}
                inline-block
                ${animationStage >= 3 ? 'animate-pulse-subtle animation-delay-400' : ''}
              `}
            >
              {content[language].hero.description.split(' × ')[2].split(' = ')[0]}
            </span>
            <span className="inline-block mx-2 transition-opacity duration-500 delay-1100">
              {' = '}
            </span>
            <span 
              className={`
                ${CONFIG.typography.weights.semibold} 
                text-black
                inline-block
                ${animationStage >= 3 ? 'animate-scale-in' : ''}
              `}
            >
              {content[language].hero.description.split(' = ')[1]}
            </span>
          </p>
        </div>
      </div>
      
      {/* 滚动指示器 - 带弹跳动画 */}
      <div 
        className={`
          ${CONFIG.positioning.absolute.heroScroll} 
          transition-all duration-1000 delay-1000 ease-out
          ${getAnimationClass(4)}
          ${animationStage >= 4 ? 'animate-bounce' : ''}
        `}
      >
        <div className={`${CONFIG.scroll.indicator.size} ${CONFIG.scroll.indicator.border} ${CONFIG.scroll.indicator.radius} ${CONFIG.scroll.indicator.padding}`}>
          <div className={`${CONFIG.scroll.indicator.innerSize} bg-black/30 ${CONFIG.scroll.indicator.radius} ${CONFIG.spacing.containers.margin} animate-pulse`} />
        </div>
      </div>

      {/* 背景装饰元素（可选） */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className={`
            absolute top-1/4 -left-1/4 w-96 h-96 
            bg-gradient-to-r from-yellow-100/20 to-amber-100/20 
            rounded-full blur-3xl
            ${animationStage >= 1 ? 'animate-float' : 'opacity-0'}
            transition-opacity duration-2000
          `}
        />
        <div 
          className={`
            absolute bottom-1/4 -right-1/4 w-96 h-96 
            bg-gradient-to-l from-yellow-100/20 to-amber-100/20 
            rounded-full blur-3xl
            ${animationStage >= 2 ? 'animate-float animation-delay-1000' : 'opacity-0'}
            transition-opacity duration-2000 delay-500
          `}
        />
      </div>
    </section>
  );
};

// 添加必要的 CSS 动画（需要在全局 CSS 文件中定义）
const heroAnimationStyles = `
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes pulse-subtle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }

  @keyframes scale-in {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0);
    }
    25% {
      transform: translateY(-20px) translateX(10px);
    }
    50% {
      transform: translateY(0) translateX(-10px);
    }
    75% {
      transform: translateY(20px) translateX(5px);
    }
  }

  .animate-gradient-x {
    animation: gradient-x 6s ease infinite;
  }

  .animate-pulse-subtle {
    animation: pulse-subtle 2s ease-in-out infinite;
  }

  .animate-scale-in {
    animation: scale-in 0.8s ease-out forwards;
  }

  .animate-float {
    animation: float 8s ease-in-out infinite;
  }

  .animation-delay-200 {
    animation-delay: 200ms;
  }

  .animation-delay-400 {
    animation-delay: 400ms;
  }

  .animation-delay-1000 {
    animation-delay: 1000ms;
  }
`;

export default HeroSection;
export { heroAnimationStyles };
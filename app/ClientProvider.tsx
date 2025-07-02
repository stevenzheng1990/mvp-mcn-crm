'use client';

import { useEffect } from 'react';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 页面加载完成标记
    const handleLoad = () => {
      document.body.classList.add('loaded');
    };

    // 键盘导航支持
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    // 如果页面已经加载完成
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // 添加事件监听器
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // 清理函数
    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return <>{children}</>;
}
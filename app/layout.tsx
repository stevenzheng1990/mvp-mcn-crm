import './globals.css'
import type { Metadata } from 'next'
import ClientProvider from './ClientProvider'

export const metadata: Metadata = {
  title: '十方众声 MCN 管理系统',
  description: 'Mega Volume Production MCN Creator Management System',
  keywords: 'MCN, 博主管理, 网红经纪, 数据分析, 十方众声',
  authors: [{ name: '十方众声 MCN' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#a8b5c8',
  robots: 'noindex, nofollow', // 私有系统，不希望被搜索引擎索引
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 预连接到字体服务 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Outfit 英文字体 */}
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* 主题颜色 */}
        <meta name="theme-color" content="#a8b5c8" />
        <meta name="msapplication-TileColor" content="#a8b5c8" />
        
        {/* PWA 支持 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="十方众声 MCN" />
        
        {/* 安全性 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* 性能优化 */}
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      </head>
      <body className="font-sans antialiased selection:bg-morandi-cloud/20 selection:text-morandi-stone">
        {/* 全局背景 */}
        <div className="fixed inset-0 -z-10 bg-morandi-gradient">
          {/* 装饰性渐变 */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-morandi-sage/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-morandi-dust/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-morandi-cloud/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        {/* 主要内容 */}
        <div className="relative z-0 min-h-screen">
          <ClientProvider>
            {children}
          </ClientProvider>
        </div>
        
        {/* 无障碍支持 */}
        <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>
        

      </body>
    </html>
  )
}
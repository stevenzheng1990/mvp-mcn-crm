// app/components/LandingPage/components/WorldMapAnimation.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface WorldMapAnimationProps {
  inView?: boolean;
  className?: string;
}

interface WorldMapAnimationProps {
  inView?: boolean;
  className?: string;
}

const WorldMapAnimation: React.FC<WorldMapAnimationProps> = ({ 
  inView = false, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [logoUrls, setLogoUrls] = useState<string[]>([]);
  const [isAsiaRegion, setIsAsiaRegion] = useState(false);
  const [logoKey, setLogoKey] = useState(0); // 用于强制重新渲染动画
  
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    particles?: THREE.Points;
    centerVector?: THREE.Vector3;
    previousTime?: number;
    raycaster?: THREE.Raycaster;
    mouse?: THREE.Vector2;
  }>({});

  // 定义平台logo - 确保路径正确
  const asiaLogos = [
    '/icons/Bilibili_logo.svg',
    '/icons/Toutiao_logo.svg', 
    '/icons/WeChat-Logo.wine.svg',
    '/icons/Xiaohongshu--Streamline-Simple-Icons.svg'
  ];

  const globalLogos = [
    '/icons/icons8-facebook.svg',
    '/icons/icons8-instagram.svg',
    '/icons/icons8-tiktok.svg',
    '/icons/icons8-twitch.svg',
    '/icons/icons8-youtube.svg'
  ];

  // 测试用：添加调试信息
  useEffect(() => {
    console.log('Logo paths being used:');
    console.log('Asia logos:', asiaLogos);
    console.log('Global logos:', globalLogos);
  }, []);

  // 判断坐标是否在亚洲区域（基于地图坐标系）
  const isInAsiaRegion = (mapX: number, mapY: number) => {
    // 基于实际世界地图，亚洲位置调整
    // 地图宽度约400px，亚洲在右中偏上位置
    const asiaMinX = 260; // 更准确的亚洲西边界
    const asiaMaxX = 390; // 亚洲东边界  
    const asiaMinY = 40;  // 亚洲北边界（更偏上）
    const asiaMaxY = 130; // 亚洲南边界
    
    return mapX >= asiaMinX && mapX <= asiaMaxX && mapY >= asiaMinY && mapY <= asiaMaxY;
  };

  // 加载真实的世界地图图片
  const loadMapImage = (): Promise<ImageData | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      };
      img.onerror = () => {
        console.warn('Failed to load world map image, using fallback');
        resolve(createFallbackMapImageData());
      };
      // 使用原版的世界地图图片
      img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/transparentMap.png';
    });
  };

  // 创建备用的世界地图数据（如果网络图片加载失败）
  const createFallbackMapImageData = () => {
    const canvas = document.createElement('canvas');
    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // 清除画布
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width, height);
    
    // 设置绘制样式
    ctx.fillStyle = 'rgba(255,255,255,255)';
    
    // 简化的大陆轮廓 - 降低点数，只绘制主要大陆
    const continents = [
      // 北美洲 (简化)
      [[60, 40], [90, 45], [120, 35], [110, 60], [80, 70], [50, 50]],
      // 南美洲 (简化)
      [[70, 100], [85, 120], [90, 160], [75, 170], [65, 140]],
      // 欧洲 (简化)
      [[180, 50], [200, 45], [220, 55], [210, 70], [190, 65]],
      // 非洲 (简化)
      [[190, 80], [210, 85], [220, 120], [200, 150], [180, 140], [175, 100]],
      // 亚洲 (简化)
      [[230, 40], [280, 35], [320, 50], [340, 70], [310, 80], [250, 75]],
      // 澳大利亚 (简化)
      [[300, 140], [340, 135], [350, 150], [320, 155], [305, 150]]
    ];
    
    // 绘制大陆
    continents.forEach(continent => {
      ctx.beginPath();
      ctx.moveTo(continent[0][0], continent[0][1]);
      continent.forEach(point => {
        ctx.lineTo(point[0], point[1]);
      });
      ctx.closePath();
      ctx.fill();
    });
    
    return ctx.getImageData(0, 0, width, height);
  };

  const initThreeJS = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // 透明背景

    // 初始化场景
    const scene = new THREE.Scene();

    // 初始化相机 - 正对屏幕
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    camera.position.set(0, 0, 400); // 正对屏幕，拉远一些

    const centerVector = new THREE.Vector3(0, 0, 0);
    camera.lookAt(centerVector);

    // 初始化光线投射器和鼠标向量
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 保存引用
    sceneRef.current = {
      renderer,
      scene,
      camera,
      centerVector,
      previousTime: 0,
      raycaster,
      mouse
    };

    // 创建地图粒子
    await createMapParticles();
  };

  const createMapParticles = async () => {
    const { scene } = sceneRef.current;
    if (!scene) return;

    const imageData = await loadMapImage();
    if (!imageData) return;

    const geometry = new THREE.BufferGeometry();
    
    // 使用支持顶点颜色的材质
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true, // 启用顶点颜色以支持紫色交互效果
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.6 // 提高透明度以更好展示颜色效果
    });

    const vertices = [];
    const destinations = [];
    const speeds = [];
    const colors = [];
    const interactionStates = []; // 跟踪粒子交互状态

    // 定义颜色
    const normalColor = new THREE.Color(0x313742); // 正常深灰色
    const interactionColor = new THREE.Color(0x7c3aed); // 交互时的紫色（稍微调整色值）

    // 减少粒子数量 - 每3个像素取一个点（减少约20%粒子数）
    for (let y = 0; y < imageData.height; y += 3) {
      for (let x = 0; x < imageData.width; x += 3) {
        const index = (x + y * imageData.width) * 4;
        if (imageData.data[index + 3] > 128) { // alpha > 128
          // 初始位置直接在目标位置，简化出现逻辑
          vertices.push(
            x - imageData.width / 2,  // 直接在目标位置
            -y + imageData.height / 2,
            0
          );
          
          // 目标位置 (地图形状)
          destinations.push(
            x - imageData.width / 2,
            -y + imageData.height / 2,
            0
          );
          
          // 还原原版移动速度（因为现在直接显示，不需要移动）
          speeds.push(0); // 不需要移动
          
          // 初始颜色为正常深灰色
          colors.push(normalColor.r, normalColor.g, normalColor.b);
          
          // 初始交互状态
          interactionStates.push(0); // 0 = 正常, >0 = 交互中
        }
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('destination', new THREE.BufferAttribute(new Float32Array(destinations), 3));
    geometry.setAttribute('speed', new THREE.BufferAttribute(new Float32Array(speeds), 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    
    // 存储交互状态（不作为Three.js属性）
    (geometry as any).interactionStates = interactionStates;
    (geometry as any).mapImageData = imageData; // 存储地图数据供后续使用

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    sceneRef.current.particles = particles;
    
    // 开始动画
    animate();
  };

  const animate = () => {
    const { renderer, scene, camera, particles, centerVector } = sceneRef.current;
    if (!renderer || !scene || !camera || !particles || !centerVector) return;

    const currentTime = performance.now();
    
    // 更新粒子位置和颜色
    const positionAttribute = particles.geometry.attributes.position as THREE.BufferAttribute;
    const destinationAttribute = particles.geometry.attributes.destination as THREE.BufferAttribute;
    const speedAttribute = particles.geometry.attributes.speed as THREE.BufferAttribute;
    const colorAttribute = particles.geometry.attributes.color as THREE.BufferAttribute;
    
    const positions = positionAttribute.array as Float32Array;
    const destinations = destinationAttribute.array as Float32Array;
    const speeds = speedAttribute.array as Float32Array;
    const colors = colorAttribute.array as Float32Array;
    const interactionStates = (particles.geometry as any).interactionStates;
    
    // 定义颜色
    const normalColor = new THREE.Color(0x313742); // 正常深灰色
    const interactionColor = new THREE.Color(0x7c3aed); // 交互时的紫色
    
    for (let i = 0; i < positions.length; i += 3) {
      const speedIndex = i / 3;
      
      // 不需要移动逻辑，粒子直接在目标位置
      
      // 处理交互状态和颜色
      const colorIndex = speedIndex * 3;
      
      if (interactionStates[speedIndex] > 0) {
        // 交互中的粒子显示紫色，有轻微的闪烁效果
        const intensity = 0.8 + 0.2 * Math.sin(currentTime * 0.01 + speedIndex);
        colors[colorIndex] = interactionColor.r * intensity;
        colors[colorIndex + 1] = interactionColor.g * intensity;
        colors[colorIndex + 2] = interactionColor.b * intensity;
        
        // 减少交互计数器
        interactionStates[speedIndex]--;
      } else {
        // 正常粒子逐渐回到深灰色
        const currentColor = new THREE.Color(colors[colorIndex], colors[colorIndex + 1], colors[colorIndex + 2]);
        const blendedColor = currentColor.lerp(normalColor, 0.03); // 稍慢的过渡
        colors[colorIndex] = blendedColor.r;
        colors[colorIndex + 1] = blendedColor.g;
        colors[colorIndex + 2] = blendedColor.b;
      }
    }
    
    // 随机粒子交互 - 给交互的粒子添加紫色效果
    if (currentTime - (sceneRef.current.previousTime || 0) > 100) {
      const vertexCount = positions.length / 3;
      if (vertexCount > 1) {
        const index1 = Math.floor(Math.random() * vertexCount);
        const index2 = Math.floor(Math.random() * vertexCount);
        
        if (index1 !== index2) {
          // 交换目标位置
          const pos1 = index1 * 3;
          const pos2 = index2 * 3;
          
          const tempX = destinations[pos1];
          const tempY = destinations[pos1 + 1];
          
          destinations[pos1] = destinations[pos2];
          destinations[pos1 + 1] = destinations[pos2 + 1];
          destinations[pos2] = tempX;
          destinations[pos2 + 1] = tempY;
          
          // 标记这两个粒子为交互状态，持续90帧（约1.5秒）
          interactionStates[index1] = 90;
          interactionStates[index2] = 90;
        }
      }
      
      sceneRef.current.previousTime = currentTime;
    }
    
    colorAttribute.needsUpdate = true;
    
    // 相机对称左右旋转
    camera.position.x = Math.sin(currentTime / 8000) * 80; // 对称左右旋转
    camera.position.z = 400; // 保持固定距离
    camera.lookAt(centerVector);
    
    renderer.render(scene, camera);
    
    if (inView) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // 处理鼠标移动事件
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 更新鼠标位置用于显示logo - 更接近鼠标
    setMousePosition({ x: event.clientX, y: event.clientY });

    // 转换为Three.js标准化坐标
    const { mouse, raycaster, camera, particles } = sceneRef.current;
    if (!mouse || !raycaster || !camera || !particles) return;

    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;

    // 使用射线投射检测鼠标位置对应的地图坐标
    raycaster.setFromCamera(mouse, camera);
    
    // 创建一个虚拟平面来检测交点
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    // 将世界坐标转换为地图坐标
    const mapImageData = (particles.geometry as any).mapImageData;
    if (mapImageData) {
      const mapX = intersection.x + mapImageData.width / 2;
      const mapY = -intersection.y + mapImageData.height / 2;
      
      // 判断是否在亚洲区域
      const inAsia = isInAsiaRegion(mapX, mapY);
      const newLogos = inAsia ? asiaLogos : globalLogos;
      
      // 只有当区域发生变化时才更新logo
      if (inAsia !== isAsiaRegion) {
        setIsAsiaRegion(inAsia);
        setLogoUrls(newLogos);
        setLogoKey(prev => prev + 1); // 触发重新动画
      } else if (logoUrls.length === 0) {
        // 首次进入时设置logo
        setLogoUrls(newLogos);
        setLogoKey(prev => prev + 1);
      }
    }
  };

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    setMousePosition(null);
    setLogoUrls([]);
    setLogoKey(0);
  };

  // 处理窗口大小变化
  const handleResize = () => {
    const canvas = canvasRef.current;
    const { renderer, camera } = sceneRef.current;
    
    if (!canvas || !renderer || !camera) return;
    
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  useEffect(() => {
    if (inView) {
      initThreeJS();
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // 清理Three.js资源
      const { renderer, scene, particles } = sceneRef.current;
      if (particles && scene) {
        scene.remove(particles);
        particles.geometry.dispose();
        (particles.material as THREE.Material).dispose();
        // 清理自定义数据
        if ((particles.geometry as any).interactionStates) {
          delete (particles.geometry as any).interactionStates;
        }
        if ((particles.geometry as any).mapImageData) {
          delete (particles.geometry as any).mapImageData;
        }
      }
      if (renderer) {
        renderer.dispose();
      }
      
      // 清理所有引用
      sceneRef.current = {};
    };
  }, [inView]);

  useEffect(() => {
    if (inView && sceneRef.current.particles) {
      animate();
    } else if (!inView && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className={`world-map-animation ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto', // 启用鼠标事件
        opacity: inView ? 0.5 : 0,
        transition: 'opacity 2s ease-in-out', // 简化为直接渐显
        backgroundColor: 'transparent',
        cursor: mousePosition ? 'pointer' : 'default',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // canvas本身不接收事件
        }}
      />
      
      {/* Logo分散在鼠标周围弹出 */}
      {mousePosition && logoUrls.length > 0 && (
        <>
          {logoUrls.map((logoUrl, index) => {
            // 计算每个logo的分散位置 - 围绕鼠标呈圆形/扇形分布
            const totalLogos = logoUrls.length;
            const angle = (index / totalLogos) * Math.PI * 2; // 圆形分布
            const radius = 100; // 距离鼠标100px
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;
            
            return (
              <div
                key={`${logoUrl}-${index}-${logoKey}`}
                style={{
                  position: 'fixed',
                  left: mousePosition.x + offsetX, // 鼠标位置 + 偏移
                  top: mousePosition.y + offsetY,  // 鼠标位置 + 偏移
                  zIndex: 1000,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  animation: `logoMegaPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.08}s both, logoMegaFloat 4s ease-in-out infinite ${index * 0.3}s`,
                  filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5))',
                  // 确保容器也是144px
                  width: '144px',
                  height: '144px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '144px',
                    height: '144px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    opacity: '1 !important', // 内层容器也强制不透明
                  }}
                >
                  <img
                    src={logoUrl}
                    alt={`Platform ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: 'transparent',
                      border: 'none',
                      display: 'block',
                      opacity: '1 !important', // 图片强制不透明
                      filter: 'none', // 移除可能的滤镜
                      backdropFilter: 'none', // 移除背景滤镜
                    }}
                    onError={(e) => {
                      console.error('Logo failed to load:', logoUrl);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // 尝试添加参数强制刷新
                      if (!target.src.includes('?')) {
                        target.src = logoUrl + '?v=' + Date.now();
                      }
                    }}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      console.log('Logo loaded successfully:', logoUrl, 'Natural size:', img.naturalWidth, 'x', img.naturalHeight);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </>
      )}
      
      {/* 全面强制移除透明度的CSS */}
      <style>{`
        /* 强制所有logo相关元素不透明 */
        .world-map-animation * {
          opacity: 1 !important;
        }
        
        .world-map-animation img {
          width: 144px !important;
          height: 144px !important;
          min-width: 144px !important;
          min-height: 144px !important;
          max-width: 144px !important;
          max-height: 144px !important;
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
          outline: none !important;
          object-fit: contain !important;
          opacity: 1 !important;
          filter: none !important;
          backdrop-filter: none !important;
        }
        
        .world-map-animation svg {
          width: 144px !important;
          height: 144px !important;
          min-width: 144px !important;
          min-height: 144px !important;
          max-width: 144px !important;
          max-height: 144px !important;
          opacity: 1 !important;
          filter: none !important;
          backdrop-filter: none !important;
        }
        
        .world-map-animation div {
          opacity: 1 !important;
        }
        
        @keyframes logoMegaPop {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(360deg);
            opacity: 1; /* 从一开始就是不透明的 */
          }
          50% {
            transform: translate(-50%, -50%) scale(1.4) rotate(180deg);
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%) scale(0.8) rotate(90deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes logoMegaFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1) rotate(0deg);
            opacity: 1 !important;
          }
          20% {
            transform: translate(-50%, -50%) translateY(-15px) scale(1.05) rotate(2deg);
            opacity: 1 !important;
          }
          40% {
            transform: translate(-50%, -50%) translateY(-25px) scale(1.1) rotate(0deg);
            opacity: 1 !important;
          }
          60% {
            transform: translate(-50%, -50%) translateY(-15px) scale(1.05) rotate(-2deg);
            opacity: 1 !important;
          }
          80% {
            transform: translate(-50%, -50%) translateY(-5px) scale(1.02) rotate(1deg);
            opacity: 1 !important;
          }
        }
        
        .world-map-animation img:hover {
          transform: translate(-50%, -50%) scale(1.3) rotate(15deg) !important;
          filter: brightness(1.3) contrast(1.2) saturate(1.2) !important;
          opacity: 1 !important;
          backdrop-filter: none !important;
        }
      `}</style>
    </div>
  );
};

export default WorldMapAnimation;
import React, { useEffect, useRef, useCallback } from 'react';

const ModifiedAudioWaveAnimation = () => {
  // ==================== 全局配置 ====================
  const CONFIG = {
    // ===== 基础设置 =====
    barCount: 128, // 总矩形数量，控制整体细腻度（建议64-256之间）
    
    // ===== 动画时间轴 =====
    // 注意：各阶段的start/end值决定了滚动时的触发时机（0-1之间）
    stages: {
      stage1: { start: 0, peak: 0.2, end: 0.25 },     // 音频波形阶段
      stage2: { start: 0.25, peak: 0.45, end: 0.5 },   // 星云聚合阶段  
      stage3: { start: 0.5, peak: 0.7, end: 0.75 },   // 手机立体排列阶段
      stage4: { start: 0.75, peak: 0.95, end: 1.0 },    // Logo固定阶段
    },
    
    // ===== 颜色主题 =====
    // 支持RGB格式，可调整为任意颜色（0-255）
    colors: {
      champagne: { r: 240, g: 210, b: 165 },    // 香槟金色（波形主色）- 略微鲜明
      lightGold: { r: 250, g: 220, b: 185 },    // 浅金色（波形亮色）- 略微鲜明
      silver: { r: 200, g: 200, b: 200 },       // 银色（波形辅色）- 略微鲜明
      lightSilver: { r: 230, g: 230, b: 230 },  // 浅银色（波形高光）- 略微鲜明
      starBright: { r: 255, g: 240, b: 200 },   // 星光亮色（星云效果）- 略微鲜明
      starCore: { r: 255, g: 255, b: 245 },     // 星光核心色（最亮点）- 略微鲜明
      phoneScreen: { r: 255, g: 245, b: 235 },  // 手机屏幕色（卡片主色）- 略微鲜明
      phoneBright: { r: 255, g: 250, b: 230 },  // 手机高光色（卡片亮色）- 略微鲜明
      phoneHover: { r: 200, g: 230, b: 255 },   // 手机悬停色（冷色调）- 加强对比
      phoneHoverBright: { r: 220, g: 240, b: 255 },  // 手机悬停高亮色 - 加强对比
    },
    
    // ===== 全局动画参数 =====
    globalCornerRadius: 0.25,              // 全局圆角比例（0-1，0=直角，1=圆形）
    globalLerpSpeed: 0.25,                 // 全局插值速度（0.1-1，越大动画越快越硬）
    maxRotationPerTransition: Math.PI * 0.75, // 单次过渡最大旋转角度（弧度制）- 调整以支持额外旋转
    rotationDamping: 0.8,                  // 旋转阻尼（0-1，防止过度旋转）
    
    // ===== 第一阶段：音频波形参数 =====
    stage1: {
      barSpacing: 12,                      // 波形条间距（像素，影响密集度）
      barWidthRatio: 0.5,                  // 波形条宽度比例（0-1，相对于间距）
      maxHeightRatio: 2.5,                 // 最大高度比例（倍数，影响波形幅度）
      minHeight: 1,                        // 最小高度（像素，避免完全消失）
      // 缩放动画序列：控制整体波形的缩放变化
      zoomSequence: { 
        initial: 0.03,   // 初始缩放（很小）
        peak: 0.45,      // 峰值缩放（最大）
        final: 0.08      // 结束缩放（收缩）
      },
      // 波形动画参数：控制波浪的运动特性
      waveParams: { 
        speed: 0.004,      // 波形动画速度（越大越快）
        randomness: 0.45,  // 随机性强度（0-1，增加自然感）
        asymmetry: 0.3     // 不对称性（0-1，波形偏移）
      },
      mouseRadius: 150,                    // 鼠标影响半径（像素）
      mouseBoost: 1,                       // 鼠标影响强度（倍数）
      baseOpacity: 0.45,                   // 基础透明度（0-1）
      maxOpacity: 0.75,                    // 最大透明度（0-1）
      colorIntensity: 0.8,                 // 颜色强度（0-1，影响色彩饱和度）
    },
    
    // ===== 第二阶段：星云效果参数 =====
    stage2: {
      position: { x: 0.75, y: 0.5 },      // 星云中心位置（屏幕比例0-1）
      initialRadius: 0.24,                 // 初始半径比例（相对屏幕）
      finalRadius: 0.35,                   // 最终半径比例（扩散大小）
      particleSize: 20,                    // 粒子大小（像素）
      sphereEffect: 1.8,                   // 球体效果强度（立体感）
      baseOpacity: 0.75,                   // 基础透明度（0-1）
      glowRadius: 8,                       // 发光半径（像素，光晕效果）
      rotationSpeed: 0.003,                // 旋转速度（弧度/帧）
    },
    
    // ===== 第三阶段：手机立体排列参数 =====
    stage3: {
      phoneWidthRatio: 0.08,               // 手机宽度比例（相对屏幕宽度）
      phoneAspectRatio: 2.1,               // 手机长宽比（高/宽）
      rowY: 0.5,                           // 垂直居中位置（0-1）
      cardSpacing: 1.1,                    // 卡片间距倍数（影响密集度）
      
      // 立体透视效果
      perspectiveTilt: Math.PI / 6,        // 透视倾斜角度（30度，3D效果）
      depthScale: 0.2,                     // 深度缩放系数（距离感）
      
      // 滚动动画
      scrollSpeed: 2.0,                    // 横向滚动速度（倍数）
      visibleRange: 1.5,                   // 可见范围（屏幕宽度倍数）
      
      // 材质效果
      brightness: 1.2,                     // 亮度系数（倍数）
      metallic: 0.9,                       // 金属质感（0-1）
      shadowStrength: 0.3,                 // 阴影强度（0-1）
      
      // 鼠标交互
      mouseRadius: 400,                    // 鼠标影响半径（像素）- 增加以使交互更明显
      mouseBrightness: 1.2,                // 鼠标悬停亮度增强（0-1）- 增加以使交互更明显
      mouseColorShift: 1.0,                // 鼠标悬停冷色调偏移（0-1）- 增加以使交互更明显
      
      // 消失动画（镜头拉远效果）
      fadeStartProgress: 0.75,             // 消失开始时间点（0-1，相对stage3）
      fadeEndProgress: 1.0,                // 消失结束时间点
      zoomOutScale: 0.2,                   // 最终缩放比例（远景效果）
      blurOpacity: 0.1,                    // 最终透明度（失焦效果）
    },
    
    // ===== 第四阶段：Logo固定阶段参数 =====
    stage4: {
      logoWidth: 300,                      // Logo总宽度（像素）
      logoHeight: 40,                      // Logo总高度（像素）
      positionY: 80,                       // 距离顶部距离（像素）
      barWidthRatio: 0.6,                  // Logo中矩形宽度比例（0-1）
      minHeightRatio: 0.15,                // 最小高度比例（相对logoHeight）
      maxHeightRatio: 1.0,                 // 最大高度比例（波形幅度）
      
      // 音波动画参数
      waveSpeed: 0.003,                    // 波形速度（越大越快）
      waveAmplitude: 0.4,                  // 波形幅度（0-1，高度变化）
      baseOpacity: 0.6,                    // 基础透明度（0-1）
      maxOpacity: 0.9,                     // 最大透明度（0-1）
      
      // 鼠标交互
      mouseRadius: 300,                    // 鼠标影响半径（像素）
      mouseAmplitude: 0.5,                 // 鼠标影响波动增幅（0-1）
      
      // 边缘衰减效果（Logo两端渐隐）
      edgeFadeRange: 0.3,                  // 边缘衰减范围（0-1）
      centerRange: 0.4,                    // 中心满透明度范围（0-1）
      
      // 形变过渡参数
      morphDuration: 0.5,                  // 形变动画持续时间比例（0-1）
      moveDuration: 0.6,                   // 移动动画持续时间比例（0-1）
    },
    
    // ===== 背景设置 =====
    background: {
      color: 'rgba(0, 0, 0, 0.7)',        // 背景颜色（支持rgba格式）
      trailEffect: 0.1,                    // 拖尾效果透明度（暂未使用）
    },
  };

  // ==================== Refs ====================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const scrollProgressRef = useRef<number>(0);
  
  const barsRef = useRef<Array<{
    x: number; y: number; width: number; height: number;
    targetX: number; targetY: number; targetWidth: number; targetHeight: number;
    color: { r: number; g: number; b: number };
    targetColor: { r: number; g: number; b: number };
    opacity: number; targetOpacity: number;
    rotation: number; targetRotation: number;
    scale: number; targetScale: number;
    rotationX: number; targetRotationX: number;
    rotationY: number; targetRotationY: number;
    phase: number; amplitude: number; frequency: number;
    colorSeed: number; depthSeed: number; angleSeed: number;
    pulseSeed: number;
    isPhone: boolean; phoneIndex: number;
    starBrightness: number;
    morphProgress: number; aspectRatio: number;
    scrollOffset: number;
    zDepth: number;
    stage3BaseX: number;
    isLogoBar: boolean; logoIndex: number;
    // 新增：用于stage2到stage3的过渡
    stage2X: number; stage2Y: number;
    stage3X: number; stage3Y: number;
    stage3Width: number; stage3Height: number;
  }>>([]);

  // ==================== 初始化 ====================
  useEffect(() => {
    const spacing = window.innerWidth / CONFIG.barCount;
    const barWidth = spacing * CONFIG.stage1.barWidthRatio;
    const baseY = window.innerHeight * 0.5;
    
    barsRef.current = Array(CONFIG.barCount).fill(0).map((_, i) => {
      const x = i * spacing + (spacing - barWidth) / 2;
      const initialHeight = CONFIG.stage1.minHeight + Math.random() * 50;
      
      return {
        x, y: baseY - initialHeight * 0.5,
        width: barWidth, height: initialHeight,
        targetX: x, targetY: baseY - initialHeight * 0.5,
        targetWidth: barWidth, targetHeight: initialHeight,
        color: CONFIG.colors.champagne,
        targetColor: CONFIG.colors.champagne,
        opacity: CONFIG.stage1.baseOpacity,
        targetOpacity: CONFIG.stage1.baseOpacity,
        rotation: 0, targetRotation: 0,
        scale: 1, targetScale: 1,
        rotationX: 0, targetRotationX: 0,
        rotationY: 0, targetRotationY: 0,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.6 + Math.random() * 0.4,
        frequency: 0.7 + Math.random() * 1.3,
        colorSeed: Math.random(),
        depthSeed: Math.random(),
        angleSeed: Math.random(),
        pulseSeed: Math.random() * Math.PI * 2,
        isPhone: false, phoneIndex: -1,
        starBrightness: 0.5 + Math.random() * 0.5,
        morphProgress: 0, aspectRatio: 1,
        scrollOffset: 0,
        zDepth: Math.random(),
        stage3BaseX: 0,
        isLogoBar: false, logoIndex: -1,
        stage2X: 0, stage2Y: 0,
        stage3X: 0, stage3Y: 0,
        stage3Width: 0, stage3Height: 0,
      };
    });
  }, []);

  // ==================== 工具函数 ====================
  // 合并缓动函数，只保留使用的
  const easing = {
    inOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  };

  // 优化插值函数，减少重复计算
  const smoothLerp = (start: number, end: number, t: number, easeFn = easing.inOutCubic) => {
    const clampedT = Math.max(0, Math.min(1, t));
    return start + (end - start) * easeFn(clampedT);
  };

  // 优化颜色插值，减少对象创建
  const lerpColor = (c1: any, c2: any, t: number) => ({
    r: Math.floor(c1.r + (c2.r - c1.r) * t),
    g: Math.floor(c1.g + (c2.g - c1.g) * t),
    b: Math.floor(c1.b + (c2.b - c1.b) * t),
  });

  // 优化旋转限制函数
  const limitRotationChange = (current: number, target: number) => {
    let diff = target - current;
    diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    
    if (Math.abs(diff) > CONFIG.maxRotationPerTransition) {
      diff = Math.sign(diff) * CONFIG.maxRotationPerTransition;
    }
    
    return current + diff * CONFIG.rotationDamping;
  };

  // 优化颜色计算函数，减少条件判断
  const getGradientColor = (seed: number, intensity: number = 1) => {
    const { champagne, lightGold, silver, lightSilver } = CONFIG.colors;
    const t = seed * intensity;
    
    return t < 0.5 
      ? lerpColor(champagne, lightGold, t * 2)
      : lerpColor(silver, lightSilver, (t - 0.5) * 2);
  };

  const getStarColor = (seed: number, brightness: number) => {
    const { starBright, starCore, champagne, lightGold } = CONFIG.colors;
    const baseColor = seed < 0.5 ? champagne : lightGold;
    
    return brightness > 0.7 
      ? lerpColor(starBright, starCore, (brightness - 0.7) * 3.33)
      : lerpColor(baseColor, starBright, brightness);
  };

  const getPhoneColor = (seed: number, brightness: number = 1, mouseInfluence: number = 0) => {
    const { phoneScreen, phoneBright, lightSilver, phoneHover, phoneHoverBright } = CONFIG.colors;
    
    let baseColor;
    if (brightness > 0.8) {
      baseColor = lerpColor(phoneScreen, phoneBright, (brightness - 0.8) * 5);
    } else {
      baseColor = lerpColor(lightSilver, phoneScreen, brightness);
    }
    
    // 鼠标悬停时添加冷色调效果和亮度增强
    if (mouseInfluence > 0) {
      const hoverColor = lerpColor(phoneHover, phoneHoverBright, mouseInfluence);
      return lerpColor(baseColor, hoverColor, mouseInfluence * CONFIG.stage3.mouseColorShift);
    }
    
    return baseColor;
  };

  // ==================== 阶段计算函数 ====================
  const calculateStage1 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const spacing = cw / CONFIG.barCount;
    const barWidth = spacing * CONFIG.stage1.barWidthRatio;
    const baseY = ch * 0.5;
    
    // 优化缩放计算
    const t = stageProgress < 0.6 ? stageProgress / 0.6 : (stageProgress - 0.6) / 0.4;
    const zoom = stageProgress < 0.6 
      ? smoothLerp(CONFIG.stage1.zoomSequence.initial, CONFIG.stage1.zoomSequence.peak, t, easing.outExpo)
      : smoothLerp(CONFIG.stage1.zoomSequence.peak, CONFIG.stage1.zoomSequence.final, t);
    
    const maxHeight = ch * CONFIG.stage1.maxHeightRatio * zoom;
    const time = timeRef.current * CONFIG.stage1.waveParams.speed;
    const { randomness, asymmetry } = CONFIG.stage1.waveParams;
    
    // 预计算鼠标位置
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    const mouseRadius = CONFIG.stage1.mouseRadius;
    const mouseBoost = CONFIG.stage1.mouseBoost;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      const normalizedPos = i / CONFIG.barCount;
      const x = i * spacing + (spacing - barWidth) / 2;
      const centerX = x + barWidth / 2;
      
      // 合并波形计算
      const p1 = Math.sin(normalizedPos * Math.PI * 8 - time * 12 + bar.phase) * bar.amplitude;
      const p2 = Math.sin(normalizedPos * Math.PI * 16 - time * 8) * 0.6;
      const p3 = Math.sin(normalizedPos * Math.PI * 32 - time * 20) * 0.25;
      const rand = Math.sin(time * 0.1 * bar.frequency + bar.phase) * randomness;
      const asym = Math.sin(normalizedPos * Math.PI * 4 + time * 6) * asymmetry;
      
      const wave = (p1 + p2 + p3 + rand) * (1 + asym);
      const normalizedWave = Math.max(0, (wave + 2.5) / 5);
      
      // 优化鼠标影响计算
      const dx = centerX - mouseX;
      const dy = baseY - mouseY;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);
      const mouseInfluence = mouseDistance < mouseRadius 
        ? (1 - mouseDistance / mouseRadius) * mouseBoost 
        : 0;
      
      const finalHeight = CONFIG.stage1.minHeight + (maxHeight - CONFIG.stage1.minHeight) * 
        (normalizedWave + mouseInfluence);
      
      const intensity = normalizedWave + mouseInfluence * 0.3;
      
      // 批量设置属性
      Object.assign(bar, {
        targetX: x,
        targetY: baseY - finalHeight * 0.5,
        targetWidth: barWidth,
        targetHeight: finalHeight,
        targetColor: getGradientColor(bar.colorSeed, intensity * CONFIG.stage1.colorIntensity),
        targetOpacity: CONFIG.stage1.baseOpacity + intensity * (CONFIG.stage1.maxOpacity - CONFIG.stage1.baseOpacity),
        targetRotation: 0,
        targetScale: 1,
        isPhone: false,
        isLogoBar: false,
        morphProgress: 0,
        aspectRatio: barWidth / finalHeight,
        zDepth: 0
      });
    }
  };

  const calculateStage2 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const centerX = cw * CONFIG.stage2.position.x;
    const centerY = ch * CONFIG.stage2.position.y;
    const minDim = Math.min(cw, ch);
    
    const radiusProgress = Math.pow(stageProgress, 1.5);
    const currentRadius = minDim * smoothLerp(
      CONFIG.stage2.initialRadius, 
      CONFIG.stage2.finalRadius, 
      radiusProgress,
      easing.outExpo
    );
    
    const rotationAngle = timeRef.current * CONFIG.stage2.rotationSpeed;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      
      // 球面坐标计算
      const phi = Math.acos(1 - 2 * bar.depthSeed);
      const theta = 2 * Math.PI * bar.angleSeed + rotationAngle;
      
      const sinPhi = Math.sin(phi);
      const x3d = sinPhi * Math.cos(theta);
      const y3d = sinPhi * Math.sin(theta);
      const z3d = Math.cos(phi);
      
      const sphereScale = 1 + z3d * CONFIG.stage2.sphereEffect * 0.5;
      const x = centerX + x3d * currentRadius * sphereScale;
      const y = centerY + y3d * currentRadius * sphereScale;
      
      const brightness = bar.starBrightness * (0.5 + z3d * 0.5);
      const particleSize = CONFIG.stage2.particleSize * (0.5 + z3d * 0.5);
      
      bar.zDepth = z3d;
      
      // 保存stage2位置，用于后续过渡
      bar.stage2X = x - particleSize / 2;
      bar.stage2Y = y - particleSize / 2;
      
      Object.assign(bar, {
        targetX: x - particleSize / 2,
        targetY: y - particleSize / 2,
        targetWidth: particleSize,
        targetHeight: particleSize,
        targetColor: getStarColor(bar.colorSeed, brightness),
        targetOpacity: CONFIG.stage2.baseOpacity * stageProgress * (0.3 + brightness),
        targetRotation: 0,
        targetScale: 1,
        isPhone: false,
        isLogoBar: false,
        morphProgress: 0,
        aspectRatio: 1
      });
    }
  };

  const calculateStage3 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const {
      phoneWidthRatio, phoneAspectRatio, rowY, cardSpacing,
      perspectiveTilt, depthScale, scrollSpeed, brightness, metallic,
      fadeStartProgress, fadeEndProgress, zoomOutScale, blurOpacity,
      mouseRadius, mouseBrightness
    } = CONFIG.stage3;
    
    const phoneWidth = cw * phoneWidthRatio;
    const phoneHeight = phoneWidth * phoneAspectRatio;
    
    // 优化消失动画计算
    const fadeProgress = stageProgress >= fadeStartProgress 
      ? Math.min(1, (stageProgress - fadeStartProgress) / (fadeEndProgress - fadeStartProgress))
      : 0;
    const fadeEased = easing.inOutCubic(fadeProgress);
    const cameraScale = 1 - fadeEased * (1 - zoomOutScale);
    
    // 优化滚动计算
    let scrollOffset;
    if (stageProgress < 0.7) {
      scrollOffset = stageProgress * cw * scrollSpeed;
    } else {
      const centeringProgress = (stageProgress - 0.7) / 0.3;
      const normalScrollOffset = 0.7 * cw * scrollSpeed;
      const centerCardIndex = Math.floor(CONFIG.barCount / 2);
      const centerCardBaseX = centerCardIndex * phoneWidth * cardSpacing;
      const targetScrollOffset = centerCardBaseX - cw / 2 + phoneWidth / 2;
      scrollOffset = smoothLerp(normalScrollOffset, targetScrollOffset, centeringProgress, easing.inOutCubic);
    }
    
    const startX = -scrollOffset;
    const focusFactor = 1 - fadeEased * 0.7;
    const finalOpacity = 1 - fadeEased * (1 - blurOpacity);
    
    // 鼠标位置
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      
      const baseX = startX + i * phoneWidth * cardSpacing;
      bar.stage3BaseX = baseX;
      
      const centerOffset = baseX + phoneWidth / 2 - cw / 2;
      const normalizedDistance = Math.abs(centerOffset) / (cw / 2);
      
      const perspectiveRotation = Math.sin(centerOffset / cw * Math.PI) * perspectiveTilt;
      const depthFactor = Math.max(0.7, 1 - normalizedDistance * depthScale);
      const cardScale = depthFactor * cameraScale;
      
      bar.zDepth = 1 - normalizedDistance;
      
      const finalPhoneWidth = phoneWidth * cardScale;
      const finalPhoneHeight = phoneHeight * cardScale;
      const finalX = baseX * cameraScale + cw * (1 - cameraScale) / 2;
      const finalY = (ch * rowY - finalPhoneHeight / 2) * cameraScale + ch * (1 - cameraScale) / 2;
      
      // 计算鼠标影响
      const cardCenterX = finalX + finalPhoneWidth / 2;
      const cardCenterY = finalY + finalPhoneHeight / 2;
      const dx = cardCenterX - mouseX;
      const dy = cardCenterY - mouseY;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);
      const mouseInfluence = mouseDistance < mouseRadius 
        ? (1 - mouseDistance / mouseRadius) 
        : 0;
      
      const cardBrightness = brightness * (0.8 + (1 - normalizedDistance) * 0.2) * focusFactor;
      const mouseBoost = 1 + mouseInfluence * mouseBrightness * 2; // 增强鼠标影响
      const totalBrightness = Math.min(1.5, cardBrightness * mouseBoost); // 限制最大亮度
      
      // 保存stage3位置，用于过渡
      bar.stage3X = finalX;
      bar.stage3Y = finalY;
      bar.stage3Width = finalPhoneWidth;
      bar.stage3Height = finalPhoneHeight;
      
      Object.assign(bar, {
        targetX: finalX,
        targetY: finalY,
        targetWidth: finalPhoneWidth,
        targetHeight: finalPhoneHeight,
        targetColor: getPhoneColor(bar.colorSeed, totalBrightness * metallic, mouseInfluence),
        targetOpacity: finalOpacity * (1 + mouseInfluence * 0.2), // 鼠标悬停时增加透明度
        targetRotation: 0,
        targetRotationY: perspectiveRotation + mouseInfluence * (Math.PI / 12), // 额外旋转以突出交互
        targetRotationX: 0,
        targetScale: 1 + mouseInfluence * 0.15, // 轻微放大以突出交互
        isPhone: true,
        isLogoBar: false,
        phoneIndex: i,
        morphProgress: 1,
        aspectRatio: phoneAspectRatio
      });
    }
  };

  const calculateStage4 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const {
      logoWidth, logoHeight, positionY, barWidthRatio,
      minHeightRatio, maxHeightRatio, waveSpeed, waveAmplitude,
      baseOpacity, maxOpacity, centerRange, edgeFadeRange,
      mouseRadius, mouseAmplitude
    } = CONFIG.stage4;
    
    const logoX = cw / 2 - logoWidth / 2;
    const logoY = positionY;
    const logoBarSpacing = logoWidth / CONFIG.barCount;
    const logoBarWidth = logoBarSpacing * barWidthRatio;
    const time = timeRef.current * waveSpeed;
    const morphEased = easing.inOutCubic(stageProgress);
    
    // 鼠标位置
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    const logoCenterY = logoY + logoHeight / 2;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      const normalizedPos = i / (CONFIG.barCount - 1);
      const distanceFromCenter = Math.abs(normalizedPos - 0.5);
      
      // 优化透明度衰减计算
      let opacityFactor = 1;
      if (distanceFromCenter > centerRange / 2) {
        const fadeProgress = (distanceFromCenter - centerRange / 2) / (0.5 - centerRange / 2);
        opacityFactor = Math.max(0.1, 1 - fadeProgress * fadeProgress * 0.9);
      }
      
      const logoBarX = logoX + i * logoBarSpacing;
      const logoBarCenterX = logoBarX + logoBarWidth / 2;
      
      // 计算鼠标影响
      const dx = logoBarCenterX - mouseX;
      const dy = logoCenterY - mouseY;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);
      const mouseInfluence = mouseDistance < mouseRadius 
        ? (1 - mouseDistance / mouseRadius) 
        : 0;
      
      // 波形计算，加入鼠标影响
      const baseWave = Math.sin(normalizedPos * Math.PI * 6 + time * 10 + bar.phase) * 
                       bar.amplitude * waveAmplitude * opacityFactor;
      const mouseWave = mouseInfluence * mouseAmplitude * Math.sin(time * 20 + bar.phase * 2);
      const wave = baseWave + mouseWave;
      
      const normalizedWave = Math.max(0, (wave + 1) / 2);
      const waveHeight = logoHeight * (minHeightRatio + 
                        (maxHeightRatio - minHeightRatio) * normalizedWave) * 
                        (opacityFactor + mouseInfluence * 0.3);
      const logoBarY = logoY + logoHeight / 2 - waveHeight / 2;
      
      const intensity = 0.6 + normalizedWave * 0.4 + mouseInfluence * 0.2;
      const waveOpacity = (baseOpacity + normalizedWave * (maxOpacity - baseOpacity)) * 
                          opacityFactor * (1 + mouseInfluence * 0.2);
      
      Object.assign(bar, {
        targetX: logoBarX,
        targetY: logoBarY,
        targetWidth: logoBarWidth,
        targetHeight: Math.max(2, waveHeight),
        targetColor: getGradientColor(bar.colorSeed, intensity),
        targetOpacity: waveOpacity,
        targetRotation: 0,
        targetRotationX: 0,
        targetRotationY: 0,
        targetScale: 1,
        isLogoBar: true,
        logoIndex: i,
        isPhone: false,
        morphProgress: 0,
        aspectRatio: logoBarWidth / Math.max(2, waveHeight),
        zDepth: 0
      });
    }
  };

  const calculateCurrentStage = (canvas: HTMLCanvasElement, progress: number) => {
    const stages = CONFIG.stages;
    
    // 清除透明度
    barsRef.current.forEach(bar => bar.targetOpacity = 0);
    
    // 优化阶段判断逻辑
    if (progress <= stages.stage1.end) {
      const stageProgress = Math.max(0, Math.min(1, 
        (progress - stages.stage1.start) / (stages.stage1.peak - stages.stage1.start)
      ));
      calculateStage1(canvas, stageProgress);
    }
    
    // Stage 2 和 Stage 3 的一体化过渡
    if (progress >= stages.stage2.start && progress <= stages.stage3.end) {
      if (progress <= stages.stage2.end) {
        // 纯 Stage 2
        const stageProgress = Math.max(0, Math.min(1,
          (progress - stages.stage2.start) / (stages.stage2.peak - stages.stage2.start)
        ));
        calculateStage2(canvas, stageProgress);
        
        // 如果与 Stage 1 重叠，进行混合
        if (progress <= stages.stage1.end) {
          const blendProgress = (progress - stages.stage2.start) / (stages.stage1.end - stages.stage2.start);
          const blendT = easing.inOutSine(Math.max(0, Math.min(1, blendProgress)));
          
          // 存储stage2状态
          const stage2States = barsRef.current.map(bar => ({
            x: bar.targetX, y: bar.targetY, width: bar.targetWidth, height: bar.targetHeight,
            color: { ...bar.targetColor }, opacity: bar.targetOpacity,
            rotation: bar.targetRotation
          }));
          
          calculateStage1(canvas, 1);
          
          // 混合状态
          barsRef.current.forEach((bar, i) => {
            const s2 = stage2States[i];
            bar.targetX = smoothLerp(bar.targetX, s2.x, blendT);
            bar.targetY = smoothLerp(bar.targetY, s2.y, blendT);
            bar.targetWidth = smoothLerp(bar.targetWidth, s2.width, blendT);
            bar.targetHeight = smoothLerp(bar.targetHeight, s2.height, blendT);
            bar.targetColor = lerpColor(bar.targetColor, s2.color, blendT);
            bar.targetOpacity = smoothLerp(bar.targetOpacity, s2.opacity, blendT);
            bar.targetRotation = limitRotationChange(bar.rotation, smoothLerp(bar.targetRotation, s2.rotation, blendT));
          });
        }
      } else {
        // Stage 2 到 Stage 3 的过渡
        const stage3Progress = Math.max(0, Math.min(1,
          (progress - stages.stage3.start) / (stages.stage3.end - stages.stage3.start)
        ));
        
        // 先计算 Stage 3 的最终状态
        calculateStage3(canvas, stage3Progress);
        
        // 如果还在过渡区间内
        if (progress < stages.stage3.start + (stages.stage3.end - stages.stage3.start) * 0.1) {
          // 保存 Stage 3 状态
          const stage3States = barsRef.current.map(bar => ({
            x: bar.targetX, y: bar.targetY, 
            width: bar.targetWidth, height: bar.targetHeight,
            color: { ...bar.targetColor }, opacity: bar.targetOpacity,
            rotationY: bar.targetRotationY
          }));
          
          // 计算 Stage 2 状态
          const stage2Progress = 1; // Stage 2 已完成
          calculateStage2(canvas, stage2Progress);
          
          // 过渡进度
          const transitionProgress = (progress - stages.stage2.end) / (stages.stage3.start + (stages.stage3.end - stages.stage3.start) * 0.1 - stages.stage2.end);
          const transitionT = easing.inOutCubic(Math.max(0, Math.min(1, transitionProgress)));
          
          // 应用过渡
          barsRef.current.forEach((bar, i) => {
            const s3 = stage3States[i];
            
            // 从星云粒子位置过渡到手机卡片位置
            bar.targetX = smoothLerp(bar.stage2X, s3.x, transitionT);
            bar.targetY = smoothLerp(bar.stage2Y, s3.y, transitionT);
            bar.targetWidth = smoothLerp(CONFIG.stage2.particleSize, s3.width, transitionT);
            bar.targetHeight = smoothLerp(CONFIG.stage2.particleSize, s3.height, transitionT);
            bar.targetColor = lerpColor(bar.targetColor, s3.color, transitionT);
            bar.targetOpacity = smoothLerp(bar.targetOpacity, s3.opacity, transitionT);
            bar.targetRotationY = s3.rotationY * transitionT;
            
            // 形态进度
            bar.morphProgress = transitionT;
            bar.aspectRatio = smoothLerp(1, CONFIG.stage3.phoneAspectRatio, transitionT);
            bar.isPhone = transitionT > 0.5;
          });
        }
      }
    }
    
    if (progress >= stages.stage4.start) {
      const stageProgress = Math.max(0, Math.min(1,
        (progress - stages.stage4.start) / (stages.stage4.end - stages.stage4.start)
      ));
      calculateStage4(canvas, stageProgress);
    }
  };

  // 优化插值函数
  const interpolateToTarget = () => {
    const lerpFactor = CONFIG.globalLerpSpeed;
    
    barsRef.current.forEach(bar => {
      bar.x = smoothLerp(bar.x, bar.targetX, lerpFactor);
      bar.y = smoothLerp(bar.y, bar.targetY, lerpFactor);
      bar.width = smoothLerp(bar.width, bar.targetWidth, lerpFactor);
      bar.height = smoothLerp(bar.height, bar.targetHeight, lerpFactor);
      bar.opacity = smoothLerp(bar.opacity, bar.targetOpacity, lerpFactor);
      bar.scale = smoothLerp(bar.scale, bar.targetScale, lerpFactor);
      bar.rotation = smoothLerp(bar.rotation, bar.targetRotation, lerpFactor);
      bar.rotationX = smoothLerp(bar.rotationX, bar.targetRotationX, lerpFactor);
      bar.rotationY = smoothLerp(bar.rotationY, bar.targetRotationY, lerpFactor);
      
      bar.color.r = Math.floor(smoothLerp(bar.color.r, bar.targetColor.r, lerpFactor));
      bar.color.g = Math.floor(smoothLerp(bar.color.g, bar.targetColor.g, lerpFactor));
      bar.color.b = Math.floor(smoothLerp(bar.color.b, bar.targetColor.b, lerpFactor));
    });
  };

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgressRef.current = Math.max(0, Math.min(1, scrollY / maxScroll));
  }, []);

  // ==================== 主渲染循环 ====================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      const progress = scrollProgressRef.current;
      
      // 移除背景填充以使canvas透明
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      calculateCurrentStage(canvas, progress);
      interpolateToTarget();
      
      // 优化渲染：只渲染可见的元素
      const visibleBars = barsRef.current
        .filter(bar => bar.opacity > 0.01)
        .sort((a, b) => a.zDepth - b.zDepth);
      
      // 批量渲染优化
      for (const bar of visibleBars) {
        ctx.save();
        
        ctx.translate(bar.x + bar.width / 2, bar.y + bar.height / 2);
        
        // 3D变换优化
        if (bar.rotationY !== 0) {
          const scaleX = Math.cos(bar.rotationY);
          ctx.transform(scaleX, 0, 0, 1, 0, 0);
        }
        
        if (bar.rotationX !== 0) {
          const skewY = Math.sin(bar.rotationX) * 0.3;
          ctx.transform(1, skewY, 0, 1, 0, 0);
        }
        
        ctx.rotate(bar.rotation);
        ctx.scale(bar.scale, bar.scale);
        
        // 优化阴影效果设置
        const isStage2 = progress >= CONFIG.stages.stage2.start && progress <= CONFIG.stages.stage2.end && !bar.isPhone && !bar.isLogoBar;
        const isStage3Phone = bar.isPhone && progress >= CONFIG.stages.stage3.start && progress < CONFIG.stages.stage4.start;
        const isStage4Logo = bar.isLogoBar && progress >= CONFIG.stages.stage4.start;
        
        if (isStage2) {
          ctx.shadowBlur = CONFIG.stage2.glowRadius;
          ctx.shadowColor = `rgba(${bar.color.r}, ${bar.color.g}, ${bar.color.b}, ${bar.opacity * 0.6})`;
        } else if (isStage3Phone) {
          const shadowStrength = CONFIG.stage3.shadowStrength * (1 - Math.abs(bar.rotationY) / CONFIG.stage3.perspectiveTilt);
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(0, 0, 0, ${shadowStrength})`;
          ctx.shadowOffsetX = Math.sin(bar.rotationY) * 4;
          ctx.shadowOffsetY = 2;
        } else if (isStage4Logo) {
          ctx.shadowBlur = 3;
          ctx.shadowColor = `rgba(${bar.color.r}, ${bar.color.g}, ${bar.color.b}, ${bar.opacity * 0.3})`;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = `rgba(${bar.color.r}, ${bar.color.g}, ${bar.color.b}, ${bar.opacity})`;
        
        // 优化圆角计算
        const minDim = Math.min(bar.width, bar.height);
        const cornerRadius = Math.max(0, minDim * CONFIG.globalCornerRadius * (1 - bar.morphProgress * 0.7));
        
        ctx.beginPath();
        ctx.roundRect(-bar.width / 2, -bar.height / 2, bar.width, bar.height, cornerRadius);
        ctx.fill();
        
        ctx.restore();
      }

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <div className="relative w-full bg-black">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ 
          background: 'transparent',
          zIndex: 0
        }}
      />
      
      <div className="relative z-10">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-screen" />
        ))}
      </div>
    </div>
  );
};

export default ModifiedAudioWaveAnimation;
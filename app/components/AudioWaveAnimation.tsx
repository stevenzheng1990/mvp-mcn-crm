import React, { useEffect, useRef, useCallback } from 'react';

const EnhancedAudioWaveAnimation = () => {
  // ==================== 全局配置 ====================
  const CONFIG = {
    barCount: 196, // 总矩形数量，统一控制所有阶段的元素数量
    
    // 动画阶段时间轴配置 - 控制各阶段的开始、高峰和结束时间点
    stages: {
      stage1: { start: 0, peak: 0.13, end: 0.2 },      // 音频波形阶段
      stage2: { start: 0.2, peak: 0.28, end: 0.4 },    // 星云聚合阶段  
      stage3: { start: 0.4, peak: 0.55, end: 0.6 },    // 手机矩阵展开阶段
      stage4: { start: 0.6, peak: 0.75, end: 0.8 },    // 五手机排列阶段
      stage5: { start: 0.8, peak: 0.9, end: 1.0 },     // 单手机全屏阶段
    },
    
    // 颜色配置 - 定义各种元素的色彩方案
    colors: {
      champagne: { r: 235, g: 215, b: 175 },    // 香槟金色
      lightGold: { r: 245, g: 225, b: 195 },    // 浅金色
      silver: { r: 192, g: 192, b: 192 },       // 银色
      lightSilver: { r: 220, g: 220, b: 220 },  // 浅银色
      starBright: { r: 255, g: 245, b: 215 },   // 星光亮色
      starCore: { r: 255, g: 255, b: 255 },     // 星光核心色
      phoneScreen: { r: 240, g: 248, b: 255 },  // 手机屏幕色
    },
    
    // 全局动画参数
    globalCornerRadius: 0.25,              // 全局圆角比例
    globalLerpSpeed: 0.25,                 // 全局插值速度，控制动画平滑度
    maxRotationPerTransition: Math.PI * 0.5, // 单次过渡最大旋转角度
    rotationDamping: 0.8,                  // 旋转阻尼，防止过度旋转
    
    // 第一阶段：音频波形参数
    stage1: {
      barSpacing: 12,                      // 波形条间距
      barWidthRatio: 0.5,                  // 波形条宽度比例
      maxHeightRatio: 2.5,                 // 最大高度比例
      minHeight: 1,                        // 最小高度像素值
      zoomSequence: { initial: 0.03, peak: 0.45, final: 0.08 }, // 缩放序列
      waveParams: {
        speed: 0.004,                      // 波形动画速度
        randomness: 0.45,                  // 随机性强度
        asymmetry: 0.3,                    // 不对称性
      },
      mouseRadius: 150,                    // 鼠标影响半径
      mouseBoost: 1,                     // 鼠标影响强度
      baseOpacity: 0.45,                    // 基础透明度
      maxOpacity: 0.75,                     // 最大透明度
      colorIntensity: 0.8,                 // 颜色强度
    },
    
    // 第二阶段：星云效果参数
    stage2: {
      position: { x: 0.75, y: 0.5 },       // 星云中心位置（屏幕比例）
      initialRadius: 0.24,                 // 初始半径比例
      finalRadius: 0.35,                    // 最终半径比例
      particleSize: 20,                    // 粒子大小
      sphereEffect: 1.8,                   // 球体效果强度
      baseOpacity: 0.75,                   // 基础透明度（提高）
      glowRadius: 8,                       // 发光半径
      rotationSpeed: 0.003,                // 旋转速度
    },
    
    // 第三阶段：手机矩阵参数
    stage3: {
      grid: {
        rows: 14,                          // 网格行数
        cols: 14,                           // 网格列数
        spacingX: 0.05,                    // 水平间距比例
        spacingY: 0.05,                    // 垂直间距比例
        offsetX: 0.5,                     // 整体水平偏移
        offsetY: 0.5,                      // 整体垂直偏移
        randomOffset: 0.25,               // 随机偏移范围
      },
      phoneWidthRatio: 0.045,              // 手机宽度比例
      phoneAspectRatio: 2.1,               // 手机长宽比
      minScale: 0.45,                      // 最小缩放
      maxScale: 0.9,                      // 最大缩放
      depthLayers: 3,                      // 深度层数
      depthScaleEffect: 1,               // 深度缩放效果
      expandCurve: 0.7,                    // 展开曲线
      // 3D旋转参数
      rotation3D: {
        maxRotationY: Math.PI / 3,         // 最大Y轴旋转角度
        maxRotationX: Math.PI / 45,        // 最大X轴旋转角度
        rotationSpeed: 0.04,              // 旋转动画速度
        phaseOffset: 1,                  // 相位偏移
      },
      // 飞出效果（与选中手机放大同时进行）
      flyOutEffect: {
        startProgress: 0.8,                // 在第三阶段的80%时开始飞出
        speed: 0.025,                      // 飞出速度
        blurIntensity: 2,                 // 动态模糊强度
        angleRange: { min: Math.PI * 0.3, max: Math.PI * 0.7 }, // 向左飞出角度范围
      },
    },
    
    // 第四阶段：五个手机排列参数
    stage4: {
      selectedPhones: [14, 24, 34, 45, 55], // 选中的5个手机索引
      arrangementY: 0.7,                   // 排列的垂直位置
      spacingX: 0.15,                      // 手机间水平间距
      alignDuration: 0.6,                  // 对齐动画持续时间
      scaleUnified: 2.9,                   // 统一放大倍数
      // 飞出效果（其他4个手机向下飞出）
      flyOutEffect: {
        startProgress: 0.5,                // 在阶段的50%时开始飞出
        direction: { x: 0, y: 1 },         // 向下飞出方向
        speed: 0.03,                       // 飞出速度
        blurIntensity: 12,                 // 动态模糊强度
      },
    },
    
    // 第五阶段：全屏聚焦参数
    stage5: {
      focusIndex: 2,                       // 聚焦的手机索引（中间那个）
      zoomDuration: 0.7,                   // 缩放动画持续时间
      finalScale: 25,                      // 最终放大倍数（覆盖整个背景）
      colorTransitionStart: 0.2,           // 颜色过渡开始时机
      targetColor: { r: 245, g: 250, b: 255 }, // 最终浅色
    },
    
    // 背景参数
    background: {
      color: 'rgba(0, 0, 0, 0.7)',           // 背景颜色
      trailEffect: 0.1,                   // 拖尾效果透明度
    },
  };

  // ==================== Refs ====================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const scrollProgressRef = useRef<number>(0);
  
  const barsRef = useRef<Array<{
    // 位置和尺寸
    x: number; y: number; width: number; height: number;
    targetX: number; targetY: number; targetWidth: number; targetHeight: number;
    
    // 颜色和视觉
    color: { r: number; g: number; b: number };
    targetColor: { r: number; g: number; b: number };
    opacity: number; targetOpacity: number;
    
    // 变换
    rotation: number; targetRotation: number;
    scale: number; targetScale: number;
    
    // 3D旋转
    rotationX: number; targetRotationX: number;
    rotationY: number; targetRotationY: number;
    
    // 动画种子
    phase: number; amplitude: number; frequency: number;
    colorSeed: number; depthSeed: number; angleSeed: number;
    pulseSeed: number;
    
    // 手机相关
    isPhone: boolean; phoneIndex: number;
    gridRow: number; gridCol: number;
    isSelected: boolean;
    selectedIndex: number;
    
    // 星云效果
    starBrightness: number;
    
    // 形变和屏幕状态
    morphProgress: number; aspectRatio: number;
    isPhoneScreen: boolean; screenProgress: number;
    
    // 飞出效果
    isFlyingOut: boolean;
    flyVelocityX: number; flyVelocityY: number;
    flyBlur: number;
    
    // 深度排序
    zDepth: number;
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
        gridRow: -1, gridCol: -1,
        isSelected: false, selectedIndex: -1,
        
        starBrightness: 0.5 + Math.random() * 0.5,
        
        morphProgress: 0, aspectRatio: 1,
        isPhoneScreen: false, screenProgress: 0,
        
        isFlyingOut: false,
        flyVelocityX: 0, flyVelocityY: 0,
        flyBlur: 0,
        
        zDepth: Math.random(),
      };
    });
  }, []);

  // ==================== 工具函数 ====================
  const easing: Record<string, (t: number) => number> = {
    inOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    inOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
    outExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
    outBack: (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
  };

  const smoothLerp = (start: number, end: number, t: number, easeFn = easing.inOutCubic) => {
    return start + (end - start) * easeFn(Math.max(0, Math.min(1, t)));
  };

  const lerpColor = (c1: any, c2: any, t: number) => ({
    r: Math.floor(smoothLerp(c1.r, c2.r, t)),
    g: Math.floor(smoothLerp(c1.g, c2.g, t)),
    b: Math.floor(smoothLerp(c1.b, c2.b, t)),
  });

  const limitRotationChange = (current: number, target: number) => {
    let diff = target - current;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    
    if (Math.abs(diff) > CONFIG.maxRotationPerTransition) {
      diff = Math.sign(diff) * CONFIG.maxRotationPerTransition;
    }
    
    return current + diff * CONFIG.rotationDamping;
  };

  const getGradientColor = (seed: number, intensity: number = 1) => {
    const { champagne, lightGold, silver, lightSilver } = CONFIG.colors;
    
    if (seed < 0.5) {
      return lerpColor(champagne, lightGold, intensity * seed * 2);
    } else {
      return lerpColor(silver, lightSilver, intensity * (seed - 0.5) * 2);
    }
  };

  const getStarColor = (seed: number, brightness: number) => {
    const { starBright, starCore, champagne, lightGold } = CONFIG.colors;
    const baseColor = seed < 0.5 ? champagne : lightGold;
    
    if (brightness > 0.7) {
      return lerpColor(starBright, starCore, (brightness - 0.7) * 3.33);
    } else {
      return lerpColor(baseColor, starBright, brightness);
    }
  };

  // ==================== 阶段计算函数 ====================
  const calculateStage1 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const spacing = cw / CONFIG.barCount;
    const barWidth = spacing * CONFIG.stage1.barWidthRatio;
    const baseY = ch * 0.5;
    
    let zoom;
    if (stageProgress < 0.6) {
      const t = stageProgress / 0.6;
      zoom = smoothLerp(CONFIG.stage1.zoomSequence.initial, CONFIG.stage1.zoomSequence.peak, t, easing.outExpo);
    } else {
      const t = (stageProgress - 0.6) / 0.4;
      zoom = smoothLerp(CONFIG.stage1.zoomSequence.peak, CONFIG.stage1.zoomSequence.final, t);
    }
    
    const maxHeight = ch * CONFIG.stage1.maxHeightRatio * zoom;
    const time = timeRef.current * CONFIG.stage1.waveParams.speed;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      const normalizedPos = i / CONFIG.barCount;
      const x = i * spacing + (spacing - barWidth) / 2;
      const centerX = x + barWidth / 2;
      
      const { randomness, asymmetry } = CONFIG.stage1.waveParams;
      const p1 = Math.sin(normalizedPos * Math.PI * 8 - time * 12 + bar.phase) * bar.amplitude;
      const p2 = Math.sin(normalizedPos * Math.PI * 16 - time * 8) * 0.6;
      const p3 = Math.sin(normalizedPos * Math.PI * 32 - time * 20) * 0.25;
      const rand = Math.sin(time * 0.1 * bar.frequency + bar.phase) * randomness;
      const asym = Math.sin(normalizedPos * Math.PI * 4 + time * 6) * asymmetry;
      
      const wave = (p1 + p2 + p3 + rand) * (1 + asym);
      const normalizedWave = Math.max(0, (wave + 2.5) / 5);
      
      let mouseBoost = 0;
      const mouseDistance = Math.sqrt(
        Math.pow(centerX - mouseRef.current.x, 2) + 
        Math.pow(baseY - mouseRef.current.y, 2)
      );
      if (mouseDistance < CONFIG.stage1.mouseRadius) {
        mouseBoost = (1 - mouseDistance / CONFIG.stage1.mouseRadius) * CONFIG.stage1.mouseBoost;
      }
      
      const finalHeight = CONFIG.stage1.minHeight + (maxHeight - CONFIG.stage1.minHeight) * 
        (normalizedWave + mouseBoost);
      
      const intensity = normalizedWave + mouseBoost * 0.3;
      const color = getGradientColor(bar.colorSeed, intensity * CONFIG.stage1.colorIntensity);
      
      bar.targetX = x;
      bar.targetY = baseY - finalHeight * 0.5;
      bar.targetWidth = barWidth;
      bar.targetHeight = finalHeight;
      bar.targetColor = color;
      bar.targetOpacity = CONFIG.stage1.baseOpacity + intensity * (CONFIG.stage1.maxOpacity - CONFIG.stage1.baseOpacity);
      bar.targetRotation = 0;
      bar.targetScale = 1;
      bar.isPhone = false;
      bar.morphProgress = 0;
      bar.aspectRatio = bar.targetWidth / bar.targetHeight;
      bar.isPhoneScreen = false;
      bar.screenProgress = 0;
      bar.isFlyingOut = false;
      bar.flyBlur = 0;
      bar.zDepth = 0;
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
      
      // 使用球面坐标生成更明确的球体
      const phi = Math.acos(1 - 2 * bar.depthSeed);
      const theta = 2 * Math.PI * bar.angleSeed;
      const rotatedTheta = theta + rotationAngle;
      
      const x3d = Math.sin(phi) * Math.cos(rotatedTheta);
      const y3d = Math.sin(phi) * Math.sin(rotatedTheta);
      const z3d = Math.cos(phi);
      
      // 增强球体感觉
      const sphereScale = 1 + z3d * CONFIG.stage2.sphereEffect * 0.5;
      
      const x = centerX + x3d * currentRadius * sphereScale;
      const y = centerY + y3d * currentRadius * sphereScale;
      
      // 简化颜色计算
      const brightness = bar.starBrightness * (0.5 + z3d * 0.5);
      const color = getStarColor(bar.colorSeed, brightness);
      
      // 深度排序
      bar.zDepth = z3d;
      
      const particleSize = CONFIG.stage2.particleSize * (0.5 + z3d * 0.5);
      
      bar.targetX = x - particleSize / 2;
      bar.targetY = y - particleSize / 2;
      bar.targetWidth = particleSize;
      bar.targetHeight = particleSize;
      bar.targetColor = color;
      bar.targetOpacity = CONFIG.stage2.baseOpacity * stageProgress * (0.3 + brightness);
      bar.targetRotation = 0;
      bar.targetScale = 1;
      bar.isPhone = false;
      bar.morphProgress = 0;
      bar.aspectRatio = 1;
      bar.isPhoneScreen = false;
      bar.screenProgress = 0;
      bar.isFlyingOut = false;
      bar.flyBlur = 0;
    }
  };

  const calculateStage3 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const { grid, minScale, maxScale, depthLayers, 
            phoneWidthRatio, phoneAspectRatio, 
            expandCurve, depthScaleEffect, rotation3D, flyOutEffect } = CONFIG.stage3;
    
    const expandProgress = Math.pow(stageProgress, expandCurve);
    const phoneWidth = cw * phoneWidthRatio;
    const phoneHeight = phoneWidth * phoneAspectRatio;
    
    const totalPhones = CONFIG.barCount;
    const startX = cw * (grid.offsetX - (grid.cols - 1) * grid.spacingX / 2);
    const startY = ch * (grid.offsetY - (grid.rows - 1) * grid.spacingY / 2);
    
    const time = timeRef.current * rotation3D.rotationSpeed;
    
    // 检查是否开始飞出效果和选中手机放大
    const shouldFlyOut = stageProgress > flyOutEffect.startProgress;
    
    // 第四阶段的排列参数（提前计算）
    const { selectedPhones, arrangementY, spacingX, scaleUnified } = CONFIG.stage4;
    const selectedCount = selectedPhones.length;
    const totalWidth = (selectedCount - 1) * spacingX;
    const startArrangementX = 0.5 - totalWidth / 2;
    const stage4PhoneWidth = cw * phoneWidthRatio * scaleUnified;
    const stage4PhoneHeight = stage4PhoneWidth * phoneAspectRatio;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      
      bar.isPhone = true;
      bar.phoneIndex = i;
      
      const row = Math.floor(i / grid.cols);
      const col = i % grid.cols;
      bar.gridRow = row;
      bar.gridCol = col;
      
      // 检查是否是选中的手机
      const isSelectedPhone = selectedPhones.includes(i);
      const selectedIndex = selectedPhones.indexOf(i);
      
      if (shouldFlyOut && !isSelectedPhone) {
        // 非选中手机向左飞出屏幕
        if (!bar.isFlyingOut) {
          bar.isFlyingOut = true;
          // 向左飞出，角度范围限制在左半圆
          const angle = flyOutEffect.angleRange.min + 
            Math.random() * (flyOutEffect.angleRange.max - flyOutEffect.angleRange.min);
          bar.flyVelocityX = Math.cos(angle) * flyOutEffect.speed;
          bar.flyVelocityY = Math.sin(angle) * flyOutEffect.speed;
        }
        
        bar.targetX += bar.flyVelocityX * cw;
        bar.targetY += bar.flyVelocityY * ch;
        bar.flyBlur = flyOutEffect.blurIntensity;
        bar.targetOpacity = Math.max(0, bar.opacity - 0.05);
      } else if (isSelectedPhone && shouldFlyOut) {
        // 选中的手机：直接移动到第四阶段排列位置
        const transitionProgress = (stageProgress - flyOutEffect.startProgress) / (1 - flyOutEffect.startProgress);
        const transitionEased = easing.inOutCubic(Math.max(0, Math.min(1, transitionProgress)));
        
        const gridX = startX + col * cw * grid.spacingX;
        const gridY = startY + row * ch * grid.spacingY;
        const randomOffsetX = (bar.angleSeed - 0.5) * cw * grid.randomOffset;
        const randomOffsetY = (bar.depthSeed - 0.5) * ch * grid.randomOffset;
        
        const currentGridX = gridX + randomOffsetX * expandProgress;
        const currentGridY = gridY + randomOffsetY * expandProgress;
        
        // 目标位置（第四阶段排列）
        const targetArrangementX = cw * (startArrangementX + selectedIndex * spacingX);
        const targetArrangementY = ch * arrangementY;
        
        // 在当前网格位置和目标排列位置之间插值
        const finalX = smoothLerp(currentGridX, targetArrangementX, transitionEased);
        const finalY = smoothLerp(currentGridY, targetArrangementY, transitionEased);
        
        // 尺寸也同时过渡
        const currentScale = minScale + (maxScale - minScale) * expandProgress;
        const currentPhoneWidth = phoneWidth * currentScale;
        const currentPhoneHeight = phoneHeight * currentScale;
        
        const finalWidth = smoothLerp(currentPhoneWidth, stage4PhoneWidth, transitionEased);
        const finalHeight = smoothLerp(currentPhoneHeight, stage4PhoneHeight, transitionEased);
        
        bar.targetX = finalX - finalWidth / 2;
        bar.targetY = finalY - finalHeight / 2;
        bar.targetWidth = finalWidth;
        bar.targetHeight = finalHeight;
        bar.targetOpacity = 1.0;
        
        // 3D旋转归零
        const rotationPhase = bar.angleSeed * Math.PI * 2 * rotation3D.phaseOffset;
        const rotationY = Math.sin(time + rotationPhase) * rotation3D.maxRotationY * expandProgress * (1 - transitionEased);
        const rotationX = Math.cos(time * 0.7 + rotationPhase) * rotation3D.maxRotationX * expandProgress * (1 - transitionEased);
        
        bar.targetRotationX = rotationX;
        bar.targetRotationY = rotationY;
        bar.targetRotation = 0;
        bar.flyBlur = 0;
        
        bar.isSelected = true;
        bar.selectedIndex = selectedIndex;
      } else {
        // 正常的网格排列（阶段前期）
        const layer = Math.floor(i / (totalPhones / depthLayers));
        const layerProgress = layer / depthLayers;
        
        const gridX = startX + col * cw * grid.spacingX;
        const gridY = startY + row * ch * grid.spacingY;
        
        const randomOffsetX = (bar.angleSeed - 0.5) * cw * grid.randomOffset;
        const randomOffsetY = (bar.depthSeed - 0.5) * ch * grid.randomOffset;
        
        // 3D旋转计算
        const rotationPhase = bar.angleSeed * Math.PI * 2 * rotation3D.phaseOffset;
        const rotationY = Math.sin(time + rotationPhase) * rotation3D.maxRotationY * expandProgress;
        const rotationX = Math.cos(time * 0.7 + rotationPhase) * rotation3D.maxRotationX * expandProgress;
        
        const scale = minScale + (maxScale - minScale) * (1 - layerProgress * depthScaleEffect);
        const finalScale = scale * expandProgress;
        const finalX = gridX + randomOffsetX * expandProgress;
        const finalY = gridY + randomOffsetY * expandProgress;
        
        const color = getGradientColor(bar.colorSeed, 0.65);
        
        // 深度排序用于遮挡
        bar.zDepth = layerProgress;
        
        bar.targetX = finalX - (phoneWidth * finalScale) / 2;
        bar.targetY = finalY - (phoneHeight * finalScale) / 2;
        bar.targetWidth = phoneWidth * finalScale;
        bar.targetHeight = phoneHeight * finalScale;
        bar.targetColor = color;
        bar.targetOpacity = 1.0;
        bar.targetRotation = 0;
        bar.targetRotationX = rotationX;
        bar.targetRotationY = rotationY;
        bar.targetScale = 1;
        bar.morphProgress = 1;
        bar.aspectRatio = phoneAspectRatio;
        bar.isPhoneScreen = false;
        bar.screenProgress = 0;
        bar.flyBlur = 0;
        bar.isSelected = isSelectedPhone;
        bar.selectedIndex = selectedIndex;
      }
    }
  };

  const calculateStage4 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const { selectedPhones, flyOutEffect } = CONFIG.stage4;
    
    // 检查是否开始飞出效果
    const shouldFlyOut = stageProgress > flyOutEffect.startProgress;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      
      if (bar.isPhone && bar.isSelected) {
        if (shouldFlyOut && bar.selectedIndex !== CONFIG.stage5.focusIndex) {
          // 非中心手机向下飞出
          if (!bar.isFlyingOut) {
            bar.isFlyingOut = true;
            bar.flyVelocityX = 0;
            bar.flyVelocityY = flyOutEffect.speed;
          }
          
          bar.targetY += bar.flyVelocityY * ch;
          bar.flyBlur = flyOutEffect.blurIntensity;
          bar.targetOpacity = Math.max(0, bar.opacity - 0.08);
        } else {
          // 中心手机保持当前状态
          bar.targetOpacity = 1;
          bar.flyBlur = 0;
        }
      } else {
        bar.targetOpacity = 0;
      }
    }
  };

  const calculateStage5 = (canvas: HTMLCanvasElement, stageProgress: number) => {
    const { width: cw, height: ch } = canvas;
    const { focusIndex, zoomDuration, colorTransitionStart, targetColor } = CONFIG.stage5;
    
    const zoomProgress = Math.min(1, stageProgress / zoomDuration);
    const zoomEased = easing.outExpo(zoomProgress);
    
    // 找到要聚焦的手机
    let focusedBar = null;
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      if (bar.isSelected && bar.selectedIndex === focusIndex) {
        focusedBar = bar;
        break;
      }
    }
    
    if (!focusedBar) return;
    
    // 计算足够大的缩放以覆盖整个屏幕
    const currentWidth = focusedBar.width;
    const currentHeight = focusedBar.height;
    const scaleX = cw / currentWidth;
    const scaleY = ch / currentHeight;
    const fullScreenScale = Math.max(scaleX, scaleY) * 1.2; // 确保完全覆盖，留一些余量
    
    const targetScale = smoothLerp(1, fullScreenScale, zoomEased);
    const targetCenterX = cw / 2;
    const targetCenterY = ch / 2;
    
    for (let i = 0; i < CONFIG.barCount; i++) {
      const bar = barsRef.current[i];
      
      if (bar.isPhone && bar.isSelected && bar.selectedIndex === focusIndex) {
        // 聚焦的手机放大到覆盖全屏
        const phoneWidth = bar.width * targetScale;
        const phoneHeight = bar.height * targetScale;
        
        bar.targetX = targetCenterX - phoneWidth / 2;
        bar.targetY = targetCenterY - phoneHeight / 2;
        bar.targetWidth = phoneWidth;
        bar.targetHeight = phoneHeight;
        bar.targetOpacity = 1;
        bar.targetScale = 1;
        bar.targetRotation = 0;
        bar.targetRotationX = 0;
        bar.targetRotationY = 0;
        
        // 颜色过渡到浅色，覆盖背景
        if (stageProgress > colorTransitionStart) {
          const colorProgress = (stageProgress - colorTransitionStart) / (1 - colorTransitionStart);
          bar.targetColor = lerpColor(bar.color, targetColor, colorProgress);
        }
        
        bar.isPhoneScreen = true;
        bar.screenProgress = zoomProgress;
        bar.flyBlur = 0;
      } else if (bar.targetOpacity > 0) {
        bar.targetOpacity = 0;
      }
    }
  };

  // ==================== 渲染函数 ====================
  const renderPhoneScreen = (ctx: CanvasRenderingContext2D, bar: any) => {
    if (!bar.isPhoneScreen || bar.screenProgress < 0.1) return;
    
    ctx.save();
    
    const centerX = bar.x + bar.width / 2;
    const centerY = bar.y + bar.height / 2;
    
    ctx.translate(centerX, centerY);
    
    // 应用3D旋转
    if (bar.rotationY !== 0 || bar.rotationX !== 0) {
      const scaleX = Math.cos(bar.rotationY);
      const skewY = Math.sin(bar.rotationX) * 0.5;
      ctx.transform(scaleX, skewY, 0, 1, 0, 0);
    }
    
    ctx.rotate(bar.rotation);
    ctx.scale(bar.scale, bar.scale);
    
    // 简化屏幕渲染，移除发光和内缩效果
    ctx.fillStyle = `rgba(${bar.color.r}, ${bar.color.g}, ${bar.color.b}, ${bar.opacity})`;
    ctx.beginPath();
    ctx.roundRect(-bar.width / 2, -bar.height / 2, bar.width, bar.height, bar.width * 0.1);
    ctx.fill();
    
    ctx.restore();
  };

  const calculateCurrentStage = (canvas: HTMLCanvasElement, progress: number) => {
    const stages = CONFIG.stages;
    
    // 清除状态
    for (const bar of barsRef.current) {
      bar.targetOpacity = 0;
    }
    
    // 根据进度计算当前阶段
    if (progress <= stages.stage1.end) {
      const stageProgress = (progress - stages.stage1.start) / (stages.stage1.peak - stages.stage1.start);
      calculateStage1(canvas, Math.max(0, Math.min(1, stageProgress)));
    }
    
    if (progress >= stages.stage2.start && progress <= stages.stage2.end) {
      const stageProgress = (progress - stages.stage2.start) / (stages.stage2.peak - stages.stage2.start);
      calculateStage2(canvas, Math.max(0, Math.min(1, stageProgress)));
      
      // 阶段过渡混合
      if (progress <= stages.stage1.end) {
        const blendProgress = (progress - stages.stage2.start) / (stages.stage1.end - stages.stage2.start);
        const blendT = easing.inOutSine(Math.max(0, Math.min(1, blendProgress)));
        
        const stage2State = barsRef.current.map(bar => ({ ...bar }));
        calculateStage1(canvas, 1);
        
        for (let i = 0; i < CONFIG.barCount; i++) {
          const bar = barsRef.current[i];
          const s1 = bar;
          const s2 = stage2State[i];
          
          bar.targetX = smoothLerp(s1.targetX, s2.targetX, blendT);
          bar.targetY = smoothLerp(s1.targetY, s2.targetY, blendT);
          bar.targetWidth = smoothLerp(s1.targetWidth, s2.targetWidth, blendT);
          bar.targetHeight = smoothLerp(s1.targetHeight, s2.targetHeight, blendT);
          bar.targetColor = lerpColor(s1.targetColor, s2.targetColor, blendT);
          bar.targetOpacity = smoothLerp(s1.targetOpacity, s2.targetOpacity, blendT);
          bar.targetRotation = limitRotationChange(bar.rotation, smoothLerp(s1.targetRotation, s2.targetRotation, blendT));
        }
      }
    }
    
    if (progress >= stages.stage3.start && progress <= stages.stage3.end) {
      const stageProgress = Math.max(0, Math.min(1,
        (progress - stages.stage3.start) / (stages.stage3.peak - stages.stage3.start)
      ));
      
      if (progress <= stages.stage2.end) {
        // 改进的形变过渡
        const stage2Progress = Math.max(0, Math.min(1,
          (progress - stages.stage2.start) / (stages.stage2.peak - stages.stage2.start)
        ));
        
        calculateStage2(canvas, stage2Progress);
        const stage2State = [];
        for (let i = 0; i < CONFIG.barCount; i++) {
          stage2State.push({ 
            x: barsRef.current[i].targetX,
            y: barsRef.current[i].targetY,
            width: barsRef.current[i].targetWidth,
            height: barsRef.current[i].targetHeight,
            color: { ...barsRef.current[i].targetColor },
            opacity: barsRef.current[i].targetOpacity,
            rotation: barsRef.current[i].targetRotation,
          });
        }
        
        calculateStage3(canvas, stageProgress);
        const stage3State = [];
        for (let i = 0; i < CONFIG.barCount; i++) {
          stage3State.push({ 
            x: barsRef.current[i].targetX,
            y: barsRef.current[i].targetY,
            width: barsRef.current[i].targetWidth,
            height: barsRef.current[i].targetHeight,
            color: { ...barsRef.current[i].targetColor },
            opacity: barsRef.current[i].targetOpacity,
            rotation: barsRef.current[i].targetRotation,
            rotationX: barsRef.current[i].targetRotationX,
            rotationY: barsRef.current[i].targetRotationY,
            isPhone: barsRef.current[i].isPhone,
            phoneIndex: barsRef.current[i].phoneIndex,
          });
        }
        
        const blendProgress = (progress - stages.stage3.start) / (stages.stage2.end - stages.stage3.start);
        const blendT = easing.inOutSine(Math.max(0, Math.min(1, blendProgress)));
        
        for (let i = 0; i < CONFIG.barCount; i++) {
          const bar = barsRef.current[i];
          const s2 = stage2State[i];
          const s3 = stage3State[i];
          
          bar.targetX = smoothLerp(s2.x, s3.x, blendT);
          bar.targetY = smoothLerp(s2.y, s3.y, blendT);
          
          const widthProgress = smoothLerp(s2.width, s3.width, blendT);
          const heightProgress = smoothLerp(s2.width, s3.height, blendT);
          bar.targetWidth = widthProgress;
          bar.targetHeight = heightProgress;
          
          bar.targetColor = lerpColor(s2.color, s3.color, blendT);
          bar.targetOpacity = smoothLerp(s2.opacity, s3.opacity, blendT);
          bar.targetRotation = limitRotationChange(bar.rotation, smoothLerp(s2.rotation, 0, blendT));
          
          bar.targetRotationX = s3.rotationX * blendT;
          bar.targetRotationY = s3.rotationY * blendT;
          
          bar.morphProgress = blendT;
          bar.aspectRatio = smoothLerp(1, CONFIG.stage3.phoneAspectRatio, blendT);
          
          bar.isPhone = blendT > 0.5;
          bar.phoneIndex = s3.phoneIndex;
        }
      } else {
        calculateStage3(canvas, stageProgress);
      }
    }
    
    if (progress >= stages.stage4.start && progress <= stages.stage4.end) {
      const stageProgress = (progress - stages.stage4.start) / (stages.stage4.peak - stages.stage4.start);
      calculateStage4(canvas, Math.max(0, Math.min(1, stageProgress)));
    }
    
    if (progress >= stages.stage5.start) {
      const stageProgress = (progress - stages.stage5.start) / (stages.stage5.peak - stages.stage5.start);
      calculateStage5(canvas, Math.max(0, Math.min(1, stageProgress)));
    }
  };

  const interpolateToTarget = () => {
    const lerpFactor = CONFIG.globalLerpSpeed;
    
    for (const bar of barsRef.current) {
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
      
      bar.morphProgress = smoothLerp(bar.morphProgress, bar.morphProgress, lerpFactor);
      bar.aspectRatio = smoothLerp(bar.aspectRatio, bar.aspectRatio, lerpFactor);
      bar.screenProgress = smoothLerp(bar.screenProgress, bar.screenProgress, lerpFactor);
    }
  };

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = Math.max(1, documentHeight - windowHeight);
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
      
      // 背景渲染
      if (progress >= CONFIG.stages.stage4.start) {
        ctx.fillStyle = `rgba(0, 0, 0, ${CONFIG.background.trailEffect})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = CONFIG.background.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      calculateCurrentStage(canvas, progress);
      interpolateToTarget();
      
      // 按深度排序渲染（后面的先渲染，实现遮挡效果）
      const visibleBars = barsRef.current
        .filter(bar => bar.opacity > 0.01)
        .sort((a, b) => a.zDepth - b.zDepth);
      
      // 渲染所有矩形
      for (const bar of visibleBars) {
        if (bar.isPhoneScreen && bar.screenProgress > 0.1) {
          renderPhoneScreen(ctx, bar);
          continue;
        }
        
        ctx.save();
        
        // 动态模糊效果
        if (bar.flyBlur > 0) {
          ctx.filter = `blur(${bar.flyBlur}px)`;
        }
        
        ctx.translate(bar.x + bar.width / 2, bar.y + bar.height / 2);
        
        // 应用3D旋转
        if (bar.rotationY !== 0 || bar.rotationX !== 0) {
          const scaleX = Math.cos(bar.rotationY);
          const skewY = Math.sin(bar.rotationX) * 0.3;
          ctx.transform(scaleX, skewY, 0, 1, 0, 0);
        }
        
        ctx.rotate(bar.rotation);
        ctx.scale(bar.scale, bar.scale);
        
        // 简化发光效果（仅用于第二阶段星云）
        if (progress >= CONFIG.stages.stage2.start && progress <= CONFIG.stages.stage2.end && !bar.isPhone) {
          const glowRadius = CONFIG.stage2.glowRadius;
          ctx.shadowBlur = glowRadius;
          ctx.shadowColor = `rgba(${bar.color.r}, ${bar.color.g}, ${bar.color.b}, ${bar.opacity * 0.6})`;
        }
        
        ctx.fillStyle = `rgba(${bar.color.r}, ${bar.color.g}, ${bar.color.b}, ${bar.opacity})`;
        
        // 动态圆角
        const minDim = Math.min(bar.width, bar.height);
        const baseCornerRadius = minDim * CONFIG.globalCornerRadius;
        const morphCornerRadius = baseCornerRadius * (1 - bar.morphProgress * 0.7);
        
        ctx.beginPath();
        ctx.roundRect(-bar.width / 2, -bar.height / 2, bar.width, bar.height, morphCornerRadius);
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
          background: 'black',
          zIndex: 0
        }}
      />
      
      <div className="relative z-10">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-screen" />
        ))}
      </div>
    </div>
  );
};

export default EnhancedAudioWaveAnimation;
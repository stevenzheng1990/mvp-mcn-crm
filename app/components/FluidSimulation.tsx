// FluidSimulation.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const FluidSimulation = ({ className = "", style = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<any>(null);
  
  // 获取准确的视口尺寸，避免黑边问题
  const getViewportSize = () => {
    // 优先使用visualViewport API（现代浏览器）
    if (typeof window !== 'undefined' && window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height
      };
    }
    // 回退到document.documentElement（更准确包含滚动条）
    if (typeof document !== 'undefined') {
      return {
        width: document.documentElement.clientWidth || window.innerWidth,
        height: document.documentElement.clientHeight || window.innerHeight
      };
    }
    // 最后回退到window.inner*
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
  
  const [canvasStyle, setCanvasStyle] = useState({
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'auto' as const,
    zIndex: -1
  });

  useEffect(() => {

    if (!canvasRef.current) {
      return;
    }

    // ========== 流体模拟可调整参数 ==========
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 模拟分辨率比例 (0.05-0.3)：相对于屏幕尺寸的纹理分辨率，越小性能越好但细节越少
    const RESOLUTION = isMobile ? 0.12 : 0.18;
    
    // 流体粘性系数 (0.00001-0.01)：控制流体粘稠度，值越大流体越难流动，越粘稠
    const VISCOSITY = 0.0002;
    
    // 外部力强度倍数 (1-20)：鼠标/触摸输入力的放大系数，影响交互响应强度
    const FORCE_SCALE = 5;
    
    // 物理时间步长 (0.01-0.05)：每帧的模拟推进量，影响视觉流动速度和数值稳定性
    const TIME_STEP = 0.03;
    
    // 数值求解迭代次数 (20-80)：粘性扩散和压力投影的迭代数，越多越精确但性能开销越大
    const ITERATIONS = isMobile ? 40 : 60;
    
    // 力衰减系数 (0.1-0.9)：每帧力的保留比例，值越小力消失越快，越大则持续时间越长
    const FORCE_DECAY = 0.3;
    
    // 力衰减强度系数 (50-500)：控制力的空间衰减速度，值越大力衰减越快，有效影响半径越小
    const FORCE_RADIUS = isMobile ? 180 : 280;
    
    // 基础流体颜色 (RGB 0-1)：静止状态下的流体颜色，当前设为白色
    const BASE_COLOR = [1.0, 1.0, 1.0];
    
    // 流动状态颜色 (RGB 0-1)：运动时的流体颜色，与速度场混合显示
    const FLOW_COLOR = [1.0, 1.0, 1.0];
    
    // 滚动扰动强度 (0.1-1.0)：页面滚动时产生的流体扰动力度缩放系数
    const SCROLL_FORCE_SCALE = 0.2;

    // Shader sources
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const externalForceShader = `
      uniform sampler2D velocity;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 fboSize;
      varying vec2 vUv;
      
      void main() {
        vec2 st = gl_FragCoord.xy / fboSize;
        vec2 oldVel = texture2D(velocity, st).xy;
        
        float dist = distance(vUv, center);
        float intensity = exp(-dist * dist * ${FORCE_RADIUS.toFixed(1)});
        
        gl_FragColor = vec4(oldVel + intensity * force, 0.0, 1.0);
      }
    `;

    const advectionShader = `
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 fboSize;
      varying vec2 vUv;
      
      void main() {
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        vec2 vel = texture2D(velocity, vUv).xy;
        vec2 uv2 = vUv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 1.0);
      }
    `;

    const viscosityShader = `
      uniform sampler2D velocity;
      uniform sampler2D velocity_new;
      uniform float v;
      uniform vec2 px;
      uniform float dt;
      varying vec2 vUv;
      
      void main() {
        vec2 old = texture2D(velocity, vUv).xy;
        vec2 new0 = texture2D(velocity_new, vUv + vec2(px.x * 2.0, 0)).xy;
        vec2 new1 = texture2D(velocity_new, vUv - vec2(px.x * 2.0, 0)).xy;
        vec2 new2 = texture2D(velocity_new, vUv + vec2(0, px.y * 2.0)).xy;
        vec2 new3 = texture2D(velocity_new, vUv - vec2(0, px.y * 2.0)).xy;
        
        vec2 new = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
        new /= 4.0 * (1.0 + v * dt);
        
        gl_FragColor = vec4(new, 0.0, 1.0);
      }
    `;

    const divergenceShader = `
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 vUv;
      
      void main() {
        float x0 = texture2D(velocity, vUv - vec2(px.x, 0)).x;
        float x1 = texture2D(velocity, vUv + vec2(px.x, 0)).x;
        float y0 = texture2D(velocity, vUv - vec2(0, px.y)).y;
        float y1 = texture2D(velocity, vUv + vec2(0, px.y)).y;
        
        float divergence = (x1 - x0 + y1 - y0) / 2.0;
        gl_FragColor = vec4(divergence / dt);
      }
    `;

    const poissonShader = `
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;
      varying vec2 vUv;
      
      void main() {
        float p0 = texture2D(pressure, vUv + vec2(px.x * 2.0, 0)).r;
        float p1 = texture2D(pressure, vUv - vec2(px.x * 2.0, 0)).r;
        float p2 = texture2D(pressure, vUv + vec2(0, px.y * 2.0)).r;
        float p3 = texture2D(pressure, vUv - vec2(0, px.y * 2.0)).r;
        float div = texture2D(divergence, vUv).r;
        
        float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
        gl_FragColor = vec4(newP);
      }
    `;

    const pressureShader = `
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 vUv;
      
      void main() {
        float p0 = texture2D(pressure, vUv + vec2(px.x, 0)).r;
        float p1 = texture2D(pressure, vUv - vec2(px.x, 0)).r;
        float p2 = texture2D(pressure, vUv + vec2(0, px.y)).r;
        float p3 = texture2D(pressure, vUv - vec2(0, px.y)).r;
        
        vec2 v = texture2D(velocity, vUv).xy;
        vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
        v = v - dt * gradP;
        
        gl_FragColor = vec4(v, 0.0, 1.0);
      }
    `;

    const colorShader = `
      uniform sampler2D velocity;
      uniform float scrollOffset;
      varying vec2 vUv;
      
      void main() {
        vec2 vel = texture2D(velocity, vUv).xy;
        // 速度长度放大系数1.5：增强流动可视化效果，使颜色变化更明显
        float len = length(vel) * 1.2;
        
        // 速度向量归一化：从(-1,1)映射到(0,1)范围，用于颜色计算
        vel = vel * 0.5 + 0.5;
        
        // 添加基于滚动的渐变效果：0.001控制滚动敏感度，π控制渐变周期
        float scrollGradient = sin(scrollOffset * 0.001 + vUv.y * 3.14159) * 0.1 + 0.9;
        
        vec3 baseColor = vec3(${BASE_COLOR[0].toFixed(1)}, ${BASE_COLOR[1].toFixed(1)}, ${BASE_COLOR[2].toFixed(1)});
        vec3 flowColor = vec3(${FLOW_COLOR[0].toFixed(1)}, ${FLOW_COLOR[1].toFixed(1)}, ${FLOW_COLOR[2].toFixed(1)});
        vec3 color = vec3(vel.x, vel.y, 1.0) * flowColor;
        color = mix(baseColor, color * scrollGradient, len);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    class FluidSimulationEngine {
      private canvas: HTMLCanvasElement;
      private renderer!: THREE.WebGLRenderer;
      private scene!: THREE.Scene;
      private camera!: THREE.OrthographicCamera;
      private resolution!: number;
      private width!: number;
      private height!: number;
      private cellScale!: THREE.Vector2;
      private planeGeometry!: THREE.PlaneGeometry;
      private isAnimating: boolean;
      private scrollY: number = 0;
      private lastScrollY: number = 0;
      private scrollVelocity: number = 0;

      private fbos!: {
        vel_0: THREE.WebGLRenderTarget;
        vel_1: THREE.WebGLRenderTarget;
        vel_viscous0: THREE.WebGLRenderTarget;
        vel_viscous1: THREE.WebGLRenderTarget;
        div: THREE.WebGLRenderTarget;
        pressure_0: THREE.WebGLRenderTarget;
        pressure_1: THREE.WebGLRenderTarget;
      };

      private materials!: {
        externalForce: THREE.ShaderMaterial;
        advection: THREE.ShaderMaterial;
        viscosity: THREE.ShaderMaterial;
        divergence: THREE.ShaderMaterial;
        poisson: THREE.ShaderMaterial;
        pressure: THREE.ShaderMaterial;
        color: THREE.ShaderMaterial;
      };

      private mouse: THREE.Vector2;
      private lastMouse: THREE.Vector2;
      private mouseForce: THREE.Vector2;
      private planeMesh!: THREE.Mesh;

      private isAutoForce: boolean = false;
      private autoStartTime: number = 0;
      private savedMouse: THREE.Vector2 = new THREE.Vector2();
      private savedLastMouse: THREE.Vector2 = new THREE.Vector2();
      private savedForce: THREE.Vector2 = new THREE.Vector2();

      // 自动动画更新控制变量
      private lastAutoUpdateTime: number = 0;
      // 自动动画更新间隔 (ms)：16ms约为60fps，可调整为更大值节省性能（如33ms=30fps）
      private autoUpdateInterval: number = 33;
      
      // 触摸跟踪
      private touchStartY: number = 0;
      private touchStartTime: number = 0;
      private isScrolling: boolean = false;
      
      // 性能优化
      private isMobile: boolean = false;
      private lastFrameTime: number = 0;
      private frameInterval: number = 16.67; // 默认60fps

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.mouse = new THREE.Vector2(0, 0);
        this.lastMouse = new THREE.Vector2(0, 0);
        this.mouseForce = new THREE.Vector2(0, 0);
        
        // 检测移动端并设置帧率
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // 帧率控制 (ms)：移动端30fps(33.33ms)节省性能，桌面端60fps(16.67ms)保证流畅度
        this.frameInterval = this.isMobile ? 33.33 : 16.67;
        
        this.setupRenderer();
        this.setupSimulation();
        this.precompileShaders();
        this.isAnimating = true;
        this.animate();
      }
      
      // 获取准确的视口尺寸
      getViewportSize() {
        // 优先使用visualViewport API（现代浏览器）
        if (typeof window !== 'undefined' && window.visualViewport) {
          return {
            width: window.visualViewport.width,
            height: window.visualViewport.height
          };
        }
        // 回退到document.documentElement（更准确包含滚动条）
        if (typeof document !== 'undefined') {
          return {
            width: document.documentElement.clientWidth || window.innerWidth,
            height: document.documentElement.clientHeight || window.innerHeight
          };
        }
        // 最后回退到window.inner*
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }

      setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: false,
          alpha: true  // 启用alpha通道以支持透明背景
        });
        
        // 设置完全透明的背景，避免黑边
        this.renderer.setClearColor(0x000000, 0); // 透明背景
        
        const viewport = this.getViewportSize();
        this.renderer.setSize(viewport.width, viewport.height);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      }

      setupSimulation() {
        this.resolution = RESOLUTION;
        const viewport = this.getViewportSize();
        this.width = Math.round(viewport.width * this.resolution);
        this.height = Math.round(viewport.height * this.resolution);

        this.cellScale = new THREE.Vector2(1 / this.width, 1 / this.height);

        // 修复黑边问题：使用完整的平面尺寸而不是缩小的尺寸
        this.planeGeometry = new THREE.PlaneGeometry(2, 2);

        this.fbos = {
          vel_0: this.createFBO(),
          vel_1: this.createFBO(),
          vel_viscous0: this.createFBO(),
          vel_viscous1: this.createFBO(),
          div: this.createFBO(),
          pressure_0: this.createFBO(),
          pressure_1: this.createFBO()
        };

        // Clear all FBOs to prevent initial flickering
        for (const key in this.fbos) {
          this.clearFBO(this.fbos[key as keyof typeof this.fbos]);
        }

        this.materials = {
          externalForce: this.createShaderMaterial(vertexShader, externalForceShader, {
            velocity: { value: null },
            force: { value: new THREE.Vector2(0, 0) },
            center: { value: new THREE.Vector2(0, 0) },
            fboSize: { value: new THREE.Vector2(this.width, this.height) }
          }),
          advection: this.createShaderMaterial(vertexShader, advectionShader, {
            velocity: { value: null },
            dt: { value: TIME_STEP },
            fboSize: { value: new THREE.Vector2(this.width, this.height) }
          }),
          viscosity: this.createShaderMaterial(vertexShader, viscosityShader, {
            velocity: { value: null },
            velocity_new: { value: null },
            v: { value: VISCOSITY },
            px: { value: this.cellScale },
            dt: { value: TIME_STEP }
          }),
          divergence: this.createShaderMaterial(vertexShader, divergenceShader, {
            velocity: { value: null },
            dt: { value: TIME_STEP },
            px: { value: this.cellScale }
          }),
          poisson: this.createShaderMaterial(vertexShader, poissonShader, {
            pressure: { value: null },
            divergence: { value: null },
            px: { value: this.cellScale }
          }),
          pressure: this.createShaderMaterial(vertexShader, pressureShader, {
            pressure: { value: null },
            velocity: { value: null },
            dt: { value: TIME_STEP },
            px: { value: this.cellScale }
          }),
          color: this.createShaderMaterial(vertexShader, colorShader, {
            velocity: { value: null },
            scrollOffset: { value: 0 }
          })
        };

        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.materials.color);
        this.scene.add(this.planeMesh);

        this.setupEventListeners();
      }

      createShaderMaterial(vertexShader: string, fragmentShader: string, uniforms: any): THREE.ShaderMaterial {
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms
        });

        return material;
      }

      precompileShaders() {
        const originalMaterial = this.planeMesh.material;
        const materialList = Object.values(this.materials);

        for (const mat of materialList) {
          this.planeMesh.material = mat;
          this.renderer.compile(this.scene, this.camera);
        }

        this.planeMesh.material = originalMaterial;
      }

      setUniformSafe(material: THREE.ShaderMaterial, name: string, value: any) {
        if (material.uniforms && material.uniforms[name]) {
          material.uniforms[name].value = value;
        }
      }

      setupEventListeners() {
        this.onMouseMove = (e: MouseEvent) => {
          this.updateMousePosition(e.clientX, e.clientY);
        };

        this.onTouchStart = (e: TouchEvent) => {
          const touch = e.touches[0];
          this.touchStartY = touch.clientY;
          this.touchStartTime = Date.now();
          this.isScrolling = false;
        };

        this.onTouchMove = (e: TouchEvent) => {
          const touch = e.touches[0];
          const deltaY = Math.abs(touch.clientY - this.touchStartY);
          const deltaTime = Date.now() - this.touchStartTime;
          
          // 如果垂直移动超过10像素或时间超过300ms，认为是滚动
          if (deltaY > 50 || deltaTime > 600) {
            this.isScrolling = true;
          }
          
          // 更新鼠标位置，但在滚动时降低力度
          const forceMultiplier = this.isScrolling ? 0.3 : 1.0;
          this.updateMousePositionWithMultiplier(touch.clientX, touch.clientY, forceMultiplier);
        };
        
        this.onTouchEnd = () => {
          this.isScrolling = false;
        };

        this.onScroll = () => {
          this.scrollY = window.scrollY;
          this.scrollVelocity = (this.scrollY - this.lastScrollY) * SCROLL_FORCE_SCALE;

          if (Math.abs(this.scrollVelocity) > 0.1) {
            this.addScrollDisturbance();
          }

          this.lastScrollY = this.scrollY;
        };

        this.updateMousePosition = (x: number, y: number) => {
          this.updateMousePositionWithMultiplier(x, y, 1.0);
        };
        
        this.updateMousePositionWithMultiplier = (x: number, y: number, forceMultiplier: number) => {
          const viewport = this.getViewportSize();
          this.mouse.x = x / viewport.width;
          this.mouse.y = 1.0 - y / viewport.height;

          const deltaX = this.mouse.x - this.lastMouse.x;
          const deltaY = this.mouse.y - this.lastMouse.y;

          if (Math.abs(deltaX) > 0.0001 || Math.abs(deltaY) > 0.0001) {
            this.mouseForce.x = deltaX * FORCE_SCALE * forceMultiplier;
            this.mouseForce.y = deltaY * FORCE_SCALE * forceMultiplier;

            this.applyExternalForce();
          }

          this.lastMouse.copy(this.mouse);
        };

        this.onResize = () => {
          const viewport = this.getViewportSize();
          this.width = Math.round(viewport.width * this.resolution);
          this.height = Math.round(viewport.height * this.resolution);

          this.cellScale.set(1 / this.width, 1 / this.height);

          this.renderer.setSize(viewport.width, viewport.height);

          for (const key in this.fbos) {
            this.fbos[key as keyof typeof this.fbos].dispose();
            this.fbos[key as keyof typeof this.fbos] = this.createFBO();
          }

          const fboSize = new THREE.Vector2(this.width, this.height);
          this.setUniformSafe(this.materials.externalForce, 'fboSize', fboSize);
          this.setUniformSafe(this.materials.advection, 'fboSize', fboSize);
          this.setUniformSafe(this.materials.viscosity, 'px', this.cellScale);
          this.setUniformSafe(this.materials.divergence, 'px', this.cellScale);
          this.setUniformSafe(this.materials.poisson, 'px', this.cellScale);
          this.setUniformSafe(this.materials.pressure, 'px', this.cellScale);
        };

        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: true });
        this.canvas.addEventListener('touchmove', this.onTouchMove, { passive: true });
        this.canvas.addEventListener('touchend', this.onTouchEnd, { passive: true });
        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.onScroll, { passive: true });
      }

      private onMouseMove!: (e: MouseEvent) => void;
      private onTouchStart!: (e: TouchEvent) => void;
      private onTouchMove!: (e: TouchEvent) => void;
      private onTouchEnd!: () => void;
      private onScroll!: () => void;
      private updateMousePosition!: (x: number, y: number) => void;
      private updateMousePositionWithMultiplier!: (x: number, y: number, forceMultiplier: number) => void;
      private onResize!: () => void;

      addScrollDisturbance() {
        // 随机水平位置：中心±10%范围内产生扰动
        const x = 0.5 + (Math.random() - 0.5) * 0.2;
        // 固定在屏幕中央高度
        const y = 0.5;

        const savedMouse = this.mouse.clone();
        const savedForce = this.mouseForce.clone();

        // 随机角度偏移：±20度范围内的扰动方向
        const angleOffset = (Math.random() - 0.5) * Math.PI / 9;
        // 滚动力度转换：滚动速度的10%转为扰动强度
        const forceMagnitude = Math.abs(this.scrollVelocity) * 0.1;
        const forceX = Math.sin(angleOffset) * forceMagnitude;
        const forceY = -Math.cos(angleOffset) * Math.sign(this.scrollVelocity) * forceMagnitude;

        this.mouse.set(x, y);
        this.mouseForce.set(forceX, forceY);
        this.applyExternalForce();

        this.mouse.copy(savedMouse);
        this.mouseForce.copy(savedForce);
      }

      createFBO() {
        return new THREE.WebGLRenderTarget(this.width, this.height, {
          type: THREE.FloatType,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat
        });
      }

      step() {
        if (Math.abs(this.mouseForce.x) > 0.001 || Math.abs(this.mouseForce.y) > 0.001) {
          this.applyExternalForce();
        }

        this.advect();
        this.applyViscosity();
        this.applyPressure();
      }

      applyExternalForce() {
        const material = this.materials.externalForce;
        this.setUniformSafe(material, 'velocity', this.fbos.vel_0.texture);
        this.setUniformSafe(material, 'force', this.mouseForce);
        this.setUniformSafe(material, 'center', this.mouse);

        this.renderToFBO(material, this.fbos.vel_1);
        this.swapVelocity();
      }

      advect() {
        const material = this.materials.advection;
        this.setUniformSafe(material, 'velocity', this.fbos.vel_0.texture);

        this.renderToFBO(material, this.fbos.vel_1);
        this.swapVelocity();
      }

      applyViscosity() {
        const material = this.materials.viscosity;
        this.setUniformSafe(material, 'velocity', this.fbos.vel_0.texture);

        this.copyFBO(this.fbos.vel_0, this.fbos.vel_viscous0);

        for (let i = 0; i < ITERATIONS; i++) {
          const input = i % 2 === 0 ? this.fbos.vel_viscous0 : this.fbos.vel_viscous1;
          const output = i % 2 === 0 ? this.fbos.vel_viscous1 : this.fbos.vel_viscous0;

          this.setUniformSafe(material, 'velocity_new', input.texture);
          this.renderToFBO(material, output);
        }

        const finalViscous = ITERATIONS % 2 === 0 ? this.fbos.vel_viscous0 : this.fbos.vel_viscous1;
        this.copyFBO(finalViscous, this.fbos.vel_0);
      }

      applyPressure() {
        const divMaterial = this.materials.divergence;
        this.setUniformSafe(divMaterial, 'velocity', this.fbos.vel_0.texture);
        this.renderToFBO(divMaterial, this.fbos.div);

        this.clearFBO(this.fbos.pressure_0);
        this.clearFBO(this.fbos.pressure_1);

        const poissonMaterial = this.materials.poisson;
        this.setUniformSafe(poissonMaterial, 'divergence', this.fbos.div.texture);

        for (let i = 0; i < ITERATIONS; i++) {
          const input = i % 2 === 0 ? this.fbos.pressure_0 : this.fbos.pressure_1;
          const output = i % 2 === 0 ? this.fbos.pressure_1 : this.fbos.pressure_0;

          this.setUniformSafe(poissonMaterial, 'pressure', input.texture);
          this.renderToFBO(poissonMaterial, output);
        }

        const pressureMaterial = this.materials.pressure;
        const finalPressure = ITERATIONS % 2 === 0 ? this.fbos.pressure_0 : this.fbos.pressure_1;
        this.setUniformSafe(pressureMaterial, 'pressure', finalPressure.texture);
        this.setUniformSafe(pressureMaterial, 'velocity', this.fbos.vel_0.texture);

        this.renderToFBO(pressureMaterial, this.fbos.vel_1);
        this.swapVelocity();
      }

      renderToFBO(material: THREE.ShaderMaterial, fbo: THREE.WebGLRenderTarget) {
        this.planeMesh.material = material;
        this.renderer.setRenderTarget(fbo);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
      }

      copyFBO(source: THREE.WebGLRenderTarget, target: THREE.WebGLRenderTarget) {
        const copyMaterial = new THREE.MeshBasicMaterial({ map: source.texture });
        this.planeMesh.material = copyMaterial;
        this.renderer.setRenderTarget(target);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        copyMaterial.dispose();
      }

      clearFBO(fbo: THREE.WebGLRenderTarget) {
        this.renderer.setRenderTarget(fbo);
        this.renderer.clear();
        this.renderer.setRenderTarget(null);
      }

      swapVelocity() {
        const temp = this.fbos.vel_0;
        this.fbos.vel_0 = this.fbos.vel_1;
        this.fbos.vel_1 = temp;
      }

      simulateAutoMouse(now: number) {
        const elapsed = now - this.autoStartTime;

        // 自动动画总时长：5秒完成完整的圆形运动
        const totalDuration = 5000;

        if (elapsed > totalDuration) {
          this.isAutoForce = false;
          this.mouse.copy(this.savedMouse);
          this.lastMouse.copy(this.savedLastMouse);
          this.mouseForce.copy(this.savedForce);
          return;
        }

        // 转圈次数：5秒内完成3圈旋转
        const rotations = 3;
        const angle = 2 * Math.PI * (rotations * (elapsed / totalDuration));
        // 圆形运动半径：相对于屏幕中心的15%半径范围
        const radius = 0.15;

        const autoX = 0.5 + radius * Math.cos(angle);
        const autoY = 0.5 + radius * Math.sin(angle);

        const newMouse = new THREE.Vector2(autoX, autoY);
        const deltaX = newMouse.x - this.lastMouse.x;
        const deltaY = newMouse.y - this.lastMouse.y;

        // 自动动画力度：比正常交互强20%，营造更明显的流体效果
        this.mouseForce.x = deltaX * FORCE_SCALE * 1.2;
        this.mouseForce.y = deltaY * FORCE_SCALE * 1.2;

        this.mouse.copy(newMouse);
        this.lastMouse.copy(newMouse);
      }

      render() {
        const now = performance.now();

        if (this.isAutoForce) {
          // 只在间隔时间后更新自动鼠标位置，以减少计算频率
          if (now - this.lastAutoUpdateTime >= this.autoUpdateInterval) {
            this.simulateAutoMouse(now);
            this.lastAutoUpdateTime = now;
          }
        }

        this.step();

        this.mouseForce.x *= FORCE_DECAY;
        this.mouseForce.y *= FORCE_DECAY;

        this.setUniformSafe(this.materials.color, 'scrollOffset', this.scrollY);
        this.setUniformSafe(this.materials.color, 'velocity', this.fbos.vel_0.texture);
        this.planeMesh.material = this.materials.color;

        this.renderer.render(this.scene, this.camera);
      }

      animate = () => {
        if (!this.isAnimating) {
          return;
        }

        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;

        // 帧率限制
        if (deltaTime >= this.frameInterval) {
          this.render();
          this.lastFrameTime = now - (deltaTime % this.frameInterval);
        }

        requestAnimationFrame(this.animate);
      }

      triggerAutoForce() {
        this.isAutoForce = true;
        this.autoStartTime = performance.now();
        this.lastAutoUpdateTime = this.autoStartTime;
        this.savedMouse.copy(this.mouse);
        this.savedLastMouse.copy(this.lastMouse);
        this.savedForce.copy(this.mouseForce);

        const initialAngle = 0;
        const radius = 0.15; // 与simulateAutoMouse中的radius一致
        this.lastMouse.set(0.5 + radius * Math.cos(initialAngle), 0.5 + radius * Math.sin(initialAngle));
      }

      destroy() {
        this.isAnimating = false;

        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        this.canvas.removeEventListener('touchmove', this.onTouchMove);
        this.canvas.removeEventListener('touchend', this.onTouchEnd);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScroll);

        for (const key in this.fbos) {
          this.fbos[key as keyof typeof this.fbos].dispose();
        }

        for (const key in this.materials) {
          this.materials[key as keyof typeof this.materials].dispose();
        }

        this.planeGeometry.dispose();
        this.renderer.dispose();
      }
    }

    simulationRef.current = new FluidSimulationEngine(canvasRef.current);

    if (simulationRef.current) {
      simulationRef.current.triggerAutoForce();
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.destroy();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...canvasStyle,
        ...style,
        // 确保完全覆盖，防止任何边距或边框影响
        margin: 0,
        padding: 0,
        border: 'none',
        display: 'block',
        // 移除transform scale以避免渲染问题
      }}
    />
  );
};

export default FluidSimulation;

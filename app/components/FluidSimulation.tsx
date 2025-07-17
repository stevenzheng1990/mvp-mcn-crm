// FluidSimulation.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const FluidSimulation = ({ className = "", style = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<any>(null);
  const [canvasStyle, setCanvasStyle] = useState({
    position: 'fixed' as const,
    top: 0,
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'auto' as const,
    zIndex: -1
  });

  useEffect(() => {
    console.log('FluidSimulation mounting...');

    if (!canvasRef.current) {
      console.error('Canvas ref is null');
      return;
    }

    // ========== 可调整参数 ==========
    const RESOLUTION = 0.18;
    const VISCOSITY = 0.00003;
    const FORCE_SCALE = 5; // 增加鼠标力的强度
    const TIME_STEP = 0.019;
    const ITERATIONS = 90;
    const FORCE_DECAY = 0.85; // 稍微增加力的持续时间
    const FORCE_RADIUS = 150; // 减小力的影响半径，使效果更集中
    const BASE_COLOR = [0, 0, 0];
    const FLOW_COLOR = [1.0, 1.0, 1.0];
    const SCROLL_FORCE_SCALE = 0.2; // 滚动产生的力的缩放

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
        float len = length(vel);
        vel = vel * 0.5 + 0.5;
        
        // 添加基于滚动的渐变效果
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

      constructor(canvas: HTMLCanvasElement) {
        console.log('FluidSimulationEngine initializing...');
        this.canvas = canvas;
        this.mouse = new THREE.Vector2(0, 0);
        this.lastMouse = new THREE.Vector2(0, 0);
        this.mouseForce = new THREE.Vector2(0, 0);
        this.setupRenderer();
        this.setupSimulation();
        this.isAnimating = true;
        this.animate();
      }

      setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: false,
          alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        console.log('Renderer size:', window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      }

      setupSimulation() {
        this.resolution = RESOLUTION;
        this.width = Math.round(window.innerWidth * this.resolution);
        this.height = Math.round(window.innerHeight * this.resolution);

        this.cellScale = new THREE.Vector2(1 / this.width, 1 / this.height);

        this.planeGeometry = new THREE.PlaneGeometry(
          2 - this.cellScale.x * 2,
          2 - this.cellScale.y * 2
        );

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

        material.onBeforeCompile = (shader) => {
          console.log('Compiling shader material');
        };

        return material;
      }

      setUniformSafe(material: THREE.ShaderMaterial, name: string, value: any) {
        try {
          if (material.uniforms && material.uniforms[name]) {
            material.uniforms[name].value = value;
          }
        } catch (error) {
          console.warn(`Failed to set uniform ${name}:`, error);
        }
      }

      setupEventListeners() {
        this.onMouseMove = (e: MouseEvent) => {
          this.updateMousePosition(e.clientX, e.clientY);
        };

        this.onTouchMove = (e: TouchEvent) => {
          e.preventDefault();
          const touch = e.touches[0];
          this.updateMousePosition(touch.clientX, touch.clientY);
        };

        this.onScroll = () => {
          this.scrollY = window.scrollY;
          this.scrollVelocity = (this.scrollY - this.lastScrollY) * SCROLL_FORCE_SCALE;

          // 滚动时产生流体扰动
          if (Math.abs(this.scrollVelocity) > 0.1) {
            this.addScrollDisturbance();
          }

          this.lastScrollY = this.scrollY;
        };

        this.updateMousePosition = (x: number, y: number) => {
          this.mouse.x = x / window.innerWidth;
          this.mouse.y = 1.0 - y / window.innerHeight;

          // 计算鼠标移动产生的力
          const deltaX = this.mouse.x - this.lastMouse.x;
          const deltaY = this.mouse.y - this.lastMouse.y;

          // 只有在鼠标真正移动时才更新力
          if (Math.abs(deltaX) > 0.0001 || Math.abs(deltaY) > 0.0001) {
            this.mouseForce.x = deltaX * FORCE_SCALE;
            this.mouseForce.y = deltaY * FORCE_SCALE;

            // 立即应用鼠标力
            this.applyExternalForce();
          }

          this.lastMouse.copy(this.mouse);
        };

        this.onResize = () => {
          this.width = Math.round(window.innerWidth * this.resolution);
          this.height = Math.round(window.innerHeight * this.resolution);

          this.cellScale.set(1 / this.width, 1 / this.height);

          this.renderer.setSize(window.innerWidth, window.innerHeight);

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
        this.canvas.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.onScroll);
      }

      private onMouseMove!: (e: MouseEvent) => void;
      private onTouchMove!: (e: TouchEvent) => void;
      private onScroll!: () => void;
      private updateMousePosition!: (x: number, y: number) => void;
      private onResize!: () => void;

      addScrollDisturbance() {
        // 引入变化：位置轻微随机偏移，保持大约居中
        const x = 0.5 + (Math.random() - 0.5) * 0.2; // x 在 0.45 ~ 0.55 之间随机
        const y = 0.5;

        // 保存当前鼠标位置和力
        const savedMouse = this.mouse.clone();
        const savedForce = this.mouseForce.clone();

        // 引入角度变化：力的方向不完全垂直，添加小角度偏移
        const angleOffset = (Math.random() - 0.5) * Math.PI / 9; // +/- 15 度偏移
        const forceMagnitude = Math.abs(this.scrollVelocity) * 0.1;
        const forceX = Math.sin(angleOffset) * forceMagnitude;
        const forceY = -Math.cos(angleOffset) * Math.sign(this.scrollVelocity) * forceMagnitude;

        // 应用滚动扰动
        this.mouse.set(x, y);
        this.mouseForce.set(forceX, forceY);
        this.applyExternalForce();

        // 恢复鼠标位置和力
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
        // 只有在有力的时候才应用外部力
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
        try {
          this.planeMesh.material = material;
          this.renderer.setRenderTarget(fbo);
          this.renderer.render(this.scene, this.camera);
          this.renderer.setRenderTarget(null);
        } catch (error) {
          console.warn('Render to FBO failed:', error);
        }
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

      simulateAutoMouse() {
        const now = performance.now();
        const elapsed = now - this.autoStartTime;

        const totalDuration = 5000; // 5 seconds

        if (elapsed > totalDuration) {
          this.isAutoForce = false;
          this.mouse.copy(this.savedMouse);
          this.lastMouse.copy(this.savedLastMouse);
          this.mouseForce.copy(this.savedForce);
          return;
        }

        // 3 circles in 5 seconds, but make speed faster by increasing the number of rotations slightly
        const rotations = 3.5; // Slightly faster than 3
        const angle = 2 * Math.PI * (rotations * (elapsed / totalDuration));
        const radius = 0.4; // Larger radius to be closer to edges

        const autoX = 0.5 + radius * Math.cos(angle);
        const autoY = 0.5 + radius * Math.sin(angle);

        const newMouse = new THREE.Vector2(autoX, autoY);
        const deltaX = newMouse.x - this.lastMouse.x;
        const deltaY = newMouse.y - this.lastMouse.y;

        this.mouseForce.x = deltaX * FORCE_SCALE;
        this.mouseForce.y = deltaY * FORCE_SCALE;

        this.mouse.copy(newMouse);
        this.lastMouse.copy(newMouse);
      }

      render() {
        if (this.isAutoForce) {
          this.simulateAutoMouse();
        }

        // 始终应用步骤，即使没有新的力
        this.step();

        // 衰减鼠标力
        this.mouseForce.x *= FORCE_DECAY;
        this.mouseForce.y *= FORCE_DECAY;

        // 更新滚动偏移量
        this.setUniformSafe(this.materials.color, 'scrollOffset', this.scrollY);
        this.setUniformSafe(this.materials.color, 'velocity', this.fbos.vel_0.texture);
        this.planeMesh.material = this.materials.color;

        this.renderer.render(this.scene, this.camera);
      }

      animate = () => {
        if (!this.isAnimating) {
          console.log('Animation stopped');
          return;
        }

        try {
          this.render();
        } catch (error) {
          console.warn('Animation frame error:', error);
        }

        requestAnimationFrame(this.animate);
      }

      triggerAutoForce() {
        this.isAutoForce = true;
        this.autoStartTime = performance.now();
        this.savedMouse.copy(this.mouse);
        this.savedLastMouse.copy(this.lastMouse);
        this.savedForce.copy(this.mouseForce);

        // Initialize starting position
        const initialAngle = 0;
        const radius = 0.4;
        this.lastMouse.set(0.5 + radius * Math.cos(initialAngle), 0.5 + radius * Math.sin(initialAngle));
      }

      destroy() {
        this.isAnimating = false;

        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('touchmove', this.onTouchMove);
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
    console.log('FluidSimulation created:', simulationRef.current);

    // 页面加载1.5秒后触发一次自动力
    setTimeout(() => {
      if (simulationRef.current) {
        simulationRef.current.triggerAutoForce();
      }
    }, 1000);

    return () => {
      console.log('FluidSimulation unmounting...');
      if (simulationRef.current) {
        simulationRef.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          ...canvasStyle,
          cursor: 'pointer' // 改为指针样式，表示可交互
        }}
      />
    </div>
  );
};

export default FluidSimulation;
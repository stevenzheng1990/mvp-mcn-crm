import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FluidSimulation = ({ className = "", style = {} }) => {
  const canvasRef = useRef(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ========== 可调整参数 ==========
    const RESOLUTION = 0.25;
    const VISCOSITY = 0.00001;
    const FORCE_SCALE = 5;
    const TIME_STEP = 0.016;
    const ITERATIONS = 20;
    const FORCE_DECAY = 0.8;
    const FORCE_RADIUS = 50.0;
    const BASE_COLOR = [0.1, 0.1, 0.2];
    const FLOW_COLOR = [1.0, 1.0, 1.0];

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
      varying vec2 vUv;
      
      void main() {
        vec2 vel = texture2D(velocity, vUv).xy;
        float len = length(vel);
        vel = vel * 0.5 + 0.5;
        
        vec3 baseColor = vec3(${BASE_COLOR[0].toFixed(1)}, ${BASE_COLOR[1].toFixed(1)}, ${BASE_COLOR[2].toFixed(1)});
        vec3 flowColor = vec3(${FLOW_COLOR[0].toFixed(1)}, ${FLOW_COLOR[1].toFixed(1)}, ${FLOW_COLOR[2].toFixed(1)});
        vec3 color = vec3(vel.x, vel.y, 1.0) * flowColor;
        color = mix(baseColor, color, len);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    class FluidSimulationEngine {
      constructor(canvas) {
        this.canvas = canvas;
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
        
        this.materials = {
          externalForce: new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: externalForceShader,
            uniforms: {
              velocity: { value: null },
              force: { value: new THREE.Vector2() },
              center: { value: new THREE.Vector2() },
              fboSize: { value: new THREE.Vector2(this.width, this.height) }
            }
          }),
          advection: new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: advectionShader,
            uniforms: {
              velocity: { value: null },
              dt: { value: TIME_STEP },
              fboSize: { value: new THREE.Vector2(this.width, this.height) }
            }
          }),
          viscosity: new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: viscosityShader,
            uniforms: {
              velocity: { value: null },
              velocity_new: { value: null },
              v: { value: VISCOSITY },
              px: { value: this.cellScale },
              dt: { value: TIME_STEP }
            }
          }),
          divergence: new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: divergenceShader,
            uniforms: {
              velocity: { value: null },
              dt: { value: TIME_STEP },
              px: { value: this.cellScale }
            }
          }),
          poisson: new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: poissonShader,
            uniforms: {
              pressure: { value: null },
              divergence: { value: null },
              px: { value: this.cellScale }
            }
          }),
          pressure: new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: pressureShader,
            uniforms: {
              pressure: { value: null },
              velocity: { value: null },
              dt: { value: TIME_STEP },
              px: { value: this.cellScale }
            }
          }),
          color: new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: colorShader,
            uniforms: {
              velocity: { value: null }
            }
          })
        };
        
        this.mouse = new THREE.Vector2();
        this.lastMouse = new THREE.Vector2();
        this.mouseForce = new THREE.Vector2();
        
        this.setupEventListeners();
      }

      setupEventListeners() {
        this.onMouseMove = (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.lastMouse.copy(this.mouse);
          this.mouse.x = (e.clientX - rect.left) / rect.width;
          this.mouse.y = 1 - (e.clientY - rect.top) / rect.height;
          
          this.mouseForce.x = (this.mouse.x - this.lastMouse.x) * FORCE_SCALE;
          this.mouseForce.y = (this.mouse.y - this.lastMouse.y) * FORCE_SCALE;
        };

        this.onTouchMove = (e) => {
          e.preventDefault();
          if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.lastMouse.copy(this.mouse);
            this.mouse.x = (touch.clientX - rect.left) / rect.width;
            this.mouse.y = 1 - (touch.clientY - rect.top) / rect.height;
            
            this.mouseForce.x = (this.mouse.x - this.lastMouse.x) * FORCE_SCALE;
            this.mouseForce.y = (this.mouse.y - this.lastMouse.y) * FORCE_SCALE;
          }
        };

        this.onResize = () => {
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          
          this.width = Math.round(window.innerWidth * this.resolution);
          this.height = Math.round(window.innerHeight * this.resolution);
          this.cellScale.set(1 / this.width, 1 / this.height);
          
          for (let key in this.fbos) {
            this.fbos[key].dispose();
            this.fbos[key] = this.createFBO();
          }
          
          const fboSize = new THREE.Vector2(this.width, this.height);
          this.materials.externalForce.uniforms.fboSize.value = fboSize;
          this.materials.advection.uniforms.fboSize.value = fboSize;
          this.materials.viscosity.uniforms.px.value = this.cellScale;
          this.materials.divergence.uniforms.px.value = this.cellScale;
          this.materials.poisson.uniforms.px.value = this.cellScale;
          this.materials.pressure.uniforms.px.value = this.cellScale;
        };

        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('resize', this.onResize);
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
        this.applyExternalForce();
        this.advect();
        this.applyViscosity();
        this.applyPressure();
      }

      applyExternalForce() {
        const material = this.materials.externalForce;
        material.uniforms.velocity.value = this.fbos.vel_0.texture;
        material.uniforms.force.value.copy(this.mouseForce);
        material.uniforms.center.value.copy(this.mouse);
        
        this.renderToFBO(material, this.fbos.vel_1);
        this.swapVelocity();
      }

      advect() {
        const material = this.materials.advection;
        material.uniforms.velocity.value = this.fbos.vel_0.texture;
        
        this.renderToFBO(material, this.fbos.vel_1);
        this.swapVelocity();
      }

      applyViscosity() {
        const material = this.materials.viscosity;
        material.uniforms.velocity.value = this.fbos.vel_0.texture;
        
        this.copyFBO(this.fbos.vel_0, this.fbos.vel_viscous0);
        
        for (let i = 0; i < ITERATIONS; i++) {
          const input = i % 2 === 0 ? this.fbos.vel_viscous0 : this.fbos.vel_viscous1;
          const output = i % 2 === 0 ? this.fbos.vel_viscous1 : this.fbos.vel_viscous0;
          
          material.uniforms.velocity_new.value = input.texture;
          this.renderToFBO(material, output);
        }
        
        const finalViscous = ITERATIONS % 2 === 0 ? this.fbos.vel_viscous0 : this.fbos.vel_viscous1;
        this.copyFBO(finalViscous, this.fbos.vel_0);
      }

      applyPressure() {
        const divMaterial = this.materials.divergence;
        divMaterial.uniforms.velocity.value = this.fbos.vel_0.texture;
        this.renderToFBO(divMaterial, this.fbos.div);
        
        this.clearFBO(this.fbos.pressure_0);
        this.clearFBO(this.fbos.pressure_1);
        
        const poissonMaterial = this.materials.poisson;
        poissonMaterial.uniforms.divergence.value = this.fbos.div.texture;
        
        for (let i = 0; i < ITERATIONS; i++) {
          const input = i % 2 === 0 ? this.fbos.pressure_0 : this.fbos.pressure_1;
          const output = i % 2 === 0 ? this.fbos.pressure_1 : this.fbos.pressure_0;
          
          poissonMaterial.uniforms.pressure.value = input.texture;
          this.renderToFBO(poissonMaterial, output);
        }
        
        const pressureMaterial = this.materials.pressure;
        const finalPressure = ITERATIONS % 2 === 0 ? this.fbos.pressure_0 : this.fbos.pressure_1;
        pressureMaterial.uniforms.pressure.value = finalPressure.texture;
        pressureMaterial.uniforms.velocity.value = this.fbos.vel_0.texture;
        
        this.renderToFBO(pressureMaterial, this.fbos.vel_1);
        this.swapVelocity();
      }

      renderToFBO(material, fbo) {
        const mesh = new THREE.Mesh(this.planeGeometry, material);
        const scene = new THREE.Scene();
        scene.add(mesh);
        
        this.renderer.setRenderTarget(fbo);
        this.renderer.render(scene, this.camera);
        this.renderer.setRenderTarget(null);
      }

      copyFBO(source, target) {
        const copyMaterial = new THREE.MeshBasicMaterial({ map: source.texture });
        this.renderToFBO(copyMaterial, target);
      }

      clearFBO(fbo) {
        this.renderer.setRenderTarget(fbo);
        this.renderer.clear();
        this.renderer.setRenderTarget(null);
      }

      swapVelocity() {
        const temp = this.fbos.vel_0;
        this.fbos.vel_0 = this.fbos.vel_1;
        this.fbos.vel_1 = temp;
      }

      render() {
        const material = this.materials.color;
        material.uniforms.velocity.value = this.fbos.vel_0.texture;
        
        const mesh = new THREE.Mesh(this.planeGeometry, material);
        this.scene.add(mesh);
        
        this.renderer.render(this.scene, this.camera);
        
        this.scene.remove(mesh);
      }

      animate() {
        if (!this.isAnimating) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.step();
        this.render();
        
        this.mouseForce.multiplyScalar(FORCE_DECAY);
      }

      dispose() {
        this.isAnimating = false;
        
        // Remove event listeners
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('resize', this.onResize);
        
        // Dispose Three.js resources
        for (let key in this.fbos) {
          this.fbos[key].dispose();
        }
        
        for (let key in this.materials) {
          this.materials[key].dispose();
        }
        
        this.planeGeometry.dispose();
        this.renderer.dispose();
      }
    }

    simulationRef.current = new FluidSimulationEngine(canvasRef.current);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{
        display: 'block',
        cursor: 'crosshair',
        ...style
      }}
    />
  );
};

export default FluidSimulation;
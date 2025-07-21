// app/components/LandingPage/components/WorldMapAnimation.tsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

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
  
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    particles?: THREE.Points;
    centerVector?: THREE.Vector3;
    previousTime?: number;
  }>({});

  // Load world map image and get pixel data
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
      img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/transparentMap.png';
    });
  };

  // Create fallback map data
  const createFallbackMapImageData = () => {
    const canvas = document.createElement('canvas');
    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,255)';
    
    // Simplified continent outlines
    const continents = [
      [[60, 40], [90, 45], [120, 35], [110, 60], [80, 70], [50, 50]],
      [[70, 100], [85, 120], [100, 160], [75, 170], [65, 140]],
      [[180, 50], [200, 45], [220, 55], [210, 70], [190, 65]],
      [[190, 80], [210, 85], [220, 120], [200, 150], [180, 140], [175, 100]],
      [[230, 40], [280, 35], [320, 50], [340, 70], [310, 80], [250, 75]],
      [[300, 140], [340, 135], [350, 150], [320, 155], [290, 150], [300, 140]]
    ];
    
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

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Initialize scene
    const scene = new THREE.Scene();

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    camera.position.set(-50, 0, 290);

    const centerVector = new THREE.Vector3(0, 0, 0);
    camera.lookAt(centerVector);

    // Save references
    sceneRef.current = {
      renderer,
      scene,
      camera,
      centerVector,
      previousTime: 0
    };

    // Create map particles
    await createMapParticles(scene);
  };

  const createMapParticles = async (scene: THREE.Scene) => {
    const imageData = await loadMapImage();
    if (!imageData) return;

    const geometry = new THREE.BufferGeometry();

    // Custom ShaderMaterial for particles with edge fade
    const material = new THREE.ShaderMaterial({
      uniforms: {
        size: { value: 3 },
        color: { value: new THREE.Color(0x313742) },
        opacity: { value: 0.8 },
        fadeStart: { value: 150 }, // Start fading at this distance from center
        fadeEnd: { value: 220 } // Fully faded at this distance
      },
      vertexShader: `
        uniform float size;
        varying float vAlpha;
        uniform float opacity;
        uniform float fadeStart;
        uniform float fadeEnd;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          gl_PointSize = size; // Fixed size, no attenuation
          
          gl_Position = projectionMatrix * mvPosition;
          
          float dist = length(position.xy); // Distance from center (z=0)
          vAlpha = opacity * (1.0 - smoothstep(fadeStart, fadeEnd, dist));
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5, 0.5);
          if (length(coord) > 0.5) discard;
          gl_FragColor = vec4(color, vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false // To avoid z-buffer issues with transparent
    });

    const vertices = [];
    const destinations = [];
    const speeds = [];

    // Map dimensions for reference
    const mapRadiusApprox = Math.sqrt(Math.pow(imageData.width / 2, 2) + Math.pow(imageData.height / 2, 2)); // ~223 for 400x200

    for (let y = 0; y < imageData.height; y += 4) {
      for (let x = 0; x < imageData.width; x += 4) {
        const index = (x + y * imageData.width) * 4;
        if (imageData.data[index + 3] > 128) { // alpha > half
          // Target position on map
          const destX = x - imageData.width / 2;
          const destY = -y + imageData.height / 2;
          const destZ = 0;

          // Starting position: small cluster near center, to spread out smoothly
          const startScale = Math.random() * 0.15 + 0.05; // Between 0.05 and 0.2 for clean expansion
          const startX = destX * startScale;
          const startY = destY * startScale;
          const startZ = Math.random() * 5 - 2.5; // Small z offset for slight depth

          vertices.push(startX, startY, startZ);
          
          destinations.push(destX, destY, destZ);
          
          // Slightly higher speed for smoother initial movement
          speeds.push(Math.random() / 150 + 0.02); // Adjusted from /200 +0.015 for a bit faster and smoother
        }
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('destination', new THREE.BufferAttribute(new Float32Array(destinations), 3));
    geometry.setAttribute('speed', new THREE.BufferAttribute(new Float32Array(speeds), 1));

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    sceneRef.current.particles = particles;
    
    // Start animation
    animate();
  };

  const animate = (currentTime: number = 0) => {
    const { renderer, scene, camera, particles, centerVector } = sceneRef.current;
    if (!renderer || !scene || !camera || !particles || !centerVector) return;

    // Update particle positions
    const positionAttribute = particles.geometry.attributes.position as THREE.BufferAttribute;
    const destinationAttribute = particles.geometry.attributes.destination as THREE.BufferAttribute;
    const speedAttribute = particles.geometry.attributes.speed as THREE.BufferAttribute;
    
    const positions = positionAttribute.array as Float32Array;
    const destinations = destinationAttribute.array as Float32Array;
    const speeds = speedAttribute.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const speedIndex = i / 3;
      const speed = speeds[speedIndex];
      
      positions[i] += (destinations[i] - positions[i]) * speed; // x
      positions[i + 1] += (destinations[i + 1] - positions[i + 1]) * speed; // y
      positions[i + 2] += (destinations[i + 2] - positions[i + 2]) * speed; // z
    }

    // Periodic particle swap for ongoing movement
    if (currentTime - (sceneRef.current.previousTime || 0) > 100) {
      const vertexCount = positions.length / 3;
      if (vertexCount > 1) {
        const index1 = Math.floor(Math.random() * vertexCount);
        const index2 = Math.floor(Math.random() * vertexCount);
        
        if (index1 !== index2) {
          const pos1 = index1 * 3;
          const pos2 = index2 * 3;
          
          const tempX = destinations[pos1];
          const tempY = destinations[pos1 + 1];
          const tempZ = destinations[pos1 + 2];
          
          destinations[pos1] = destinations[pos2];
          destinations[pos1 + 1] = destinations[pos2 + 1];
          destinations[pos1 + 2] = destinations[pos2 + 2];
          
          destinations[pos2] = tempX;
          destinations[pos2 + 1] = tempY;
          destinations[pos2 + 2] = tempZ;
        }
      }
      
      sceneRef.current.previousTime = currentTime;
    }
    
    positionAttribute.needsUpdate = true;
    
    // Camera movement
    camera.position.x = Math.sin(currentTime / 5000) * 100;
    camera.lookAt(centerVector);
    
    renderer.render(scene, camera);
    
    if (inView) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Handle window resize
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
      
      // Cleanup Three.js resources
      const { renderer, scene, particles } = sceneRef.current;
      if (particles && scene) {
        scene.remove(particles);
        particles.geometry.dispose();
        (particles.material as THREE.Material).dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
      
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
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        opacity: inView ? 0.6 : 0,
        transition: 'opacity 2s ease-in-out',
        backgroundColor: 'transparent',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default WorldMapAnimation;
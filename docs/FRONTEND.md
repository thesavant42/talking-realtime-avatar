# Frontend Documentation

## Overview

The frontend is built with React and uses **Three.js** via **React Three Fiber** for 3D avatar rendering. The avatar is loaded from GLB files, animated with morph targets and skeletal animations, and synchronized with audio for lip-sync.

## Three.js Architecture

### Libraries Used

- **three** (v0.160.0): Core Three.js library for 3D graphics
- **@react-three/fiber** (v8.15.13): React renderer for Three.js
- **@react-three/drei** (v9.93.0): Useful helpers and abstractions for React Three Fiber
- **leva**: Debug UI controls for tweaking values in real-time

### Component Structure

```
App.jsx
  └── Canvas (React Three Fiber)
      └── Scenario.jsx
          ├── CameraControls
          ├── Environment
          └── Avatar.jsx (Main avatar component)
```

### Canvas Setup

The main Canvas is configured in `apps/frontend/src/App.jsx`:

```jsx
<Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
  <Scenario />
</Canvas>
```

### Avatar Component

The `Avatar` component (`apps/frontend/src/components/Avatar.jsx`) handles:

1. **Model Loading**: Uses `useGLTF` from `@react-three/drei` to load GLB files
2. **Animations**: Uses `useAnimations` to manage skeletal animations
3. **Morph Targets**: Controls facial expressions and lip-sync via morph targets
4. **Audio Playback**: Synchronizes audio with lip-sync data
5. **Frame Updates**: Uses `useFrame` hook for per-frame updates (morph targets, lip-sync)

## Materials and Shaders

### Current Material Setup

The avatar model is loaded from `/models/avatar.glb` and uses the materials defined in the GLB file. The materials are accessed via:

```jsx
const { nodes, materials, scene } = useGLTF("/models/avatar.glb");
```

The scene is rendered directly:

```jsx
<group {...props} dispose={null} ref={group} position={[0, -0.5, 0]}>
  <primitive object={scene} />
</group>
```

### Adding a Hologram Shader Effect

Yes, you can add a shader to make the avatar look like a hologram! Here are several approaches:

#### Approach 1: Custom Shader Material (Recommended)

Create a custom shader material that applies a hologram effect to the avatar. You can modify materials in the `Avatar` component:

```jsx
import { useMemo } from 'react';
import * as THREE from 'three';

// Hologram shader
const hologramShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0x00ffff) }, // Cyan hologram color
    opacity: { value: 0.8 },
  },
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vPosition = position;
      vNormal = normal;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      // Scan lines effect
      float scanLine = sin(vUv.y * 800.0 + time * 10.0) * 0.5 + 0.5;
      scanLine = pow(scanLine, 10.0);
      
      // Fresnel effect (edges glow)
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
      
      // Flicker effect
      float flicker = sin(time * 20.0) * 0.1 + 0.9;
      
      // Combine effects
      vec3 finalColor = color * (scanLine * 0.3 + fresnel * 0.7) * flicker;
      
      gl_FragColor = vec4(finalColor, opacity * (0.7 + fresnel * 0.3));
    }
  `,
};

// In Avatar component
useEffect(() => {
  // Apply hologram shader to all materials
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const originalMaterial = child.material;
      
      // Create shader material
      const hologramMaterial = new THREE.ShaderMaterial({
        ...hologramShader,
        transparent: true,
        side: THREE.DoubleSide,
      });
      
      // Replace material
      child.material = hologramMaterial;
      
      // Store original for toggling
      child.userData.originalMaterial = originalMaterial;
    }
  });
}, [scene]);
```

#### Approach 2: Using `useFrame` to Update Shader Uniforms

Update the shader uniforms each frame for animated effects:

```jsx
import { useFrame } from '@react-three/fiber';

useFrame((state) => {
  const time = state.clock.getElapsedTime();
  
  scene.traverse((child) => {
    if (child.isMesh && child.material && child.material.uniforms) {
      if (child.material.uniforms.time) {
        child.material.uniforms.time.value = time;
      }
    }
  });
});
```

#### Approach 3: Post-Processing Effects

For more advanced effects, use post-processing with `@react-three/postprocessing`:

```bash
yarn add @react-three/postprocessing
```

Then add effects to the Canvas:

```jsx
import { EffectComposer, ScanlineEffect } from '@react-three/postprocessing';

<Canvas>
  <Scenario />
  <EffectComposer>
    <ScanlineEffect density={4} />
  </EffectComposer>
</Canvas>
```

#### Approach 4: Material Override with Drei's `useGLTF`

You can override materials when loading the GLB:

```jsx
import { useGLTF } from '@react-three/drei';

const { nodes, materials, scene } = useGLTF("/models/avatar.glb", (loader) => {
  // Modify materials after loading
  loader.parser.json.materials.forEach((mat) => {
    // Apply custom shader properties
  });
});
```

### Hologram Shader Features

A good hologram shader typically includes:

1. **Scan Lines**: Horizontal lines that move vertically (like old CRT displays)
2. **Fresnel Effect**: Edges glow brighter than the center
3. **Flicker**: Subtle brightness variation
4. **Transparency**: Semi-transparent appearance
5. **Color Tint**: Usually cyan/blue tint
6. **Distortion**: Optional wave distortion effect

### Example: Complete Hologram Implementation

Here's a complete example you can add to `Avatar.jsx`:

```jsx
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Add this inside the Avatar component
const hologramMaterialRef = useRef();

useEffect(() => {
  const hologramShader = {
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x00ffff) },
      opacity: { value: 0.85 },
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform float opacity;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      void main() {
        // Scan lines
        float scanLine = sin(vUv.y * 800.0 + time * 10.0) * 0.5 + 0.5;
        scanLine = pow(scanLine, 20.0);
        
        // Fresnel
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
        
        // Flicker
        float flicker = sin(time * 30.0) * 0.02 + 0.98;
        
        // Combine
        vec3 finalColor = color * (scanLine * 0.2 + fresnel * 0.8) * flicker;
        float finalOpacity = opacity * (0.6 + fresnel * 0.4);
        
        gl_FragColor = vec4(finalColor, finalOpacity);
      }
    `,
  };

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const originalMaterial = child.material;
      const shaderMaterial = new THREE.ShaderMaterial({
        ...hologramShader,
        transparent: true,
        side: THREE.DoubleSide,
      });
      
      child.material = shaderMaterial;
      child.userData.originalMaterial = originalMaterial;
      hologramMaterialRef.current = shaderMaterial;
    }
  });
}, [scene]);

// Update shader time uniform
useFrame((state) => {
  if (hologramMaterialRef.current && hologramMaterialRef.current.uniforms) {
    hologramMaterialRef.current.uniforms.time.value = state.clock.getElapsedTime();
  }
});
```

### Toggling Hologram Effect

You can add a control to toggle the hologram effect:

```jsx
import { useControls } from 'leva';

const { hologramEnabled } = useControls('Hologram', {
  hologramEnabled: { value: false, label: 'Enable Hologram' },
});

useEffect(() => {
  scene.traverse((child) => {
    if (child.isMesh && child.userData.originalMaterial) {
      child.material = hologramEnabled 
        ? hologramMaterialRef.current 
        : child.userData.originalMaterial;
    }
  });
}, [hologramEnabled, scene]);
```

## Morph Targets and Animations

### Morph Targets

The avatar uses morph targets for:
- **Facial Expressions**: Controlled via `facialExpressions` constant
- **Lip-Sync**: Controlled via `visemesMapping` and lip-sync data from Rhubarb

Morph targets are updated in the `useFrame` hook using `lerpMorphTarget()` function.

### Skeletal Animations

Skeletal animations are loaded from `/models/animations.glb` and managed via `useAnimations` hook. Available animations include:
- Idle
- TalkingOne, TalkingTwo, TalkingThree
- SadIdle
- Defeated
- Angry
- Surprised
- DismissingGesture
- ThoughtfulHeadShake

## Performance Considerations

- **Material Instancing**: If applying shaders to multiple meshes, consider using material instances
- **Shader Complexity**: Complex shaders can impact performance; test on target devices
- **Post-Processing**: Post-processing effects add render passes; use sparingly
- **Morph Targets**: Many active morph targets can impact performance

## References

### Core Documentation
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [GLTF Transform](https://gltf-transform.donmccurdy.com/) - For modifying GLB files

### Shader Resources
- [Three.js Shader Examples](https://threejs.org/examples/?q=shader) - Official Three.js shader demos
- [Shadertoy](https://www.shadertoy.com/) - Community shader gallery (can be adapted for Three.js)
- [The Book of Shaders](https://thebookofshaders.com/) - Interactive shader tutorials and examples
- [Three.js ShaderMaterial Examples](https://threejs.org/examples/webgl_materials_shaders_fresnel.html) - Fresnel shader example
- [Three.js Basic Shader Example](https://threejs.org/examples/webgl_shader.html) - Simple shader example
- [Three.js Advanced Shader Example](https://threejs.org/examples/webgl_shader2.html) - More complex shader example
- [React Three Fiber Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples) - R3F examples including shaders
- [Three.js Shader Library](https://github.com/mrdoob/three.js/tree/dev/examples/jsm/shaders) - Source code for Three.js shader examples


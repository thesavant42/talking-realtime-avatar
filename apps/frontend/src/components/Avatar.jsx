import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { useSpeech } from "../hooks/useSpeech";
import facialExpressions from "../constants/facialExpressions";
import visemesMapping from "../constants/visemesMapping";
import morphTargets from "../constants/morphTargets";

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF("/models/avatar.glb");
  const { animations } = useGLTF("/models/animations.glb");
  const { message, onMessagePlayed } = useSpeech();
  
  // Debug: Log available nodes and materials
  useEffect(() => {
    console.log("Available nodes:", Object.keys(nodes));
    console.log("Available materials:", Object.keys(materials));
  }, [nodes, materials]);
  const [lipsync, setLipsync] = useState();
  const [setupMode, setSetupMode] = useState(false);

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    
    // Only create and play audio if it exists
    if (message.audio) {
      try {
        const audio = new Audio("data:audio/wav;base64," + message.audio);
        audio.onended = onMessagePlayed;
        audio.onerror = (e) => {
          console.error("Error playing audio:", e);
          // Still call onMessagePlayed to continue to next message
          onMessagePlayed();
        };
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          onMessagePlayed();
        });
        setAudio(audio);
      } catch (error) {
        console.error("Error creating audio:", error);
        onMessagePlayed();
      }
    } else {
      console.warn("Message received without audio:", message);
      // If no audio, still mark message as played after a short delay
      setTimeout(() => {
        onMessagePlayed();
      }, 1000);
    }
  }, [message]);


  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name);
  useEffect(() => {
    if (actions[animation]) {
      actions[animation]
        .reset()
        .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
        .play();
      return () => {
        if (actions[animation]) {
          actions[animation].fadeOut(0.5);
        }
      };
    }
  }, [animation]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], value, speed);
      }
    });
  };

  const [blink, setBlink] = useState(false);
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState();

  useFrame(() => {
    !setupMode &&
      morphTargets.forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return; // eyes wink/blink are handled separately
        }
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });

    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);

    if (setupMode) {
      return;
    }

    const appliedMorphTargets = [];
    if (message && lipsync) {
      const currentAudioTime = audio.currentTime;
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          appliedMorphTargets.push(visemesMapping[mouthCue.value]);
          lerpMorphTarget(visemesMapping[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }

    Object.values(visemesMapping).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
  });

  const hologramControls = useControls("Hologram", {
    enabled: { value: false, label: "Enable Hologram" },
    color: { value: "#00ffff", label: "Color" },
    opacity: { value: 0.85, min: 0, max: 1, step: 0.01, label: "Opacity" },
    scanLineIntensity: { value: 0.2, min: 0, max: 1, step: 0.1, label: "Scan Line Intensity" },
    fresnelIntensity: { value: 0.8, min: 0, max: 1, step: 0.1, label: "Fresnel Intensity" },
    flickerAmount: { value: 0.02, min: 0, max: 0.1, step: 0.01, label: "Flicker Amount" },
  });

  useControls("FacialExpressions", {
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    setupMode: button(() => {
      setSetupMode(!setupMode);
    }),
    logMorphTargetValues: button(() => {
      const emotionValues = {};
      Object.values(nodes).forEach((node) => {
        if (node.morphTargetInfluences && node.morphTargetDictionary) {
          morphTargets.forEach((key) => {
            if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
              return;
            }
            const value = node.morphTargetInfluences[node.morphTargetDictionary[key]];
            if (value > 0.01) {
              emotionValues[key] = value;
            }
          });
        }
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  // MorphTarget controls hidden - only available in setup mode via console if needed
  // useControls("MorphTarget", () => ...)

  // Store hologram materials for uniform updates
  const hologramMaterialsRef = useRef(new Map());

  // Hologram shader setup - replace materials with ShaderMaterial (working approach)
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (hologramControls.enabled) {
          // Store original material if not already stored
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }
          
          // Create or reuse hologram material for this mesh
          if (!hologramMaterialsRef.current.has(child)) {
            const hologramShader = {
              uniforms: {
                uHologramTime: { value: 0 },
                uHologramColor: { value: new THREE.Color(hologramControls.color) },
                uHologramOpacity: { value: hologramControls.opacity },
                uHologramScanLineIntensity: { value: hologramControls.scanLineIntensity },
                uHologramFresnelIntensity: { value: hologramControls.fresnelIntensity },
                uHologramFlickerAmount: { value: hologramControls.flickerAmount },
              },
              vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                varying vec2 vUv;
                
                void main() {
                  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                  vNormal = normalize(normalMatrix * normal);
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `,
              fragmentShader: `
                uniform float uHologramTime;
                uniform vec3 uHologramColor;
                uniform float uHologramOpacity;
                uniform float uHologramScanLineIntensity;
                uniform float uHologramFresnelIntensity;
                uniform float uHologramFlickerAmount;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                varying vec2 vUv;
                
                // Simple noise function for randomness
                float hologramRandom(float x) {
                  return fract(sin(x * 12.9898) * 43758.5453);
                }
                
                float hologramNoise(float x) {
                  float i = floor(x);
                  float f = fract(x);
                  return mix(hologramRandom(i), hologramRandom(i + 1.0), smoothstep(0.0, 1.0, f));
                }
                
                void main() {
                  // Add stutter/randomness to time
                  float stutterTime = uHologramTime + hologramNoise(uHologramTime * 0.5) * 0.3;
                  float stutterTime2 = uHologramTime + hologramNoise(uHologramTime * 0.3 + 100.0) * 0.5;
                  
                  // Scan lines with stutter and randomness
                  float scanSpeed = 10.0 + hologramNoise(uHologramTime * 0.2) * 5.0;
                  float scanOffset = hologramNoise(vUv.y * 50.0 + stutterTime * 0.1) * 0.1;
                  float scanLine = sin(vUv.y * 800.0 + stutterTime * scanSpeed + scanOffset) * 0.5 + 0.5;
                  scanLine = pow(scanLine, 20.0);
                  
                  // Add random dropouts to scanlines
                  float scanDropout = step(0.95, hologramNoise(stutterTime * 2.0 + vUv.y * 10.0));
                  scanLine *= (1.0 - scanDropout * 0.3);
                  
                  // Fresnel
                  vec3 viewDir = normalize(cameraPosition - vPosition);
                  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
                  
                  // Flicker with stutter and randomness
                  float flickerBase = sin(stutterTime2 * 30.0) * uHologramFlickerAmount + (1.0 - uHologramFlickerAmount);
                  float flickerStutter = hologramNoise(stutterTime2 * 5.0) * uHologramFlickerAmount * 0.5;
                  float flicker = flickerBase + flickerStutter;
                  
                  // Random glitches
                  float glitch = step(0.98, hologramNoise(stutterTime * 0.5));
                  flicker *= (1.0 - glitch * 0.2);
                  
                  // Combine hologram effect
                  float scanFresnelMix = scanLine * uHologramScanLineIntensity + fresnel * uHologramFresnelIntensity;
                  vec3 hologramColor = uHologramColor * scanFresnelMix * flicker;
                  float hologramAlpha = uHologramOpacity * (0.6 + fresnel * 0.4);
                  
                  gl_FragColor = vec4(hologramColor, hologramAlpha);
                }
              `,
            };
            
            const hologramMaterial = new THREE.ShaderMaterial({
              ...hologramShader,
              transparent: true,
              side: THREE.DoubleSide,
            });
            
            hologramMaterialsRef.current.set(child, hologramMaterial);
          }
          
          // Apply hologram material
          child.material = hologramMaterialsRef.current.get(child);
        } else {
          // Restore original material
          if (child.userData.originalMaterial) {
            child.material = child.userData.originalMaterial;
          }
        }
      }
    });
  }, [scene, hologramControls.enabled, hologramControls.color, hologramControls.opacity, hologramControls.scanLineIntensity, hologramControls.fresnelIntensity, hologramControls.flickerAmount]);

  // Update shader uniforms
  useFrame((state) => {
    if (hologramControls.enabled) {
      const time = state.clock.getElapsedTime();
      hologramMaterialsRef.current.forEach((material) => {
        if (material && material.uniforms) {
          material.uniforms.uHologramTime.value = time;
          material.uniforms.uHologramColor.value.set(hologramControls.color);
          material.uniforms.uHologramOpacity.value = hologramControls.opacity;
          material.uniforms.uHologramScanLineIntensity.value = hologramControls.scanLineIntensity;
          material.uniforms.uHologramFresnelIntensity.value = hologramControls.fresnelIntensity;
          material.uniforms.uHologramFlickerAmount.value = hologramControls.flickerAmount;
        }
      });
    }
  });

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} dispose={null} ref={group} position={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { useSpeech } from "../hooks/useSpeech";
import facialExpressions from "../constants/facialExpressions";
import visemesMapping from "../constants/visemesMapping";
import morphTargets from "../constants/morphTargets";
import HolographicMaterial from "./HolographicMaterialVanilla";

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
    enabled: { value: true, label: "Enable Hologram" },
    hologramColor: { value: "#00d5ff", label: "Color" },
    hologramOpacity: { value: 1.0, min: 0, max: 1, step: 0.01, label: "Opacity" },
    fresnelAmount: { value: 0.45, min: 0, max: 1, step: 0.01, label: "Fresnel Amount" },
    fresnelOpacity: { value: 1.0, min: 0, max: 1, step: 0.01, label: "Fresnel Opacity" },
    scanlineSize: { value: 8.0, min: 1, max: 15, step: 0.1, label: "Scanline Size" },
    hologramBrightness: { value: 1.0, min: 0, max: 2, step: 0.1, label: "Brightness" },
    signalSpeed: { value: 1.0, min: 0, max: 2, step: 0.1, label: "Signal Speed" },
    enableBlinking: { value: true, label: "Enable Blinking" },
    blinkFresnelOnly: { value: true, label: "Blink Fresnel Only" },
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

  // Store hologram materials for updating
  const hologramMaterialsRef = useRef(new Map());

  // Hologram shader setup - use HolographicMaterial
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
            const hologramMaterial = new HolographicMaterial({
              hologramColor: hologramControls.hologramColor,
              hologramOpacity: hologramControls.hologramOpacity,
              fresnelAmount: hologramControls.fresnelAmount,
              fresnelOpacity: hologramControls.fresnelOpacity,
              scanlineSize: hologramControls.scanlineSize,
              hologramBrightness: hologramControls.hologramBrightness,
              signalSpeed: hologramControls.signalSpeed,
              enableBlinking: hologramControls.enableBlinking,
              blinkFresnelOnly: hologramControls.blinkFresnelOnly,
            });

            hologramMaterialsRef.current.set(child, hologramMaterial);
          } else {
            // Update existing material uniforms
            const existingMaterial = hologramMaterialsRef.current.get(child);
            existingMaterial.uniforms.hologramColor.value.set(hologramControls.hologramColor);
            existingMaterial.uniforms.hologramOpacity.value = hologramControls.hologramOpacity;
            existingMaterial.uniforms.fresnelAmount.value = hologramControls.fresnelAmount;
            existingMaterial.uniforms.fresnelOpacity.value = hologramControls.fresnelOpacity;
            existingMaterial.uniforms.scanlineSize.value = hologramControls.scanlineSize;
            existingMaterial.uniforms.hologramBrightness.value = hologramControls.hologramBrightness;
            existingMaterial.uniforms.signalSpeed.value = hologramControls.signalSpeed;
            existingMaterial.uniforms.enableBlinking.value = hologramControls.enableBlinking;
            existingMaterial.uniforms.blinkFresnelOnly.value = hologramControls.blinkFresnelOnly;
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
  }, [scene, hologramControls.enabled, hologramControls.hologramColor, hologramControls.hologramOpacity, hologramControls.fresnelAmount, hologramControls.fresnelOpacity, hologramControls.scanlineSize, hologramControls.hologramBrightness, hologramControls.signalSpeed, hologramControls.enableBlinking, hologramControls.blinkFresnelOnly]);  // Update shader uniforms
  useFrame((state) => {
    if (hologramControls.enabled) {
      hologramMaterialsRef.current.forEach((material) => {
        if (material && material.update) {
          material.update();
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

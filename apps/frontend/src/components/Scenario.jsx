import { CameraControls, Environment, Backdrop } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useControls } from "leva";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar } from "./Avatar";

export const Scenario = () => {
  const cameraControls = useRef();
  const { scene: threeScene } = useThree();
  const { darkBackground, backgroundColor } = useControls("Background", {
    darkBackground: { value: false, label: "Dark Background (for Hologram)" },
    backgroundColor: { value: "#000000", label: "Background Color" },
  });

  useEffect(() => {
    cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
  }, []);

  // Set scene background and ensure lighting is maintained
  useEffect(() => {
    if (darkBackground) {
      threeScene.background = new THREE.Color(backgroundColor);
    } else {
      threeScene.background = null;
    }
    
    // Debug: Log scene state
    console.log('=== SCENE DEBUG ===');
    console.log('Background:', threeScene.background);
    console.log('Children count:', threeScene.children.length);
    
    // Check for lights in the scene
    const lights = [];
    threeScene.traverse((child) => {
      if (child.isLight) {
        lights.push({
          type: child.type,
          name: child.name,
          visible: child.visible,
          intensity: child.intensity,
          color: child.color?.getHexString(),
        });
      }
    });
    console.log('Lights in scene:', lights);
    
    // Traverse and log all meshes
    const meshes = [];
    threeScene.traverse((child) => {
      if (child.isMesh) {
        meshes.push({
          name: child.name,
          type: child.type,
          material: {
            type: child.material?.type,
            color: child.material?.color?.getHexString(),
            transparent: child.material?.transparent,
            opacity: child.material?.opacity,
            visible: child.material?.visible,
          },
          position: child.position,
          visible: child.visible,
          renderOrder: child.renderOrder,
        });
      }
    });
    console.log('All meshes:', meshes);
    console.log('=== END SCENE DEBUG ===');
  }, [darkBackground, backgroundColor, threeScene]);

  return (
    <>
      <CameraControls ref={cameraControls} />
      {/* Always include Environment for lighting, but hide it visually when darkBackground is enabled */}
      <Environment preset="sunset" />
      {darkBackground && (
        <Backdrop floor={0.25} segments={20} position={[0, 0, -10]} scale={[10, 10, 1]} renderOrder={-1}>
          <meshBasicMaterial color={backgroundColor} depthWrite={false} />
        </Backdrop>
      )}
      <Avatar />
    </>
  );
};

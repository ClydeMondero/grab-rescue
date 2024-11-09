import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ambulanceModel from "/assets/ambulance/scene.gltf";
import { useLoader, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

const Model = ({ view }) => {
  const gltf = useLoader(GLTFLoader, ambulanceModel);
  const model = gltf.scene;

  // Set color only once after the model is loaded
  useEffect(() => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.color.setHex(0x99ff99);
      }
    });
  }, [model]);

  // Animation logic
  useFrame(() => {
    if (view === "left-right") {
      model.position.x += 0.01; // Reduced the increment to avoid large jumps

      if (model.position.x > 100) {
        model.position.x = -100;
      }
    } else if (view === "top-down") {
      model.position.set(0, 0, 0);
    }
  });

  // Set rotation and scale based on view
  useEffect(() => {
    if (view === "top-down") {
      model.rotation.set(Math.PI / 2, Math.PI, 0);
      model.scale.set(0.6, 0.6, 0.6);
    } else if (view === "left-right") {
      model.rotation.set(0, Math.PI / 2, 0);
      model.scale.set(1, 1, 1);
    } else if (view === "3d") {
      model.rotation.set(Math.PI / 4.8, Math.PI * 1, 0);
      model.scale.set(0.6, 0.6, 0.6);
    }
  }, [view, model]);

  return <primitive object={model} />;
};

const RescuerMarker = ({ view }) => {
  return (
    <Canvas
      style={{
        width: "75px",
        height: "75px",
        background: "transparent",
      }}
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 100]} // Fixed camera position
        fov={view !== "3d" ? 100 : 60} // Field of view
      />

      {/* Adding lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 10]} intensity={1} />

      {/* Displaying the model with rotation */}
      <Model view={view} />
    </Canvas>
  );
};

export default RescuerMarker;

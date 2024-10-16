import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ambulanceModel from "../assets/ambulance/scene.gltf";
import { useLoader, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

const Model = ({ view }) => {
  const gltf = useLoader(GLTFLoader, ambulanceModel);
  const model = gltf.scene;

  useFrame(() => {
    model.position.x += 0.1;

    if (model.position.x > 100) {
      model.position.x = -100;
    }
  });

  view === "top-down"
    ? model.rotation.set(Math.PI / 2, Math.PI, 0)
    : model.rotation.set(0, Math.PI / 2, 0);

  view === "top-down"
    ? model.scale.set(0.5, 0.5, 0.5)
    : model.scale.set(1, 1, 1);

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.color.setHex(0x99ff99);
    }
  });

  // view == "top-down"
  //   ? model.rotation.set(Math.PI / 2, Math.PI, 0)
  //   : model.rotation.set(0, Math.PI / 2, 0);

  // view == "top-down"
  //   ? model.scale.set(0.5, 0.5, 0.5)
  //   : model.scale.set(1, 1, 1);

  // model.traverse((child) => {
  //   if (child.isMesh) {
  //     child.material.color.setHex(0x99ff99);
  //   }
  // });

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
        fov={100} // Field of view
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

import { Box, OrbitControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useState } from "react";

export const Experience = () => {
  const [hover, setHover] = useState(false);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />

      <OrbitControls />

      {/* CUBE ON THE LEFT SIDE */}
      <RigidBody position={[-2.5, 1, 0]}>
        <Box
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box>
      </RigidBody>

      <RigidBody type="fixed" restitution={2}>
        <Box position={[0, 0, 0]} args={[10, 1, 10]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
};

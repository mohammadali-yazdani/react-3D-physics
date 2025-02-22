import { Box, OrbitControls, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Controls } from "../constants/controls";

export const Experience = () => {
  const cubeRef = useRef();
  const kickerRef = useRef();

  const [hover, setHover] = useState(false);
  const [start, setStart] = useState(false);

  const jump = () => {
    if (isOnFloor.current) {
      cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 });
      isOnFloor.current = false;
    }
  };

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );

  const handleMovement = () => {
    if (!isOnFloor.current) {
      return;
    }

    if (leftPressed) {
      cubeRef.current.applyImpulse({ x: -0.1, y: 0, z: 0 });
    }
    if (rightPressed) {
      cubeRef.current.applyImpulse({ x: 0.1, y: 0, z: 0 });
    }
    if (backPressed) {
      cubeRef.current.applyImpulse({ x: 0, y: 0, z: 0.1 });
    }
    if (forwardPressed) {
      cubeRef.current.applyImpulse({ x: 0, y: 0, z: -0.1 });
    }
  };

  const speed = useRef(5);

  useFrame((_state, delta) => {
    if (jumpPressed) {
      jump();
    }
    handleMovement();

    if (!start) {
      return;
    }

    const curRotation = quat(kickerRef.current.rotation());
    const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * speed.current
    );

    curRotation.multiply(incrementRotation);
    kickerRef.current.setNextKinematicRotation(curRotation);

    speed.current += delta;
  });

  const isOnFloor = useRef(true);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />

      <OrbitControls />

      {/* CUBE ON THE LEFT SIDE */}
      <RigidBody
        position={[-2.5, 1, 0]}
        ref={cubeRef}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject.name === "floor") {
            isOnFloor.current = true;
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject.name === "floor") {
            isOnFloor.current = false;
          }
        }}
      >
        <Box
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          onClick={() => setStart(true)}
        >
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box>
      </RigidBody>

      {/* KICKER */}
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.75, 0]}
        ref={kickerRef}
      >
        <group position={[2.5, 0, 0]}>
          <Box args={[5, 0.5, 0.5]}>
            <meshStandardMaterial color="peachpuff" />
          </Box>
        </group>
      </RigidBody>

      <RigidBody type="fixed" name="floor">
        <Box position={[0, 0, 0]} args={[10, 1, 10]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
};

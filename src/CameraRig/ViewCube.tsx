import { Scene, Matrix4 } from "three";
import React, { useRef, useMemo, useState, FC } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  createPortal,
  Camera,
  Events,
} from "@react-three/fiber";
import {
  OrbitControls,
  OrthographicCamera,
  useCamera,
} from "@react-three/drei";
import { Object3D } from "three";

/**
 * ViewCube to be used with to illustrate what default camera view you are using to 'look-at' the house.
 * PLane in the canvas elemement, and it will show a cube, which rotates to mirrow the current camera view direction
 *  -> probably needs to use react spring for animation ?
 *
 */

export const ViewCube: FC<{}> = () => {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCamRef = useRef<Camera>(null!);
  const viewCubeMeshRef = useRef<Object3D>(null!);
  const [hover, set] = useState<number | null>(null);
  const matrix = new Matrix4();

  useFrame(() => {
    matrix.copy(camera.matrix).invert();
    viewCubeMeshRef.current.quaternion.setFromRotationMatrix(matrix);
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCamRef.current);
  }, 1);

  return (
    <>
      {createPortal(
        <>
          <OrthographicCamera
            ref={virtualCamRef}
            makeDefault={false}
            position={[0, 0, 100]}
          />
          <mesh
            ref={viewCubeMeshRef}
            raycast={useCamera(virtualCamRef)}
            position={[size.width / 2 - 80, size.height / 2 - 80, 0]}
            onPointerOut={(e) => set(null)}
            onPointerMove={(e) => {
              const i = e.faceIndex || 0;
              set(Math.floor(i / 2));
            }}
          >
            {[...Array(6)].map((_, index) => (
              <meshLambertMaterial
                attachArray="material"
                key={index}
                color={hover === index ? "hotpink" : "white"}
              />
            ))}
            <boxGeometry args={[60, 60, 60]} />
          </mesh>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
        </>,
        virtualScene
      )}
    </>
  );
};

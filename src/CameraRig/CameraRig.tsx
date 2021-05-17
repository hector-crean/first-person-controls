import React, { useRef, useEffect, FC } from "react";
import R3f, {
  Camera,
  useThree,
  useFrame,
  CameraProps,
  useLoader,
} from "@react-three/fiber";
import { useCamera } from "@react-three/drei";
import {
  FirstPersonControls as FirstPersonControlsImpl,
  MapControls as MapControlsImpl,
  SVGLoader,
} from "three-stdlib";
import {
  Object3D,
  Vector3,
  Raycaster,
  Euler,
  MeshStandardMaterial,
  MathUtils,
  Matrix4,
  Shape,
  Color,
  Box3,
  Sphere,
} from "three";
import { Either } from "fp-ts/Either";

/**
 * @aim : It will be useful to be able to transition between three camera control modes :
 *  1. Orbit controls
 *  2. First person controls
 *  3. 'Map controls' -> probably useful for viewing floorplans
 */

/**
 * A@devNotes : the control components have been copied and pasted from drei in order that it's more
 * explicit how their internals work.
 *
 * default views can be achieved simply by: camera.lookat(position); and updating the position of the camera too.
 *
 */

/**
 *
 *  @userJourney :
 *  ==== Scene View -> House
 *  1. Double Click on a house and want to recentre the camera such that it is at the centre of view.
 *  2. Have various default 'views' of a house :
 *      Sketchup has :
 *          - top, bottom, front, back, left, right, perspective
 *
 * ====  House --> House interior
 *  Want to be able to navigate through relevant parts of a house. Would you like to be able to
 *  'walk' through the house ? i.e. first person controls. This probably requires there to be some
 *  building physics, such that you can't walk through a wall... Or potentially use a raycaster ?
 */

const PI = 3.14159265359;

/**
 * This is derived from the drei implementation of 'fly controls'
 *
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      firstPersonControlsImpl: FirstPersonControls;
      mapControlsImpl: MapControls;
    }
  }
}

export type FirstPersonControls = R3f.Object3DNode<
  FirstPersonControlsImpl,
  typeof FirstPersonControlsImpl
>;

export const FirstPersonControls = React.forwardRef<
  FirstPersonControlsImpl,
  FirstPersonControls
>((props, ref) => {
  const invalidate = useThree(({ invalidate }) => invalidate);
  const camera = useThree(({ camera }) => camera);
  const gl = useThree(({ gl }) => gl);
  const [controls] = React.useState(
    () => new FirstPersonControlsImpl(camera, gl.domElement)
  );

  React.useEffect(() => {
    controls?.addEventListener?.("change", invalidate);
    return () => controls?.removeEventListener?.("change", invalidate);
  }, [controls, invalidate]);

  useFrame((_, delta) => controls?.update(delta));

  return controls ? (
    <primitive ref={ref} dispose={undefined} object={controls} {...props} />
  ) : null;
});

export enum Rank {
  R0 = "R0",
  R1 = "R1",
  R2 = "R2",
  R3 = "R3",
  R4 = "R4",
  R5 = "R5",
  R6 = "R6",
  R7 = "R7",
  R8 = "R8",
}

export interface TensorShape<T> {
  R0: T[];
  R1: [T];
  R2: [T, T];
  R3: [T, T, T];
  R4: [T, T, T, T];
  R5: [T, T, T, T, T];
  R6: [T, T, T, T, T, T];
  R7: [T, T, T, T, T, T, T];
  R8: [T, T, T, T, T, T, T, T];
}

interface FirstPerson<R extends Rank> {
  body: Object3D;
  rayRirections: TensorShape<Direction>[R];
  caster: Raycaster;
  collisionTestFn: (
    collisionDistance: number,
    obstacles: Object3D[],
    rays: TensorShape<Direction>[R],
    caster: Raycaster
  ) => (
    body: Object3D
  ) => TensorShape<{
    direction: Direction;
    blocked: boolean;
  }>[R];
  rotateFn: (rotate: Rotation) => (body: Object3D) => Object3D;
  translateFn: (translation: Direction) => (body: Object3D) => Object3D;
}

/** left/right : up/down : forward/back */
type Direction =
  | { tag: "forward"; direction: [0, 0, 1] }
  | { tag: "up-forward"; direction: [1, 0, 1] }
  | { tag: "right"; direction: [1, 0, 0] }
  | { tag: "right-down"; direction: [1, 0, -1] }
  | { tag: "back"; direction: [0, 0, -1] }
  | { tag: "left-back"; direction: [-1, 0, -1] }
  | { tag: "left"; direction: [-1, 0, 0] }
  | { tag: "left-forward"; direction: [-1, 0, 1] };

const radianDict = {
  fullRotation: 6.28318530718,
  halfRotation: 3.14159265359,
  closwiseQuarterRotation: 1.57079632679,
  clockwiseEigthRotation: 0.78539816339,
  clockwiseSixteenthRotation: 0.39269908169,
  anticlockwiseQuarterRotation: -1.57079632679,
  anticlockwiseEigthRotation: -0.78539816339,
  anticlockwiseSixteenthRotation: -0.39269908169,
} as const;

type Rotation =
  | {
      tag: "yAxis-closwiseQuarterRotation";
      rotation: [0, typeof radianDict["closwiseQuarterRotation"], 0];
    }
  | {
      tag: "yAxis-anticlockwiseQuarterRotation";
      rotation: [0, typeof radianDict["anticlockwiseQuarterRotation"], 0];
    };

const rayDirectionsDefault: TensorShape<Direction>[Rank.R8] = [
  { tag: "forward", direction: [0, 0, 1] },
  { tag: "up-forward", direction: [1, 0, 1] },
  { tag: "right", direction: [1, 0, 0] },
  { tag: "right-down", direction: [1, 0, -1] },
  { tag: "back", direction: [0, 0, -1] },
  { tag: "left-back", direction: [-1, 0, -1] },
  { tag: "left", direction: [-1, 0, 0] },
  { tag: "left-forward", direction: [-1, 0, 1] },
];

const mkFirstPersonImpl = <R extends Rank>(
  body: Object3D,
  rayDirections: TensorShape<Direction>[R]
): FirstPerson<R> => {
  return {
    body: body,
    rayRirections: rayDirections,
    caster: new Raycaster(),
    collisionTestFn: (
      collisionDistance: number,
      obstacles: Object3D[],
      rays: TensorShape<Direction>[R],
      caster: Raycaster
    ) => (
      body: Object3D
    ): TensorShape<{ direction: Direction; blocked: boolean }>[R] => {
      const collisionDirections = rays.map((ray: Direction) => {
        // We reset the raycaster to this direction
        const [x, y, z] = ray.direction;
        caster.set(body.position, new Vector3(x, y, z));
        // Test if this intersects with an obstacle mesh
        const collisions = caster.intersectObjects(obstacles);
        // And disable that direction if we do
        if (
          collisions.length > 0 &&
          collisions[0].distance <= collisionDistance
        ) {
          switch (ray.tag) {
            case "back":
              return { direction: ray, blocked: true };
            case "forward":
              return { direction: ray, blocked: true };
            case "left":
              return { direction: ray, blocked: true };
            case "left-back":
              return { direction: ray, blocked: true };
            case "left-forward":
              return { direction: ray, blocked: true };
            case "right":
              return { direction: ray, blocked: true };
            case "right-down":
              return { direction: ray, blocked: true };
            case "up-forward":
              return { direction: ray, blocked: true };
          }
        } else {
          return { direction: ray, blocked: false };
        }
      });
      return collisionDirections as TensorShape<{
        direction: Direction;
        blocked: boolean;
      }>[R];
    },
    rotateFn: (rotate: Rotation) => (body: Object3D) => {
      const [ψ, θ, φ] = rotate.rotation;
      const R = new Euler(ψ, θ, φ);
      const matrix4Rotation = new Matrix4().makeRotationFromEuler(R);

      switch (rotate.tag) {
        case "yAxis-anticlockwiseQuarterRotation":
          body.applyMatrix4(matrix4Rotation);
          return body;
        case "yAxis-closwiseQuarterRotation":
          body.applyMatrix4(matrix4Rotation);
          return body;
      }
    },
    translateFn: (translation: Direction, constant = 1) => (body: Object3D) => {
      const [x, y, z] = translation.direction;
      const translationAxis = new Vector3(x, y, z);
      switch (translation.tag) {
        case "back":
          body.translateOnAxis(translationAxis, constant);
          return body;
        case "forward":
          body.translateOnAxis(translationAxis, constant);
          return body;
        case "left":
          body.translateOnAxis(translationAxis, constant);
          return body;
        case "left-back":
          body.translateOnAxis(translationAxis, constant);
          return body;
        case "left-forward":
          body.translateOnAxis(translationAxis, constant);
          return body;
        case "right":
          body.translateOnAxis(translationAxis, constant);
          return body;
        case "right-down":
          body.translateOnAxis(translationAxis, constant);
          return body;
        case "up-forward":
          body.translateOnAxis(translationAxis, constant);
          return body;
      }
    },
  };
};

const fp = mkFirstPersonImpl<Rank.R8>(new Object3D(), rayDirectionsDefault);

/** https://github.com/gcanti/fp-ts/issues/528 */
export class TranslationError extends Error {
  constructor() {
    super("translation error");
    this.name = this.constructor.name;
  }
}
declare const translateFn2: (
  translation: Direction,
  constant: number,
  collisionTestFn: any
) => (body: Object3D) => Either<TranslationError, Object3D>;

const Camera: FC<CameraProps> = (props) => {
  const cameraRef = useRef<Camera>(null!);
  const set = useThree((state) => state.set);
  // Make the camera known to the system
  useEffect(() => void set({ camera: cameraRef.current }), []);
  // Update it every frame
  useFrame(() => cameraRef.current.updateMatrixWorld());
  return <perspectiveCamera ref={cameraRef} />;
};

declare function useFirstPersonPositionState(): any;

const useFollowRef = () => {
  const { activePlayer, playersRefs } = useFirstPersonPositionState();
  if (activePlayer && playersRefs[activePlayer]) {
    return playersRefs[activePlayer];
  }
  return null;
};

const CameraController: React.FC = () => {
  const { camera } = useThree();
  const followRef = useFollowRef();
  // useEffect(() => {
  //   console.log('followingObjectRef', followingObjectRef, camera)
  // }, [followingObjectRef])
  useFrame(() => {
    if (followRef) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      camera.position.set(
        followRef.position.x - 3,
        followRef.position.y + 4,
        followRef.position.z + 3
      );
    }
  });
  return null;
};

export type MapControls = R3f.Overwrite<
  R3f.Object3DNode<MapControlsImpl, typeof MapControlsImpl>,
  { target?: R3f.Vector3; camera?: THREE.Camera }
>;

export const MapControls = React.forwardRef<MapControlsImpl, MapControls>(
  (props = { enableDamping: true }, ref) => {
    const { camera, ...rest } = props;
    const invalidate = useThree(({ invalidate }) => invalidate);
    const defaultCamera = useThree(({ camera }) => camera);
    const domElement = useThree(({ gl }) => gl.domElement);

    const explCamera = camera || defaultCamera;
    const controls = React.useMemo(() => new MapControlsImpl(explCamera), [
      explCamera,
    ]);

    React.useEffect(() => {
      controls.connect(domElement);
      controls.addEventListener("change", invalidate);

      return () => {
        controls.dispose();
        controls.removeEventListener("change", invalidate);
      };
    }, [controls, invalidate, domElement]);

    useFrame(() => controls.update());

    return (
      <primitive
        ref={ref}
        dispose={undefined}
        object={controls}
        enableDamping
        {...rest}
      />
    );
  }
);

/** @example of Maps controls */

const Cell = ({
  color,
  shape,
  fillOpacity,
}: {
  color: Color;
  shape: Shape;
  fillOpacity: number;
}) => (
  <mesh>
    <meshBasicMaterial
      attach="material"
      color={color}
      opacity={fillOpacity}
      depthWrite={false}
      transparent
    />
    <shapeBufferGeometry attach="geometry" args={[shape]} />
  </mesh>
);

const Svg = () => {
  const [center, setCenter] = React.useState(() => new Vector3(0, 0, 0));
  const ref = React.useRef<THREE.Group>(null!);

  const { paths } = useLoader(SVGLoader, "map.svg");

  const shapes = React.useMemo(
    () =>
      paths.flatMap((p) =>
        p.toShapes(true).map((shape) =>
          //@ts-expect-error this issue has been raised https://github.com/mrdoob/three.js/pull/21059
          ({ shape, color: p.color, fillOpacity: p.userData.style.fillOpacity })
        )
      ),
    [paths]
  );

  React.useEffect(() => {
    const box = new Box3().setFromObject(ref.current);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);
    setCenter((vec) => vec.set(-sphere.center.x, -sphere.center.y, 0));
  }, []);

  return (
    <group position={center} ref={ref}>
      {shapes.map((props) => (
        <Cell key={props.shape.uuid} {...props} />
      ))}
    </group>
  );
};

const GlobalControls = (mode: "map" | "orbit" | "first-person") => {
  switch (mode) {
    case "orbit":
      return (
        <firstPersonControlsImpl
          autoForward={false}
          movementSpeed={1.0}
          lookSpeed={1.0}
          lookVertical={false}
          /*
        object: Camera;
        domElement: HTMLElement | Document;
        enabled: boolean;
        movementSpeed: number;
        lookSpeed: number;
        lookVertical: boolean;
        autoForward: boolean;
        activeLook: boolean;
        heightSpeed: boolean;
        heightCoef: number;
        heightMin: number;
        heightMax: number;
        constrainVertical: boolean;
        verticalMin: number;
        verticalMax: number;
        mouseDragOn: boolean;
        dispose: () => void;
        handleResize: () => void;
        lookAt: (x: Vector3 | number, y?: number | undefined, z?: number | undefined) => this;
        update: (delta: number) => void;
        */
        />
      );
  }
};

/**
 * taking screenshots of house : https://github.com/pmndrs/react-three-fiber/discussions/770
 *
 */

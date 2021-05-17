import { Free, liftF, free } from "fp-ts-contrib/Free";
import * as F from "fp-ts-contrib/Free";
import * as I from "fp-ts/Identity";
import { Do } from "fp-ts-contrib/Do";
import { Identity, identity as id, URI as IdURI } from "fp-ts/Identity";
import { identity } from "fp-ts/function";
import { Semigroup, semigroupSum } from "fp-ts/Semigroup";

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

/**
 * Can take inspiration from here : https://github.com/kenbot/free/blob/master/src/main/scala/kenbot/free/tank/ai/AI.scala
 */

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

export interface Tensor<T> {
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


type ClockwiseEigthRotation = 0.78539816339;
type AntiClockwiseEigthRotation = -0.78539816339;
type RotationAngle = ClockwiseEigthRotation | AntiClockwiseEigthRotation



type Rotation =
  | {
      tag: "yAxis-clockwiseEigthRotation";
      rotation: [0, ClockwiseEigthRotation, 0];
    }
  | {
      tag: "yAxis-antiClockwiseEigthRotation";
      rotation: [0, AntiClockwiseEigthRotation, 0];
    };

// creating a set of instructions

// interface FirstPerson<R extends Rank> {
//     body: Object3D;
//     rayRirections: Tensor<Direction>[R];
//     caster: Raycaster;
//     collisionTestFn: (
//       collisionDistance: number,
//       obstacles: Object3D[],
//       rays: Tensor<Direction>[R],
//       caster: Raycaster
//     ) => (
//       body: Object3D
//     ) => Tensor<{
//       direction: Direction;
//       blocked: boolean;
//     }>[R];
//     rotateFn: (rotate: Rotation) => (body: Object3D) => Object3D;
//     translateFn: (translation: Direction) => (body: Object3D) => Object3D;
//   }

export type PlayerFURI = "PlayerF";
export const PlayerFURI: PlayerFURI = "PlayerF";

// ADTs for moves
export class Rotate<A> {
  readonly tag: "Rotate" = "Rotate";
  readonly _A!: A;
  readonly _URI!: PlayerFURI;
  constructor(
    readonly rotation: Rotation,
    readonly body: Object3D,
    readonly next: (body: Object3D) => A
  ) {}
}

export class Translate<A> {
  readonly tag: "Translate" = "Translate";
  readonly _A!: A;
  readonly _URI!: PlayerFURI;
  constructor(
    readonly translation: Direction,
    readonly body: Object3D,
    readonly next: (body: Object3D) => A
  ) {}
}

// Functor for moves
type MoveF<A> = Rotate<A> | Translate<A>;
/**
 * | Accelerate<A>
 *
 */

/** have to return a body ?  */
export class Collide<R extends Rank, A> {
  readonly tag: "Collide" = "Collide";
  readonly _A!: A;
  readonly _URI!: PlayerFURI;
  constructor(
    readonly collisionDistance: number,
    readonly obstacles: Object3D[],
    readonly rays: Tensor<Direction>[R],
    readonly caster: Raycaster,
    readonly body: Object3D,
    readonly next: (
      directions: Tensor<{ direction: Direction; blocked: boolean }>[R]
    ) => A
  ) {}
}

export class OpenDoor<A> {
  readonly tag: "OpenDoor" = "OpenDoor";
  readonly _A!: A;
  readonly _URI!: PlayerFURI;
  constructor(readonly door: Object3D, readonly next: (t: undefined) => A) {}
}

export class ChangeMaterial<A> {
  readonly tag: "ChangeMaterial" = "ChangeMaterial";
  readonly _A!: A;
  readonly _URI!: PlayerFURI;
  constructor(readonly element: Object3D, readonly next: (t: undefined) => A) {}
}

export class AddFurniture<A> {
  readonly tag: "AddFurniture" = "AddFurniture";
  readonly _A!: A;
  readonly _URI!: PlayerFURI;
  constructor(
    readonly position: Tensor<number>[Rank.R3],
    readonly furnitureHash: string,
    readonly next: (t: undefined) => A
  ) {}
}

type InteractF<A> = Collide<
  Rank.R8,
  A
>; /*
| OpenDoor<A> 
| ChangeMaterial<A> 
| AddFurniture<A>

*/

export class QueryMaterial<A> {
  readonly tag: "QueryMaterial" = "QueryMaterial";
  readonly _A!: A;
  readonly _URI!: PlayerFURI;
  constructor(readonly element: Object3D, readonly next: (t: undefined) => A) {}
}

type QueryF<A> = QueryMaterial<A>;

/**
| FindNearest<A>
| IsAt<A>
| IsFacing<A>
| AngleTo<A> 
 */

export type PlayerF<A> = MoveF<A> | InteractF<A>; /*| QueryF<A>*/

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    PlayerF: PlayerF<A>;
  }
}

// lifting functions

export const collide = <R extends Rank>(
  collisionDistance: number,
  obstacles: Object3D[],
  rays: Tensor<Direction>[R],
  caster: Raycaster,
  body: Object3D
) =>
  liftF(
    new Collide(collisionDistance, obstacles, rays, caster, body, identity)
  );

export const translate = (translation: Direction, body: Object3D) =>
  liftF(new Translate(translation, body, identity));

export const rotate = (rotation: Rotation, body: Object3D) =>
  liftF(new Rotate(rotation, body, identity));

interface Compuation<R extends Rank> {
  collide: (
    collisionDistance: number,
    obstacles: Object3D[],
    rays: Tensor<Direction>[R],
    caster: Raycaster
  ) => (
    body: Object3D
  ) => Tensor<{
    direction: Direction;
    blocked: boolean;
  }>[R];
  rotate: (rotate: Rotation) => (body: Object3D) => Object3D;
  translate: (
    translation: Direction,
    constant: number
  ) => (body: Object3D) => Object3D;
}

const computation: Compuation<Rank.R8> = {
  collide: (
    collisionDistance: number,
    obstacles: Object3D[],
    rays: Tensor<Direction>[Rank.R8],
    caster: Raycaster
  ) => (
    body: Object3D
  ): Tensor<{ direction: Direction; blocked: boolean }>[Rank.R8] => {
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
    return collisionDirections as Tensor<{
      direction: Direction;
      blocked: boolean;
    }>[Rank.R8];
  },
  rotate: (rotate: Rotation) => (body: Object3D) => {
    const [ψ, θ, φ] = rotate.rotation;
    const R = new Euler(ψ, θ, φ);
    const matrix4Rotation = new Matrix4().makeRotationFromEuler(R);

    switch (rotate.tag) {
      case 'yAxis-antiClockwiseEigthRotation':
        body.applyMatrix4(matrix4Rotation);
        return body;
      case 'yAxis-clockwiseEigthRotation':
        body.applyMatrix4(matrix4Rotation);
        return body;
    }
  },
  translate: (translation: Direction, constant: number) => (body: Object3D) => {
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

export const interpretIdentity = <A>(fa: PlayerF<A>): Identity<A> => {
  switch (fa.tag) {
    case "Collide":
      return id.of(
        fa.next(
          computation.collide(
            fa.collisionDistance,
            fa.obstacles,
            fa.rays,
            fa.caster
          )(fa.body)
        )
      );
    case "Rotate":
      return id.of(fa.next(computation.rotate(fa.rotation)(fa.body)));
    case "Translate":
      return id.of(fa.next(computation.translate(fa.translation, 3)(fa.body)));
  }
};

export const interpretLogger = <A>(program: PlayerF<A>): PlayerF<A> => {
  const { tag, ...rest } = program;
  console.log(`[${tag}]`, JSON.stringify(rest));
  return program;
};

const rayDirectionsDefault: Tensor<Direction>[Rank.R8] = [
  { tag: "forward", direction: [0, 0, 1] },
  { tag: "up-forward", direction: [1, 0, 1] },
  { tag: "right", direction: [1, 0, 0] },
  { tag: "right-down", direction: [1, 0, -1] },
  { tag: "back", direction: [0, 0, -1] },
  { tag: "left-back", direction: [-1, 0, -1] },
  { tag: "left", direction: [-1, 0, 0] },
  { tag: "left-forward", direction: [-1, 0, 1] },
];

// fancy composite moves :
/*
- moveTo
- distanceTo
- rotateTowards
- aimAwayFrom
 */

const advancedMoves = {
  interactionWithWall: (initialBody: Object3D): Free<PlayerFURI, Object3D> =>
    Do(F.free)
      .bind(
        "body_0",
        translate({ tag: "forward", direction: [0, 0, 1] }, initialBody)
      )
      .bindL("body_1", ({ body_0 }) =>
        translate({ tag: "forward", direction: [0, 0, 1] }, body_0)
      )
      .bindL("possibleDirections", ({ body_1 }) =>
        collide(
          3,
          [new Object3D()],
          rayDirectionsDefault,
          new Raycaster(),
          body_1
        )
      )
      .bindL("body_3", ({ possibleDirections, body_1 }) =>
        translate(possibleDirections[0].direction, body_1)
      )
      .return(({ body_3 }) => body_3),
};

const result = F.foldFree(id)(
  interpretIdentity,
  advancedMoves.interactionWithWall(new Object3D())
);

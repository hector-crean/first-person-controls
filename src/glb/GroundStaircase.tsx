import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib/loaders/GLTFLoader'; 


type GLTFResult = GLTF & {
  nodes: {
    ['060521skylark011']: THREE.Mesh
    ['060521skylark019']: THREE.Mesh
    ['060521skylark020']: THREE.Mesh
    ['060521skylark052']: THREE.Mesh
    ['060521skylark053']: THREE.Mesh
    ['060521skylark054']: THREE.Mesh
    ['060521skylark055']: THREE.Mesh
    ['060521skylark058']: THREE.Mesh
    ['060521skylark070']: THREE.Mesh
    ['060521skylark081']: THREE.Mesh
    ['060521skylark083']: THREE.Mesh
    ['060521skylark087']: THREE.Mesh
    ['060521skylark145']: THREE.Mesh
    ['060521skylark146']: THREE.Mesh
    ['060521skylark189']: THREE.Mesh
    ['060521skylark203']: THREE.Mesh
    ['060521skylark204']: THREE.Mesh
    ['060521skylark207']: THREE.Mesh
    ['060521skylark210']: THREE.Mesh
    ['060521skylark224']: THREE.Mesh
    ['060521skylark256']: THREE.Mesh
    ['060521skylark260']: THREE.Mesh
    ['060521skylark263']: THREE.Mesh
    ['060521skylark311']: THREE.Mesh
    ['060521skylark315']: THREE.Mesh
    ['060521skylark317']: THREE.Mesh
    ['060521skylark325']: THREE.Mesh
    ['060521skylark326']: THREE.Mesh
    ['060521skylark369']: THREE.Mesh
    ['060521skylark413']: THREE.Mesh
    ['060521skylark416']: THREE.Mesh
    ['060521skylark431']: THREE.Mesh
    ['060521skylark451']: THREE.Mesh
    ['060521skylark513']: THREE.Mesh
    ['060521skylark555']: THREE.Mesh
    ['060521skylark596']: THREE.Mesh
    ['060521skylark599']: THREE.Mesh
    ['060521skylark600']: THREE.Mesh
    ['060521skylark601']: THREE.Mesh
    ['060521skylark603']: THREE.Mesh
    ['060521skylark607']: THREE.Mesh
    ['060521skylark629']: THREE.Mesh
    ['060521skylark654']: THREE.Mesh
    ['060521skylark655']: THREE.Mesh
    ['060521skylark667']: THREE.Mesh
    ['060521skylark674']: THREE.Mesh
    ['060521skylark685']: THREE.Mesh
    ['060521skylark701']: THREE.Mesh
    ['060521skylark702']: THREE.Mesh
    ['060521skylark703']: THREE.Mesh
    ['060521skylark790']: THREE.Mesh
    ['060521skylark791']: THREE.Mesh
    ['060521skylark800']: THREE.Mesh
    ['060521skylark813']: THREE.Mesh
    ['060521skylark817']: THREE.Mesh
    ['060521skylark820']: THREE.Mesh
  }
  materials: {
    internalWall_structure: THREE.MeshStandardMaterial
    externalWall_drywall: THREE.MeshStandardMaterial
    externalWall_cladding: THREE.MeshStandardMaterial
    floor_surface: THREE.MeshStandardMaterial
    externalWall_structure: THREE.MeshStandardMaterial
    externalWall_window_glass: THREE.MeshStandardMaterial
    externalWall_window_frame: THREE.MeshStandardMaterial
    stair_structure: THREE.MeshStandardMaterial
    floor_structure: THREE.MeshStandardMaterial
  }
}

export default function Model(props: JSX.IntrinsicElements['group']) {


  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/span-1_ G-M-stair-parallel.glb') as unknown as GLTFResult


  return (
    <group ref={group} {...props} dispose={null}>
      
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark011'].geometry}
        material={nodes['060521skylark011'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark019'].geometry}
        material={nodes['060521skylark019'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark020'].geometry}
        material={nodes['060521skylark020'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark052'].geometry}
        material={nodes['060521skylark052'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark053'].geometry}
        material={nodes['060521skylark053'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark054'].geometry}
        material={nodes['060521skylark054'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark055'].geometry}
        material={nodes['060521skylark055'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark058'].geometry}
        material={nodes['060521skylark058'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark070'].geometry}
        material={nodes['060521skylark070'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark081'].geometry}
        material={nodes['060521skylark081'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark083'].geometry}
        material={nodes['060521skylark083'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark087'].geometry}
        material={nodes['060521skylark087'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark145'].geometry}
        material={nodes['060521skylark145'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark146'].geometry}
        material={nodes['060521skylark146'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark189'].geometry}
        material={nodes['060521skylark189'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark203'].geometry}
        material={nodes['060521skylark203'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark204'].geometry}
        material={nodes['060521skylark204'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark207'].geometry}
        material={nodes['060521skylark207'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark210'].geometry}
        material={nodes['060521skylark210'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark224'].geometry}
        material={nodes['060521skylark224'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark256'].geometry}
        material={nodes['060521skylark256'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark260'].geometry}
        material={nodes['060521skylark260'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark263'].geometry}
        material={nodes['060521skylark263'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark311'].geometry}
        material={nodes['060521skylark311'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark315'].geometry}
        material={nodes['060521skylark315'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark317'].geometry}
        material={nodes['060521skylark317'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark325'].geometry}
        material={nodes['060521skylark325'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark326'].geometry}
        material={nodes['060521skylark326'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark369'].geometry}
        material={nodes['060521skylark369'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark413'].geometry}
        material={nodes['060521skylark413'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark416'].geometry}
        material={nodes['060521skylark416'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark431'].geometry}
        material={nodes['060521skylark431'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark451'].geometry}
        material={nodes['060521skylark451'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark513'].geometry}
        material={nodes['060521skylark513'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark555'].geometry}
        material={nodes['060521skylark555'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark596'].geometry}
        material={nodes['060521skylark596'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark599'].geometry}
        material={nodes['060521skylark599'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark600'].geometry}
        material={nodes['060521skylark600'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark601'].geometry}
        material={nodes['060521skylark601'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark603'].geometry}
        material={nodes['060521skylark603'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark607'].geometry}
        material={nodes['060521skylark607'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark629'].geometry}
        material={nodes['060521skylark629'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark654'].geometry}
        material={nodes['060521skylark654'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark655'].geometry}
        material={nodes['060521skylark655'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark667'].geometry}
        material={nodes['060521skylark667'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark674'].geometry}
        material={nodes['060521skylark674'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark685'].geometry}
        material={materials.stair_structure}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark701'].geometry}
        material={nodes['060521skylark701'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark702'].geometry}
        material={nodes['060521skylark702'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark703'].geometry}
        material={nodes['060521skylark703'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark790'].geometry}
        material={nodes['060521skylark790'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark791'].geometry}
        material={nodes['060521skylark791'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark800'].geometry}
        material={nodes['060521skylark800'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark813'].geometry}
        material={nodes['060521skylark813'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark817'].geometry}
        material={nodes['060521skylark817'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['060521skylark820'].geometry}
        material={nodes['060521skylark820'].material}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload('/span-1_ G-M-stair-parallel.glb')

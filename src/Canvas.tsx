import Rf3, { Canvas, useThree, useFrame, extend, useLoader, Node } from '@react-three/fiber';
import React, { FC, Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { Stage, OrbitControls, shaderMaterial, Html, useProgress} from '@react-three/drei'
import { EffectComposer as EffectComposerImpl , GLTFLoader, RenderPass, ShaderPass, TexturePass, ClearPass, ClearMaskPass, MaskPass, CopyShader } from 'three-stdlib'
import * as three from 'three';
import { useClippingPlanes, initStencilMaterials} from './ClippingPlanes'; 
import {Switch, Route, BrowserRouter} from "react-router-dom";


import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'

import PlayerModel from './Controls/PlayerModel'; 


import { CapShaderMaterial, SheetShaderMaterial, BackStencilShaderMaterial, FrontStencilShaderMaterial, 
  capShaderMaterial, sheetShaderMaterial, backStencilShaderMaterial, frontStencilShaderMaterial} from './shaders/ClippingCap'; 
// https://codesandbox.io/s/react-three-fiber-mask-post-processing-ok64m?from-embed=&file=/src/index.js

declare global {
  namespace JSX {
    interface IntrinsicElements {
      effectComposerImpl: Node<EffectComposerImpl<three.WebGLRenderTarget>, typeof EffectComposerImpl>,
      shaderPass: Node<ShaderPass, typeof ShaderPass>,
      texturePass: Node<ShaderPass, typeof TexturePass>,
      clearPass: Node<ClearPass, typeof ClearPass>,
      maskPass: Node<MaskPass, typeof MaskPass>,
      clearMaskPass: Node<ClearMaskPass, typeof ClearMaskPass>,
      // copyShader: Node<CopyShader, typeof CopyShader>,
      renderPass: Node<RenderPass, typeof RenderPass>
      
    }
  }
}

extend({
    EffectComposerImpl,
    ShaderPass,
    TexturePass,
    ClearPass,
    MaskPass,
    ClearMaskPass,
    CopyShader,
    RenderPass,
  })


  function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress()
    return <Html center>{progress} % loaded</Html>
  }
  

  interface BoxProps {
    clippingPlanes: three.Plane[]
  }
  const Box: FC<BoxProps> = ({clippingPlanes}) =>  {
    const ref = useRef(new three.Mesh())
    
    return (
      <mesh ref={ref}>
        <boxBufferGeometry attach="geometry" args={[4, 4, 4]} />
        <meshStandardMaterial 
          color={new three.Color("rgb(255, 0, 0)")}
          clippingPlanes={clippingPlanes}
          side={three.DoubleSide}
        />
      </mesh>
    )
  }

  
  
  


interface EffectsProps {
    mainSceneRef: React.MutableRefObject<three.Scene>;
    capSceneRef: React.MutableRefObject<three.Scene>;
    backStencilSceneRef: React.MutableRefObject<three.Scene>;   
    frontStencilSceneRef: React.MutableRefObject<three.Scene>;  
}
const Effects: FC<EffectsProps> = ({ mainSceneRef, capSceneRef }) => {
    const { gl, camera, size, scene } = useThree()
   

    const renderTarget = useMemo(
      () =>
        new three.WebGLRenderTarget(size.height, size.width, {
          minFilter: three.LinearFilter,
          magFilter: three.LinearFilter,
          format: three.RGBFormat,
          stencilBuffer: true
        }),
      [size.height, size.width]
    )
    const composerRef= useRef(new EffectComposerImpl(gl, renderTarget)) 

    useEffect(() => {
        composerRef.current.setSize(size.width, size.height) 
    }, [size])
  
    useFrame(() => {
      // gl.autoClear = false
      // gl.clear()
      composerRef.current.render()
    })
    // https://stackoverflow.com/questions/63219093/three-js-trouble-combining-stencil-clipping-with-effectcomposer
    return (
      
      
        <effectComposerImpl ref={composerRef} args={[gl, renderTarget]}>
          
          <renderPass attachArray="passes" scene={scene} camera={camera} />

          {/**
           *  PASS 1 
           * everywhere that the back faces are visible (clipped region) the stencil
           * buffer is incremented by 1.
           */}
          <shaderPass attachArray="passes" args={[backStencilShaderMaterial]}> </shaderPass>
          {/**
           *   PASS 2
           * everywhere that the front faces are visible the stencil
           * buffer is decremented back to 0.
           */}
          <shaderPass attachArray="passes" args={[frontStencilShaderMaterial]} />
          {/**
           *   PASS 3
           * draw the plane everywhere that the stencil buffer != 0, which will
           * only be in the clipped region where back faces are visible.
           */}
          <shaderPass attachArray="passes" args={[capShaderMaterial]} />
          <shaderPass attachArray="passes" args={[sheetShaderMaterial]} renderToScreen/>


        </effectComposerImpl>
      
      )
    }



  interface ModelProps {
      // clippingPlanes: three.Plane[]; 
      overideMaterial?: three.MeshStandardMaterial | three.ShaderMaterial; 
  }
  const Model: FC<ModelProps> = ({ overideMaterial}) => {
  
    const gltf  = useLoader(GLTFLoader, '/span-1_ G-M-stair-parallel.glb'); 

     useMemo(
          
          () => gltf.scene.traverse((obj: three.Object3D) => {
              
           // traverse and mutate the scene
           if (overideMaterial !== undefined && obj instanceof three.Mesh && obj.material !== undefined){
                  obj.material = overideMaterial; 
           }
      }), []) 
  
      
       return ( <primitive object={gltf} dispose={null} /> )
  }
  
  


  const PlaneClip = () => {
    const { gl } = useThree();
    gl.localClippingEnabled = true;
    return null;
  }

  const Composer = () => {
    const { gl, scene, camera, size } = useThree()
    const composerRef = useRef()
    
    return (
      <effectComposerImpl 
        ref={composerRef} 
        args={[gl]} 
        /*renderTarget1={} */
      > </effectComposerImpl>
    )
  }
  
  interface ClearPlaneStencilProps {
    geometry: three.BufferGeometry;
    plane: three.Plane[];
    renderOrder: number; 
    face: 'back'|'front'
  }
  const CreatePlaneStencil: FC<ClearPlaneStencilProps> = ({ geometry, plane, renderOrder, face }) => {
    //<torusKnotBufferGeometry args={[0.4, 0.15, 220, 60]} />
    let wrap =
      face === "back"
        ? three.IncrementWrapStencilOp
        : three.DecrementWrapStencilOp;
    return (
      <mesh 
        renderOrder={renderOrder}
      >
        <torusKnotBufferGeometry args={[0.4, 0.15, 220, 60]} />
        <meshBasicMaterial
          depthWrite={false}
          depthTest={false}
          colorWrite={false}
          stencilWrite={true}
          stencilFunc={three.AlwaysStencilFunc}
          side={face === "back" ? three.BackSide : three.FrontSide}
          clippingPlanes={plane}
          stencilFail={wrap}
          stencilZFail={wrap}
          stencilZPass={wrap}
        />
      </mesh>
    );
  }
  interface CutsProps {
    model: any;
    cplane: three.Plane; 
  }
  const Cuts: FC<CutsProps> = ({ model, cplane }) => {
    console.log("cuts.js", model, cplane);
    const { gl } = useThree();
  
    //useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
    let afterRender = function (renderer: three.WebGLRenderer) {
      renderer.clearStencil();
    };
  
    return (
      <group>
        {model && (
          <group>
            <CreatePlaneStencil
              geometry={model.geometry}
              plane={[cplane]}
              renderOrder={1}
              face={"back"}
            />
            <CreatePlaneStencil
              geometry={model.geometry}
              plane={[cplane]}
              renderOrder={1}
              face={"front"}
            />
          </group>
        )}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.5, 0]}
          renderOrder={1.1}
          onAfterRender={() => afterRender(gl)}
        >
          <planeBufferGeometry args={[2, 2]} />
          <meshStandardMaterial
            color={0xe91e63}
            metalness={0.1}
            roughness={0.75}
            side={three.DoubleSide}
            stencilWrite={true}
            stencilRef={0}
            stencilFunc={three.NotEqualStencilFunc}
            stencilFail={three.ReplaceStencilOp}
            stencilZFail={three.ReplaceStencilOp}
            stencilZPass={three.ReplaceStencilOp}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, cplane.constant, 0]}>
          <planeBufferGeometry args={[5, 5]} />
          <meshStandardMaterial color={0xe91e63} wireframe />
        </mesh>
      </group>
    );
  }

interface ClippedModel {
  cplane: three.Plane
}
const ClippedModel: FC<ClippedModel> = ({ cplane }) => {
  const mesh = useRef();
  console.log("model.js", mesh);
  //temp disable rotate
  //useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  return (
    <>
      <mesh ref={mesh} name="clippedcolorfront" renderOrder={6}>
        <torusKnotBufferGeometry args={[0.4, 0.15, 220, 60]} />
        <meshPhongMaterial
          color={0xffc107}
          clippingPlanes={[cplane]}
          clipShadows={true}
          shadowSide={three.DoubleSide}
        />
      </mesh>
      <Cuts model={mesh.current} cplane={cplane} />
    </>
  );
}


/**
 * Rendering simulatenous scenes :
 */
 const MainScene = () => {

  const sceneRef = useRef<three.Scene>(new three.Scene())
  const { camera } = useThree()
  useFrame(({ gl }) => void ((gl.autoClear = true), gl.render(sceneRef.current, camera)), 100)
  return (
  <scene ref={sceneRef}>
    <Model/>
  </scene>
  )
}

const CapScene = () => {
  const sceneRef = useRef<three.Scene>(new three.Scene())
  const { camera } = useThree()
  useFrame(({ gl }) => void ((gl.autoClear = false), gl.clearDepth(), gl.render(sceneRef.current, camera)), 10)
  return (
  <scene ref={sceneRef}>
    <Model overideMaterial={capShaderMaterial}/>
  </scene>
  )
}

const FrontStencilScene = () => {
  const sceneRef = useRef<three.Scene>(new three.Scene())
  const { camera } = useThree()
  useFrame(({ gl }) => void ((gl.autoClear = false), gl.clearDepth(), gl.render(sceneRef.current, camera)), 9)
  return (
  <scene ref={sceneRef}>
    <Model overideMaterial={frontStencilShaderMaterial}/>
  </scene>
  )
}
const BackStencilScene = () => {
  const sceneRef = useRef<three.Scene>(new three.Scene())
  const { camera } = useThree()
  useFrame(({ gl }) => void ((gl.autoClear = false), gl.clearDepth(), gl.render(sceneRef.current, camera)), 8)
  return (
  <scene ref={sceneRef}>
    <Model overideMaterial={backStencilShaderMaterial}/>
  </scene>
  )
}










const CanvasImpl: FC<{}> = () => {

    const clippingPlanes = useClippingPlanes(); 

    const localClippingPlane = new three.Plane(new three.Vector3(0, -1, 0), 0.5);



    // const { camera  } = useThree()
    // const cameraRef = useRef(camera); 
    // useFrame(() => cameraRef.current.updateMatrixWorld())



    return (

        <div
        style={{
          height: "100vh",
          width: "100vw",
        }}
        >        
            <Canvas
           
                gl={{ antialias: true }}
                onCreated={({ gl }): void=> {
                    gl.localClippingEnabled = true
                    }
                }
                camera={{ position: [1, 1, 1] }}
            >
                <color attach="background" args={[new three.Color("black")]} />


      
              
                   
      
            {/* <Suspense fallback={ <Box clippingPlanes={clippingPlanes}/>}>
                <Box clippingPlanes={clippingPlanes}/>
                <Effects 
                  mainSceneRef={mainSceneRef} 
                  capSceneRef={capSceneRef} 
                  frontStencilSceneRef={frontStencilSceneRef} 
                  backStencilSceneRef={backStencilSceneRef}
                />
            </Suspense> */}
            

{/* 
            <Suspense fallback={<Loader/>}>
                <MainScene/>
                <CapScene/>
                <FrontStencilScene/>
                <BackStencilScene/>
            </Suspense> */}
            {/* <Box clippingPlanes={clippingPlanes}/> */}





            <ambientLight intensity={0.5} />
            <pointLight intensity={1} position={[0, 0, 5]} />


            <OrbitControls enablePan={true} screenSpacePanning={true} />


            {/* <ClippedModel cplane={localClippingPlane} />
            <PlaneClip /> */}
            <Suspense fallback={null}>
              <PlayerModel/>
            </Suspense>
       
                
                
            <perspectiveCamera 
                // ref={cameraRef}
                onUpdate={self => self.updateProjectionMatrix()}
            />
            <OrbitControls enableDamping />
            <ambientLight/>



        </Canvas>

      

        </div>

    )
}

export default CanvasImpl
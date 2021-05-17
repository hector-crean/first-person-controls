import { WebGLRenderTarget } from 'three';
import { useEffect, useMemo } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, ShaderPass, RenderPass } from 'three-stdlib';
import * as three from 'three'; 

extend({ EffectComposer, ShaderPass, RenderPass });

function Effect() {
    const { gl, scene, camera, size } = useThree()

    const renderTarget: three.WebGLRenderTarget = useMemo(
        () =>
          new three.WebGLRenderTarget(size.height, size.width, {
            minFilter: three.LinearFilter,
            magFilter: three.LinearFilter,
            format: three.RGBFormat,
            stencilBuffer: true
          }),
        [size.height, size.width]
      )
    
    const renderScene = new RenderPass(scene, camera);

    const composer = new EffectComposer(gl, renderTarget);
    composer.addPass(renderScene); 


    useEffect(() => {
      composer.setSize(size.width, size.height);
    }, [composer, size])

    useFrame(() => {
      composer.render();
    }, 1);

    return null;
};

export default Effect;


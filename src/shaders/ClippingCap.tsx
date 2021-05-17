import * as three from 'three'; 
import glsl from 'glslify';
import { ShaderMaterialProps } from '@react-three/fiber'; 
import React, {FC, useMemo} from 'react'; 
import Rf3, { useLoader } from '@react-three/fiber';
import { GLTFLoader, GLTF } from 'three-stdlib';
import { useGLTF } from "@react-three/drei"


const SHADERS = {
    vertex: glsl`
		uniform vec3 color;
		varying vec3 pixelNormal;
		
		void main() {
			
			pixelNormal = normal;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			
		}`,

	vertexClipping: glsl`
		uniform vec3 color;
		uniform vec3 clippingLow;
		uniform vec3 clippingHigh;
		
		varying vec3 pixelNormal;
		varying vec4 worldPosition;
		varying vec3 camPosition;
		
		void main() {
			
			pixelNormal = normal;
			worldPosition = modelMatrix * vec4( position, 1.0 );
			camPosition = cameraPosition;
			
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			
		}`,

	fragment: glsl`
		uniform vec3 color;
		varying vec3 pixelNormal;
		
		void main( void ) {
			
			float shade = (
				  3.0 * pow ( abs ( pixelNormal.y ), 2.0 )
				+ 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )
				+ 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )
			) / 3.0;
			
			gl_FragColor = vec4( color * shade, 1.0 );
			
		}`,

	fragmentClipping: glsl`
		uniform vec3 color;
		uniform vec3 clippingLow;
		uniform vec3 clippingHigh;
		
		varying vec3 pixelNormal;
		varying vec4 worldPosition;
		
		void main( void ) {
			
			float shade = (
				  3.0 * pow ( abs ( pixelNormal.y ), 2.0 )
				+ 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )
				+ 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )
			) / 3.0;
			
			if (
				   worldPosition.x < clippingLow.x
				|| worldPosition.x > clippingHigh.x
				|| worldPosition.y < clippingLow.y
				|| worldPosition.y > clippingHigh.y
				|| worldPosition.z < clippingLow.z
				|| worldPosition.z > clippingHigh.z
			) {
				
				discard;
				
			} else {
				
				gl_FragColor = vec4( color * shade, 1.0 );
				
			}
			
		}`,

	fragmentClippingFront: glsl`
		uniform vec3 color;
		uniform vec3 clippingLow;
		uniform vec3 clippingHigh;
		
		varying vec3 pixelNormal;
		varying vec4 worldPosition;
		varying vec3 camPosition;
		
		void main( void ) {
			
			float shade = (
				  3.0 * pow ( abs ( pixelNormal.y ), 2.0 )
				+ 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )
				+ 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )
			) / 3.0;
			
			if (
				   worldPosition.x < clippingLow.x  && camPosition.x < clippingLow.x
				|| worldPosition.x > clippingHigh.x && camPosition.x > clippingHigh.x
				|| worldPosition.y < clippingLow.y  && camPosition.y < clippingLow.y
				|| worldPosition.y > clippingHigh.y && camPosition.y > clippingHigh.y
				|| worldPosition.z < clippingLow.z  && camPosition.z < clippingLow.z
				|| worldPosition.z > clippingHigh.z && camPosition.z > clippingHigh.z
			) {
				
				discard;
				
			} else {
				
				gl_FragColor = vec4( color * shade, 1.0 );
				
			}
			
		}`,

	invisiblevertexShader: glsl`
		void main() {
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
		}`,

	invisiblefragmentShader: glsl`
		void main( void ) {
			gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
			discard;
		}`
}

const UNIFORMS = {
    clipping: {
		color:        { type: "c",  value: new three.Color( 0x3d9ecb ) },
		clippingLow:  { type: "v3", value: new three.Vector3( 0, 0, 0 ) },
		clippingHigh: { type: "v3", value: new three.Vector3( 0, 0, 0 ) }
	},

	caps: {
		color: { type: "c", value: new three.Color( 0xf83610 ) }
	}

}

export const sheetShaderMaterial = new three.ShaderMaterial({
	uniforms: UNIFORMS.clipping,
	fragmentShader: SHADERS.vertexClipping,
	vertexShader: SHADERS.fragmentClipping
})

export const SheetShaderMaterial: FC<ShaderMaterialProps> = (props) => {
	
	return (
		<shaderMaterial 
			attach="material" 
			uniforms={UNIFORMS.clipping} 
			fragmentShader={SHADERS.vertexClipping} 
			vertexShader={SHADERS.fragmentClipping} 
			{...props} 
		/>
	)
}

export const capShaderMaterial = new three.ShaderMaterial({
	uniforms: UNIFORMS.caps,
	fragmentShader: SHADERS.vertex,
	vertexShader: SHADERS.fragment
})
export const CapShaderMaterial: FC<ShaderMaterialProps> = (props) => {
	
	return (
		<shaderMaterial 
			attach="material" 
			uniforms={UNIFORMS.caps} 
			fragmentShader={SHADERS.vertex} 
			vertexShader={SHADERS.fragment} 
			{...props} 
		/>
	)
}

export const backStencilShaderMaterial = new three.ShaderMaterial({
	uniforms: UNIFORMS.clipping,
	fragmentShader: SHADERS.vertexClipping,
	vertexShader: SHADERS.fragmentClippingFront,
	colorWrite: false,
	depthWrite: false,
	side: three.BackSide
})

export const BackStencilShaderMaterial: FC<ShaderMaterialProps> = (props) => {
	
	return (
		<shaderMaterial 
			attach="material" 
			uniforms={UNIFORMS.clipping} 
			fragmentShader={SHADERS.vertexClipping} 
			vertexShader={SHADERS.fragmentClippingFront}
			colorWrite={false}
			depthWrite={false}
			side={three.BackSide} 
			{...props} 
		/>
	)
}

export const frontStencilShaderMaterial = new three.ShaderMaterial({
	uniforms: UNIFORMS.clipping,
	fragmentShader: SHADERS.vertexClipping,
	vertexShader: SHADERS.fragmentClippingFront,
	colorWrite: false,
	depthWrite: false,
	side: three.FrontSide
})
export const FrontStencilShaderMaterial:FC<ShaderMaterialProps> = (props) => {
	
	return (
		<shaderMaterial 
			attach="material" 
			uniforms={UNIFORMS.clipping} 
			fragmentShader={SHADERS.vertexClipping} 
			vertexShader={SHADERS.fragmentClippingFront} 
			colorWrite={false}
			depthWrite={false}
			side={three.FrontSide} 
			{...props} 
		/>
	)
}








import * as THREE from 'three'
import glsl from 'glslify'

// https://roystan.net/articles/outline-shader.html
// https://alexanderameye.github.io/outlineshader

const outlineShader = {
	uniforms: THREE.UniformsUtils.clone({
		fillColor: { type: 'vec3', value: new THREE.Color(0x74ebd5) },
		linewidth: {
			// type: "f",
			value: 0.01,
		},
		vertexColors: true,
	}),
	vertexShader: glsl`
    uniform float linewidth;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;
      gl_Position = projectionMatrix * displacement;
    }
  `,
	fragmentShader: glsl`
    precision highp float;
    uniform vec3 fillColor;

    void main() {
      // fill colour of the polygon
      gl_FragColor = vec4(fillColor, 1.0 );
    }
  `,
}

export default new THREE.ShaderMaterial(outlineShader)

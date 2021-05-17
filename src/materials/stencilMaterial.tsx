import * as THREE from 'three'

export const stencilMaterialProps = {
	color: 0x000000,
	metalness: 0,
	roughness: 1,
	stencilFail: THREE.ReplaceStencilOp,
	stencilFunc: THREE.NotEqualStencilFunc,
	stencilRef: 0,
	stencilWrite: true,
	stencilZFail: THREE.ReplaceStencilOp,
	stencilZPass: THREE.ReplaceStencilOp,
}
export const stencilMaterial = new THREE.MeshStandardMaterial(
	stencilMaterialProps
)

export default stencilMaterial




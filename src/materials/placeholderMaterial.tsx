import * as THREE from 'three'

export const placeholderMaterialProps = {
	color: '#9cf542',
	opacity: 0.5,
	transparent: true,
	side: THREE.DoubleSide,
}
export const placeHolderMaterial = new THREE.MeshBasicMaterial(
	placeholderMaterialProps
)

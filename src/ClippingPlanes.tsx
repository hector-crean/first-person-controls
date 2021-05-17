import * as three from 'three'; 
import React, {useState, FC} from 'react'; 


export const useClippingPlanes = (
    initialClippingPlanes: [three.Plane, three.Plane, three.Plane] =  [
        new three.Plane( new three.Vector3( - 1, 0, 0 ), 0.5 ),
        new three.Plane( new three.Vector3( 0, - 1, 0 ), -1 ),
        new three.Plane( new three.Vector3( 0, 0, - 1 ), -1 )
      ]
) => {
    // -- clipping planes by default are initilaised below ground level
    const [clippingPlanes, setClippingPlanes] = useState<[three.Plane, three.Plane, three.Plane]>(initialClippingPlanes); 
  
    return clippingPlanes
}


// -- look into constructive solid geomeyry for creating infills ? 

const ClipPlaneSlider: FC<{
    clippingPlanes:  [three.Plane, three.Plane, three.Plane]; 
    setClippingPlanes: React.Dispatch<React.SetStateAction<[three.Plane, three.Plane, three.Plane]>>
}> = ({clippingPlanes, setClippingPlanes, children}) => {

    /**
     * Clipping Planes :
     *  - readonly planes ------------------------------
     *  - planeX : slices in x direction (not necessarily useful)
     *  - planeY : cuts across levels of building
     *  - planeZ : slices in z direction (not necessarily useful)
     *  - dynamic, changeable planes ------------------
     *  - frontPlane : this slice in the direction of the 'front'
     *  - sidePlane :  this slice in the direction of the 'side'
     *  - 
     */
    const [planeX, planeY, planeZ] = clippingPlanes; 
    


    const incrementConstant = (plane: three.Plane): three.Plane => { plane.constant = plane.constant + 1; return plane; }
    const newClippingPlane = clippingPlanes.map(p => incrementConstant(p)) as [three.Plane, three.Plane, three.Plane]

    return (
        <div 
            className=''
            onClick={ e => setClippingPlanes(state => newClippingPlane)}
        >
        {children}
        </div>
    )

}
  





export const initStencilMaterials = (clippingPlane: three.Plane): {
  backFaceStencilMaterial: three.MeshStandardMaterial;
  frontFaceStencilMaterial: three.MeshStandardMaterial; 
  planeStencilMaterial: three.MeshStandardMaterial; 
} => {

  
  // PASS 1
  // everywhere that the back faces are visible (clipped region) the stencil
  // buffer is incremented by 1.
  
  //back faces: 
  const backFaceStencilMaterial = new three.MeshStandardMaterial({
    depthTest: false,
    depthWrite: false,
    colorWrite: false,
    stencilWrite: true,
    stencilFunc: three.AlwaysStencilFunc,
    side: three.BackSide,
    clippingPlanes: [clippingPlane],
    stencilFail: three.IncrementWrapStencilOp,
    stencilZFail: three.IncrementWrapStencilOp,
    stencilZPass: three.IncrementWrapStencilOp 
  }); 


  // PASS 2
  // everywhere that the front faces are visible the stencil
  // buffer is decremented back to 0.

  const frontFaceStencilMaterial = new three.MeshStandardMaterial({
    depthTest: false,
    depthWrite: false,
    colorWrite: false,
    stencilWrite: true,
    stencilFunc: three.AlwaysStencilFunc,
    side: three.BackSide,
    clippingPlanes: [clippingPlane],
    stencilFail: three.DecrementStencilOp,
    stencilZFail: three.DecrementStencilOp,
    stencilZPass: three.DecrementStencilOp 
  }); 


  //   PASS 3
  // draw the plane everywhere that the stencil buffer != 0, which will
  // only be in the clipped region where back faces are visible.
  const planeStencilMaterial = new three.MeshStandardMaterial({
    color: 0xE91E63,
    roughness: 0.75,
    metalness: 0.1,
    stencilWrite: true,
    stencilRef: 0,
    stencilFunc: three.NotEqualStencilFunc,
    stencilFail: three.ReplaceStencilOp,
    stencilZFail: three.ReplaceStencilOp,
    stencilZPass: three.ReplaceStencilOp
  }); 


  return {
    backFaceStencilMaterial: backFaceStencilMaterial,
    frontFaceStencilMaterial: frontFaceStencilMaterial, 
    planeStencilMaterial: planeStencilMaterial 
  } 
}






  // const clippingPlaneParams = {
  //   planeX: { constant: 0, negated: false, displayHelper: false },
  //   planeY: { constant: 0, negated: false, displayHelper: false },
  //   planeZ: { constant: 0, negated: false, displayHelper: false }
  // }
  

  // clipping planes :
  const planes = [
    new three.Plane( new three.Vector3( - 1, 0, 0 ), 0 ),
    new three.Plane( new three.Vector3( 0, - 1, 0 ), 0 ),
    new three.Plane( new three.Vector3( 0, 0, - 1 ), 0 )
  ];
  
  // const planeHelpers = planes.map( p => {
  //   const ph = new three.PlaneHelper( p, 2, 0xffffff)
  //   ph.visible = false; 
  //   return ph; 
  // })


  const cylinderGeom = new three.CylinderGeometry(15, 15, 50, 64);
  const cylinderMat = new three.MeshNormalMaterial({
     clippingPlanes: planes,
     side: three.DoubleSide
  });
  const cylinderMesh = new three.Mesh(cylinderGeom, cylinderMat);



  // const { backFaceStencilMaterial, frontFaceStencilMaterial, planeStencilMaterial } = initStencilMaterials(planes); 

  // // front face stencil : 
  // const frontMesh = new three.Mesh(cylinderGeom, frontFaceStencilMaterial);
  // frontMesh.rotation.copy(cylinderMesh.rotation);

  // // back face stencil : 
  // const backMesh = new three.Mesh(cylinderGeom, backFaceStencilMaterial);
  // backMesh.rotation.copy(cylinderMesh.rotation);
  

  // const planeNormal = new three.Vector3(1,0,-0.5).normalize(); 
  // const forwardVector = new three.Vector3(0,0,-1); 
  // const plane: three.Plane = new three.Plane(planeNormal, -3)

  //  // Add the plane
  // const planeGeom = new three.PlaneBufferGeometry();
  // const planeMesh = new three.Mesh(planeGeom, planeStencilMaterial);
  // planeMesh.scale.setScalar(100);
  // plane.coplanarPoint(planeMesh.position);
  // planeMesh.quaternion.setFromUnitVectors(forwardVector, plane.normal);
  // planeMesh.renderOrder = 1;


  

 
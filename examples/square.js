// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("white", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, -100);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 32, 16);
  
  // // draw triangle
  // const geo = new THREE.Geometry();
  // function drawTriangle(x, y,length){
  //   geo.vertices.push(new THREE.Vector3(x+length,0,0))
  //   geo.vertices.push(new THREE.Vector3(0,y+length,0))
  //   geo.vertices.push(new THREE.Vector3(x+length,y+length,0))
  //   geo.faces.push(new THREE.Face3(0,1,2))
  // }

  // drawTriangle(1,1, length);

  // //draw square
  // const geo = new THREE.Geometry()
  
  // function drawSquare(x1,y1,x2,y2){
  //   geo.vertices.push( new THREE.Vector3( x1, y1, 0 ) );
  //   geo.vertices.push( new THREE.Vector3( x2, y1, 0 ) );
  //   geo.vertices.push( new THREE.Vector3( x2, y2, 0 ) );
  //   geo.vertices.push( new THREE.Vector3( x1, y2, 0 ) );
  //   geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
  //   geo.faces.push( new THREE.Face3( 2, 0, 3 ) );
  //   return geo;
  // }
  // drawSquare(-0.5,-0.5,0.5,0.5,12)
  let meshes = []
  let group = new THREE.Group()
  let material;
  let count = 0;
  scene.add(group)
  function createSphere(x, y, scale){
    let geo = new THREE.CircleGeometry()
    if(scale % 2){
     material = new THREE.MeshBasicMaterial({
      color: "blue",
      wireframe: true,
      // transparent: true,
    });
  } else {
     material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: true,
      // transparent: true,
    });
  }
    meshes[count] = new THREE.Mesh(geo, material);
    meshes[count].position.x = x*100
    meshes[count].position.y = 10*Math.sin(x*1000*Math.PI)
    meshes[count].scale.setScalar(scale)
    group.add(meshes[count]);
    scale -= 3
    count++
  if(scale >= 2){
    createSphere(x/2-5,y/2,scale)
    createSphere(x/2+5,y/2,scale)
    // createSphere(x/2,y/2-10,scale)
    // createSphere(x/2,y/2+10,scale)
    // createSphere(x/2+10,y/2,scale)
  }else{
      return;
    }
  
}

createSphere(0,0,30)
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);

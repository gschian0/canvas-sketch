// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const palettes = require('nice-color-palettes')
const random = require('canvas-sketch-util/random');

const palette = random.pick(palettes);

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
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, -350);
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
  let color1 = new THREE.Color(random.pick(palette))
  let color2 = new THREE.Color(random.pick(palette))
  let color3 = new THREE.Color(random.pick(palette))

  let meshes = []
  let group = new THREE.Group()
  let material;
  let count = 0;
  let angle = 0;
  scene.add(group)
  function createSphere(x, y, scale){
    let geo = new THREE.BoxGeometry()
    if(scale % 2){
     material = new THREE.MeshStandardMaterial({
      color: color1,
      metalness: 0.7,
      roughness: 0.2,
      // wireframe: true,
      // transparent: true,
    });
  } else if (scale % 7){
     material = new THREE.MeshStandardMaterial({
      color: color2,
      metalness: 0.7,
      roughness: 0.2,
      // wireframe: true,
      // transparent: true,
    });
  } else {
    material = new THREE.MeshStandardMaterial({
      color: color3,
      metalness: 0.7,
      roughness: 0.2,
      // wireframe: true,
      // transparent: true,
    });
  }
    meshes[count] = new THREE.Mesh(geo, material);
    meshes[count].rotation.z = angle;
    angle += Math.PI/4
    meshes[count].position.x = x *2
    meshes[count].position.y = y *2
    meshes[count].scale.setScalar(scale)
    group.add(meshes[count]);
    scale -= 3
    count++
  if(scale >= 3){
    createSphere(x/2-100,y/2-100,scale)
    createSphere(x/2+100,y/2+100,scale)
    createSphere(x/2+100,y/2-100,scale)
    createSphere(x/2-100,y/2+100,scale)
    // createSphere(x/4+10,y/4+10,scale)
    // createSphere(x/4-10,y/4-10,scale)
  }else{
      return;
    } 
}
const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.x = 1
pointLight.position.y = 4
pointLight.position.z = -3
// pointLight.lookAt(new THREE.Vector3())
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 2)
pointLight2.position.x = -2
pointLight2.position.y = -3
pointLight2.position.z = -4
// pointLight2.lookAt(new THREE.Vector3())
scene.add(pointLight2)
const light = new THREE.AmbientLight('white',2)
scene.add(light)
createSphere(0,0,20)
const clock = new THREE.Clock()
let clocktime;
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
      
      meshes.forEach((fract,time,index) =>{
        fract.rotation.y += 0.5 * 0.08
        // fract.position.z *= Math.sin(time)
      })
      clocktime = clock.getElapsedTime();
      group.rotation.y = clocktime* 0.001*Math.sin(time*0.5)
      group.rotation.z = clocktime* 0.01*Math.sin(time*0.5)
      group.rotation.x = clocktime* 0.01*Math.sin(time*0.5)
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

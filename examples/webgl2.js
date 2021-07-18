// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const palettes = require('nice-color-palettes');
const random = require('canvas-sketch-util/random');
const { PointLight } = require("three");

const palette = random.pick(palettes).slice(0,3);

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes : {antialias: true},
};

const sketch = ({ context }) => {
  // Create a renderer
  console.log(random.getRandomSeed())
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor(random.pick(palette), 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -8);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  const light = new THREE.PointLight('white',1,15.5);
  light.position.set(2,2,-4).multiplyScalar(1.5);

  const light2 = new THREE.PointLight('white',1,15.5);
  light2.position.set(-2,-2,4).multiplyScalar(1.5);
  light2.lookAt(0,0,0);
  
  scene.add(light,light2);
  // Setup a geometry
  const geometry = new THREE.BoxBufferGeometry(0.5,0.5,0.5);

  // // Setup a material
  // const material1 = new THREE.MeshLambertMaterial({
  //   color: palette[0],
  //   wireframe: false
  // });

  // // Setup a mesh with geometry + material
  // const mesh1 = new THREE.Mesh(geometry, material1);
  // mesh1.rotation.x = -Math.PI /6
  // mesh1.position.x = -1;

  // const material2 = new THREE.MeshLambertMaterial({
  //   color: random.pick(palette),
  //   wireframe: false
  // });

  // // Setup a mesh with geometry + material
  // const mesh2 = new THREE.Mesh(geometry, material2);
  // mesh2.rotation.x = -Math.PI /6

  // const material3 = new THREE.MeshLambertMaterial({
  //   color: palette[0],
  //   wireframe: false
  // });

  // // Setup a mesh with geometry + material
  // const mesh3 = new THREE.Mesh(geometry, material3);
  // mesh3.rotation.x = -Math.PI /6
  // mesh3.position.x = 1

  // scene.add(mesh1,mesh2,mesh3);
  const group= new THREE.Group();
  for (let i = 0; i < 100; i++){
    let randMat = new THREE.MeshLambertMaterial({color: random.pick(palette)});
    let randMesh = new THREE.Mesh(geometry,randMat);
    randMesh.position.x = (Math.random()*4)-2
    randMesh.position.y = (Math.random()*4)-2
    randMesh.position.z = (Math.random()*4)-2
    
    group.add(randMesh);
    
  }
  scene.add(group);

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
      group.children.forEach((child,index) => {
        //child.rotation.y += 0.05 / index * Math.sqrt(child.position.x*child.position.x+child.position.y * child.position.y+child.position.z*child.position.z);
        child.rotation.y -= 0.05;
        // child.position.y = index*random.value(0,3)* 4 -2
        // child.position.z = index*random.value(0,3)*4 -2
        // child.position.x = index*random.value(0,3)*4 -2
        //child.rotation.y /= index 
      });
      group.rotation.y += 0.005;
      // mesh1.rotation.y = (time*0.05) * Math.PI * 2.;
      // mesh2.rotation.y = (time*0.05) * Math.PI * 2.;
      // mesh3.rotation.y = (time*0.05) * Math.PI * 2.;
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

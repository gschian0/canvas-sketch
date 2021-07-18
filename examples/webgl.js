// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  time : 5,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes : {antialias: true}
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("pink", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -9);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 2);
  // setup lights
  const dirLight = new THREE.DirectionalLight();
  dirLight.position=(0,1,0)
  scene.add(dirLight);

  // const dirLight2 = new THREE.DirectionalLight('pink');
  // dirLight2.position=(0,-1,0)
  // scene.add(dirLight2);

  // Setup a material
  const material = new THREE.MeshNormalMaterial(THREE.FlatShading);

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  const newMesh = [];
  for(let i = -2.5; i <= 2.5; i += 0.01) {
    for(let j = -2.5; j <= 2.5; j += 0.7){
    newMesh[i+j] = mesh.clone();
    newMesh[i+j].position.x = i;
    newMesh[i+j].position.y = j;
    group.add(newMesh[i+j]);
  }
    
  }
  scene.add(group);

  //scene.add(mesh);

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
      group.children.forEach((child, index)=>{
      child.rotation.x = time * Math.PI * 4 * 0.25 + Math.sin(index);
      child.rotation.y = time * Math.PI * 2 * 0.25 - Math.cos(index);
      
      })
      group.rotation.y = time * Math.PI * 4 * 0.25 * 0.5;
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

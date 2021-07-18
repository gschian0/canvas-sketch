// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // dimensions: [512,512],
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: {antialias: true},
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 2, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  // load new texture 
  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load("/img/earth.jpg");
  const moonTexture = loader.load("/img/moon.jpg");
  // Setup a material
  const earthMaterial = new THREE.MeshStandardMaterial({
    // color: "yellow",
    // wireframe: true,
    // flatShading : true,
    roughness: 1,
    metalness: 0,
    roughness: 1,
    map: earthTexture,
  });
  const moonGroup = new THREE.Group();
  const moonMaterial = new THREE.MeshStandardMaterial({
    // color: "yellow",
    // wireframe: true,
    // flatShading : true,
    roughness: 1,
    metalness: 0,
    roughness: 1,
    map: moonTexture,
  });

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  const moonMesh = new THREE.Mesh(geometry,moonMaterial);
  moonMesh.scale.multiplyScalar(0.25);
  moonMesh.position.set(1.5,0.8,0);
  moonGroup.add(moonMesh);

  scene.add(earthMesh,moonGroup);

  const light = new THREE.PointLight('tan',2);
  light.position.set(-1,1.5,-1);
  scene.add(light);

  const ambLight = new THREE.AmbientLight('white',0.2);
  scene.add(ambLight);

  //helpers
  const helpers = new THREE.Group();
  scene.add(new THREE.PointLightHelper(light,0.2));
  const grid = new THREE.GridHelper(5,15);
  grid.position.y = -1
  helpers.add(grid);
  // helpers.add(new THREE.AxesHelper(5,15,'red'));
  scene.add(helpers);

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
      earthMesh.rotation.y = time*0.25;
      moonMesh.rotation.y = time*0.1;
      moonGroup.rotation.y = time* 0.5;
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

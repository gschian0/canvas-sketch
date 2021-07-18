// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");


const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random")
const palettes = require("nice-color-palettes")
const eases = require("eases")
const BezierEasing = require('bezier-easing')
const settings = {
  // Make the loop animated
  animate: true,
  dimensions: [2048,2048],
  duration : 9,
  fps : 24,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });
  console.log(random.getRandomSeed())
  // WebGL background color
  const palette = random.pick(palettes);
  renderer.setClearColor(random.pick(palette));

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  // camera.position.set(4,2,2);
  // camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1,10,10,10);
  const group = new THREE.Group();
  for(let i = 0; i < 300; i++){
    let mesh;
    if (i%3){
    mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1,3,3),
      new THREE.MeshStandardMaterial({
        color:random.pick(palette),
      })
    ); } else {
      mesh = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1,3,3),
        new THREE.MeshNormalMaterial({
          // color:random.pick(palette),
        })
      );
    }
    mesh.position.set(
      random.gaussian(-2,2),
      random.gaussian(-2,2),
      random.gaussian(-2,2)
    );
    mesh.scale.set(
      random.gaussian(-0.2,0.2),
      random.gaussian(-0.2,0.2),
      random.gaussian(-0.2,0.2)
    )
    group.add(mesh);
  };

  scene.add(group);

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0,4,1)
  scene.add(light);

  const ambLight = new THREE.AmbientLight('blue',0.3);
  scene.add(ambLight);  

  const easeFn = BezierEasing(.28,1.87,1,-0.87);

  

  // // Setup a geometry
  // const geometry = new THREE.BoxBufferGeometry(1, 1, 1,10,10,10);

  // // Setup a material
  // const material = new THREE.MeshBasicMaterial({
  //   color: "red",
  //   wireframe: false
  // });

  // // Setup a mesh with geometry + material
  // const mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time, playhead }) {
      // controls.update();
      group.children.forEach((child,index) => {
        child.rotation.x = playhead*Math.sin(index) * Math.PI * 2.;
        // child.position.x= playhead*Math.sin(20*index)*Math.PI * 2;
        // child.position.y= playhead*-Math.cos(20*index)*Math.PI * 2;
        // child.position.z= playhead*Math.cos(200*index)*Math.PI * 2;
      })
      const t = Math.sin(playhead * Math.PI );
      scene.rotation.z = eases.bounceInOut(t);
      scene.rotation.y = easeFn(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);

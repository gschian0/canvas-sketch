// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glsl = require('glslify');
const palettes = require('nice-color-palettes');

const random = require('canvas-sketch-util/random')
const TWO_PI = Math.PI * 2.;
const palette = random.pick(palettes);

const settings = {
  // Make the loop animated
  animate: true,
  duration: 5,
  dimensions: [2048,2048],
  fps: 24,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor(random.pick(palette), 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -3);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 200,200);

  const vert = glsl(/* glsl */`
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float time;

    void main () {
      vPosition = position;
      vUv = uv;
      vNormal = normal;
      vec3 pos = position;
      pos.x = pos.x + 0.2*sin(20.*pos.y + time);
      pos.y = pos.y + 0.1*sin(10.*pos.x + time);
      pos.z = pos.z + 0.1*sin(10.*pos.x + time);
      pos.z = pos.z + 0.1*sin(10.*pos.y + time);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
    `);

  const frag = glsl(/* glsl */`
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    uniform vec3 color;

    void main () {
      vec3 col = vec3(0.0,0.0,0.0);
      float alpha = 1.0;
      col = color*vPosition+0.8;
      gl_FragColor = vec4(vec3(sin(2.*3.14*10.*vUv.x-vUv.y+sin(2.*3.14*5.*vUv.y)))*col, alpha);
    }
    `);

  // Setup a material
  const material = new THREE.ShaderMaterial({
    fragmentShader : frag,
    vertexShader : vert,
    uniforms : {
      color : {value : new THREE.Color('pink')}, 
      time : {value : 0}
    }
    
    
    //wireframe: true
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
    render({ time,playhead }) {
      //mesh.rotation.y += Math.PI ;
      mesh.rotation.y = playhead * TWO_PI;
      controls.update();
      renderer.render(scene, camera);
      material.uniforms.time.value = playhead *TWO_PI;
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);

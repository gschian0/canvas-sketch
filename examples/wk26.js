// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glsl = require('glslify');
const palettes = require('nice-color-palettes');
const random = require('canvas-sketch-util/random');
const chroma = require('chroma-js');

const TWO_PI = Math.PI * 2.;
const palette = random.pick(palettes);
const cubePalette = palette.slice(2,4);

const pink = chroma('hotpink').hex();

let f = chroma.scale([random.pick(palette), random.pick(cubePalette)]).mode('lab');
let f2 = chroma.scale([random.pick(palette), random.pick(cubePalette)]).mode('lab');
// console.log(f(0.5).hex());
// const color 


// console.log(pink);
// console.log(random.pick(palette));

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
  renderer.setClearColor(random.pick(palette), 0.4);

  

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 500,500);

  const vert = glsl(/* glsl */`
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float time;
    uniform float stretch;
    uniform float stretchfreq;

    void main () {
      vPosition = position;
      vUv = uv;
      vNormal = normal;
      vec3 pos = position;
      vec3 transformed = position.xyz;
      pos.x = pos.x + 0.2*sin(20.*pos.y + time);
      pos.y = pos.y + 0.1*sin(10.*pos.x + time);
      pos.z = pos.z + 0.5*sin(10.*pos.x + time);
      pos.z = pos.z + 0.1*sin(10.*pos.y + time);
      transformed.xz *= sin(stretchfreq*position.y + stretch + time);
     // transformed.yz *= sin(stretchfreq*2.*position.x + stretch);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos+transformed, 1.0);
}
    `);

  const frag = glsl(/* glsl */`
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    uniform vec3 color;
    uniform vec3 color2;
    uniform float time;

    void main () {
      vec3 col = color;
      float alpha = 1.0;
      vec2 pos = mod(vUv * 8.0, 1.);
      float d = distance(pos, vec2(0.5,0.5));
      //float mask = 1.- (d > 0.25 ? 1.0 : 0.0);
      float mask = 1.-step(0.5 + vUv.x * 0.2*sin(time), d);

      gl_FragColor = vec4(vec3(vUv.x ,vUv.y,vUv.x) * color * d,1.0);
      gl_FragColor += vec4(vec3(mask)*mix(color,color2, fract(2.*vUv.y+time)),1.0)-0.3;
    }
    `);

  // Setup a material
  const material = new THREE.ShaderMaterial({
    fragmentShader : frag,
    vertexShader : vert,
    uniforms : {
      color : {value : new THREE.Color(f(0.3).hex())}, 
      color2 : {value : new THREE.Color(f(0.1).hex())}, 
      time : {value : 0},
      stretch : {value : 0},
      stretchfreq : {value : 0},
      
    //   wireframe: true
    },
    side: THREE.DoubleSide,
     
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotateY(Math.PI/4)
  mesh.rotateX(Math.PI/3)
  scene.add(mesh);

//   const light = new THREE.DirectionalLight('0xffffff');
//   light.position.set(1,1,-1);
//   scene.add(light);
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
    //   let timer = Date.now();
    //   console.log(timer);
      //mesh.rotation.y += Math.PI ;
      mesh.rotation.y = playhead * TWO_PI;
      mesh.rotation.x = -playhead * TWO_PI;

      controls.update();
      renderer.render(scene, camera);
      mesh.material.uniforms.time.value = playhead *TWO_PI;
      mesh.material.uniforms.stretch.value = playhead *TWO_PI;
      mesh.material.uniforms.stretchfreq.value = playhead *TWO_PI *5.*Math.sin(playhead*TWO_PI);
      mesh.material.uniforms.color.value = new THREE.Color(f(Math.abs(Math.sin(playhead*TWO_PI))).hex())
      mesh.material.uniforms.color2.value = new THREE.Color(f2(Math.abs(Math.sin(playhead*TWO_PI))).hex())
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);

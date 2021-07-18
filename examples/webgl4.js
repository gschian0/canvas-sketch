// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const palettes = require('nice-color-palettes');
const random = require('canvas-sketch-util/random');
const glsl = require('glslify');
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
  camera.position.set(0, 0, -5);
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
  //shaders 
  
  const frag = glsl(/* glsl */`

  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform vec3 color;

  void main () {
    vec2 nU = vUv - 0.5;
    float w1 = sin(44.*nU.x*-nU.y +time*0.1);
    float w2 = sin(200.*nU.x*nU.y +time*0.1);
    float w3 = sin(14.*nU.x*nU.y +time*0.1);
    // float worldPos = dot(vec3(0.,0.,0.),vPosition);
    vec3 colorComp = vec3(mix(w2*w1,w1,sin(time*.02)));
    gl_FragColor = vec4(colorComp*color, 1.0);
  }
`);

const vert = glsl(/*glsl*/`
    #pragma glslify: noise = require(glsl-noise/simplex/4d)
    varying vec2 vUv; 
    varying vec3 vPosition;
    uniform vec3 color;
    uniform float time;
    
    void main(){
        vUv = uv;
        vPosition = position;
        vec3 pos = position.xyz * sin(time*.05);
        pos += normal *noise(vec4(position.xyz, time*.005));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `);
  // Setup a geometry
  const geometry = new THREE.BoxBufferGeometry(0.5,0.5,0.5, 10,10,10);

  const group= new THREE.Group();

  for (let i = 0; i < 100; i++){
    // random.setSeed(422089);
    let randMat = new THREE.ShaderMaterial({
        extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
          },
        fragmentShader : frag,
        vertexShader : vert,
        uniforms: {
        color: {value: new THREE.Color(random.pick(palette))},
        time: {value : 0}
        },
    });
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
    render({ time, playhead }) {
      group.children.forEach((child,index) => {
        //child.rotation.y += 0.05 / index * Math.sqrt(child.position.x*child.position.x+child.position.y * child.position.y+child.position.z*child.position.z);
        child.rotation.y -= 0.05;
        child.material.uniforms.time.value = index+time*index;
        // child.position.y = index*random.value(0,3)* 4 -2
        // child.position.z = index*random.value(0,3)*4 -2
        // child.position.x = index*random.value(0,3)*4 -2
        //child.rotation.y /= index 
      });
      group.rotation.y += 0.005;
    //   console.log(group.children);
      
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

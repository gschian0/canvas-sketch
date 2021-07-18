const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');
const glsl = require('glslify');

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  duration: 5,
  // Loop framerate
  fps: 24,
  // Visualize the above FPS in-browser
  playbackRate: 'throttle',
  // Turn on MSAA
  attributes: { antialias: true }
};

const vertMaster = `
uniform float playhead;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fragMaster = `
#define PI acos(-1.)

uniform float playhead;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

varying vec2 vUv;


vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

float stroke(float x, float s, float w){
    float d = step(s,x +w*.5) - step(s,x - w*.5);
    return clamp(d , 0.,1.);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float circleSDF(vec2 st) {
    return length(st -.5)*2.;
 }
 
 float fill(float x, float size) {
 return 1. -step(size,x);
}

float rectSDF(vec2 st, vec2 s) {
st = st*2.-1.;
    return max(abs(st.x/s.x), abs(st.y/s.y));
}

float crossSDF(vec2 st, float s){
    vec2 size = vec2(.5, s);
    return min(rectSDF(st,size.xy),
            rectSDF(st,size.yx));
}

float flip(float v, float pct) {
    return mix(v, 1.-v, pct);
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

vec2 brick(vec2 _st, float _zoom){
    _st *= _zoom;
    _st.x += step(1., mod(_st.y, 2.0)) *-.5;
    _st.y += step(1., mod(_st.x, 2.0)) *-.5;
    return fract(_st);
}

void main(void)
{
    vec2 uv =  vUv-0.5;
    uv = abs(uv*1.);
    uv.x *= 6.1*sin(uv.y*PI+playhead)*.5+.5+ 1.5*cos(uv.x*PI+playhead +PI)*.5+0.5/log(length(3.*uv+vec2(.5*sin(playhead-uv.y-PI)*.5+.5,4.3*cos(playhead+uv.x)*.5+0.5)));
    uv.y *= 6.1*sin(uv.y*PI+playhead)*.5+.5+ 1.5*cos(uv.y*PI+playhead +PI)*.5+.5/log(length(3.*uv+vec2(.5*sin(playhead-uv.y-PI)*.5+.5,4.3*cos(playhead+uv.x)*.5+.5)));
    vec3 col = vec3(0.);
    uv = rotate(uv,playhead*.03);
   uv = brick(uv,3.);
   uv *= brick(uv,3.);
   col.rgb = uv.xyx;
   col.rgb += uv.y*uv.x;
   
   col += smoothstep(rectSDF(uv, vec2(.1)),rectSDF(uv, vec2(.6)),.1);
   col.rb += uv;
    col.bg = uv.yx;
    vec3 finalCol = col;
    

    finalCol = finalCol;
    finalCol.r += sin(2.*finalCol.r+2.*playhead+PI/2.)*0.5+0.3;
   finalCol.g += sin(3.*finalCol.g+playhead+PI/8.)*0.5+0.2;
   finalCol.b += finalCol.b +0.5;
   gl_FragColor = vec4(
        vec3(clamp(finalCol,0.,1.)-.1),
        1.0);
}
`

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(80, 1, 0.01, 100);
  camera.position.set(0,0,5);
  //camera.rotation.y = Math.PI*2;
  
  //camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  //Add Lights

  const ambLight = new THREE.AmbientLight(0xffffff,0.5)
  scene.add(ambLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff,0.5)
  dirLight1.position.x = 1
  dirLight1.position.y = 3
  dirLight1.position.z = 0.5
  dirLight1.lookAt(0,0.0)
  // dirLight1.castShadow = true;
  // dirLight1.shadow.mapSize.width = 2048;
  // dirLight1.shadow.mapSize.height = 2048;
  // dirLight1.shadow.camera.right = 2;
  // dirLight1.shadow.camera.left = -2;
  // dirLight1.shadow.camera.top = 2;
  // dirLight1.shadow.camera.bottom = -2;
  scene.add(dirLight1)

  const dirLight2 = new THREE.DirectionalLight(0xffffff,0.3)
  dirLight2.position.x = -1
  dirLight2.position.y = -3
  dirLight2.position.z = -0.5
  dirLight2.lookAt(0,1.0)
  // dirLight2.castShadow = true;
  // dirLight2.shadow.mapSize.width = 2048;
  // dirLight2.shadow.mapSize.height = 2048;
  // dirLight2.shadow.camera.right = 2;
  // dirLight2.shadow.camera.left = -2;
  // dirLight2.shadow.camera.top = 2;
  // dirLight2.shadow.camera.bottom = -2;
  // dirLight2.shadow.bias = 0.00000001;
  scene.add(dirLight2)

  // Setup a geometry
  //let geometry = new THREE.IcosahedronBufferGeometry(1, 32, 16);

  function paramEq(u,v,target){
    let phi = Math.PI * 2 * (u-0.5);
    let theta = Math.PI * 22 * (v-0.5);
    let tau = 5.;
    let denom = 1 + Math.cosh(2*phi)*Math.cosh(3*theta);
    let x = Math.sinh(phi)*Math.cos(tau*theta)/denom;
    let y = Math.sinh(phi)*Math.sin(tau*theta)/denom;
    let z = 2.*Math.cosh(phi)*Math.sinh(theta)/denom; 
    //sphere
    // let x = Math.sin(phi)*Math.cos(theta);
    // let y = Math.sin(phi/4)*Math.sin(theta);
    // let z = Math.cos(phi);
    target.set(x,y,z);
    
  }
  let m = [];
  // m = [1,3,3,4,5,9,7,10,8];
  m = [Math.floor(Math.random()*8),Math.floor(Math.random()*8),
    Math.floor(Math.random()*8),Math.floor(Math.random()*8),
    Math.floor(Math.random()*8),Math.floor(Math.random()*8),
    Math.floor(Math.random()*8),Math.floor(Math.random()*8)];
    console.log(m);
  function spherical(u,v,target){
    let r = 0;  
    
    let phi = Math.PI * 2 * (u-0.5);
    let theta = Math.PI * 22 * (v-0.5);

    r += Math.pow(Math.sin(m[0]*phi),m[1]);
    r += Math.pow(Math.cos(m[2]*phi),m[3]);
    r += Math.pow(Math.sin(m[4]*theta),m[5]);
    r += Math.pow(Math.cos(m[6]*theta),m[7]);

    let x = r * Math.sin(phi) * Math.cos(theta);
    let y = r * Math.cos(phi);
    let z = r * Math.sin(phi) * Math.sin(theta);
    //sphere
    // let x = Math.sin(phi)*Math.cos(theta);
    // let y = Math.sin(phi/4)*Math.sin(theta);
    // let z = Math.cos(phi);
    target.set(x,y,z);
    
  }
  var audioCtx, oscillator, gainNode;
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var started = false;
  var oscillators = [];
  var random = Math.random();
  console.log(random);
    window.addEventListener('click',() =>{
        if (!started){
    audioCtx = new AudioContext();
    gainNode = audioCtx.createGain();
    
    // create Oscillator node
    for (let i = 0; i < 7; i++){
    oscillators[i] = audioCtx.createOscillator();
    oscillators[i].type = 'sine';
    oscillators[i].frequency.setValueAtTime(random*122*m[i], audioCtx.currentTime); // value in hertz
    oscillators[i].connect(gainNode).connect(audioCtx.destination);
    gainNode.gain.setValueAtTime(1./oscillators.length, audioCtx.currentTime);
    oscillators[i].start();
    }

     console.log("bone");
     started = true;
        } else {
            gainNode.gain.linearRampToValueAtTime(0., audioCtx.currentTime+1.);
            // audioCtx.suspend();
            started = false;
    }
    })
    


    const geometry = new THREE.ParametricBufferGeometry(spherical,1000,1000);

  // Setup a material
  function getMaterial(){
    let material = new THREE.MeshPhysicalMaterial({
      // color: 0x72db,
      color: 0xffffff,
      // emissive: 0x64723,
      clearcoat: 1,
      clearcoatRoughness : 0.3,
      wireframe: false,
      metalness: 0.5,
      side: THREE.DoubleSide,
    });
    material.onBeforeCompile = function(shader){
      shader.uniforms.playhead = {value:0};
      shader.fragmentShader = `uniform float playhead;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <logdepthbuf_fragment>',
       `
       float diff = dot(vec3(1.), vNormal);
       vec3 a = vec3(1.,1.,0.5);
       vec3 b = vec3(0.5,0.5,0.5);
       vec3 c = vec3(1.0,1.0,1.0);
       vec3 d = vec3(0.0,0.10,0.20);
       vec3 cc = a + b * cos(10.*3.141592*(c*diff+d + playhead)); 
       
       
       
       //diffuseColor.rgb = vec3(1.0,0.0,0.0);
       diffuseColor.rgb = cc;
        `        
        + '#include <logdepthbuf_fragment>'
      )
        material.userData.shader = shader;
    }

    return material;
}

let material = getMaterial();
let normalMat = new THREE.MeshNormalMaterial();
  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.castShadow = mesh.receiveShadow = true;
  scene.add(mesh);

  let geom = new THREE.IcosahedronBufferGeometry(0.5,5);
  let ball1 = new THREE.Mesh(geom,getMaterial());
  let ball2 = new THREE.Mesh(geom,getMaterial());

  let skybox = new THREE.BoxBufferGeometry(30,30,20);
  let skyNormMat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
  let skyMaterial = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      playhead: { type: "f", value: 0 },
      resolution: { type: "v4", value: new THREE.Vector2(this.width, this.height) },
    },
    // wireframe: true,
    // transparent: true,
    vertexShader: vertMaster,
    fragmentShader: fragMaster
  });

  let skyMesh = new THREE.Mesh(skybox,skyMaterial);
  scene.add(skyMesh);
  
  scene.add(ball1,ball2);

  // ball1.castShadow = ball1.recieveShadow = true;
  // ball2.castShadow = ball2.recieveShadow = true;

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // And render events here
    render ({ time, playhead }) {
      if (material.userData.shader){
        // console.log(material.userData.shader.uniforms.playhead);
         material.userData.shader.uniforms.playhead.value = playhead;
      }
      skyMaterial.uniforms.playhead.value += 0.02;
      //camera.rotation.z = playhead * (2*Math.PI);
      //mesh.rotation.x = playhead * (2*Math.PI );
    mesh.rotation.y = playhead * (2*Math.PI  );
      mesh.rotation.z = playhead * (2*Math.PI );
      dirLight1.position.x = 0.5*playhead * Math.sin(2*Math.PI);
      if(ball1 && ball2){
        let theta1 = playhead * 2 * Math.PI;
        let theta2 = playhead * 2 * Math.PI + Math.PI;
        ball1.position.x = 5*Math.sin(theta1);
        ball1.position.y = 5*Math.cos(theta1);
        ball2.position.x = 5*Math.sin(theta2);
        ball2.position.y = 5*Math.cos(theta2);
        ball2.position.z = 5*Math.cos(2*theta2);
        ball1.rotation.x = playhead *(2*Math.PI)
      }
      

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of WebGL context (optional)
    unload () {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);



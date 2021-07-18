const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

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

  let geom = new THREE.IcosahedronBufferGeometry(0.1,5);
  let ball1 = new THREE.Mesh(geom,getMaterial());
  let ball2 = new THREE.Mesh(geom,getMaterial());
  
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



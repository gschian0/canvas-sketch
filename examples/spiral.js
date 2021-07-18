// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { Group } = require("three");
const colorArray = ['red','blue','yellow','green'] 

function getMesh(x,y,z, mesh) {
	this.x = x;
  this.y = y;
  this.z = z;
  this.mesh = mesh;
  this.meshClone = this.mesh.clone();
  this.meshClone.position.x = this.x;
  this.meshClone.position.y = this.y;
  this.meshClone.position.z = this.z;
	return this.meshClone;
}

function createSpiral(mesh,maxB,c,inc){
  this.grouper = new THREE.Group;
  this.maxBoxes = maxB;
  this.meshGrid = [];
  this.c = c;
  this.inc = inc;
  for(let i = -this.maxBoxes * 2 ; i < this.maxBoxes *2; i++){
    // golden ratio
    //this.angle = i * 2.4;
    this.angle = i * this.inc;   
    this.r = this.c * Math.sqrt(i);
    this.meshGrid[i] = getMesh(
      r * Math.cos(this.angle),
      r * Math.sin(this.angle),
      0,
      mesh);
    this.grouper.add(this.meshGrid[i])  
  } 
  return this.grouper;
}


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
  const camera = new THREE.PerspectiveCamera(40, 1, 0.001, 1000);
  camera.position.set(0, 0, -150);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  const ambLight = new THREE.AmbientLight('white',0.2);
  scene.add(ambLight)

  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 1000, 10 );
  spotLight.lookAt(0,0,0);
  scene.add(spotLight);

  // Setup a geometry
  const geometry = new THREE.IcosahedronBufferGeometry(1, 1, 1);

  // Setup a material
  const material = new THREE.MeshPhysicalMaterial({
    color: "green",
    wireframe: false
  });
 
  // Setup a mesh with geometry + material
  // let maxBoxes = 5;
  mesh = new THREE.Mesh(geometry,material);
  spiral = createSpiral(mesh,200,2,2.4);
  // console.log(spiral.children[0].material.color);

  scene.add(spiral);

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
      
      // console.log(spiral)
      //
      // if (spiral){
      // console.log(spiral.children.material.color);
      // }
        spiral.children.forEach(function(child,index){
        child.material.needsUpdate = true;
        //  child.material.needsUpdate() = true;
          //  child.position.y += 0.01*Math.sin(time+index);
          //  child.position.x += 0.07*Math.sin(time-index);
          // child.position.z += 0.2*Math.sin(time-index*2.);
         child.material.color = new THREE.Color(colorArray[0]);
         //child.material.uniforms.time.value = this.time + index
       });
      spiral.rotation.y += 0.0085;
      // controls.update();
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

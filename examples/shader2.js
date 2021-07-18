const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true,
  duration: 4,
};

// Your glsl code
const frag = glsl(/*glsl */`
  precision highp float;
  #define PI 3.14159265359
  uniform float time;
  varying vec2 vUv;
  uniform float aspect;
  
  
  
  void main () {
    float t = time * 2. * PI /4.;
    vec3 colorA = sin(t) +vec3(1.0,0.0,0.0);
    vec3 colorB = vec3(0.0,1.0,0.0);

    vec2 nuUV = vUv - vec2(0.5);
    nuUV.x *= aspect;
    float dist = length(nuUV);

    float alpha = smoothstep(00.5,0.25,dist);

    vec3 color = mix(colorA,colorB,vUv.y+ vUv.x * sin(t));
    
    // gl_FragColor = vec4(color, dist > 0.25 ? 0.0 : 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({width,height}) => width / height,
    }
  });
};

canvasSketch(sketch, settings);

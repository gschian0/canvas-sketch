const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  // dimensions: [512,512],
  animate: true,
  // duration: 4,
  fps: 24,
};

// Your glsl code
const frag = glsl(/*glsl */`
  
  precision highp float;
  #define PI 3.14159265359
  uniform float playhead;
  uniform float time;
  varying vec2 vUv;
  uniform float aspect;
  
  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');
  #pragma glslify: fbm3d = require('glsl-fractal-brownian-noise/3d') 
  
  void main () {
    vec2 nuUV = vUv -0.5;
    float t = time * 0.5;
    nuUV.x *= aspect;
    float n = 22.*noise(vec3(nuUV,time*PI*.005));
    n *= 2.*noise(vec3(7.*nuUV,time*PI));
    float dist = length(nuUV);
    float alpha = smoothstep(0.45,0.435,dist);
    vec3 color = hsl2rgb(
      .1 +n * .3 ,
      0.5 + n *.003,
      0.4 + n *.005
    );
    gl_FragColor = vec4(color*1.-fbm3d(vec3(30.*nuUV*0.4, t*playhead*2.*PI), 1), alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: false,
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      playhead: ({ playhead }) => playhead,
      time: ({ time }) => time,
      aspect: ({width,height}) => width / height,
    }
  });
};

canvasSketch(sketch, settings);

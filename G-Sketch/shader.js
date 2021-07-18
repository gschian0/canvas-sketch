const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;

  uniform float time;
  varying vec2 vUv;
  vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
  }
  void main () {
    vec2 nuUV = fract(3.*abs(vUv - 0.5));
    nuUV = rotate(nuUV, time*.5);
    nuUV.x = sin(1.*nuUV.x*3.14);
    nuUV.y += cos(1.*nuUV.y*3.14);
    nuUV = vec2(length(nuUV),atan(nuUV.y,nuUV.x)*1.-time*3.14);
    
    nuUV *= sin(0.4*nuUV.x*3.14);
    nuUV = rotate(nuUV, time*.100);
    
    vec3 color = 0.5 + 0.5 * sin(time + nuUV.xyy + vec3(0.0, 2.0, 4.0));
    float d = 1.-fract(10.*length(vUv-vec2(0.5)));
    float circle = 1.-step(abs(2.*sin(0.9+time*.5)+0.3),d);
    gl_FragColor = vec4(color*circle, 1.0);
    //gl_FragColor = vec4(color, 1.0);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time
    }
  });
};

canvasSketch(sketch, settings);

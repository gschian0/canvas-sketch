// const canvasSketch = require('canvas-sketch');
import {canvasSketch} from 'canvas-sketch';
import {lerp} from 'canvas-sketch-util/math';
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  
  const createGrid = () => {

    const palette = random.pick(palettes).slice(0,6);
    const palette2 = random.pick(palettes).slice(0,4);
    // console.log(palatte);

    const points = [];
    const count = 150;
    for (let x = 0; x < count; x++) {
      for ( let y = 0; y < count; y++){
        const u = x/(count-1);
        const v = y/(count-1);
        points.push({
          color : random.pick(palette),
          outcolor : random.pick(palette2),
          radius : Math.abs(random.gaussian()*0.006),
          position: [u,v],
        });
      }
    }
    return points;
  }
  random.setSeed(random.value()*30);  
  console.log (random.getSeed())
  const points = createGrid().filter(() => random.value() > 0.9);
  const margin = 100;
  // console.log(points);

  

  return ({ context, width, height }) => {
    context.fillStyle = 'lightgreen';
    context.fillRect(0, 0, width, height);
    let idx;
    points.forEach((data) => {
      const {
        position,
        radius,
        color, 
        outcolor
      } = data;
      const [u, v ] = position;

      const x = lerp(margin, width-margin, u);
      const y = lerp(margin, height-margin,v );
      context.beginPath();
      context.arc(x,y,radius*width,Math.PI /(x %0.6) * random.value(0,5) , false);
      context.strokeStyle = outcolor
      context.lineWidth = 30;
      context.fillStyle = color
      context.stroke();
      context.fill();
      random.setSeed(random.gaussian())
      idx ++;
    });
};
}

canvasSketch(sketch, settings);

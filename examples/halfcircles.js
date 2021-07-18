// const canvasSketch = require('canvas-sketch');
import {canvasSketch} from 'canvas-sketch';
import {lerp} from 'canvas-sketch-util/math';
const random = require('canvas-sketch-util/random')


const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  
  const createGrid = () => {
    const points = [];
    const count = 150;
    for (let x = 0; x < count; x++) {
      for ( let y = 0; y < count; y++){
        const u = x/(count-1);
        const v = y/(count-1);
        points.push({
          radius : Math.abs(random.gaussian()*0.006),
          position: [u,v],
        });
      }
    }
    return points;
  }
  random.setSeed(333);  
  const points = createGrid().filter(() => random.value() > 0.7);
  const margin = 100;
  // console.log(points);

  

  return ({ context, width, height }) => {
    context.fillStyle = 'lightgreen';
    context.fillRect(0, 0, width, height);
    
    points.forEach((data) => {
      const {
        position,
        radius
      } = data;
      const [u, v ] = position;

      const x = lerp(margin, width-margin, u);
      const y = lerp(margin, height-margin,v );
      context.beginPath();
      context.arc(x,y,radius*width,Math.PI /(x %0.9) , false);
      context.strokeStyle = 'blue'
      context.lineWidth = 3;
      context.fillStyle = 'pink'
      context.stroke();
      context.fill();
      
    });
};
}

canvasSketch(sketch, settings);

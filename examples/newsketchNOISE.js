// const canvasSketch = require('canvas-sketch');
import {canvasSketch} from 'canvas-sketch';
import {lerp} from 'canvas-sketch-util/math';
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ],
  suffix: random.getSeed(),
};
// random.setSeed(27.819412707769153);

const palettebg = random.pick(palettes).slice(0,4);
const bg = random.pick(palettebg);

const sketch = () => {
  
  const createGrid = () => {

    const palette = random.pick(palettes).slice(0,4);
    const palette2 = random.pick(palettes).slice(0,1);
    // console.log(palatte);
    // random.setSeed(18.875774715830815);
    const bg = random.pick(palette);

    const points = [];
    const count = 77;
    for (let x = 0; x < count; x++) {
      for ( let y = 0; y < count; y++){
        const u = x/(count-1);
        const v = y/(count-1);
        const radius = Math.abs(Math.sin(random.noise2D(u,v))*0.04);
        points.push({
          color : random.pick(palette),
          outcolor : random.pick(palette2),
          //radius : Math.abs(random.gaussian()*0.006),
          radius,
          position: [u,v],
        });
      }
    }
    return points;
  }
  random.setSeed(random.value()*30);  
// random.setSeed(27.819412707769153);
  // random.setSeed(18.875774715830815);
  console.log ('circle random ' + random.getSeed())
  const points = createGrid().filter(() => random.value() > 0.53);
  //const points = createGrid()
  const margin = 100;
  // console.log(points);

  

  return ({ context, width, height }) => {
    context.fillStyle = bg
    context.fillRect(0, 0, width, height);
    let idx;
    points.forEach((data,index) => {
      const {
        position,
        radius,
        color, 
        outcolor
      } = data;
      const [u, v ] = position;
      context.save();
      context.rotate(index*Math.PI/4)
      const x = lerp(margin, width-margin, u);
      const y = lerp(margin, height-margin,v );
      // context.beginPath();
      //context.arc(x,y,radius*width,Math.PI /(x %10) * random.value(0,9) , false);
      context.fillRect(x,y,radius*width*2,radius*height*2)
      context.restore();
      context.strokeStyle = outcolor
      context.lineWidth = 30;
      context.fillStyle = color
      context.stroke();
      context.fill();
      random.setSeed(random.gaussian())
      
    });
};
}

canvasSketch(sketch, settings);

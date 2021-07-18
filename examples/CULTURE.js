// const canvasSketch = require('canvas-sketch');
import {canvasSketch} from 'canvas-sketch';
import {lerp} from 'canvas-sketch-util/math';
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};
// random.setSeed(27.819412707769153);

const palettebg = random.pick(palettes).slice(0,2);
const bg = random.pick(palettebg);

const sketch = () => {
  
  const createGrid = () => {

    const palette = random.pick(palettes).slice(0,4);
    const palette2 = random.pick(palettes).slice(0,4);
    // console.log(palatte);
    const bg = random.pick(palette);

    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for ( let y = 0; y < count; y++){
        const u = x/(count-1);
        const v = y/(count-1);
        const radius = Math.abs(random.noise2D(u,v))*0.04;
        points.push({
          color : random.pick(palette),
          outcolor : random.pick(palette2),
          //radius : Math.abs(random.gaussian()*0.006),
          radius,
          position: [u,v],
          rotation: random.noise2D(u,v),
        });
      }
    }
    return points;
  }
  random.setSeed(random.value()*30);  
// random.setSeed(27.819412707769153);
  console.log ('circle random' + random.getSeed())
  const points = createGrid().filter(() => random.value() > 0.5);
  //const points = createGrid()
  const margin = 100;
  // console.log(points);

  

  return ({ context, width, height }) => {
    context.fillStyle = bg
    context.fillRect(0, 0, width, height);
    let idx;
    points.forEach((data) => {
      const {
        position,
        radius,
        color, 
        outcolor,
        rotation
      } = data;
      const [u, v ] = position;

      const x = lerp(margin, width-margin, u);
      const y = lerp(margin, height-margin,v );
      context.beginPath();
    //   context.save()
      context.rotate(Math.PI/2);
      context.arc(x,y,radius*width/2.,Math.PI /(x %10) * random.value(0,9) , false);
      context.strokeStyle = outcolor
      context.lineWidth = 30;
      context.fillStyle = color
      context.stroke();
    //   context.restore();
    context.save();
      context.fill();
      random.setSeed(random.gaussian())
      context.fillStyle = outcolor;
      context.font = `${radius*width*2}px "arial"`
      context.translate(x,y);
      context.rotate(rotation);
      context.fillText('CULTURE',0,0);
      context.restore();
    });
};
}

canvasSketch(sketch, settings);

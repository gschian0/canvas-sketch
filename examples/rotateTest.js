const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048,2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';
    //context.translate(width/2,height/2);
    let size = width;
    for(let i = size;i > 1; i -= 1){
      context.translate(width/2,height/4)
      context.rotate(Math.PI/0.9)
      if(i %2){
        
        context.fillStyle = 'black';
      } else if (i%4) {
        context.fillStyle = 'lightgreen';
      } else   {
        context.fillStyle = 'yellow'
      }
      context.fillRect(0,0, i, i);
  }
    // context.fillRect(0,0,width/i,height/i);
    
  };
};

canvasSketch(sketch, settings);

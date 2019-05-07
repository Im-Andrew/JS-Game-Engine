
var LMaker = LayerMaker = (function(){
  function Layer(canvas, x, y, dVal, objects){
    this.super();
    this.position = [x,y];
    this.width = canvas.width;
    this.height = canvas.height;
    this.depth(dVal);
    this.canvas = canvas;
    this.objectList = objects;
  }
  make.start(Layer);
  Layer.prototype.draw = function(){
    ctx.drawImage(this.canvas, this.position[0], this.position[1]);
  };

  return function(){
    /*
      maintains a depth manager of objects,
        splits them up by depth
        once "baked",
          creates a new canvas for every layer
          draws each object to those layers
          returns an array of layer objects
    */
    this.layers = new DepthManager();
    this.bake = function(){
      var depths = this.layers.getIndexes();
      var treeList = this.layers.getLayers(depths);
      var layerList = [];
      treeList.forEach(function(objects, index){
        // Create the dimensions for the canvas
        var maxX = -100000;
        var minX = +100000;
        var maxY = -100000;
        var minY = +100000;
        objects.forEach(function(object){
          maxX = Math.max(maxX, object.position[0]);
          maxY = Math.max(maxY, object.position[1]);
          minX = Math.min(minX, object.position[0]);
          minY = Math.min(minY, object.position[1]);
        });

        // Create the canvas
        var canvas = document.createElement('canvas');
        canvas.width = maxX - minX + 32;
        canvas.height = maxY - minY + 32;

        // Draw to the canvas
        var ctxP = ctx;
        ctx = canvas.getContext('2d');
        ctx.translate(-minX, -minY);
        objects.forEach(function(object){
          object.draw();
        });
        ctx = ctxP;

        // create the new layer
        layerList.push( new Layer(canvas, minX, minY, depths[index], objects ) );
      });
      this.layers.destroy();
      return layerList;
    };
  };
})();

function DepthManager() {
  var uniqueKey = "DM" + DepthManager.prototype.version,
  ukD = uniqueKey + "_d",// depth, y position
  ukX = uniqueKey + "_x",// x position
  ukA = uniqueKey + "_a",// available for use
  depthContainer = {},
  depthsList = [];
  DepthManager.prototype.version += 1;

  this.addArray = function(arr, depth){
    var dArray, obj;
    while(!depthContainer.hasOwnProperty(depth)){
      this.add(arr[0],depth);
      arr.shift();
    }
    for( var i = 0; i < arr.length; i ++ ){
      obj = arr[i];
      // Can only create it once
      if( obj[ ukA ] )continue;
      obj[ ukA ] = true;
      // Lets push it onto an already existing depth
      dArray = depthContainer[depth];
      dArray.push(obj);
      obj[ ukD ] = depth;
      obj[ ukX ] = dArray.length;
    }
  };
  this.add = function (obj, depth) {
      var dArray;
      // Can only create it once
      if( obj[ukA] )return console.warn("Can't be placed twice");
      obj[ukA] = true;

      // Lets push it onto an already existing depth
      if (depthContainer.hasOwnProperty(depth)) {
          dArray = depthContainer[depth];
          dArray.push(obj);
          obj[ukD] = depth;
          obj[ukX] = dArray.length;
      } else {// make a new depth
          dArray = [obj];
          depthContainer[depth] = dArray;
          obj[ukD] = depth;
          obj[ukX] = dArray.length;

          // Add it into depths list, sort it
          depthsList.push(depth);
          depthsList.sort();
      }
  };

  this.remove = function (obj) {
      var pos = obj[ ukD ];
      if(!obj[ ukA ])return console.warn('not in the depth');
      obj[ ukA ] = false;
      var dArray = depthContainer[pos];
      if (dArray.length === 1) {
          var delIndex = depthsList.indexOf(pos);
          depthsList.splice(delIndex,1);
          return delete depthContainer[pos]
      }
      var posX = obj[ ukX ]-1;
      for(var i = posX; i < dArray.length; i ++ ){
          dArray[i][ ukX ]--;
      }
      dArray.splice(posX,1);
  };

  this.jump = function(obj, depth){
      this.remove(obj);
      this.add(obj,depth);
  };

  this.flat = function(){
      var DC = depthContainer;
      return depthsList.reduce(function(flat, prop){
         return flat.concat( DC[prop]);
      }, []);
  };

  // Get an entire layer
  this.getLayer = function(layer){
    return (depthContainer[layer]||[]).slice();// get copy of layer
  }

  //Returns the indexes
  this.getIndexes = function(){
    return depthsList.slice();
  };

  // Gets a list of layers
  this.getLayers = function(layers){
    var getLayer = this.getLayer,
        fin = [];
    layers.forEach( function(layer){
      fin.push(getLayer(layer));
    });
    return fin;
  }

  // Get an objects depth value
  this.objectDepth = function(obj){
    return obj[ukD];
  }

  // Deletes this depth manager and succesfully removes memory stored in objects and removes references to those objects.
  this.destroy = function(){
    var objects = this.flat();
    objects.forEach(function(object){
      delete object[ukD];
      delete object[ukX];
      delete object[ukA];
    });
    depthContainer = {},
    depthsList = [];
  }

  this.exists = function(obj){
    return (obj[ukA] === true);
  };
}

DepthManager.prototype.version = 0;

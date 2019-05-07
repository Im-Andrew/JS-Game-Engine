// Polly fill
var requestAnimFrame = (function(callback) {
  return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        });
})();



var flow = lemonFlow = new (function(){
  var preDraw = this.cleanCanvas,
      postDraw = emptyFunction;
  var base = this;
  function emptyFunction(){};//placeholder for empty callbacks
  this.objects = [];
  this.drawList = new DepthManager();
  this.objectList = new DepthManager();

  //## General System code
  function pushOperator(obj){
    base.objects.push(obj);
    base.objectList.add(obj, obj.constructor);
  }
  function pushDisplay(obj){
    base.drawList.add(obj, obj.depthVal);
    obj.depth = handleDepth;
  }

  //## Persistence System
  //persistent container
  var persistentInstances = {
    "object":[],
    "operator":[],
    "display": []
  };

  // Adds persistent instances to the system
  function persistentAdd(obj, sector){
    if( !obj.persistent ){return;}
    switch(sector){
      case "object":
        persistentInstances[sector].push(obj);
      break;
      case "operator":
      case "display":
        if(!~persistentInstances["object"].indexOf(obj) ){
          persistentInstances[sector].push(obj);
        }
      break;
      default:
        console.error("No such object category.")
      break;
    }
  }
  // Removes an instance from the persistent container and returns the object, or undefined
  function persistentRemove(obj){
    var arr = persistentInstances["object"];
    var ind = arr.indexOf(obj);
    if(~ind){
      return arr.splice(ind,1);
    }
    arr = persistentInstances["operator"];
    ind = arr.indexOf(obj);
    if(~ind){
      return arr.splice(ind,1);
    }
    arr = persistentInstances["display"];
    ind = arr.indexOf(obj);
    if(~ind){
      return arr.splice(ind,1);
    }
    return undefined;
  }
  // After the system has been reset the persistent instances must be re-added for functionality.
  function persistentRestock(){
    // Push objects
    var arr = persistentInstances["object"];
    arr.forEach(function(obj){
      pushOperator(obj);
      pushDisplay(obj);
    });
    // Push operators
    arr = persistentInstances["operator"];
    arr.forEach(function(obj){
      pushOperator(obj);
    });
    // Push displays
    arr = persistentInstances["display"];
    arr.forEach(function(obj){
      pushDisplay(obj);
    });
  };


  //## Exists system (true or false)
  this.objectExists = function(obj){
    return (this.operatorExists(obj)&&this.displayExists(obj));
  };
  this.operatorExists = function(obj){
    return (this.objectList.exists(obj));
  };
  this.displayExists = function(obj){
    return (this.drawList.exists(obj));
  };

  //##General Loop Logic.
  this.cleanCanvas = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset
  }
  //Starts the entire system
  this.init = function(context, preMan, priMan){
    ctx = context;// Cheaply globalize ctx :P
    Input.init();
    preDraw = preMan || preDraw;
    postDraw = priMan || postDraw;
    base.main();
  };

  this.update = function(){
    base.objects.forEach(function(piece){
        piece.update();
    });
  }

  this.draw = function(){
    preDraw();
    this.drawList.flat().forEach(function(inp){
        inp.draw();
    });
    postDraw();
  };

  this.main = function(){
    base.update();
    base.draw();
    Input.next();
    requestAnimFrame( base.main );
  };


  //##Creating instances

  // Change an objects regular depth handling to manipulate inside the system
  var handleDepth = function(depth){
    if( depth ){
      depthVal = depth;
      return flow.drawList.jump(this,depth);
    }
    return flow.drawList.objectDepth(this);
  }

  // Add an essential object to the system
  this.createObject = function(obj){
    if(this.objectExists(obj)){return;}
    persistentAdd(obj,"object");
    this.createOperator(obj);
    this.createDisplay(obj);
    return obj;
  };
  this.qAdd = this.createObject;

  // An an object to solely operate on the frame
  this.createOperator = function(obj){
    if( this.operatorExists(obj)){return;}
    persistentAdd(obj,"operator");
    obj.update = obj.update || emptyFunction;
    pushOperator(obj);
    return obj;
  };

  //add an object to the draw buffer
  this.createDisplay = function(obj){
    if( this.displayExists(obj)){return;}
    persistentAdd(obj,"display");
    // Allow objects to handle their depths
    obj.draw = obj.draw || emptyFunction;
    pushDisplay(obj);
    return obj;
  };

  //Delete an object from the system
  this.remove = function(obj){
    var index = this.objects.indexOf(obj);
    if( ~index ){
      this.objects.splice(index, 1);
    }
    this.drawList.remove(obj);
    this.objectList.remove(obj);
    persistentRemove(obj);
  };


  this.reset = function(){
    delete this.objects;
    this.drawList.destroy();
    this.objectList.destroy();
    this.objects = [];
    this.drawList = new DepthManager();
    this.objectsList = new DepthManager();
    persistentRestock();
  };
})();

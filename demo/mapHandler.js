function mapAdd(obj,  LM){
  obj.x = Number.parseInt(obj.x);
  obj.y = Number.parseInt(obj.y);
  switch(obj.t){
    case 'B':
      var o = new Block(obj.x, obj.y);
      flow.createOperator(o);
    break;

    case 'player':
      var o = new Player(obj.x, obj.y);
      flow.createObject(o);
    break;

    case 'S':
      var o = new Spike(obj.x, obj.y, media.image(obj.I));
      flow.createObject(o);
    break;

    case 'T':
      var o = new Tile(obj.x, obj.y, media.image(obj.I));
      LM.layers.add(o, obj.D*-1);
    break;

    default:
      console.warn('no such type:' + obj.type);
    break;
  }
}

// Load the map
var server =  confirm("Load server map?\n\nYour browser can't load from your local storage unless it's hosted.\n\n\nEdit this message in mapHandler.js line 32.");
if( server )
  var mapPath = 'https://api.myjson.com/bins/3b686';
else {
  var mapPath = "demo/levelMap.json";
}
function loadMap(){
  loadJSON(mapPath, function(data){
    var lmake = new LMaker();
    data.forEach(function(obj){ mapAdd(obj, lmake);});
    lmake.bake().forEach(function(layer){
      flow.createDisplay(layer);
    });
  }, function(){console.error('Error loading Map File')});
}

var GP;//for debugging

// Player Object
function Player(x,y){
    GP = this;
    this.super();
    this.position = [x,y];

    this.setSprites();
    this.cState = "standing";

    var width = this.sprite.getMap(0).cellWidth,
        height = this.sprite.getMap(0).cellHeight;
    this.box = new SAT.Box(new SAT.Vector(x,y), width, height).toPolygon();


    // Physics engine
    this.gravity = 0;
    this.vSpeed = .75;
    this.jumpSpeed = -10;
    this.jumps = 3;
    this.jumpsMax = 3;
    this.speed = 3;

    this.onX = this.position[0];
    this.onY = this.position[1];
}
make.start(Player);
Player.prototype.setSprites=function(){
  // the sprite manager
  this.sprite = new media.SpriteGroup(1);
  this.sprite.setSpeed(.18);

  // Definers of the sprites to be drawn
  this.facing = 1;
  this.moving = false;
  this.states = {};

  // Make Image Maps
  var stat = new media.IMap(media.image('playerStat'), 3, 2),
      walk = new media.IMap(media.image('playerWalk'), 6, 2),
      s = this.states;
  // Adding the sprites to the manager and setting states to their corresponding states
  s.standing  = this.sprite.addSingle(stat, {c:1, r:1});
  s.jumping   = this.sprite.addSingle(stat, {c:1, r:1, sx:1});
  s.falling   = this.sprite.addSingle(stat, {c:1, r:1, sx:2});
  s.walking   = this.sprite.addSprite(walk, {c:6, r:1});

};
Player.prototype.collidingWith = function(objArr, response){
  var box = this.box;
  return objArr.some(function(obj){
    return( SAT.testPolygonPolygon( obj.box, box, response) );
  });
};
Player.prototype.collidingWithAt = function(objArr, response, testX, testY){
  var pastX = this.position[0],
      pastY = this.position[1];
  this.posStat(testX, testY);
  var collision = this.collidingWith(objArr, response);
  this.posStat(pastX, pastY);
  return collision;
};
Player.prototype.pos = function(x,y){
    this.position[0] += x;
    this.position[1] += y;
    this.box.pos.x += x;
    this.box.pos.y += y;
};
Player.prototype.posStat = function(x,y){
    this.position[0] = x;
    this.position[1] = y;
    this.box.pos.x = x;
    this.box.pos.y = y;
};
Player.prototype.update = function(){
  var blocks = flow.objectList.getLayer(Block);
  var spikes = flow.objectList.getLayer(Spike);
  var response = new SAT.Response();

  // jump back from spikes
  if( this.collidingWith(spikes) ){
    media.sound('playerHurt').play();
    response.clear();
    this.posStat(this.onX, this.onY);
    while(!this.collidingWith(blocks, response)){
      response.clear();
      this.pos(0, 1);
    }
    this.pos(0, -1);
    this.gravity = 0;
    Input.keyboardClear();
  }

  this.moving = false;

  if( Input.isDown(Keys.RIGHT) ){
    this.facing = 1;
    this.moving = true;
    this.pos(this.speed, 0);
    while(this.collidingWith(blocks, response) ){
      response.clear();
      this.pos(-1, 0);
    }
  }else if( Input.isDown(Keys.LEFT) ){
    this.facing = 0;
    this.moving = true;
    this.pos(-this.speed, 0);
    while( this.collidingWith(blocks, response) ){
      response.clear();
      this.pos(+1, 0);
    }
  }
  if( Input.isPressed(Keys.UP) ){
    if( this.jumps > 0 ){
      this.gravity = this.jumpSpeed
      this.jumps --;
      media.sound('playerJump').play();
    }
  }
  a = this.collidingWith(blocks, response);
  this.gravity += this.vSpeed;
  this.pos(0, this.gravity );
  if( this.collidingWithAt(blocks, response, this.position[0], this.position[1]+this.gravity ) ){
    this.posStat( Math.round(this.position[0]), Math.round(this.position[1] + this.gravity) );
    if( this.gravity >= 0 ){
      this.jumps = this.jumpsMax;
      while( this.collidingWith(blocks, response) ){
        response.clear();
        this.pos(0, -1);
      }
    }else{
      while( this.collidingWith(blocks, response) ){
        this.pos(0, 1);
      }
    }

    this.gravity = 0;
  }

  //Set sprite state
  if( this.gravity === 0 ){
    if(!this.collidingWith(spikes, response)){
      response.clear();
      if( this.collidingWithAt(blocks, response, this.position[0], this.position[1]+1) ){
        response.clear();
        this.onX = this.position[0];
        this.onY = this.position[1];
      }
    }
    if( this.moving ){
      this.cState='walking';
    }else{
      this.cState = 'standing';
    }
  }else if( this.gravity<0 ){
    this.cState = 'jumping';
  }else if(this.gravity>1){
    this.cState = 'falling';
  }

  view.set(- Math.floor((this.position[0] )/544)*544, -Math.floor((this.position[1] )/544)*544 );
};
Player.prototype.draw = function(){
  this.sprite.set( this.states[this.cState] );
  this.sprite.draw( this.position[0], this.position[1], 0, this.facing);
};

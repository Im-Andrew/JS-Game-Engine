// mouse object
function Mouse(){
    this.super();
    this.radius = 3;
}
make.start(Mouse);
Mouse.prototype.update = function(){
    this.position[0] = mouseX;
    this.position[1] = mouseY;
};
Mouse.prototype.draw = function(){
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], this.radius, 0, 2*Math.PI);
    ctx.stroke();
};


// Basic Block
function Block(x,y){
    this.super();
    this.position = [x,y];
    this.box = new SAT.Box(new SAT.Vector(x,y), 31, 31).toPolygon();
}
make.start(Block);

// Basic Spike
function Spike(x,y, sprite){
    this.super();
    this.position = [x,y];
    this.sprite = sprite;
    this.box = new SAT.Box(new SAT.Vector(x,y), 31, 31).toPolygon();
}
make.start(Spike);
Spike.prototype.draw = function(){
  ctx.drawImage( this.sprite, this.position[0], this.position[1]);
};



// Basic Tiles
function Tile(x,y, sprite){
    this.super();
    this.position = [x,y];
    this.sprite = sprite;
}
make.start(Tile);
Tile.prototype.draw = function(){
  ctx.drawImage( this.sprite, this.position[0], this.position[1]);
};

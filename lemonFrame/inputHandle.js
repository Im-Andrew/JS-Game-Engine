var Keys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  A: 65,
  S:83,
  D:68,
  SHIFT: 16,
  CTRL: 17,
  SPACE:32,
  ENTER: 13,
  BACKSPACE:8,
  ESCAPE: 27,
  "0":48,
  "1":49,
  "2":50,
  "3":51,
  "4":52,
  "5":53,
  "6":54,
  "7":55,
  "8":56,
  "9":57,
  "a":65,
  "b":	66,
  "c":	67,
  "d":	68,
  "e":	69,
  "f":	70,
  "g":	71,
  "h":	72,
  "i":	73,
  "j":	74,
  "k":	75,
  "l":	76,
  "m":	77,
  "n":	78,
  "o":	79,
  "p":	80,
  "q":	81,
  "r":	82,
  "s":	83,
  "t":	84,
  "u":	85,
  "v":	86,
  "w":	87,
  "x":	88,
  "y":	89,
  "z":	90
};
var Input = InputHandle = {
  _holding: {},
  _pressed: {},
  _released: {},
  _wait: {},
  
  init: function(){
    window.addEventListener('keyup', function(event) { Input.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Input.onKeydown(event); }, false);
    window.addEventListener('mousemove', Input.updateMouse, false);
  },

  isPressed: function(keyCode){
    return this._pressed[keyCode];
  },

  isReleased: function(keyCode){
    return this._released[keyCode];
  },

  isDown: function(keyCode) {
    return this._holding[keyCode];
  },

  keyClear: function(keyCode){
    this._wait[event.keyCode] = true;
    delete this._holding[event.keyCode];
    delete this._pressed[event.keyCode];
    delete this._released[event.keyCode];
  },

  keyboardClear: function(){
    this._wait = this._holding;
    this._holding = {};
    this._pressed = {};
  },

  onKeydown: function(event) {
    if( !this._holding[event.keyCode] ){
      if( !this._wait[event.keyCode] ){
        this._pressed[event.keyCode] = true;
        this._holding[event.keyCode] = true;
      }
    }
  },

  onKeyup: function(event) {
    delete this._holding[event.keyCode];
    delete this._wait[event.keyCode];
    this._released[event.keyCode] = true;
  },

  next: function(){
    this._pressed = {};
    this._released = {};
  },


  /*Regarding mouse movement*/
  mouseX: 0,
  mouseY: 0,

  mousemove: function( evt ) {
    var rect = canvas.getBoundingClientRect();
    this.mouseX = evt.clientX - rect.left;
    this.mouseY = evt.clientY - rect.top;
  }

};

/*
  Whenever making an object for the main game object, it needs to be a child of some object that has
  the baseObjects traits.
*/
var make = objectClassing = new (function(){
  function Bobj(mDepth){
      this.depthVal = mDepth||0;
      this.persistent = false;
  };
  Bobj.prototype.depth = function(nd){
    if( Number.isNaN(nd) ){return this.depthVal;}
    return (this.depthVal = (nd || this.depthVal) );
  }
  Bobj.children = [];
  // Recursive child finding!
  function childrenTreeFind(assembler){
    return function(getSelf){
      var allChildren = [];
      if(getSelf){allChildren.push(assembler);}
      for(var i = 0; i < assembler.children.length; i ++ ){
        allChildren = allChildren.concat( assembler.children[i].prototype.getChildren(true) );
      }
      return allChildren;
    }
  }
  Bobj.prototype.getChildren = childrenTreeFind(Bobj);
  Bobj._parents = [];
  Bobj.prototype.childPlace = 0;

  function subClass( ChildObj, ParObj){
    //Lets extend the childObj by the parent object.
    ChildObj.prototype = Object.create(ParObj.prototype);
    ChildObj.prototype.constructor = ChildObj;

    // Super System
    ChildObj._parents = ParObj._parents.slice().concat([ParObj]);
    ChildObj.prototype.childPlace ++;
    //This system contains a list of each
      childStart = ChildObj.prototype.childPlace;
    ChildObj.prototype.super = function(){
        this.childPlace --;
        ChildObj._parents[this.childPlace].apply(this);
        if(this.childPlace === 0 ){
            this.childPlace = ChildObj.prototype.childPlace;
        }
    }

    //Make childrening system
    ChildObj.children = [];
    ChildObj.prototype.getChildren = childrenTreeFind(ChildObj);
    ParObj.children.push(ChildObj);
  };

  function base(ChildObj ){
    subClass(ChildObj, Bobj);
  }

  this.inherit = subClass;
  this.start = base;
  this.ALL = function(){
    return Bobj.getChildren();
  };
})();

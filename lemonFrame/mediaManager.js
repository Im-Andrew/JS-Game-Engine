var media = MediaMaster = new (function(){
  //## PROPERTIES
  var images = {};
  var sounds = {};

  //## OBJECTS
  this.sourceManager = new (function(){
    this.base = ['',''];
    this.images = {};
    this.sounds = {};
    toLoad = -1;
    this.done = null;// done(error);
    // loading all of the
    this.loadAll = function(imgB, sndB){
      var base = ['',''];
      base[0] = imgB||this.base[0];
      base[1] = sndB||this.base[1];
      toLoad = Object.keys(this.images).length + Object.keys(this.sounds).length;
      console.log('LOADING: '+this.toLoad);
      var loaded = this.loaded,
          done = this.done,
          errorHandle = function(e){
            console.warn("RESOURCE COULD NOT LOAD");
            done(e);
          };

      // load Images
      withKeys( this.images, function(path, key){
        var img = new Image();
        img.src = base[0]+path;
        images[key] = img;
        img.onload = loaded;
        img.onerror = errorHandle
      });

      // load Sounds
      withKeys( this.sounds, function(path, key){
        var snd = new Audio();
        snd.src = base[1]+path;
        sounds[key] = snd;
        instanceVolume[key] = 1;
        snd.addEventListener('canplaythrough', loaded, false);
        snd.onerror = errorHandle
      });

    };
    // This is called everytime a resource is loaded, "done" will be called when
    var done = this.done;
    this.loaded = function(){
      toLoad --;
      if(toLoad == 0){
        console.log('media loaded.');
        if( media.sourceManager.done ){
          media.sourceManager.done(false);
          // Free self and don't let this ever be manipulated again
          delete MediaMaster.sourceManager;
        }
      }
    }
  })();

  // Master Controll of sounds
  var liveSounds = [],
      instanceVolume = {},
      globalVolume = 1,
      emptyFunction = function(){};
  var SB = {muted: false, previousVolume:1};
  this.soundBatch = this.sBatch = SB;
  SB.toggleMute = function(){
    if( SB.muted === false ){
      // mute everything
      liveSounds.forEach(function(snd){
        snd.previousVolume = snd.volume;
        snd.volume = 0;
      });
      SB.previousVolume = globalVolume;
      globalVolume = 0;
      return (SB.muted = true);
    }
    //unmute everything
    liveSounds.forEach(function(snd){
      snd.volume = snd.previousVolume;
      delete snd.previousVolume;
    });
    globalVolume = SB.previousVolume;
    return (SB.muted = false);
  };
  // Hide specific soundBatch functionality
  (function(){
    function killSound(snd){
      snd.pause();
      snd.onended();
      snd.currentTime = 0;
    }
    function globalVolumeChange(v){ globalVolume = Math.min(!SB.muted, Math.pow(v,2)); }
    function globalStop(){liveSounds.forEach(function(snd){killSound(snd)});}
    function globalPause(){ liveSounds.forEach(function(snd){snd.pause();}); }
    function globalGetLive(){return liveSounds.slice();}
    //Applies a callback to anything that passes the filter
    function instanceApply(name, callback){
      var match = sounds[name].src;
      liveSounds.forEach(function(snd){
        if( snd.src !== match ) return;
        callback(snd);
      });
    }


    SB.volume = function(name, v){
      if(!name)return globalVolumeChange(v);
      instanceVolume[name] = Math.pow(v,2);
    };
    SB.stop = SB.kill = function( name ){
      if(!name)return globalStop();
      instanceApply(name, killSound);
    };
    SB.pause = function( name ){
      if(!name)return globalPause();
      instanceApply(name, function(snd){ snd.pause(); });
    }
    SB.getLive = function( name ){
      if(!name)return globalGetLive();
      return liveSounds.filter(function(snd){ return( snd.src === match );});
    }
  })();

  //## CLASSES
  // Image maps contain how many cells there are in an image
  function ImageMap(image, horCells, verCells){
    this.image = image;
    this.horCells = horCells;
    this.verCells = verCells;
    this.cellWidth = image.width/horCells;
    this.cellHeight = image.height/verCells;
  }
  this.IMap = this.ImageMap = ImageMap;
  // Sprite Groups make it easer to animate or single out drawing tiles from image sheets
  function SpriteGroup(){
    // Animations
    function ImageFlip(horCells, verCells, shiftX, shiftY){
      this.shiftX = shiftX || 0;
      this.shiftY = shiftY || 0;
      this.horCells = horCells;
      this.verCells = verCells;
      this.imageIndex = 0;
    }
    ImageFlip.prototype.sourceY = function(){
      return this.shiftY + Math.floor(this.imageIndex/this.horCells);
     };
    ImageFlip.prototype.sourceX = function(){
      return this.shiftX + Math.floor(this.imageIndex%this.horCells);
    };
    ImageFlip.prototype.next = function(index, speed){
      return (this.imageIndex = ( index + speed )%(this.horCells*this.verCells));
    };


    return function(speed){
      this.imageIndex = 0;
      this.length = 0;
      this.spriteIndex = null;
      this.speed = speed||0;
      this.sprites = [];

      //Add a sprite to this group
      this.addSprite = function(iMap, flip){
        flip.c = flip.c || flip.columns || 1;
        flip.r = flip.r || flip.rows || 1;
        flip.sx = flip.sx || flip.shiftX || 0;
        flip.sy = flip.sy || flip.shiftY || 0;
        var sprite = {
          image: iMap,
          flipper: new ImageFlip(flip.c, flip.r, flip.sx, flip.sy)
        };
        this.sprites.push(sprite);
        this.spriteIndex = this.spriteIndex||sprite;
        return this.sprites.length-1;
      };
      this.addSingle = function(iMap, flip){
        var index = this.addSprite(iMap, flip);
        this.turnOff(index);
        return index;
      }

      this.turnOff = function(i){
        var flipper = this.sprites[i].flipper;
        flipper.sourceY = function(){ return this.shiftY; };
        flipper.sourceX = function(){ return this.shiftX; };
        flipper.next = function(){ return (this.imageIndex = 0); };
      };
      this.set = this.is = function(i){
        this.spriteIndex = this.sprites[i];
      };
      this.setSpeed = function(spd){
        this.speed = spd;
      }
      this.getMap = function(i){
        return this.sprites[i].image;
      }
      this.setImageIndex = function(i){
        this.imageIndex = i;
      };

      // Next image index
      this.next = function(){
        var flipper = this.spriteIndex.flipper;
        this.imageIndex = flipper.next(this.imageIndex, this.speed);
      };

      // drawing
      this.draw = function(x, y, shiftX, shiftY){
        shiftX = shiftX || 0;
        shiftY = shiftY || 0;
        var flipper = this.spriteIndex.flipper,
            iMap = this.spriteIndex.image;
        var sX = shiftX + flipper.sourceX(),
            sY = shiftY + flipper.sourceY();
        ctx.drawImage( iMap.image, sX*iMap.cellWidth, sY*iMap.cellHeight, iMap.cellWidth, iMap.cellHeight, x, y, iMap.cellWidth ,iMap.cellHeight);
        this.next();//animate and accustom cells to match sprite index
      };

    };
  }
  this.SpriteGroup = SpriteGroup();


  //## FUNCTIONS
  function drawSingle(iMap, shiftX, shiftY, x, y){
    var sX = shiftX*iMap.cellWidth,
        sY = shiftY*iMap.cellHeight;
    ctx.drawImage( iMap.image, sX, sY, iMap.cellWidth, iMap.cellHeight, x, y, iMap.cellWidth ,iMap.cellHeight);
  }
  this.drawMap = this.dMap = drawSingle;




  prototypePlay = Audio.prototype.play;//keep a reference

  // Getting  sounds
  this.sound = function(name){
    var snd = new Audio( sounds[name].src );

    snd.volume = instanceVolume[name];
    snd.play = function(){
      var that = this;// used for removing "liveSounds" this conflict.
      that.volume *= globalVolume;
      prototypePlay.apply(that);
      liveSounds.push(that);
      this.onended = function(){ liveSounds.splice( liveSounds.indexOf(that), 1 );};
    };
    return snd;
  };
  // Getting graphics
  this.image = function(name){
    return images[name];
  };
});

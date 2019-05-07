#lemonFrame
A JavaScript Game Framework


#__Documentation__


## __Building Classes__
___
##`Master Class`: __objectClassing__ <small>aka</small> __make__
##### Description: <small>This class controlls the object hierachy of the system. Every time you want to make a lemonWork compatible object you will need to inherit at least once from this class.</small>
###__Functions__
 - __`start(func)`__: This will be used on any class that requires the most basic support with lemonwork.
    ####ARGUMENTS
  - `func`: The name of your class. NOT A STRING.

 ######__Example__
    ____
            function Animal(family){
                // ALWAYS call this.super().
                this.super([depth]);// depth is an optional paramater for objects using start.
                this.family = family||"no family";
                this.x = 0;
                this.y = 0;
            }
            make.start(Animal);//Animal now a child of the base object
            Animal.prototype.getName = function(){return this.family;};
 - __`inherit(child, parent)`__: Any time you want to inherit attributes from another class, call this. The syntax is very similar to `start(func)`. &nbsp;<small>__note:__ parent must have the base lemonwork object somewhere in its prototype chain.</small>
    ####ARGUMENTS
  - `child`: The name of your child class <small>(_the derivative_)</small>. NOT A STRING.
  - `parent`: The name of the parent class <small>(_the integral_)</small>. NOT A STRING.

 ######__Example__
    ____
            function Feline(type){
                this.super("Feline");//or you can do this.super() and set family explicitly.
                this.type = type;
            }
            // we can inherit from Animal(also, feline is now a child of animal && the base)
            make.inherit(Feline, Animal);
            Feline.prototype.getType = function(){retrun this.type;};

            function Cat(name){
                this.super("house cat");// always call super. Type is now cat
                this.name = name;
            }
            // Now Cat is a child of Feline, Animal, & the base object.
            // Has all their funcitonality
            make.inherit(Cat, Feline);

 - __`ALL()`__: Returns a list of every single Class made in the lemonWork system.  
 ######__Example__
    ____
        make.ALL();// > [Animal, Feline, Cat]

###__The base class__
 - __Quick Description:__ <small>Whenever you use the inheriting functions, your class inherits the following functionalities</small>
 - __`getChildren()`__: This function will return the name of every class that has inherited from it.
 ######__Example__
    ____
        //From an instance of Animal:
        var unkownAnimal = new Animal();
        unkownAnimal.getChildren();//> [Feline, Cat]
        //Without instantiating, just from the class itself
        Animal.prototype.getChildren();//> [Feline, Cat]
__note:__ Animal is actually an abstract class, and we would never instantiate it, but this is a demonstration.
 - __`depth([depth])`__: Gets or sets the value of the objects depth. (this is appart of the layer system).
    ####ARGUMENTS
  - `[depth]`: If you want to set the depth, apply a value.
  - ___note:___ Depth is ordered by the function `array.sort()` so strings are valid, but not recommended.

 ######__Example__
    ____
        var kitty = new Cat('kitty');
        kitty.depth()// is always zero unless the constructor changes it after calling Super();
        kitty.depth(3);
        kitty.depth();// >> 3

<br/><br/>
## __Input Handling__
___
##`Master Object`: __Keys__  
##### Description: <small>This object is simply a container of key codes. This will help handling input in conjunction with the `Input` object.</small>
###__Stored Values__
 - Common functional keys
     -   LEFT, UP, RIGHT, DOWN, SHIFT,  CTRL,  SPACE,  ENTER,  BACKSPACE,  ESCAPE,
 - All Letters <small>*note:* __use lowercase__</small>
 - All Numbers <small>(not numpad, those can be implemented though)</small>

##`Master Object`: __InputHandle__ <small>aka</small> __Input__
##### Description: <small>This object handles all input with extremely accurate responsiveness. No need to worry about the odd glitches you may find when working with the keyboard events, this handles most if not all your dirt work.</small>
###__Functions__
 - __`isPressed(keyCode)`__: Returns true or false depending on if a key was just pressed.
    ####ARGUMENTS
  - `keyCode`: Either a hard keycode of your choosing, or from the `Keys` object.  

 ######__Example__
    ____
        console.log(Input.isPressed(Keys["a"]));/* true or false on pressed state */

 - __`isReleased(keyCode)`__: Returns true or false depending on if a key was just released.
    ####ARGUMENTS
  - `keyCode`: Either a hard keycode of your choosing, or from the `Keys` object.  

 ######__Example__
    ____
        console.log(Input.isReleased(Keys["a"]));/* true or false on released state */

 - __`isDown(keyCode)`__: Returns true or false depending on if a key is down.
    ####ARGUMENTS
  - `keyCode`: Either a hard keycode of your choosing, or from the `Keys` object.  

 ######__Example__
    ____
        console.log(Input.isDown(Keys["a"]) );/* true or false on 'holding or down' state */

 - __`keyClear(keyCode)`__: Clears the state of a key.
    ####ARGUMENTS
  - `keyCode`: Either a hard keycode of your choosing, or from the `Keys` object.  

 ######__Example__
    ____
        Input.keyClear(Keys["a"]);

 - __`keyboardClear()`__: Clears the entire keyboard state.
 ######__Example__

    ____
        Input.keyboardClear();

###__Values__
 - mouseX: TThe location the mouse's X coordinate based on canvas position. <small>window mouseX - canvas.left </small>
 - mouseY: The location the mouse's Y coordinate based on canvas position. <small>window mouseY - canvas.top </small>

####__NOTE__: <small>The press and release functions are cleared at the end of every loop based on the input's function `next()`. The listeners are also started by calling `Input.init()`. Calling init is left to you to decide, use it if you need input handling.</small>

<br/><br/>
## __Media Usage__
___  
##`Master Object`: __MediaMaster__ <small>aka</small> __media__
##### Description: <small>This object handles all media elements **AND** _loading_ without any hassle. It comes with a global sound control system for easier control and handling. For images, there are two classes that will make drawing from image-sheets much more convenient and make Animations an easy task. </small>
##__Objects__
###__MediaMaster`.sourceManager`__
***WARNING:***`This object will be completely removed from the program after loadAll has been executed.`
 - ####Functions
  - __`loadAll(Path, Path)`__: This will load all of your resources set inside the image and sound object.
  - __Arguments:__
    - #####0`Path`: Images path, where you locate all of your images
    - #####1`Path`: Sounds path, where you locate all of your sounds

    ######__Example__
    ____
            media.sourceManager.loadAll('./sounds/', './images/');
 - ####Properties
  - __`done(error)`__: This is a property of the resource manager that will be executed after loadAll() has finished and every resource was loaded.
  - __Arguments:__
    - `Error`: Returns an error object, or it will return a falsey value.

    ######__Example__
    ____
            media.sourceManager.done = function(err){
                if(err) return console.error('something went wrong' + err);
                //start game
                console.log("All resources were loaded correctly");
            };
  - __`images`__: A Image hashmap(object) of names (keys) and values (image paths)
  - __Syntax:__
    - `object Key`: name of your image ie: "cat"
    - `object Value`: value of your image file "catNormal.png";
    ######__Example__
    ____
            media.sourceManager.images = {
                "cat":"catNormal.png", "catMove":"catWalking.jpeg"
            };
  - __`sounds`__: A Sound hashmap(object) of names (keys) and values (sound paths)
  - __Syntax:__
    - `object Key`: name of your image ie: "cat"
    - `object Value`: value of your image file "catNormal.png";
    ######__Example__
    ____
            media.sourceManager.sounds = {
                "catMeow":"catMeowing.mp3", "catHiss":"catHissing.ogg"
            };

###__MediaMaster`.soundBatch`<small>aka</small> `.sBatch`__
This object was made to make working with a group of sounds that could be played muliple times or in an entire batch much more easier. This object supports global and instance sound control. It's based on a "live" system, so any sound that is playing or starts to play.
 - ####Functions
  - __`volume([sound name], volume)`__: Exponentially changes Audio volume
  - __Arguments:__
    - `[sound name]`: The name of your sound, in the sounds object. <small>earlier</small> `"catMeow"`

    ######__Example__
    ____
            media.sBatch.volume(null, volume);// Controls the master (global) volume
            meda.sBatch.volume("catMeow", volume);//volume of all audio instances of "catMeow"
  - __`pause([sound name])`__: Pauses sounds that are currently live
  - __Arguments:__
    - `[sound name]`: The name of your sound, in the sounds object. <small>earlier</small> `"catMeow"`

    ######__Example__
    ____
            media.sBatch.pause();// effects all live Audio
            meda.sBatch.pause("catMeow");// pauses all audio instances of "catMeow"
  - __`kill`or`stop` `([sound name])`__: Completely stops Audio and kills them from the system
  - __Arguments:__
    - `[sound name]`: The name of your sound, in the sounds object. <small>earlier</small> `"catMeow"`

    ######__Example__
    ____
            media.sBatch.kill();// kills all live Audio
            meda.sBatch.kill("catMeow");// kills all live audio instances of "catMeow"
  - __`getLive([sound name])`__: Gets a list of audio elements
  - __Arguments:__
    - `[sound name]`: The name of your sound, in the sounds object. <small>earlier</small> `"catMeow"`

    ######__Example__
    ____
            media.sBatch.getLive();// gets all live Audio instances
            meda.sBatch.getLive("catMeow");// gets all Audio instances of "catMeow"
   - __`toggleMute()`__: Completely mutes or unmutes all audio in the system`

    ######__Example__
    ____
            media.sBatch.toggleMute();// Muts the entire system

##__Classes__
Classes are functions you need to instantiate before using. There can be as many of them as you'd like.
###__MediaMaster`.ImageMap(image, horCells, verCells)`<small>aka</small> `.IMap`__
This class is simply a container to represent the image sheet passed in as a gridlike structure.
 - ####Argument && Variables
  - __`image`__: An Image object
  - __`horCells`__: # of Horizontal cells in the image, "columns"
  - __`verCells`__: # of Vertical Cells in the image, "Rows"
  - __cellWidth__: calculated width of each cell image.width / horCells;
  - __cellHeight__: calculated height of each cell image.height / verCells;
 - ######__Instantiation Example__
    ____
        var catMap = new media.IMap( media.image('catMove'), 1, 2);
        //The catMap is defined as a sheet 1Column x 2Rows
        var catWalkMap = new media.IMap( media.image('catMove'), 3, 2);
        //The catWalkMap is defined as a sheet 3Columns x 2Rows
     - __tip:__ A good way to make images flip without CTX commands is by shifting through an IMap.                   This wil be explained later

###__MediaMaster`.SpriteGroup([speed])`__
This class should generally be used for any object that needs to display multiple different sprites ___WHILE___ also needing to animate those sprites. It is okay to include sprites that don't require animation in your SpriteGroups, but if they're all static then using a different rendering process is preferred. _This class relies on `ImageMaps`_
 - ####Variables
  - __imageIndex__: returns what frame of the animation is currently displayed.
 - ######__Instantiation Example__
    ____
        var catSprite = new media.SpriteGroup(1);
        //The catSprite starts with a speed of 1
 - ###Functions
  - __`addSprite(IMap [,{ }])`__: adds a sprite to the manager
  - <small>***returns an index # used to change the current sprite index.***</small>
  - ####Arguments
    - __`IMap`__: An ImageMap. _note: the spritegroup relies on IMaps_
    - __[ {} ]__: An object representing an animation's length and source
        - { c, columns, r, rows, sx, shiftX, sy, shiftY}: All are optional and their name's are interchangeable
        - `columns`(or `c`): horizontal length of animation.
        - `rows`(or `r`): # of vertical cells to animate through.
        - `shiftX`(or `sx`): the left most cell index to start the animation from.
        - `shiftY`(or `sy`): the top most cell index to start the animation from.
- #####Example
    ___
          standing  = catSprite.addSprite(catMap);
          catSprite.turnOff(standing);//declares the sprite non-animated(optimized)
          walking   = catSprite.addSprite(catWalkMap, {columns:3, rows:1});
  - __`getMap(sprite index)`__: Gets  an `ImageMap` of the sprite.
  - __Arguments:__
    - `sprite index`: The index of which sprite to draw.

    ######__Example__
    ____
         var walkMap = catSprite.getMap(walking);// Gets the IMAGE MAP of walking
  - __`is` or `set` `(sprite index)`__:
  - __Arguments:__
    - `sprite index`: The index of which sprite to draw.

    ######__Example__
    ____
         catSprite.is(walking);//
  - __`draw(x, y [, shiftX, shiftY])`__:
  - __Arguments:__
    - `x`: The x coordinate of the canvas to draw at.
    - `x`: The y coordinate of the canvas to draw at.
    - `shiftX`: how many cells in the image map to shift to the right.
    - `shiftY`: how many cells in the image map to shift downwards.

    ######__Example__
    ____
         catSprite.draw( kitty.x, kitty.y );// draws the current sprite at Kitty's position

##__Functions__
 - __`drawMap`<small> aka </small> `dMap` `(IMap, x, y[,shiftX, shiftY])`__
 - __Arguments:__
     - `x`: The x coordinate of the canvas to draw at.
     - `x`: The y coordinate of the canvas to draw at.
     - `shiftX`: how many cells in the image map to shift to the right.
     - `shiftY`: how many cells in the image map to shift downwards.

 ######__Example__
  ____
       catSprite.draw( catMap, kitty.x, kitty.y );
       // draws the kitty map at cell (0,0) at Kitty's position
 - __`image(name)`__: Returns an `Image` that was preloaded.
 - __Arguments:__
     - `name`: The name you defined as a key for your image in the sourceManager

 ######__Example__
  ____
       var myImage = media.image("cat");
 - __`sound(name)`__: returns an `Audio` instance that was preloaded.
 - __Arguments:__
     - `name`: The name you defined as a key for your sound in the sourceManager

 ######__Example__
  ____
       var mySound = media.sound("meow");
       mySound.play();

<br/><br/>
## __Baking Static Images__
___

##`Master Class`: __LayerMaker__ <small>aka</small> __LMaker__
##### Description: <small>The layer maker is not a primary aspect of the egine but a second glance class. This Class only comes in handy to anyone who is familiar with pre-rendering images and understands its true power. What it will do is remove any work you need to do in order to preserve rendering time for static images by taking LemonWork objects and putting them into a layer based on depth. When the time comes for baking, the layerMaker will combine each object into a layer and draw them to a canvas. After it is done rendering, it will return an array of Layer objects that don't require any further manipulations to draw each object in its correct depth or position.</small>
###`WARNING`:<small>this class assumes your position property is an array named `position[x,y]`</small>
If you use this class, simply define such property correctly and remove it ___AFTER___ baking.
###Instantiation
    var lmake = new LMaker();// a new LayerMaker
###__Functions__
 - __LMaker`.layers.add(instance, depth)`__: Adds an object to a baking layer.
    ####ARGUMENTS
  - `instance`: The lemonWork inherited objectto be added to the layer
  - `depth`: A # representing the depth layer of the object.

 ######__Example__
    ____
        lmake.layers.add(kitty, 5);
    this example is simply an example of how to use the function. The LMaker is best used on LARGE groups of of objects that would be otherwise be drawn repeatedly.
 - __`bake()`__: Returns an array of layers that can be added to the GameLoop as `displays`

 ######__Example__
    ____
        lmake.bake().forEach(function(layer){
            ctrl.createDisplay(layer);//adds each layer as a display to the controller
        });

<br/><br/>
## __Game Flow <small>(loop control)</small>__
___
##`Master Object`: __lemonFlow__ <small>aka</small> __flow__
##### Description: <small> The core of `lemonWork`. This is the entry point for any actual processing and rendering to the screen and correctly refreshing input. This class also contains a per Class list of objects. So, if you want to run a function on every instance of a class, it's a quick and painless procedure. </small>
###__Functions__
 - __`init(context [, preDraw, posDraw])`__: Starts the system
    ####ARGUMENTS
  - `context`: the 2d context of your canvas.
  - `[preDraw]`: A function to execute prior to drawing: <small>specifically canvas manipulation</small>
  - `[posDraw]`:  A function to execute after drawing: <small>specifically canvas manipulation, or a reset.</small>

 ######__Example__
    ____
        flow.init(context, viewHandle);// Starts the system

 - __`createObject(obj)`__: adds an object that can process and draw itself.
    ####ARGUMENTS
  - `obj`: the instance of a lemonWork object.  

 ######__Example__
    ____
        flow.createObject(obj);// adds an object that can process and draw itself.
 - __`createOperator(obj)`__: adds an object that will only perform operations in the system.
    ####ARGUMENTS
  - `obj`: the instance of a lemonWork object.  

 ######__Example__
    ____
        flow.createOperator(obj);//adds an object that will only perform operations in the system.
 - __`createDisplay(obj)`__: adds an object that will only be drawn in the system.
    ####ARGUMENTS
  - `obj`: the instance of a lemonWork object.  

 ######__Example__
    ____
        flow.createDisplay(obj);// adds an object that will only be drawn in the system.
 - __`deleteObject(obj)`__: Removes an instance from the entire system IF it's in the system.
    ####ARGUMENTS
  - `obj`: the instance of a lemonWork object.  

 ######__Example__
    ____
       flow.deleteObject(obj);//Removes an instance from the entire system IF it's in the system.
 - ###__`reset()`__: Completely clears the `flow` freeing any memory and objects.
     - Good for changing levels or switching views and such.

 ######__Example__
    ____
       flow.reset();//Completely clears the flow freeing any memory and objects.

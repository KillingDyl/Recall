/**
 * @author Dylan
 */
var DEBUGMODE = false;

// Constant Declarations
var PHYSICS_SCALE = 100.0;
var KEY_E = 69;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_SPACE = 32;
var KEY_ESC = 27;
var VIEWPORT_WIDTH = document.getElementById("recall").width;
var VIEWPORT_HEIGHT = document.getElementById("recall").height;

// PLAYER CONSTANTS
var PLAYER_WIDTH_RUNNING = 57;
var PLAYER_HEIGHT_RUNNING = 50;
var PLAYER_WIDTH_SLIDING = 57;
var PLAYER_HEIGHT_SLIDING = 30;
var PLAYER_STATE_NORMAL = 0;
var PLAYER_STATE_RUNNER = 1;
var PLAYER_WALK_SPEED = 1;
var PLAYER_RUN_SPEED = 4;

//
// Initialization
// Set up physics engine and brine engine
//
(function() {
	use2D = true;
	showConsole = DEBUGMODE;
	
	// Global Variables
	var physics;
	var player;
	
	gInput.addBool(KEY_LEFT, "left");
	gInput.addBool(KEY_UP, "up");
	gInput.addBool(KEY_RIGHT, "right");
	gInput.addBool(KEY_DOWN, "down");
	gInput.addBool(KEY_SPACE, "space");
	gInput.addBool(KEY_E, "E");
	gInput.addBool(KEY_ESC, "esc");
	
	initGame("recall");
	var pause = new State();
	pause.alwaysDraw = false;
	pause.alwaysUpdate = false;
	var game = new State();
	game.alwaysDraw = true;
	game.alwaysUpdate = false;
	physics = new b2.World(new b2.Vec2(0, 10), true);
	
	// Initiates all levels
	new StoryOne();
	new LevelOne();
	new LevelTwo();
	
	game.init = function() {
		
		var listener = new b2.ContactListener();
		listener.BeginContact = beginContactListen;
		listener.EndContact = endContactListen;
		physics.SetContactListener(listener);
		
		if(DEBUGMODE) {
			CanvasDebugDraw._extend(b2.Draw);
			var debugDraw = new CanvasDebugDraw();
			debugDraw.context = ctx;
			debugDraw.scale = PHYSICS_SCALE;
			debugDraw.width = VIEWPORT_WIDTH;
			debugDraw.height = VIEWPORT_HEIGHT;
			debugDraw.SetFlags(b2.Draw.e_shapeBit | b2.Draw.e_jointBit);
			physics.SetDebugDraw(debugDraw);
		}
		
		println("World Initialized");
		
		this.level = StoryOne();
		this.level.Construct();
		
		player = CreatePlayer(0, 450);//TODO where player starts
	};
	
	game.world.update = function(d) {
		physics.Step(1/60, 10, 10);
		physics.ClearForces();
		
		this.x = VIEWPORT_WIDTH / 2 - player.x;
				
		this.updateChildren(d);
	};
	
	game.world.draw = function(ctx) {
		if(DEBUGMODE) {
			physics.DrawDebugData();
			this.alpha = 0.5;
		}
		Sprite.prototype.draw.call(this, ctx);
	};
	
	States.push(game);
	
	println("Game Initialized");
	
	//
	// Level objects
	//
	
	/* LEVEL TEMPLATE
	function LEVEL_NAME_HERE() {
		if(arguments.callee._singletonInstance)
			return arguments.callee._singletonInstance;
		arguments.callee._singletonInstance = this;
		this.constructed = false;
		
		this.Construct = function() {
	  		if(this.constructed) return;
	  		this.fill = []; // Shouldn't need to use this after Rahil changes the wall size to reflect the image size
	  		this.floor = [];
	  		this.interactive = [];
	  		this.obstacles = [];
	  		
	  		this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacles.length; i++) this.obstacles[i].Destroy();
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	 
	 */
	
	function StoryOne() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.interactive = [];
	  		this.obstacles = [];
	  		
	  		var x = -400;
	  		for(var i=0; i<15; i++)
			{
				this.floor[i] = CreateFloorElement(x, 550, 100, 100, "", 0, false);
				x += 100;
			}
			
			var background = CreateSprite(250,400,1275,420,"sprites/Labratory.png", 0);
			var fore_desk = CreateSprite(300,500,442,214,"sprites/Labratory_bottom_desk.png",-9995);
			var text_image = CreateSprite(775,275, 173,225,"sprites/Right_text.png",-400);
			var text = CreateText(775,275, "Hey Bill");
			
			var right_door = CreateWorldElement(828, 370, 825, 942, "sprites/Right_door.png", true, true, 0);
			right_door.action = function() {
				States.current().level.Destruct();
				States.current().level = LevelOne();
				States.current().level.Construct();
				States.current().world.removeChild(background);
				States.current().world.removeChild(fore_desk);
				States.current().world.removeChild(text_image);
			};
       		this.interactive.push(right_door);
			
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacles.length; i++) this.obstacles[i].Destroy();
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	function LevelOne() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacles = [];
	  		////work after this
	  		var x = 100;
			var y = 450;
			var tracker = 0;
			var buildingLength = tracker;
			var xobstacle;
			var obstacleCount = 0;
			var obstacle1offset = 215;
			var obstacle2offset = 295;
			var obstacle3offset = 231;
			var obstacle4offset = 240;
			
			//FLOOR 1///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +10;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        
	        //FLOOR 2///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +10;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        
	        //FLOOR 3///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +2;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        
	        //FLOOR 4///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +15;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 4 obstacles
			xobstacle = 8000;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 1400;
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        
	        //FLOOR 5///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +2;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 5 obstacles
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 1000;
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        
	        //FLOOR 6///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +10;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 6 obstacles
			xobstacle += 1300;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        y = 350;
	        //FLOOR 7///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, 475, 183, 621, "sprites/LeftWall.png", 0, true);
	  		//this.fill[tracker] = CreateFloorElement(x, 621, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, 721, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, 475, 183, 621, "sprites/RightWall.png", 0, true);
			//this.fill[tracker] = CreateFloorElement(x, 621, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 7 obstacles
			xobstacle += 1450;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        y = 250;
	        //FLOOR 8///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, 375, 183, 621, "sprites/LeftWall.png", 0, true);
	  		//this.fill[tracker] = CreateFloorElement(x, 621, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, 621, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, 375, 183, 621, "sprites/RightWall.png", 0, true);
			//this.fill[tracker] = CreateFloorElement(x, 621, 183, 371, "sprites/RightWall.png", 0, true);
			x += 550;
			//floor 8 obstacles
			xobstacle += 1500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle3offset, 73, 108, "sprites/Obstacle3.png", true, false, 0);
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        y = 450;
	        //FLOOR 9///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +10;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 9 obstacle
			xobstacle += 2500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle3offset, 73, 108, "sprites/Obstacle3.png", true, false, 0);
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        
	        //FLOOR 10///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        y = 350;
	        //FLOOR 11///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
	  		this.floor[tracker] = CreateFloorElement(x, 475, 183, 621, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +2;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.floor[i] = CreateFloorElement(x, 721, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			this.floor[tracker] = CreateFloorElement(x, 475, 183, 621, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 11 obstacles
			xobstacle += 2600;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        y = 550;
	        //FLOOR 12///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 12 obstacles
			xobstacle += 1600;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        y = 450;
	        //FLOOR 13///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +10;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        //OBJ
	        door = CreateRunnerElement(400, 218, 80, 100, "sprites/door.png", true, true, 0);
	        door.action = printWords;//give it a function if the player interacts
	        this.interactive.push(door);
	        
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  		player.body.SetTransform(new b2.Vec2(400/PHYSICS_SCALE,100/PHYSICS_SCALE), 0);
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacles.length; i++) this.obstacles[i].Destroy();
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	function LevelTwo() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacles = [];
	  		////work after this
	  		var x = 100;
			var y = 450;
			var tracker = 0;
			var buildingLength = tracker;
			var xobstacle;
			var obstacleCount = 0;
			var obstacle1offset = 215;
			var obstacle2offset = 295;
			var obstacle3offset = 231;
			var obstacle4offset = 240;
	  		
			
			//FLOOR 1///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +40;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 1 obstacles
			xobstacle = 1198;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 1830;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			//END FLOOR1//////////////////////////////////////////////////////////////////
			
			y = 550;
			//FLOOR 2///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +15;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 2 obstacles
			xobstacle += 2500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle3offset, 73, 108, "sprites/Obstacle3.png", true, false, 0);
			xobstacle += 500;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle1offset, 155, 113, "sprites/Obstacle1.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			//END FLOOR2//////////////////////////////////////////////////////////////////
			
			y= 500;
			//FLOOR 3///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +60;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 3 obstacles
			xobstacle += 915;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 880;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			//END FLOOR3//////////////////////////////////////////////////////////////////
			
			y = 450;
			//FLOOR 4///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +15;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 4 obstacles
			xobstacle += 915;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle1offset, 155, 113, "sprites/Obstacle1.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			//END FLOOR4//////////////////////////////////////////////////////////////////
			
			y = 500;
			//FLOOR 5///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 5 obstacles
			xobstacle += 915;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			//END FLOOR5//////////////////////////////////////////////////////////////////
			
			y = 550;
			//FLOOR 6///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 6 obstacles
			//END FLOOR6//////////////////////////////////////////////////////////////////
			
			y = 600;
			//FLOOR 7///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//END FLOOR7//////////////////////////////////////////////////////////////////
			
			y = 450;
			//FLOOR 8///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +20;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 383;
			//floor 8 obstacles
			xobstacle += 1830;
			xobstacle += 1830;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle3offset, 73, 108, "sprites/Obstacle3.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle1offset, 155, 113, "sprites/Obstacle1.png", true, false, 0);
			xobstacle += 915;
			obstacleCount++;
			//END FLOOR8//////////////////////////////////////////////////////////////////
			
			
			//OBJ
	        door = CreateRunnerElement(400, 218, 80, 100, "sprites/door.png", true, true, 0);
	        door.action = printWords;//give it a function if the player interacts
	        this.interactive.push(door);
	        
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  		player.body.SetTransform(new b2.Vec2(400/PHYSICS_SCALE,100/PHYSICS_SCALE), 0);
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacles.length; i++) this.obstacles[i].Destroy();
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	//
	// Function definitions
	//
	
	//
	// Event that triggers when any contact begins
	//
	function beginContactListen(contact) {
		var objectA = contact.GetFixtureA().GetBody().GetUserData();
		var objectB = contact.GetFixtureB().GetBody().GetUserData();
		if(objectA == player || objectB == player) {
			var other;
			if(objectA == player) other = objectB;
			if(objectB == player) other = objectA;
			//OBJ
			var interactives = States.current().level.interactive;
			for (var i = 0; i < interactives.length; i++ ) {//TODO fix logix if need
	        	if(other == interactives[i]){ //check if it is specifically near the door
	        		player.near = true;
	        		player.ob = interactives[i];//give it the object that it is near
	        		println("near");
	        		break;
	        	}	
	        }//checks to see if it is on top of the ground
	        /////
	        if(other.fixture.IsSensor()) return;
         	if(Math.abs(player.x - other.x) < other.width/2 + player.width/2) {
         		player.onGround = true;
         	} else if(player.y + player.height/2 > other.y - other.height/2) {
         		var direction = 1;
         		if(player.x < other.x) direction = -1;
				var deltaVelocity = (direction * player.maxSpeed);
				var impulse = new b2.Vec2(player.body.GetMass() * deltaVelocity, player.body.GetMass() * -2);
				player.body.SetTransform(new b2.Vec2(direction * .1, 0), 0);
				player.body.SetLinearVelocity(new b2.Vec2(0, 0));
				player.body.ApplyLinearImpulse(impulse, player.body.GetWorldCenter(), true);
				player.onGround = false;
         	}/* else if(player.y - (floor.y + floor.height/2) < 1 && player.y < floor.y) {
         		var impulse = new b2Vec2(player.body.GetMass() * -1, player.body.GetMass() * -2);
				player.body.ApplyLinearImpulse(impulse, player.body.GetWorldCenter());
         		println("CLIMB");
         	}*/
      	}
	}
	
	//
	// Event triggers when any contacts end
	//
	function endContactListen(contact) {
		var objectA = contact.GetFixtureA().GetBody().GetUserData();
		var objectB = contact.GetFixtureB().GetBody().GetUserData();
		if(objectA == player || objectB == player) {
			var other;
			if(objectA == player) other = objectB;
			if(objectB == player) other = objectA;
			var interactives = States.current().level.interactive;
			for (var i = 0; i < interactives.length; i++ ) {
	        	if(other == interactives[i]){	
					player.near = false;
	        		println("away");
	      	 	}
	      	}
		}	
	}
	
	//OBJ
	//test funtion that prints when player moves thru an object
	function printWords(){
		println("E");
	}
	function Words(){
		println("ADAdka");	
	}
	///
	
	//
	// CreateSprite - function to create a basic sprite to be displayed
	//
	function CreateSprite(x, y, width, height, image, index) {
		var sprite = new Sprite();
		sprite.x = x;
		sprite.y = y;
		sprite.width = width;
		sprite.height = height;
		sprite.offsetX = -width/2;
		sprite.offsetY = -height/2;
		sprite.image = Textures.load(image);
		sprite.index = index;
		States.current().world.addChild(sprite);
		return sprite;
	}
	
	//
	// CreateText - function to create a basic text to be displayed
	//
	function CreateText(x, y, text) {
		var scoreText = new TextBox();
		scoreText.x = x;
		scoreText.y = y;
		scoreText.fontSize = 32;
		scoreText.text = text;
		States.current().world.addChild(scoreText);
	}
	
	//
	// CreatePlayer - creates the player sprite, physics body, and update functions
	//
	function CreatePlayer(x, y) {
		var player = CreateSprite(x, y, PLAYER_WIDTH_RUNNING, PLAYER_HEIGHT_RUNNING, "sprites/Char.png", -9990);
		player.onGround = true;
		player.near = false;//check for whether or not the player is near an interactable obj
		
		var bodyDef = CreateBodyDef(player, b2.Body.b2_dynamicBody);
		player.body = physics.CreateBody(bodyDef);
		CreateRunningFixture(player);
		player.body.SetUserData(player);
		player.body.SetFixedRotation(true);
		
		player.state = PLAYER_STATE_NORMAL;
		player.maxSpeed = PLAYER_WALK_SPEED;
		player.sliding = false;
		player.latency = 0;
		player.update = function(d) {
			// Move the sprite according to the physics body
			var pos = this.body.GetPosition();
			this.x = pos.x * PHYSICS_SCALE;
			this.y = pos.y * PHYSICS_SCALE;
			this.rotation = this.body.GetAngle();
			//OBJ
			if(this.near && gInput.E && this.latency < 0){
				this.latency = 15;
				this.ob.action();
				//println("E");
			} 
			//
			// Movement code
			var velocity = this.body.GetLinearVelocity();
			this.latency--;
			if(this.state == PLAYER_STATE_NORMAL) {
				if(gInput.right && this.onGround) {
					var deltaVelocity = this.maxSpeed - velocity.x;
					var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
					this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
				}
				if(gInput.left && this.onGround) {
					var deltaVelocity = -this.maxSpeed - velocity.x;
					var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
					this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
				}
				if(gInput.space) {
					this.state = PLAYER_STATE_RUNNER;
					this.maxSpeed = PLAYER_RUN_SPEED;
				}
			} else if(this.state == PLAYER_STATE_RUNNER && this.onGround) {
				var deltaVelocity = this.maxSpeed - velocity.x;
				var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
				this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
				if(gInput.right && this.onGround) {
					var deltaVelocity = this.maxSpeed * 2 - velocity.x;
					var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
					this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
				}
				if(gInput.down && !this.sliding) {
					this.body.DestroyFixture(this.fixture);
					CreateSlidingFixture(this);
					this.sliding = true;
				} else if(!gInput.down && this.sliding) {
					this.body.DestroyFixture(this.fixture);
					CreateRunningFixture(this);
					this.sliding = false;
				}
			}
			if(gInput.up && this.onGround && !this.sliding && this.latency < 0) {
				this.onGround = false;
				this.latency = 15;
				var deltaVelocity = velocity.y - 6;
				var impulse = new b2.Vec2(0, this.body.GetMass() * deltaVelocity);
				this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
			}
		};
		return player;
	}
	
	//
	// CreateRunningFixture - creates the running body for player
	//
	function CreateRunningFixture(sprite) {
		var fixDef = CreateFixtureDef(10.0, 1.0, 0);
		var scaled_width = sprite.width / PHYSICS_SCALE;
		var scaled_height = sprite.height / PHYSICS_SCALE;
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(scaled_width / 2, scaled_height / 2);
		sprite.fixture = sprite.body.CreateFixture(fixDef);
	}
	
	//
	// CreateSlidingFixture - creates the sliding body for player
	//
	function CreateSlidingFixture(sprite) {
		var fixDef = CreateFixtureDef(10.0, 1.0, 0);
		var scaled_width = 57 / PHYSICS_SCALE;
		var scaled_height = 30 / PHYSICS_SCALE;
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(scaled_width / 2, scaled_height / 4);
		sprite.fixture = sprite.body.CreateFixture(fixDef);
	}
	
	//
	// CreateWorldElement - creates a world element that is always there
	// 						float x, float y, float width, float height, image, bool solid, bool sensor, int index
	//						Note: Sensor can't be true and not be solid
	//						Note: Use this for creating hub worlds (i.e. non runner levels)
	//
	function CreateWorldElement(x, y, width, height, image, solid, sensor, index) {
		var element = CreateSprite(x, y, width, height, image, index);
		if(solid) ApplyRectBBox(element, b2.Body.b2_staticBody, 1.0, 1, 0);
		if(sensor && solid) element.fixture.SetSensor(true);
		element.Destroy = function() {
			if(typeof(this.body) !== "undefined") physics.DestroyBody(this.body);
			States.current().world.removeChild(this);
		};
		return element;
	}
	
	//
	// CreateRunnerElement - creates a world element that will spawn and despawn based on visibility
	// 						float x, float y, float width, float height, image, bool solid, bool sensor, int index
	//						Note: Sensor can't be true and not be solid
	//
	function CreateRunnerElement(x, y, width, height, image, solid, sensor, index) {
		var element = CreateSprite(x, y, width, height, image, index);
		if(solid) ApplyRectBBox(element, b2.Body.b2_staticBody, 1.0, 1, 0);
		if(sensor && solid) element.fixture.SetSensor(true);
		element.update = function(d) {
			var xpos = this.x + States.current().world.x;
			if(xpos + this.width/2 < -States.current().level.width / 2) {
				this.x += States.current().level.width;
				if(typeof(this.body) !== "undefined") {
					var pos = this.body.GetPosition();
					pos.x += States.current().level.width / PHYSICS_SCALE;
					this.body.SetTransform(pos, 0);
				}
			}
			if(xpos - this.width/2 > States.current().level.width / 2) {
				this.x -= States.current().level.width;
				if(typeof(this.body) !== "undefined") {
					var pos = this.body.GetPosition();
					pos.x -= States.current().level.width / PHYSICS_SCALE;
					this.body.SetTransform(pos, 0);
				}
			}
		};
		if(typeof(this.body) !== "undefined") {
			element.Destroy = function() {
				physics.DestroyBody(this.body);
				States.current().world.removeChild(this);
			};
		}
		return element;
	}
	
	//
	// CreateFloorElement - creates a world element, if respawn is true, when it goes offscreen, it will be moved
	//						to create and infinite level
	// 						NOTE: Defines a different type of shape for floor tiles
	//
	function CreateFloorElement(x, y, width, height, image, index, respawn) {
		var element = CreateSprite(x, y, width, height, image, index);
		var fixDef = CreateFixtureDef(1.0, 1, 0);
		var scaled_width = width / PHYSICS_SCALE;
		var scaled_height = height / PHYSICS_SCALE;
		fixDef.shape = new b2.ChainShape();
		var vertices = [];
		vertices.push(new b2.Vec2(-scaled_width / 2, -scaled_height / 2));
		vertices.push(new b2.Vec2(scaled_width / 2, -scaled_height / 2));
		vertices.push(new b2.Vec2(scaled_width / 2, scaled_height / 2));
		vertices.push(new b2.Vec2(-scaled_width / 2, scaled_height / 2));
		fixDef.shape.CreateLoop(vertices, 4);
		ApplyBBox(element, b2.Body.b2_staticBody, fixDef);
		if(respawn) {
			element.update = function(d) {
				var xpos = this.x + States.current().world.x;
				if(xpos + this.width/2 < -States.current().level.width / 2) {
					this.x += States.current().level.width;
					if(typeof(this.body) !== "undefined") {
						var pos = this.body.GetPosition();
						pos.x += States.current().level.width / PHYSICS_SCALE;
						this.body.SetTransform(pos, 0);
					}
				}
				if(xpos - this.width/2 > States.current().level.width / 2) {
					this.x -= States.current().level.width;
					if(typeof(this.body) !== "undefined") {
						var pos = this.body.GetPosition();
						pos.x -= States.current().level.width / PHYSICS_SCALE;
						this.body.SetTransform(pos, 0);
					}
				}
			};
		}
		element.Destroy = function() {
			physics.DestroyBody(this.body);
			States.current().world.removeChild(this);
		};
		return element;
	}
	
	//
	// applyBBox - takes sprite and fixture definition and applies the bounding box to sprite
	//
	function ApplyBBox(sprite, type, fixDef) {
		var bodyDef = CreateBodyDef(sprite, type);
		
		sprite.body = physics.CreateBody(bodyDef);
		sprite.fixture = sprite.body.CreateFixture(fixDef);
		sprite.body.SetUserData(sprite);
		
		if(type == b2.Body.b2_dynamicBody) {
			sprite.update = function(d) {
				var pos = sprite.body.GetPosition();
				sprite.x = pos.x * PHYSICS_SCALE;
				sprite.y = pos.y * PHYSICS_SCALE;
				sprite.rotation = sprite.body.GetAngle();
			};
		}
	}
	
	//
	// applyRectBBox - creates and links a rectanglular bounding box to the specified sprite
	//
	function ApplyRectBBox(sprite, type, density, friction, restitution) {
		var fixDef = CreateFixtureDef(density, friction, restitution);
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(sprite.width / 2 / PHYSICS_SCALE, sprite.height / 2 / PHYSICS_SCALE);
		ApplyBBox(sprite, type, fixDef);
	}
	
	//
	// CreateBodyDef - Creates a body definition for the input sprite
	//
	function CreateBodyDef(sprite, type) {
		var bodyDef = new b2.BodyDef();
		bodyDef.type = type;
		bodyDef.position.Set(sprite.x / PHYSICS_SCALE, sprite.y / PHYSICS_SCALE);
		return bodyDef;
	}
	
	//
	// CreateFixtureDef - Creates a basic fixture definition without a shape
	//
	function CreateFixtureDef(density, friction, restitution) {
		var fixDef = new b2.FixtureDef();
		fixDef.density = typeof density !== 'undefined' ? density : 1.0;
		fixDef.friction = typeof friction !== 'undefined' ? friction : 0.5;
		fixDef.restitution = typeof restitution !== 'undefined' ? restitution : 0.2;
		return fixDef;
	}
}());


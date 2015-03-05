/**
 * @author Dylan
 */
var DEBUGMODE = true;

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
var PLAYER_DASH_SPEED = 10;
var PLAYER_DASH_DURATION = 60;
var PLAYER_SLIDE_DURATION = 60;

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
	
	var chat = new State();
	chat.alwaysDraw = false;
	chat.alwaysUpdate = false;
	
	// Initiates all levels
	new StoryOne();
	new StoryTwo();
	new StoryThree();
	new LevelOne();
	new LevelTwo();
	new StoryFour();
	new LevelThree();
	new LevelFour();
	new LevelFive();
	
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
		
		player = CreatePlayer(0, 400);
		this.level = StoryOne();
		this.level.Construct();
	};
	
	game.world.update = function(d) {
		physics.Step(1/60, 10, 10);
		physics.ClearForces();
		
		if(player.state == PLAYER_STATE_NORMAL) {
			this.x = VIEWPORT_WIDTH / 2 - player.x;
			//this.y = VIEWPORT_HEIGHT * 0.75 - player.y;
		} else {
			var deltaX = (VIEWPORT_WIDTH / 5 - player.x) - this.x;
			var deltaY = (VIEWPORT_HEIGHT * 0.75 - player.y) - this.y;
			var accel = deltaX < VIEWPORT_WIDTH / 2 ? 10 : 1;
			this.x += deltaX / accel;
			this.y += deltaY / accel;
		}
				
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
	  
	  	this.Construct = function() {//TODO
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
			
			var background = CreateSprite(250,400,1275,420,"sprites/Labratory.png", 500);
			var fore_desk = CreateSprite(300,500,442,214,"sprites/Labratory_bottom_desk.png",-9995);
			var text_image = CreateSprite(675,275, 173,225,"sprites/Right_text.png",100);
			var text = CreateText(620,255, "Hey Bill(FUCK YOU BILL SEEN UR NAME TOO MUCH)");
			var left_door = CreateSprite(-337, 362, 825, 942, "sprites/Left_door.png", 400);
			var middle_door = CreateSprite(250 , 362, 925, 1042,"sprites/Middle_door.png", 400);
			var right_door = CreateWorldElement(828, 370, 825, 942, "sprites/Right_door.png", true, true, 400);
			right_door.action = function() {
				States.current().level.Destruct();
				States.current().level = LevelFive(); ///change back to one after test
				States.current().level.Construct();
				States.current().world.removeChild(background);
				States.current().world.removeChild(fore_desk);
				States.current().world.removeChild(text_image);
				States.current().world.removeChild(text);
				States.current().world.removeChild(left_door);
				States.current().world.removeChild(middle_door);
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
			var obstacle5offset = 220;
			
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
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 383;
			//floor 7 obstacles
			xobstacle += 1450;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
	        //////////////////////////////////////////////////////////////////////////////
	        
	        y = 250;
	        //FLOOR 8///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
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
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +2;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
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
	
	function StoryTwo() {
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.interactive = [];
	  		var x = -400;
	  		for(var i=0; i<15; i++)
			{
				this.floor[i] = CreateFloorElement(x, 550, 100, 100, "", 0, false);
				x += 100;
			}
			
			var background = CreateSprite(400,400,1055.33,560,"sprites/Office.png", 500);
		    var boss = CreateSprite(550,440,900,582,"sprites/boss.png",100);
		    this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  	    this.constructed = true;
	  	    player.body.SetTransform(new b2.Vec2(300/PHYSICS_SCALE,475/PHYSICS_SCALE), 0);
	  	};	
	};
	
	function StoryThree() {//TODO
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.interactive = [];
	  		var x = -400;
	  		for(var i=0; i<15; i++)
			{
				this.floor[i] = CreateFloorElement(x, 550, 100, 100, "", 0, false);
				x += 100;
			}
			
			var background = CreateSprite(250,400,1275,420,"sprites/Labratory.png", 500);
			var fore_desk = CreateSprite(300,500,442,214,"sprites/Labratory_bottom_desk.png",-9995);
			var right_door = CreateSprite(828, 370, 825, 942, "sprites/Right_door.png", 400);
			var left_door = CreateSprite(-337, 362, 825, 942, "sprites/Left_door.png", 400);
			var middle_door = CreateSprite(250 , 362, 925, 1042,"sprites/Middle_door.png", 400);
			var female = CreateSprite(100,450,900,582,"sprites/female_teammate.png",400);
			var male = CreateSprite(400,475,900,582,"sprites/male_teammate.png",400);
		    this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  	    this.constructed = true;
	  	    player.body.SetTransform(new b2.Vec2(275/PHYSICS_SCALE,475/PHYSICS_SCALE), 0);
	  	};	
	};
	
	function LevelTwo() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.checkpoint = [];
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
			var obstacle5offset = 220;
	  		
			
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
	
	function StoryFour(){
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  
	  	this.Construct = function() {//TODO
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.interactive = [];
	  		this.obstacle = [];
	  		
	  		var x = -400;
	  		for(var i=0; i<15; i++)
			{
				this.floor[i] = CreateFloorElement(x, 550, 100, 100, "", 0, false);
				x += 100;
			}
			
			var background = CreateSprite(250,400,1275,420,"sprites/Hallway.png", 500);
			var left_door = CreateSprite(-337, 362, 825, 942, "sprites/Left_door.png", 400);
			var right_door = CreateWorldElement(828, 370, 825, 942, "sprites/Right_door.png", true, true, 400);
			right_door.action = function() {
				States.current().level.Destruct();
				States.current().level = StoryThree();
				States.current().level.Construct();
				States.current().world.removeChild(background);
			};
       		this.interactive.push(right_door);
			
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  		player.body.SetTransform(new b2.Vec2(-100/PHYSICS_SCALE,475/PHYSICS_SCALE), 0);
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	function LevelThree() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.checkpoint = [];
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacles = [];
	  		////work after this
	  		var x = 100;
			var y = 350;
			var tracker = 0;
			var buildingLength = tracker;
			var xobstacle;
			var obstacleCount = 0;
			var obstacle1offset = 215;
			var obstacle2offset = 295;
			var obstacle3offset = 231;
			var obstacle4offset = 240;
			var obstacle5offset = 220;
	  		
			
			//FLOOR 1///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
	  		this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +15;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 383;
			///////////////////////////////////////////////////////////////////////////
			
			y = 700;
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
			//floor 2 obstacles
			xobstacle = 3500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			xobstacle += 1200;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle1offset, 155, 113, "sprites/Obstacle1.png", true, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			y = 550;
			//FLOOR 3///////////////////////////////////////////////////////////////////
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
			x += 550;
			//floor 3 obstacles
			xobstacle += 1500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			xobstacle += 2550;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 4///////////////////////////////////////////////////////////////////
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
			x += 200;
			//floor 4 obstacles
			xobstacle += 1500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			y = 400;
			//FLOOR 5///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +5;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 200;
			//floor 5 obstacles
			xobstacle += 700;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle5offset, 86, 72, "sprites/Obstacle5.png", false, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			y = 550;
			//FLOOR 6///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +7;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 200;
			///////////////////////////////////////////////////////////////////////////
			
			y = 400;
			//FLOOR 7///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +15;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 583;
			//floor 7 obstacles
			xobstacle += 3000;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			xobstacle += 800;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			xobstacle += 900;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle5offset, 86, 72, "sprites/Obstacle5.png", false, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			y = 800;
			//FLOOR 8///////////////////////////////////////////////////////////////////
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
			x += 200;
			//floor 8 obstacles
			xobstacle += 3000;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle1offset, 155, 113, "sprites/Obstacle1.png", true, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			
			y = 635;
			//FLOOR 9///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +6;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 583;
			///////////////////////////////////////////////////////////////////////////
			
			//PART 2 OF SKETCH//////////////////////////////////////////////////////////
			
			
			//FLOOR 10///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 583;
			///////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 11///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 583;
			///////////////////////////////////////////////////////////////////////////
			
			 y = 700;
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
			x += 483;
			//floor 12 obstacles
			xobstacle += 5000;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;

			///////////////////////////////////////////////////////////////////////////
			
			y = 750;
			//FLOOR 13///////////////////////////////////////////////////////////////////
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
			x += 400;
			//floor 13 obstacles
			xobstacle += 950;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			xobstacle += 600;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle5offset, 86, 72, "sprites/Obstacle5.png", false, false, 0);
			obstacleCount++;
			xobstacle += 1200;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle1offset, 155, 113, "sprites/Obstacle1.png", true, false, 0);
			obstacleCount++;
			xobstacle += 600;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			y = 600;
			//FLOOR 14///////////////////////////////////////////////////////////////////
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
			//floor 14 obstacles
			xobstacle += 1800;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			xobstacle += 700;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			y = 500;
			//FLOOR 15//////////////////////////////////////////////////////////////////
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
			//floor 15 obstacles
			xobstacle += 1000;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle5offset, 86, 72, "sprites/Obstacle5.png", false, false, 0);
			obstacleCount++;
			xobstacle += 1000;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			///////////////////////////////////////////////////////////////////////////
			
			y = 350;
			//FLOOR 16///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +15;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 383;
			///////////////////////////////////////////////////////////////////////////
			
			
			//OBJ
	        door = CreateRunnerElement(400, 140, 80, 100, "sprites/door.png", true, true, 0);
	        door.action = printWords;//give it a function if the player interacts
	        this.interactive.push(door);
	        
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  		player.body.SetTransform(new b2.Vec2(400/PHYSICS_SCALE,140/PHYSICS_SCALE), 0);
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
	
	function LevelFour() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacle = [];
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
			var obstacle5offset = 220;
			
			
			//FLOOR 1///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +10;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 383;
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
	  		
			y= 550; 
			//FLOOR 2///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			xobstacle = 3200;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 3///////////////////////////////////////////////////////////////////
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
			x += 200;
			//floor obstacles
			xobstacle += 1600;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			y =600;
			//FLOOR 4///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +3;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 5///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			xobstacle += 2400;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			xobstacle += 500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			y = 500;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
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
			//floor obstacles
			xobstacle += 3715;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle5offset, 86, 72, "sprites/Obstacle5.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			y = 550;
			//FLOOR 8///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			y = 600;
			//FLOOR 9///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			xobstacle += 1190;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle3offset, 73, 108, "sprites/Obstacle3.png", true, false, 0);
			obstacleCount++;
			xobstacle += 1233;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle3offset, 73, 108, "sprites/Obstacle3.png", true, false, 0);
			obstacleCount++;
			
			////////////////////////////////////////////////////////////////////////////
			
			y = 650;
			//FLOOR 10///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +4;
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
			//floor obstacles
			xobstacle += 850;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			
			y = 700;
			//FLOOR 11///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +6;
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
			//floor obstacles
			xobstacle += 1170;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			xobstacle += 470;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle4offset, 147, 142, "sprites/Obstacle4.png", true, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			y = 600;
			//FLOOR 12///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +3;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 13///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +3;
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
			//floor obstacles
			xobstacle += 2500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			y = 500;
			//FLOOR 14///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +7;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			y = 550;
			//FLOOR 15///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			xobstacle += 2800;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			y = 600;
			//FLOOR 16///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			y = 650;
			//FLOOR 17///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +4;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/RightWall.png", 0, true);
			x += 200;
			//floor obstacles
			xobstacle += 2925;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle2offset, 211, 246, "sprites/Obstacle2.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			y = 525;
			//FLOOR 18///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			y = 500;
			//FLOOR 19///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			y = 450;
			//FLOOR 20///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +2;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 383;
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 21///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x-10, y, 210, 371, "sprites/LeftWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +10;
			for(var i=tracker; i<buildingLength; i++) //middle
			{
				this.floor[i] = CreateFloorElement(x, y, 183, 371, "sprites/MiddleWall.png", 0, true);
				this.fill[i] = CreateFloorElement(x, y+369, 183, 371, "sprites/MiddleWall.png", 0, true);
				x += 183;
				tracker++;
			}
			//right side
			tracker++;
			this.floor[tracker] = CreateFloorElement(x+10, y, 210, 371, "sprites/RightWall.png", 0, true);
			this.fill[tracker] = CreateFloorElement(x, y+371, 183, 371, "sprites/MiddleWall.png", 0, true);
			x += 383;
			//floor obstacles
			xobstacle += 5500;
			this.obstacles[obstacleCount] = CreateRunnerElement(xobstacle, y-obstacle5offset, 86, 72, "sprites/Obstacle5.png", false, false, 0);
			obstacleCount++;
			////////////////////////////////////////////////////////////////////////////
			
			
			
			
			
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
	
	function LevelFive() {
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
			var y = 200;
			var tracker = 0;
			var buildingLength = tracker;
			var xobstacle;
			var obstacleCount = 0;
			var obstacle1offset = 215;
			var obstacle2offset = 295;
			var obstacle3offset = 231;
			var obstacle4offset = 240;
			var obstacle5offset = 220;
	  		
			
			//FLOOR 1///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +7;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 3///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 4///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 5///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 6///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 7///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 8///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 9///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 10///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 11///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +3;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 12///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 13///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +3;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 14///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +3;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 15///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 16///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 17///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +1;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 18///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 19///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 20///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 21///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 22///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +4;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 23///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +4;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 24///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 25///////////////////////////////////////////////////////////////////
	  		//left side
	  		this.floor[tracker] = CreateFloorElement(x, y, 183, 371, "sprites/LeftWall.png", 0, true);
			x += 183;
			tracker++;
			buildingLength = tracker +3;
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 26///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			//FLOOR 27///////////////////////////////////////////////////////////////////
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
			//floor obstacles
			
			////////////////////////////////////////////////////////////////////////////
			
			
			
			
			
			//OBJ
	        door = CreateRunnerElement(400, 0, 80, 100, "sprites/door.png", true, true, 0);
	        door.action = printWords;//give it a function if the player interacts
	        this.interactive.push(door);
	        
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
			this.width += 600;
	  		this.constructed = true;
	  		player.body.SetTransform(new b2.Vec2(400/PHYSICS_SCALE,10/PHYSICS_SCALE), 0);
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	
	
	
	
	//////////////////////////////////////
	// Function definitions
	//
	
	//
	// Event that triggers when any contact begins
	//////////////////////////////////////
	function beginContactListen(contact) {
		var fixtureA = contact.GetFixtureA();
		var fixtureB = contact.GetFixtureB();
		if(fixtureA.IsSensor() && fixtureB.IsSensor()) return;
		if(fixtureA == player.foot || fixtureB == player.foot) {
			player.foot.numContacts++;
			return;
		}
		if(fixtureA == player.reach || fixtureB == player.reach) {
			player.reach.numContacts++;
			return;
		}
		var objectA = fixtureA.GetBody().GetUserData();
		var objectB = fixtureB.GetBody().GetUserData();
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
	        if(other.type == "checkpoint") player.checkpoint = other;
	        if(other.fixture.IsSensor()) return;
         	var position = player.body.GetPosition();
         	var end = new b2.Vec2(position.x, position.y + 5);
         	var ray = new b2.RayCastCallback();
			ray.ReportFixture = RayCallback;
			player.aboveGround = false;
			physics.RayCast(ray, position, end);
         	if(player.y > other.y - player.height && player.onGround && player.aboveGround) {
         		var direction = 1;
         		if(player.x < other.x) direction = -1;
				var deltaVelocity = (direction * player.maxSpeed);
				position.x += direction * .5;
				var impulse = new b2.Vec2(player.body.GetMass() * deltaVelocity, player.body.GetMass() * -2);
				player.body.SetLinearVelocity(new b2.Vec2(0, 0));
				player.body.SetTransform(position, 0);
				player.body.ApplyLinearImpulse(impulse, player.body.GetWorldCenter(), true);
         	}
      	}
	}
	
	//
	// Event triggers when any contacts end
	//
	function endContactListen(contact) {
		var fixtureA = contact.GetFixtureA();
		var fixtureB = contact.GetFixtureB();
		if(fixtureA.IsSensor() && fixtureB.IsSensor()) return;
		if(fixtureA == player.foot || fixtureB == player.foot) {
			player.foot.numContacts--;
		}
		if(fixtureA == player.reach || fixtureB == player.reach) {
			player.reach.numContacts--;
		}
		var objectA = fixtureA.GetBody().GetUserData();
		var objectB = fixtureB.GetBody().GetUserData();
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
	
	//
	// Ray cast callback function
	//
	function RayCallback(fixture, point, normal, fraction) {
		if(fixture == player.foot) return -1;
		player.aboveGround = true;
		return 0;
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
		var Text = new TextBox();
		Text.x = x;
		Text.y = y;
		Text.fontSize = 32;
		Text.text = text;
		States.current().world.addChild(Text);
		return Text;
	}
	
	//
	// CreatePlayer - creates the player sprite, physics body, and update functions
	//
	function CreatePlayer(x, y) {
		var player = CreateSprite(x, y, PLAYER_WIDTH_RUNNING, PLAYER_HEIGHT_RUNNING, "sprites/Char.png", -9990);
		player.offsetY = -player.height;
		player.onGround = true;
		player.aboveGround = true;
		player.near = false;//check for whether or not the player is near an interactable obj
		
		var bodyDef = new b2.BodyDef();
		bodyDef.type = b2.Body.b2_dynamicBody;
		bodyDef.position.Set(player.x / PHYSICS_SCALE, (player.y - player.height / 2) / PHYSICS_SCALE);
		player.body = physics.CreateBody(bodyDef);
		
		// Creates the foot sensor
		var fixDef = CreateFixtureDef(0, 0, 0);
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(player.width / 2.05 / PHYSICS_SCALE, 10 / PHYSICS_SCALE, new b2.Vec2(0, player.height / 2 / PHYSICS_SCALE), 0);
		player.foot = player.body.CreateFixture(fixDef);
		player.foot.SetSensor(true);
		player.foot.numContacts = 0;
		
		// Creates the climb sensor
		fixDef = CreateFixtureDef(0, 0, 0);
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(5 / PHYSICS_SCALE, 5 / PHYSICS_SCALE, new b2.Vec2(player.width / 1.8 / PHYSICS_SCALE, -player.height / 1.8 / PHYSICS_SCALE), 0);
		player.reach = player.body.CreateFixture(fixDef);
		player.reach.SetSensor(true);
		player.reach.numContacts = 0;
		
		CreateRunningFixture(player);
		
		player.body.SetUserData(player);
		player.body.SetFixedRotation(true);
		
		player.state = PLAYER_STATE_NORMAL;
		player.maxSpeed = PLAYER_WALK_SPEED;
		player.dashing = false;
		player.sliding = false;
		player.cooldown = 0;
		player.latency = 0;
		player.update = function(d) { 
			// Move the sprite according to the physics body
			var pos = this.body.GetPosition();
			this.x = pos.x * PHYSICS_SCALE;
			this.y = pos.y * PHYSICS_SCALE + this.height / 2;
			this.rotation = this.body.GetAngle();
			if(this.y > VIEWPORT_HEIGHT + this.height / 2) {
				pos = this.checkpoint.body.GetPosition();
				this.body.SetTransform(pos, 0);
			}
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
			this.cooldown--;
			this.onGround = this.foot.numContacts > 0;
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
				this.climbing = this.reach.numContacts > 0;
				var deltaVelocity = this.maxSpeed - velocity.x;
				var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
				this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
				if(gInput.right && !this.dashing && this.cooldown < 0) {
					this.dashing = true;
					this.maxSpeed = PLAYER_DASH_SPEED;
					this.cooldown = PLAYER_DASH_DURATION;
				}
				if(this.dashing && this.cooldown < PLAYER_DASH_DURATION / 2) {
					var deltaMax = PLAYER_RUN_SPEED - this.maxSpeed;
					this.maxSpeed += deltaMax / PLAYER_DASH_DURATION;
					if(Math.abs(deltaMax) < .25) {
						this.maxSpeed = PLAYER_RUN_SPEED;
						this.dashing = false;
						this.cooldown = 15;
					}
				}
				if(gInput.down && !this.sliding && this.cooldown < 0) {
					this.body.DestroyFixture(this.fixture);
					CreateSlidingFixture(this);
					this.sliding = true;
					this.cooldown = PLAYER_SLIDE_DURATION;
				} else if(!gInput.down && this.sliding || this.cooldown < 0) {
					this.body.DestroyFixture(this.fixture);
					CreateRunningFixture(this);
					this.sliding = false;
					this.cooldown = 15;
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
		sprite.width = PLAYER_WIDTH_RUNNING;
		sprite.height = PLAYER_HEIGHT_RUNNING;
		sprite.offsetY = -sprite.height;
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
		sprite.width = PLAYER_WIDTH_SLIDING;
		sprite.height = PLAYER_HEIGHT_SLIDING;
		sprite.offsetY = -sprite.height;
		var fixDef = CreateFixtureDef(10.0, 1.0, 0);
		var scaled_width = sprite.width / PHYSICS_SCALE;
		var scaled_height = sprite.height / PHYSICS_SCALE;
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(scaled_width / 2, scaled_height / 2);
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
					var pos = this.body.GetPosition();
					pos.x += States.current().level.width / PHYSICS_SCALE;
					this.body.SetTransform(pos, 0);
				}
				if(xpos - this.width/2 > States.current().level.width / 2) {
					this.x -= States.current().level.width;
					var pos = this.body.GetPosition();
					pos.x -= States.current().level.width / PHYSICS_SCALE;
					this.body.SetTransform(pos, 0);
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
	// CreateCheckpoint - creates a checkpoint to respawn the player
	//
	function CreateCheckpoint(x, y, respawn) {
		var checkpoint = CreateSprite(x, y, 10, 300, "", 9998);
		ApplyRectBBox(checkpoint, b2.Body.b2_staticBody);
		checkpoint.fixture.SetSensor(true);
		checkpoint.type = "checkpoint";
		if(respawn) {
			checkpoint.update = function(d) {
				var xpos = this.x + States.current().world.x;
				if(xpos + this.width/2 < -States.current().level.width / 2) {
					this.x += States.current().level.width;
					var pos = this.body.GetPosition();
					pos.x += States.current().level.width / PHYSICS_SCALE;
					this.body.SetTransform(pos, 0);
				}
				if(xpos - this.width/2 > States.current().level.width / 2) {
					this.x -= States.current().level.width;
					var pos = this.body.GetPosition();
					pos.x -= States.current().level.width / PHYSICS_SCALE;
					this.body.SetTransform(pos, 0);
				}
			};
		}
		checkpoint.Destroy = function() {
			physics.DestroyBody(this.body);
			States.current().world.removeChild(this);
		};
		return checkpoint;
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


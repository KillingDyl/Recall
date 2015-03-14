/**
 * @author Ducklyn
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
var PLAYER_WIDTH_STANDING = 126;
var PLAYER_HEIGHT_STANDING = 200;
var PLAYER_WIDTH_RUNNING = 125;
var PLAYER_HEIGHT_RUNNING = 100;
var PLAYER_WIDTH_JUMPING = 100;
var PLAYER_HEIGHT_JUMPING = 100;
var PLAYER_WIDTH_SLIDING = 120;
var PLAYER_HEIGHT_SLIDING = 50;
var PLAYER_WIDTH_CLIMBING = 87;
var PLAYER_HEIGHT_CLIMBING = 175;
var PLAYER_STATE_NORMAL = 0;
var PLAYER_STATE_RUNNER = 1;
var PLAYER_STATE_JUMPING = 2;
var PLAYER_STATE_CLIMBING = 3;
var PLAYER_STATE_SLIDING = 4;
var PLAYER_WALK_SPEED = 2;
var PLAYER_RUN_SPEED = 5;
var PLAYER_DASH_SPEED = 10;
var PLAYER_DASH_DURATION = 20;
var PLAYER_SLIDE_DURATION = 120;

var AUDIO = {
	
};

var SPRITES = {
	TITLE: "sprites/Recall_Title.png",
	PLAYER_WALK: "sprites/player_walk_cycle.png",
	PLAYER_RUN: "sprites/player_run_cycle.png",
	PLAYER_JUMP: "sprites/player_jump_cycle.png",
	PLAYER_SLIDE: "sprites/player_slide_cycle.png",
	PLAYER_CLIMB: "sprites/player_climb_cycle.png",
	LEFT_WALL: "sprites/roof_left.png",
	MIDDLE_WALL: "sprites/roof_middle.png",
	MIDDLE_WALL_LIT: "sprites/roof_middle2.png",
	RIGHT_WALL: "sprites/roof_right.png",
	LEFT_WALL_FILL: "sprites/roof_left_fill.png",
	MIDDLE_WALL_FILL: "sprites/roof_middle_fill.png",
	MIDDLE_WALL_FILL_LIT: "sprites/roof_middle2_fill.png",
	RIGHT_WALL_FILL: "sprites/roof_right_fill.png",
	LEFT_DOOR: "sprites/door_left.png",
	RIGHT_DOOR: "sprites/door_right.png",
	MIDDLE_DOOR: "sprites/door_middle.png",
	ROOF_AC: "sprites/rooftop_ac.png",
	ROOF_CHIMNEY: "sprites/rooftop_chimney.png",
	ROOF_CONTAINER: "sprites/rooftop_container.png",
	ROOF_CRATE: "sprites/rooftop_crate.png",
	ROOF_CRATE_DEATH: "sprites/rooftop_crate_death.png",
	ROOF_DOOR: "sprites/rooftop_door.png",
	SKY: "sprites/sky.png",
	BLACK: "sprites/black.png",
	BLUE: "sprites/blue_gradient.png",
	LEFT_TEXT: "sprites/left_text.png",
	RIGHT_TEXT: "sprites/right_text.png",
	BOSS: "sprites/boss.png",
	MALE_TEAMMATE: "sprites/male_teammate.png",
	FEMALE_TEAMMATE: "sprites/female_teammate.png",
	LAB: "sprites/laboratory.png",
	LAB_DESK: "sprites/laboratory_bottom_desk.png",
	OFFICE: "sprites/office.png",
	HALLWAY: "sprites/hallway.png",
	INFORMATION: "sprites/information_screen.png",
	STORAGE: "sprites/storage_room.png",
	STORAGE_DESK: "sprites/storage_room_front_desk.png",
	CAGE: "sprites/mouse_cage.png",
	E: "sprites/ekey.png",
	UP: "sprites/upkey.png",
	DOWN: "sprites/downkey.png",
	LEFT: "sprites/leftkey.png",
	RIGHT: "sprites/rightkey.png",
};

var SPRITE_W = 
{
	WALL: 200,
	WALL_FILL: 200,
	WALL_SIDE_FILL: 178,
	ROOF_CHIMNEY: 31,
	ROOF_CONTAINER: 177,
	ROOF_AC: 127,
	ROOF_DOOR: 190,
	ROOF_CRATE: 213 / 2,
	ROOF_CRATE_DEATH: 350 / 2,
	BOSS: 675,
	MALE_TEAMMATE: 900,
	FEMALE_TEAMMATE: 900,
	LAB: 5100 / 4,
	LAB_DESK: 1768 / 4,
	OFFICE: 3166 / 4,
	HALLWAY: 5100 / 4,
	STORAGE: 3166 / 4,
	STORAGE_DESK: 3166 / 4,
	CAGE: 100,
	LEFT_DOOR: 72,
	RIGHT_DOOR: 72,
	MIDDLE_DOOR: 146,
	KEY: 284 / 4,
};

var SPRITE_H = 
{
	WALL: 360,
	WALL_FILL: 290,
	WALL_SIDE_FILL: 290,
	ROOF_CHIMNEY: 89,
	ROOF_CONTAINER: 240,
	ROOF_AC: 86,
	ROOF_DOOR: 157,
	ROOF_CRATE: 177 / 2,
	ROOF_CRATE_DEATH: 280 / 2,
	BOSS: 436.5,
	MALE_TEAMMATE: 582,
	FEMALE_TEAMMATE: 582,
	LAB: 1680 / 4,
	LAB_DESK: 856 / 4,
	OFFICE: 1680 / 4,
	HALLWAY: 1680 / 4,
	STORAGE: 1680 / 4,
	STORAGE_DESK: 1680 / 4,
	CAGE: 92,
	LEFT_DOOR: 280,
	RIGHT_DOOR: 280,
	MIDDLE_DOOR: 210,
	KEY: 271 / 4,
};

var SPRITE_OFFSET = 
{
	WALL_FILL_W: (SPRITE_W["WALL_FILL"] - SPRITE_W["WALL_SIDE_FILL"]) / 2,
	WALL_FILL_H: (SPRITE_H["WALL"] + SPRITE_H["WALL_FILL"]) / 2,
	ROOF_AC: SPRITE_H["WALL"] / 2 + SPRITE_H["ROOF_AC"] / 2,
	ROOF_CHIMNEY: SPRITE_H["WALL"] / 2 + SPRITE_H["ROOF_CHIMNEY"] / 2,
	ROOF_CONTAINER: SPRITE_H["WALL"] / 2 + SPRITE_H["ROOF_CONTAINER"] / 2,
	ROOF_DOOR: SPRITE_H["WALL"] / 2 + SPRITE_H["ROOF_DOOR"] / 2,
	ROOF_CRATE: SPRITE_H["WALL"] / 2 + SPRITE_H["ROOF_CRATE"] / 2,
};
//
// Initialization
// Set up physics engine and brine engine
//
(function() {
	clearColor = [0,0,0,1];
	use2D = true;
	showConsole = DEBUGMODE;
	
	// Global Variables
	var physics;
	var player;
	var indicator;
	
	gInput.addBool(KEY_LEFT, "left");
	gInput.addBool(KEY_UP, "up");
	gInput.addBool(KEY_RIGHT, "right");
	gInput.addBool(KEY_DOWN, "down");
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
	
	var loadingscreen = new State();
	
	var chat = new State();
	chat.alwaysDraw = false;
	chat.alwaysUpdate = false;
	
	var chat2 = new State();
	chat2.alwaysDraw = false;
	chat2.alwaysUpdate = false;
	
	var chat3 = new State();
	chat3.alwaysDraw = false;
	chat3.alwaysUpdate = false;
	
	var chat4 = new State();
	chat4.alwaysDraw = false;
	chat4.alwaysUpdate = false;
	
	loadingscreen.init = function() {
		this.loading = CreateText(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2, 32, "");
		this.loading.color = "cyan";
		for(var sprite in SPRITES) Textures.load(SPRITES[sprite]);
		for(var audio in AUDIO) Sounds.load(AUDIO[audio]);
	};
	
	loadingscreen.updateState = function(d) {
		this.loading.text = "Loading..." + Math.round((1 - Resources.percentLoaded()) * 100) + "%";
		if(Resources.getLeftToLoad() == 0) {
			for(var child in this.world.children) this.world.removeChild(child);
			States.pop();
			States.push(game);
		}
	};
	
	loadingscreen.world.draw = function(ctx) {
		this.drawChildren(ctx);
		
		var x = VIEWPORT_WIDTH / 2;
		var y = VIEWPORT_HEIGHT / 2;
		ctx.fillStyle = "cyan";
		ctx.fillRect(x - 200, y + 50, 400 * (1 - Resources.percentLoaded()), 25);
		ctx.strokeStyle = "cyan";
		ctx.strokeRect(x - 200, y + 50, 400, 25);
	};

	// Initiates all levels / level order
	new Lab();
	new Office();
	new Hallway();
	new LabScene();
	new Storage();
	new LevelOne();
	new LevelTwo();
	new LevelThree();
	new LevelFour();
	new LevelFive();
	new Title();
	new Credits();
	new Story();
	
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
		
		this.world.state = this;
		println("World Initialized");
		
		player = CreatePlayer(0, 0);//TODO
		indicator = CreateIndicator(0, -250);
		indicator.update = function(d) {
			this.x = player.x;
			this.y = player.y;
		};
		//this.level = Title();
		//this.level.ConstructStory();
		this.level = LabScene();
		this.level.Construct();
	};
	
	game.world.update = function(d) {
		physics.Step(1/60, 10, 10);
		physics.ClearForces();
		
		if(player.state == PLAYER_STATE_NORMAL) {
			this.x = VIEWPORT_WIDTH / 2 - player.x;
			if(this.x > 0) this.x = 0;
			else if(this.x + this.state.level.width - VIEWPORT_WIDTH <= 0) this.x = VIEWPORT_WIDTH - this.state.level.width;
			this.y = 0;
		} else {
			var deltaX = (VIEWPORT_WIDTH / 7 - player.x) - this.x;
			var deltaY = (VIEWPORT_HEIGHT * 0.6 - player.y) - this.y;
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
	
	States.push(loadingscreen);
	
	println("Game Initialized");
	
	//
	// Level objects
	//
	
	// Title Screen
	function Title() {
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.floor = [];
  		this.interactive = [];
  		this.scenery = [];
	   
	  	this.ConstructBase = function() {
	  		this.floor.push(CreateFloorElement(0, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH + 50, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2, 650, VIEWPORT_WIDTH, 100, "", 0, false));
	  	
	    	this.scenery.push(CreateWorldElement(600, 300, 1350, 600, SPRITES["BLUE"], false, false, 100));
       	   	
	  		this.width = VIEWPORT_WIDTH;
	  	};
	  	
	  	this.ConstructStory = function() {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	    	
	    	var background = CreateWorldElement(600, 170, 768.25, 402, SPRITES["TITLE"], true, false, 5);
	    	this.scenery.push(background);
	    	this.scenery.push(CreateText(325,360, 32, "Credits", "cyan"));
	    	this.scenery.push(CreateText(1125,360, 32, "Story", "cyan"));
	    	
			var numeroUno = CreateDoorElement(325, 480, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], SPRITES["MIDDLE_DOOR"], 2, false);
			var numeroDos = CreateDoorElement(725, 480, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], SPRITES["MIDDLE_DOOR"], 2, false);
			var numeroTres = CreateDoorElement(1125, 480, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], SPRITES["MIDDLE_DOOR"], 2, false);
			this.interactive.push(numeroUno);
			this.interactive.push(numeroDos);
			this.interactive.push(numeroTres);
			
			numeroUno.action = function()
			{
				States.current().level.Destruct();
				States.current().level = Credits();
				States.current().level.ConstructStory();
			};
			
			numeroDos.action = function()
			{
				States.current().level.Destruct();
				States.current().level = Lab();
				States.current().level.ConstructStory();
			};
			
			numeroTres.action = function()
			{
				States.current().level.Destruct();
				States.current().level = Story();
				States.current().level.ConstructStory();
			};
	    	
	    	player.body.SetTransform(new b2.Vec2(50/PHYSICS_SCALE,450/PHYSICS_SCALE), 0);
	  		this.constructed = true;
	  		player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Credits
	function Credits() {
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.floor = [];
  		this.interactive = [];
  		this.scenery = [];
	   
	  	this.ConstructBase = function() {
	  		this.floor.push(CreateFloorElement(0, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH + 50, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2, 650, VIEWPORT_WIDTH, 100, "", 0, false));
	  		
	    	this.scenery.push(CreateWorldElement(600, 300, 1350, 600, SPRITES["BLUE"], false, false, 100));
       	   	
	  		this.width = VIEWPORT_WIDTH;
	  	};
	  	
	  	this.ConstructStory = function() {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	  		
	  		var numeroUno = CreateDoorElement(1125, 480, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], SPRITES["MIDDLE_DOOR"], 2, false);
	    	this.interactive.push(numeroUno);
	    	
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 2, 25, 40, "Credits", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 100, 30, "Lead Designers", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 130, 22, "Sterling Salvaterra", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 160, 22, "Ben Filstrup", "cyan"));
	    	
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 250, 30, "Engines Engineers", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 280, 22, "Dylan Tran", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 310, 22, "Sterling Salvaterra", "cyan"));
	    	
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 400, 30, "Lead Artist", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3, 430, 22, "Sam Filstrup", "cyan"));
	    	
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 100, 30, "Lead Programmers", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 130, 22, "Dylan Tran", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 160, 22, "Rahil Shah", "cyan"));
	    	
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 250, 30, "Writers", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 280, 22, "Ben Filstrup", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 310, 22, "Sterling Salvaterra", "cyan"));
	    	
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 400, 30, "Audio Engineer", "cyan"));
	    	this.scenery.push(CreateText(VIEWPORT_WIDTH / 3 * 2, 430, 22, "Ben Filstrup", "cyan"));
	    	
	    	numeroUno.action = function()
			{
				States.current().level.Destruct();
				States.current().level = Title();
				States.current().level.ConstructStory();
			};
	    	
	    	player.body.SetTransform(new b2.Vec2(50/PHYSICS_SCALE,450/PHYSICS_SCALE), 0);

	  		this.constructed = true;
	  		player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Story Explanation
	function Story() { 
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.floor = [];
  		this.interactive = [];
  		this.scenery = [];
	   
	  	this.ConstructBase = function() {
	  		this.floor.push(CreateFloorElement(0, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH + 50, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2, 650, VIEWPORT_WIDTH, 100, "", 0, false));
	  		
	    	this.scenery.push(CreateWorldElement(600, 300, 1350, 600, SPRITES["BLUE"], false, false, 100));
       	   	
	  		this.width = VIEWPORT_WIDTH;
	  	};
	  	
	  	this.ConstructStory = function() {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	  		
	  		var numeroUno = CreateDoorElement(1125, 480, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], SPRITES["MIDDLE_DOOR"], 2, false);
	    	this.interactive.push(numeroUno);
	    	
	    	var story = CreateText(600, 225, 40, "Story:\n\n You play as Remy, a scientist that works on memory \nalteration. Successful tests on mice have yielded positive \nresults, but not enough to impress your superiors. As a result, \nyour funding gets cut, leaving your research and efforts wasted. \nIn a final desperate attempt, you experiment on yourself, \ncausing your reality and perception to collapse. Now, it's \nyour job to figure out who you are, where you \nare, and if the things you see are real.", "cyan");
	    	this.scenery.push(story);
	    	
	    	numeroUno.action = function()
			{
				States.current().level.Destruct();
				States.current().level = Title();
				States.current().level.ConstructStory();
			};
	    	
	    	player.body.SetTransform(new b2.Vec2(50/PHYSICS_SCALE,450/PHYSICS_SCALE), 0);

	  		this.constructed = true;
	  		player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.Destruct = function() { 
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Story One - Contains Construct and ConstructStory
	function Lab() {
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.floor = [];
  		this.interactive = [];
  		this.scenery = [];
	   
	  	this.ConstructBase = function() {
	  		this.floor.push(CreateFloorElement(0, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(1300, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(SPRITE_W["LAB"] / 2, 550, SPRITE_W["LAB"], 100, "", 0, false));
	  	
	    	this.scenery.push(CreateWorldElement(1500, 1500, 3000, 3000, SPRITES["BLACK"], false, false, 100));
			this.scenery.push(CreateWorldElement(SPRITE_W["LAB"] / 2, 400, SPRITE_W["LAB"], SPRITE_H["LAB"], SPRITES["LAB"], false, false, 3));
			this.scenery.push(CreateWorldElement(700,500,SPRITE_W["LAB_DESK"],SPRITE_H["LAB_DESK"],SPRITES["LAB_DESK"], false, false,-1));
       	   	
	  		this.width = SPRITE_W["LAB"];
	  	};
	  	
	  	this.Construct = function(spawn) {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	  		var left_door = CreateDoorElement(52, 369, SPRITE_W["LEFT_DOOR"], SPRITE_H["LEFT_DOOR"], SPRITES["LEFT_DOOR"], 2, false);
			left_door.action = function() {
				States.current().level.Destruct();
				States.current().level = Hallway(); 
				States.current().level.Construct(new b2.Vec2(1214 / PHYSICS_SCALE, 500 / PHYSICS_SCALE));
			};
			this.interactive.push(left_door);
			var middle_door = CreateDoorElement(639 , 360, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], SPRITES["MIDDLE_DOOR"], 2, false);
			middle_door.action = function() {
				States.current().level.Destruct();
				States.current().level = Office(); 
				States.current().level.Construct();
			};
			this.interactive.push(middle_door);
			var right_door = CreateDoorElement(1214, 369, SPRITE_W["RIGHT_DOOR"], SPRITE_H["RIGHT_DOOR"], SPRITES["RIGHT_DOOR"], 2, false);
			right_door.action = function() {
				States.current().level.Destruct();
				States.current().level = Storage(); 
				States.current().level.Construct();
			};
       		this.interactive.push(right_door);
       		player.body.SetTransform(spawn, 0);
	  		this.constructed = true;
	  		player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.ConstructStory = function() {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	  		var sensor = CreateWorldElement(850, 370, 10, 500,"", true, true, 400);
	        sensor.Enter = function(){
   	    		States.push(chat);
				var text_image = CreateWorldElement(995,275, 200,125,SPRITES["RIGHT_TEXT"], false, false, 1);
				var text = CreateText(995,250, 16, "Remy, over here.");
				var text2 = CreateText(995,285,14, "E to intEract.");
				chat.world.update = function(d) {
					if(gInput.E) {
						this.removeChild(text);
						this.removeChild(text2);
						States.pop();
					}
				};
       	    };
       	    this.interactive.push(sensor);
	    	
	    	var tutorial = CreateText(400, 240, 32, "to move");
	    	var leftkey = CreateIndicator(-SPRITE_W["KEY"] * 2 - 50, 0);
	    	var rightkey = CreateIndicator(-SPRITE_W["KEY"] - 50, 0);
	    	ShowIndicator(tutorial, leftkey, SPRITES["LEFT"]);
	    	ShowIndicator(tutorial, rightkey, SPRITES["RIGHT"]);
	    	this.scenery.push(tutorial);
	    	this.scenery.push(leftkey);
	    	this.scenery.push(rightkey);
	    	this.scenery.push(CreateDoorElement(52, 369, SPRITE_W["LEFT_DOOR"], SPRITE_H["LEFT_DOOR"], SPRITES["LEFT_DOOR"], 2, true));
			this.interactive.push(CreateDoorElement(639 , 360, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], SPRITES["MIDDLE_DOOR"], 2, true));
			var right_door = CreateDoorElement(1214, 369, SPRITE_W["RIGHT_DOOR"], SPRITE_H["RIGHT_DOOR"], SPRITES["RIGHT_DOOR"], 2, false);
			right_door.action = function() {
				States.current().level.Destruct();
				States.current().level = LevelOne(); ///change back to one after test
				States.current().level.Construct();
			};
       		this.interactive.push(right_door);
	    	
	    	player.body.SetTransform(new b2.Vec2(450/PHYSICS_SCALE,405/PHYSICS_SCALE), 0);
	  		this.constructed = true;
	  		player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Story Two - Contains Construct and ConstructStory
	function Office() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
  		this.floor = [];
  		this.interactive = [];
  		this.scenery = [];
	  
	  	this.ConstructBase = function() {
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2 - SPRITE_W["OFFICE"] / 2 - 50, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2 + SPRITE_W["OFFICE"] / 2 + 50, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2, 580, SPRITE_W["OFFICE"], 100, "", 0, false));
	  		
			// Background
	    	this.scenery.push(CreateWorldElement(1500, 1500, 3000, 3000, SPRITES["BLACK"], false, false, 100));
			this.scenery.push(CreateWorldElement(VIEWPORT_WIDTH / 2, 400, SPRITE_W["OFFICE"], SPRITE_H["OFFICE"], SPRITES["OFFICE"], false, false, 3));
		    
		    this.width = VIEWPORT_WIDTH;
	  	};
	  	
	  	this.Construct = function(spawn) {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	  		
	  		this.scenery.push(CreateText(VIEWPORT_WIDTH / 2, 240, 32, "E in the Center to return"));
	  		var middle_door = CreateDoorElement(VIEWPORT_WIDTH / 2 , 400, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"], "", 2, false);
			middle_door.action = function() {
				States.current().level.Destruct();
				States.current().level = Lab(); 
				States.current().level.Construct(new b2.Vec2(639 / PHYSICS_SCALE, 500 / PHYSICS_SCALE));
			};
			this.interactive.push(middle_door);
			player.body.SetTransform(new b2.Vec2(400/PHYSICS_SCALE,505/PHYSICS_SCALE), 0);
	  	    this.constructed = true;
	  	    player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.ConstructStory = function() {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	  		
	  		var sensor = CreateWorldElement(337.5, 277.5, 10, 500,"", true, true, 400);
	        sensor.Enter = function(){
   	    		States.push(chat2);
   	    		//var i = 0;
   	    		world.dialogue = [];
   	    		world.dialogue[0] = "Sir, what do you want \nto speak to me about?";
   	  			world.dialogue[1] = "Remy, as you know, the \ncompany has been \nstruggling a bit financially \nin recent months.";
   	  			world.dialogue[2] = "Yes.";
   	   			world.dialogue[3] = "I'm gonna be blunt with \nyou. We can't continue \nto support your research.";
   	   			world.dialogue[4] = "We haven't seen the \nsignificant advances with \nwe were looking for.";
   	   			world.dialogue[5] = "But all the time we spent \non it! What will I tell \nthe team?!";
   	   		 	world.dialogue[6] = "I'm sorry Remy, it was \na corporate decision.\nIt's out of my hands.";
   	    	
				var text_image = CreateWorldElement(500,275, 200, 125,SPRITES["LEFT_TEXT"], false, false, 1);

				var text = CreateText(500,268, 16, world.dialogue[0]);
					text.center = true;
					
				var count= 0;
				var pressed = false;
				chat2.world.update = function(d) {
					text.text = world.dialogue[count];
					if(gInput.E && !pressed){
						pressed = true;
					}
					if (!gInput.E && pressed){
						count++;
						pressed = false;
					}	
					if(count == world.dialogue.length){
						States.pop();
						States.current().level.Destruct();
					    States.current().level = LabScene();
					    States.current().level.Construct();
					}
					if(count == 1 || count == 3 || count == 6){
						text_image.image = Textures.load(SPRITES["RIGHT_TEXT"]);
						text_image.x = 445;
						text.x = 445;
						
					}
					if(count == 2 || count == 5){
						text_image.image = Textures.load(SPRITES["LEFT_TEXT"]);
						text_image.x = 500;
						text.x = 500;
			
					}
				};
       	    };
       	    this.interactive.push(sensor);
       	    this.scenery.push(CreateWorldElement(550,440,SPRITE_W["BOSS"],SPRITE_H["BOSS"],SPRITES["BOSS"],false, false, -1));
       	    
       	    player.body.SetTransform(new b2.Vec2(400/PHYSICS_SCALE,505/PHYSICS_SCALE), 0);
	  	    this.constructed = true;
	  	    player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Story Three - Contains Construct
	function LabScene() {
		if (arguments.callee._singletonInstance)
	    return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
			
	  		this.floor.push(CreateFloorElement(SPRITE_W["LAB"] / 2, 550, SPRITE_W["LAB"], 100, "", 0, false));
	  	
	    	this.scenery.push(CreateWorldElement(1500, 1500, 3000, 3000, SPRITES["BLACK"], false, false, 100));
			this.scenery.push(CreateWorldElement(VIEWPORT_WIDTH / 2, 400, SPRITE_W["LAB"], SPRITE_H["LAB"], SPRITES["LAB"], false, false, 3));
			this.scenery.push(CreateWorldElement(VIEWPORT_WIDTH / 2 + 50,500,SPRITE_W["LAB_DESK"],SPRITE_H["LAB_DESK"],SPRITES["LAB_DESK"], false, false,-1));
			
			this.interactive.push(CreateDoorElement(VIEWPORT_WIDTH / 2 + 1.5 , 360, SPRITE_W["MIDDLE_DOOR"], SPRITE_H["MIDDLE_DOOR"],SPRITES["MIDDLE_DOOR"], 2, true));
			this.interactive.push(CreateDoorElement(13, 369, SPRITE_W["LEFT_DOOR"], SPRITE_H["LEFT_DOOR"],SPRITES["LEFT_DOOR"], 2, true));
			this.interactive.push(CreateDoorElement(VIEWPORT_WIDTH - 22 , 369, SPRITE_W["RIGHT_DOOR"], SPRITE_H["RIGHT_DOOR"],SPRITES["RIGHT_DOOR"], 2, true));
			var female = CreateWorldElement(VIEWPORT_WIDTH / 2 - 100,450,SPRITE_W["FEMALE_TEAMMATE"],SPRITE_H["FEMALE_TEAMMATE"],SPRITES["FEMALE_TEAMMATE"],false, false, 0);
			this.scenery.push(female);
			var male = CreateWorldElement(VIEWPORT_WIDTH / 2 + 150,475,SPRITE_W["MALE_TEAMMATE"],SPRITE_H["MALE_TEAMMATE"],SPRITES["MALE_TEAMMATE"],false, false, 0);
			this.scenery.push(male);
			
			var sensor = CreateWorldElement(VIEWPORT_WIDTH / 2 + 75, 370, 10, 500,"", true, true, 400);
			var sensor1 = CreateWorldElement(VIEWPORT_WIDTH / 2 - 75, 370, 10, 500,"", true, true, 400);
	        this.interactive.push(sensor);
	        this.interactive.push(sensor1);
	       
	        sensor.Enter = function(){
   	    		States.push(chat3);
   	    		//var i = 0;
   	    		world.dialogue = [];
   	    		world.dialogue[0] = "...so I guess it's \nbest we start \nlooking for other work."; // Remy
   	    		world.dialogue[1] = "This is outrageous! \nAfter all the \ntime we spent?"; //female
   	    		world.dialogue[2] = "All those \nhours...wasted!?"; //female
   	    		world.dialogue[3] = "0x57 0x68 \n0x79 0x3F"; //male
   	    		world.dialogue[4] = "Alex...\nwhat did yo---"; //Remy
   	    		world.dialogue[5] = "#o !h@t, ^t'$ \n*&l g(@b)%e r#s)\n(rc# @8w? \nU0&les7$?"; // female
   	    		world.dialogue[6] = "What's \ngoing on...?"; //Remy
   	    		
				var text_image = CreateWorldElement(415,250, 220,265,SPRITES["LEFT_TEXT"], false, false, 1);
				
				
				var text = CreateText(415,250, 16, world.dialogue[0]);
					text.center = true;
					
				var count= 0;
				var pressed = false;
				chat3.world.update = function(d) {
					
				text.text = world.dialogue[count];
				if(gInput.E && !pressed){
					pressed = true;
				}
				if (!gInput.E && pressed){
					count++;
					pressed = false;
				}	
				if(count == world.dialogue.length){
					States.pop();
					States.current().level.Destruct();
				    States.current().level = LevelTwo(); ///change back to one after test
				    States.current().level.Construct();
				}
				
				if(count == 1 || count == 2 || count == 5){ // girl
						text_image.image = Textures.load(SPRITES["RIGHT_TEXT"]);
						text_image.x = 150;
						text.x = 150;
						text_image.y = 280;
						text.y = 280;
						
					}
				else if(count == 3){ // guy
						text_image.image = Textures.load(SPRITES["LEFT_TEXT"]);
						text_image.x = 550;
						text.x = 550;
						text_image.y = 300;
						text.y = 300;
					}
				else
					{
						text_image.image = Textures.load(SPRITES["LEFT_TEXT"]);
						text_image.x = 415;
						text.x = 415;
						text_image.y = 250;
						text.y = 250;
					}
				};
       	    };
       	    sensor1.Enter = sensor.Enter;
       	    
		    this.width = VIEWPORT_WIDTH;
	  	    this.constructed = true;
	  	    player.body.SetTransform(new b2.Vec2(VIEWPORT_WIDTH / 2 /PHYSICS_SCALE,475/PHYSICS_SCALE), 0);
	  	};	
	
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		//for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		//this.obstacle = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	};
	
	// Story Four - Contains Construct and ConstructStory
	function Hallway(){ 
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.floor = [];
  		this.interactive = [];
  		this.scenery = [];
  		
  		this.ConstructBase = function() {
  			var left_wall = CreateFloorElement(0, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false);
	  		this.floor.push(left_wall);
	  		var right_wall = CreateFloorElement(1300, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false);
	  		this.floor.push(right_wall);
	  		this.floor.push(CreateFloorElement(SPRITE_W["HALLWAY"] / 2, 550, SPRITE_W["HALLWAY"], 100, "", 0, false));
	    	this.scenery.push(CreateWorldElement(1500, 1500, 3000, 3000, SPRITES["BLACK"], false, false, 100));
	  		var background = CreateWorldElement(SPRITE_W["HALLWAY"] / 2, 400, SPRITE_W["HALLWAY"], SPRITE_H["HALLWAY"], SPRITES["HALLWAY"], false, false, 3);
			this.scenery.push(background);
			var info_screen = CreateWorldElement(475,338,442,214,SPRITES["INFORMATION"], false, false, 2);
			this.scenery.push(info_screen);
			
	  		this.width = SPRITE_W["HALLWAY"];
  		};
  		
  		this.Construct = function(spawn) {
  			if(this.constructed) return;
	  		this.ConstructBase();
	  		var left_door = CreateDoorElement(52, 369, SPRITE_W["LEFT_DOOR"], SPRITE_H["LEFT_DOOR"], SPRITES["LEFT_DOOR"], 2, true);
			this.interactive.push(left_door);
			var right_door = CreateDoorElement(1214, 369, SPRITE_W["RIGHT_DOOR"], SPRITE_H["RIGHT_DOOR"], SPRITES["RIGHT_DOOR"], 2, false);
			right_door.action = function() {
				States.current().level.Destruct();
				States.current().level = Lab();
				States.current().level.Construct(new b2.Vec2(100 / PHYSICS_SCALE, 500 / PHYSICS_SCALE));
			};
       		this.interactive.push(right_door);
       		
	  		player.body.SetTransform(spawn, 0);
	  	    this.constructed = true;
	  	    player.ChangeState(PLAYER_STATE_NORMAL);
  		};
	   
	  	this.ConstructStory = function() {
	  		if(this.constructed) return;
	  		this.ConstructBase();
			
			var sensor = CreateWorldElement(900, 370, 10, 500,"", true, true, 400);
	        this.interactive.push(sensor);
				sensor.Enter = function(){
   	    		States.push(chat4);
   	    		//var i = 0;
   	    		world.dialogue = [];
   	    		world.dialogue[0] = "Morning Rob!"; // counter
   	    		world.dialogue[1] = "R-...Rob?"; // Remy
   	    		world.dialogue[2] = "Is...something \nwrong?"; // counter
   	    		world.dialogue[3] = "You just...\nbut I'm not..."; // Remy 
   	    		world.dialogue[4] = "No. Nothings \nwrong. Sorry."; //Remy
   	    		
				var text_image = CreateWorldElement(565,240, 220,265,SPRITES["RIGHT_TEXT"], false, false, 1);
				
				
				var text = CreateText(565,240, 16, world.dialogue[0]);
					text.center = true;
					
				var count= 0;
				var pressed = false;
				chat4.world.update = function(d) {
					
				text.text = world.dialogue[count];
				if(gInput.E && !pressed){
					pressed = true;
				}
				if (!gInput.E && pressed){
					count++;
					pressed = false;
				}	
				
				if(count == world.dialogue.length){ //TODO Need to make it allow me to break from chat loop so I can interact with door
						States.pop();
						States.current().level.Destruct();
					    States.current().level = LevelTwo();
					    States.current().level.ConstructLoop();
					}
				
				if(count == 1 || count == 3 || count == 4){ // Remy
						text_image.image = Textures.load(SPRITES["RIGHT_TEXT"]);
						text_image.x = 340;
						text.x = 340;
						text_image.y = 260;
						text.y = 260;
						
					}
				else
					{
						text_image.image = Textures.load(SPRITES["LEFT_TEXT"]);
						text_image.x = 565;
						text.x = 565;
						text_image.y = 240;
						text.y = 240;
					}
				};
       	    };
			
			var left_door = CreateDoorElement(52, 369, SPRITE_W["LEFT_DOOR"], SPRITE_H["LEFT_DOOR"], SPRITES["LEFT_DOOR"], 2, true);
			this.interactive.push(left_door);
			var right_door = CreateDoorElement(1214, 369, SPRITE_W["RIGHT_DOOR"], SPRITE_H["RIGHT_DOOR"], SPRITES["RIGHT_DOOR"], 2, false);
			right_door.action = function() {
				States.current().level.Destruct();
				States.current().level = Lab();
				States.current().level.Construct();
			};
       		this.interactive.push(right_door);
       	   	
			player.body.SetTransform(new b2.Vec2(200/PHYSICS_SCALE,400/PHYSICS_SCALE), 0);
	  	    this.constructed = true;
	  	    player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
	  	
	  	this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Storage Room - Contains Construct
	function Storage() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.floor = [];
  		this.interactive = [];
  		this.scenery = [];
  		
  		this.ConstructBase = function() {
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2 - SPRITE_W["STORAGE"] / 2 - 50, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2 + SPRITE_W["STORAGE"] / 2 + 50, VIEWPORT_HEIGHT / 2, 100, VIEWPORT_HEIGHT, "", 0, false));
	  		this.floor.push(CreateFloorElement(VIEWPORT_WIDTH / 2, 550, SPRITE_W["STORAGE"], 100, "", 0, false));
			// Background
	    	this.scenery.push(CreateWorldElement(1500, 1500, 3000, 3000, SPRITES["BLACK"], false, false, 100));
			this.scenery.push(CreateWorldElement(VIEWPORT_WIDTH / 2, 400, SPRITE_W["STORAGE"], SPRITE_H["STORAGE"], SPRITES["STORAGE"], false, false, 3));
			this.scenery.push(CreateWorldElement(VIEWPORT_WIDTH / 2, 400, SPRITE_W["STORAGE_DESK"], SPRITE_H["STORAGE_DESK"], SPRITES["STORAGE_DESK"], false, false, -3));
		    
		    this.width = VIEWPORT_WIDTH;
	  	};
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		this.ConstructBase();
	  		
	  		var cage = CreateWorldElement(525, 425, SPRITE_W["CAGE"], SPRITE_H["CAGE"], SPRITES["CAGE"], true, true, -4);
	  		cage.action = function() {
	  			States.current().level.Destruct();
	  			States.current().level = LevelFive();
	  			States.current().level.Construct();
	  		};
	  		this.interactive.push(cage);
	  		
	  		var left_door = CreateDoorElement(257, 369, SPRITE_W["LEFT_DOOR"], SPRITE_H["LEFT_DOOR"], SPRITES["LEFT_DOOR"], 2, false);
			left_door.action = function() {
				States.current().level.Destruct();
				States.current().level = Lab(); 
				States.current().level.Construct(new b2.Vec2(1214 / PHYSICS_SCALE, 500 / PHYSICS_SCALE));
			};
			this.interactive.push(left_door);
			player.body.SetTransform(new b2.Vec2(257/PHYSICS_SCALE,500/PHYSICS_SCALE), 0);
	  	    this.constructed = true;
	  	    player.ChangeState(PLAYER_STATE_NORMAL);
	  	};
  		
  		this.Destruct = function() { 
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.floor = [];
	  		this.interactive = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	};
	
	// Tutorial - Contains Construct
	function LevelOne() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.checkpoint = [];
  		this.floor = [];
  		this.fill = [];
  		this.interactive = [];
  		this.obstacle = [];
  		this.scenery = [];
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		var x = 100;
			var y = 450;
			
			this.checkpoint[0] = CreateCheckpoint(x, y - 200, true);
			
			this.scenery.push(CreateBackground(SPRITES["SKY"]));
			
			//Floors
			//1
			x = 100;
			y = 450;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			var jumptutorial = CreateRunnerElement(x - 600, 200, 1000, 400, "", true, true, 100);
			jumptutorial.Enter = function() {
	    		ShowIndicator(player, indicator, SPRITES["UP"]);
			};
			this.interactive.push(jumptutorial);
			
			//2
			x += 500;
			buildingLength = 8;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			//3
			x += 500;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//4		
			x += 500;
			makeBuilding.call(this, x, y, 15);
			x = fillBuilding.call(this, x, y, 15);
			//floor 4 obstacles
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			var slidetutorial = CreateRunnerElement(x - 2000, 200, 1000, 400, "", true, true, 100);
			slidetutorial.Enter = function() {
	    		ShowIndicator(player, indicator, SPRITES["DOWN"]);
			};
			this.interactive.push(slidetutorial);
			
			//5
			x += 500;
			makeBuilding.call(this, x, y, 6);
			x = fillBuilding.call(this, x, y, 6);
			//floor 5 obstacles
			this.obstacle.push(CreateSlideElement(x - 500, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//6
			x += 500;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			//floor 6 obstacles
			this.obstacle.push(CreateDashElement(x - 600, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 600, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			var dashtutorial = CreateRunnerElement(x - 900, 200, 600, 400, "", true, true, 100);
			dashtutorial.Enter = function() {
	    		ShowIndicator(player, indicator, SPRITES["RIGHT"]);
			};
			this.interactive.push(dashtutorial);
			
			//7
			x += 500;
			y = 250;
			makeBuilding.call(this, x, y, 6);
			x = fillBuilding.call(this, x, y, 6);
			//floor 7 obstacles
			this.obstacle.push(CreateDashElement(x - 700, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 700, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			
			//8
			x += 500;
			y = 150;
			makeBuilding.call(this, x, y, 6);
			x = fillBuilding.call(this, x, y, 6);
			//floor 8 obstacles
			this.obstacle.push(CreateRunnerElement(x - 600, y-SPRITE_OFFSET["ROOF_CHIMNEY"], SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			
			//9
			x += 600;
			y = 450;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			//floor 9 obstacle
			this.obstacle.push(CreateRunnerElement(x - 1000, y-SPRITE_OFFSET["ROOF_CHIMNEY"], SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			
			//10
			x += 500;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			//11
			x += 500;
			y = 250;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor 11 obstacles
			this.obstacle.push(CreateSlideElement(x - 500, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//12
			x += 500;
			y = 550;
			makeBuilding.call(this, x, y, 7);
			x = fillBuilding.call(this, x, y, 7);
			//floor 12 obstacles
			this.obstacle.push(CreateDashElement(x - 700, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 700, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			
			//13
			x += 500;
			y = 450;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			
			var sensor = CreateRunnerElement(x, 100, 10, 500,"", true, true, 400);
	        sensor.Enter = function(){
   	    		States.current().level.Destruct();
				States.current().level = Office();
				States.current().level.ConstructStory();
       	    };
       	  	this.interactive.push(sensor);
       	    
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
			this.width += 500;
	  		this.constructed = true;
	  		player.checkpoint = this.checkpoint[0];
	  		player.body.SetTransform(player.checkpoint.body.GetPosition(), 0);
	  		player.ChangeState(PLAYER_STATE_RUNNER);
		};
		
		this.Reset = function() {
	  		for(var i = 0; i < this.obstacle.length; i++) if(this.obstacle[i].Reset) this.obstacle[i].Reset();
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.checkpoint = [];
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacle = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Contains Construct and ConstructLoop
	function LevelTwo() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.checkpoint = [];
  		this.floor = [];
  		this.fill = [];
  		this.interactive = [];
  		this.obstacle = [];
  		this.scenery = [];
	  	
	  	this.ConstructBase = function() {
	  		////work after this
	  		var x = 100;
			var y = 450;
			
			this.checkpoint[0] = CreateCheckpoint(x, y - 200, true);
			
			this.scenery.push(CreateBackground(SPRITES["SKY"]));
	  		
			//Floors
			//1
			x = 100;
			y = 450;
			makeBuilding.call(this, x, y, 20);
			x = fillBuilding.call(this, x, y, 20);
			//floor 1 obstacles
			this.obstacle.push(CreateRunnerElement(x - 3000, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 2300, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 1600, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateRunnerElement(x - 400, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//2
			x += 500;
			y = 550;
			makeBuilding.call(this, x, y, 15);
			x = fillBuilding.call(this, x, y, 15);
			//floor 2 obstacles
			this.obstacle.push(CreateRunnerElement(x - 2600, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 1600, y-SPRITE_OFFSET["ROOF_CHIMNEY"], SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 1000, y-SPRITE_OFFSET["ROOF_AC"], SPRITE_W["ROOF_AC"], SPRITE_H["ROOF_AC"], SPRITES["ROOF_AC"], true, false, 0));
			
			//3
			x += 500;
			y = 500;
			x = makeBuilding.call(this, x, y, 60);
			//floor 3 obstacles
			this.obstacle.push(CreateRunnerElement(x - 11500, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateSlideElement(x - 11000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 10000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 9000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 8000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 7000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 6000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 5000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 4000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 3000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateRunnerElement(x - 2000, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 1000, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//4
			x += 500;
			y = 450;
			makeBuilding.call(this, x, y, 15);
			x = fillBuilding.call(this, x, y, 15);
			//floor 4 obstacles
			this.obstacle.push(CreateRunnerElement(x - 2000, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 1000, y-SPRITE_OFFSET["ROOF_AC"], SPRITE_W["ROOF_AC"], SPRITE_H["ROOF_AC"], SPRITES["ROOF_AC"], true, false, 0));
			
			//5
			x += 500;
			y = 500;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor 5 obstacles
			this.obstacle.push(CreateRunnerElement(x - 400, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//6
			x += 500;
			y = 550;
			makeBuilding.call(this, x, y, 0);
			x = fillBuilding.call(this, x, y, 0);
			
			//7
			x += 500;
			y = 600;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//8
			x += 500;
			y = 450;
			makeBuilding.call(this, x, y, 12);
			x = fillBuilding.call(this, x, y, 12);
			//floor 8 obstacles
			this.obstacle.push(CreateRunnerElement(x - 2000, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateRunnerElement(x - 400, y-SPRITE_OFFSET["ROOF_AC"], SPRITE_W["ROOF_AC"], SPRITE_H["ROOF_AC"], SPRITES["ROOF_AC"], true, false, 0));
	        
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
		};
		
		this.Construct = function() {
			if(this.constructed) return;
			this.ConstructBase();
			
			var sensor = CreateRunnerElement(this.width, 200, 10, 500,"", true, true, 400);
	        this.interactive.push(sensor);
	        sensor.Enter = function(){
   	    		States.current().level.Destruct();
				States.current().level = Hallway();
				States.current().level.ConstructStory();
       	    };
       	    
       	    this.constructed = true;
	  		player.checkpoint = this.checkpoint[0];
	  		player.body.SetTransform(player.checkpoint.body.GetPosition(), 0);
			player.ChangeState(PLAYER_STATE_RUNNER);
		};
		
		this.ConstructLoop = function() {
			if(this.constructed) return;
			this.ConstructBase();
			
			var sensor = CreateRunnerElement(this.width - 400, 200, 200, 500, SPRITES["BOSS"], true, true, 400);
			sensor.cycles = 0;
	        this.interactive.push(sensor);
	        sensor.Enter = function() {
	        	this.cycles++;
	        	if(this.cycles >= 2) console.log("PRESS E DUMBFUCK");
	        };
	        sensor.action = function(){
   	    		States.current().level.Destruct();
				States.current().level = LevelFour();
				States.current().level.Construct();
       	    };
			
			this.constructed = true;
	  		player.checkpoint = this.checkpoint[0];
	  		player.body.SetTransform(player.checkpoint.body.GetPosition(), 0);
			player.ChangeState(PLAYER_STATE_RUNNER);
		};
		
		this.Reset = function() {
	  		for(var i = 0; i < this.obstacle.length; i++) if(this.obstacle[i].Reset) this.obstacle[i].Reset();
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.checkpoint = [];
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacle = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Contains Construct
	function LevelThree() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.checkpoint = [];
  		this.floor = [];
  		this.fill = [];
  		this.interactive = [];
  		this.obstacle = [];
  		this.scenery = [];
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		
	  		////work after this
	  		var x = 100;
			var y = 350;
			
			this.checkpoint[0] = CreateCheckpoint(x, y - 200, true);
			
			this.scenery.push(CreateBackground(SPRITES["SKY"]));
	  		
			//Floors
			//1
			x = 100;
			y = 350;
			makeBuilding.call(this, x, y, 7);
			x = fillBuilding.call(this, x, y, 7);
			
			//2
			x += 575;
			y = 700;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			//floor 2 obstacles
			this.obstacle.push(CreateRunnerElement(x - 1500, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 500, y-SPRITE_OFFSET["ROOF_AC"], SPRITE_W["ROOF_AC"], SPRITE_H["ROOF_AC"], SPRITES["ROOF_AC"], true, false, 0));
			
			//3
			x += 550;
			y = 500;
			makeBuilding.call(this, x, y, 15);
			x = fillBuilding.call(this, x, y, 15);
			//floor 3 obstacles
			this.obstacle.push(CreateSlideElement(x - 2500, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateRunnerElement(x, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//4
			x += 600;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor 4 obstacles
			this.obstacle.push(CreateRunnerElement(x - 400, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//5
			x += 400;
			y = 275;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor 5 obstacles
			this.obstacle.push(CreateDashElement(x - 200, y - SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 200, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			
			//6
			x += 400;
			y = 550;
			makeBuilding.call(this, x, y, 7);
			x = fillBuilding.call(this, x, y, 7);
			
			//7
			x += 400;
			y = 275;
			makeBuilding.call(this, x, y, 15);
			x = fillBuilding.call(this, x, y, 15);
			//floor 7 obstacles
			this.obstacle.push(CreateRunnerElement(x - 1800, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateDashElement(x - 100, y - SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 100, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			
			//8
			x += 600;
			y = 800;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			//floor 8 obstacles
			this.obstacle.push(CreateRunnerElement(x - 400, y-SPRITE_OFFSET["ROOF_AC"], SPRITE_W["ROOF_AC"], SPRITE_H["ROOF_AC"], SPRITES["ROOF_AC"], true, false, 0));
			
			//9
			x += 400;
			y = 575;
			makeBuilding.call(this, x, y, 6);
			x = fillBuilding.call(this, x, y, 6);
			
			//10
			x += 500;
			y = 635;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//11
			x += 500;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//12
			x += 500;
			y = 650;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor 12 obstacles
			this.obstacle.push(CreateSlideElement(x, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//13
			x += 350;
			y = 850;
			makeBuilding.call(this, x, y, 15);
			x = fillBuilding.call(this, x, y, 15);
			//floor 13 obstacles
			this.obstacle.push(CreateRunnerElement(x - 3200, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateDashElement(x - 2400, y - SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 2400, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			this.obstacle.push(CreateRunnerElement(x - 1200, y-SPRITE_OFFSET["ROOF_AC"], SPRITE_W["ROOF_AC"], SPRITE_H["ROOF_AC"], SPRITES["ROOF_AC"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x - 600, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//14
			x += 650;
			y = 600;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			//floor 14 obstacles
			this.obstacle.push(CreateRunnerElement(x - 1200, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateSlideElement(x - 400, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//15
			x += 650;
			y = 500;
			makeBuilding.call(this, x, y, 15);
			x = fillBuilding.call(this, x, y, 15);
			//floor 15 obstacles
			this.obstacle.push(CreateDashElement(x - 2000, y - SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 2000, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//16
			x += 500;
			y = 350;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			var sensor = CreateRunnerElement(x, 200, 10, 500,"", true, true, 400);
	        this.interactive.push(sensor);
	        sensor.Enter = function(){
   	    		States.current().level.Destruct();
				States.current().level = Lab();
				States.current().level.Construct(new b2.Vec2(4, 5));
       	    };
	        
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
			this.width += 500;
	  		this.constructed = true;
	  		player.checkpoint = this.checkpoint[0];
	  		player.body.SetTransform(player.checkpoint.body.GetPosition(), 0);
	  		player.ChangeState(PLAYER_STATE_RUNNER);
		};
		
		this.Reset = function() {
	  		for(var i = 0; i < this.obstacle.length; i++) if(this.obstacle[i].Reset) this.obstacle[i].Reset();
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.checkpoint = [];
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacle = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Contains Construct
	function LevelFour() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.checkpoint = [];
  		this.floor = [];
  		this.fill = [];
  		this.interactive = [];
  		this.obstacle = [];
  		this.scenery = [];
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		
	  		////work after this
	  		var x = 100;
			var y = 350;
			
			this.checkpoint[0] = CreateCheckpoint(x, y - 200, true);
			
			this.scenery.push(CreateBackground(SPRITES["SKY"]));
			
			//Floors
			//1
			x = 100;
			y = 350;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			//2
			x += 500;
			y = 550;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor obstacles 2
			this.obstacle.push(CreateRunnerElement(x - 1000, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//3
			x += 500;
			y = 550;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor obstacles3
			this.obstacle.push(CreateSlideElement(x, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//4
			x += 180;
			y = 800;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			
			//5
			x += 550;
			y = 800;
			makeBuilding.call(this, x, y, 8);
			x = fillBuilding.call(this, x, y, 8);
			//floor obstacles 5
			this.obstacle.push(CreateRunnerElement(x - 800, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateSlideElement(x - 200, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//6
			x += 500;
			y = 500;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//7
			x += 500;
			y = 500;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			//floor obstacles7
			this.obstacle.push(CreateDashElement(x - 100, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 100, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 100, y-SPRITE_OFFSET["ROOF_CRATE"] - 2 * SPRITE_H["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 200, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 200, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 200, y-SPRITE_OFFSET["ROOF_CRATE"] - 2 * SPRITE_H["ROOF_CRATE"], -10));
			
			//8
			x += 500;
			y = 600;
			makeBuilding.call(this, x, y, 2);
			x = fillBuilding.call(this, x, y, 2);
			
			//9
			x += 500;
			y = 600;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor obstacles9
			this.obstacle.push(CreateDashElement(x - 1250, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 1250, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x + 50, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x + 50, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			
			//10
			x += 500;
			y = 650;
			makeBuilding.call(this, x, y, 2);
			x = fillBuilding.call(this, x, y, 2);
			//floor obstacles 10
			this.obstacle.push(CreateSlideElement(x, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//11
			x += 500;
			y = 750;
			makeBuilding.call(this, x, y, 6);
			x = fillBuilding.call(this, x, y, 6);
			//floor obstacles 11
			this.obstacle.push(CreateSlideElement(x - 1200, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateRunnerElement(x, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//12
			x += 500;
			y = 600;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			
			//13
			x += 500;
			y = 600;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			//floor obstacles 13
			this.obstacle.push(CreateSlideElement(x, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//14
			x += 500;
			y = 500;
			makeBuilding.call(this, x, y, 7);
			x = fillBuilding.call(this, x, y, 7);
			
			//15
			x += 500;
			y = 550;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor obstacles 15
			this.obstacle.push(CreateSlideElement(x - 100, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//16
			x += 300;
			y = 700;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			//17
			x += 500;
			y = 680;
			makeBuilding.call(this, x, y, 4);
			x = fillBuilding.call(this, x, y, 4);
			//floor obstacles 17
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//18
			x += 200;
			y = 500;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			//19
			x += 500;
			y = 700;
			makeBuilding.call(this, x, y, 2);
			x = fillBuilding.call(this, x, y, 2);
			
			//20
			x += 500;
			y = 550;
			makeBuilding.call(this, x, y, 2);
			x = fillBuilding.call(this, x, y, 2);
			
			//21
			x += 500;
			y = 350;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			//floor obstacles 21
			this.obstacle.push(CreateDashElement(x - 400, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 400, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
			
			var sensor = CreateRunnerElement(x, 200, 10, 500,"", true, true, 400);
	        this.interactive.push(sensor);
	        sensor.Enter = function(){
   	    		States.current().level.Destruct();
				States.current().level = LevelThree();
				States.current().level.Construct();
       	    };
			
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  		player.checkpoint = this.checkpoint[0];
	  		player.body.SetTransform(player.checkpoint.body.GetPosition(), 0);
			player.ChangeState(PLAYER_STATE_RUNNER);
		};
		
		this.Reset = function() {
	  		for(var i = 0; i < this.obstacle.length; i++) if(this.obstacle[i].Reset) this.obstacle[i].Reset();
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.checkpoint = [];
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacle = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	// Contains Construct
	function LevelFive() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.checkpoint = [];
  		this.floor = [];
  		this.fill = [];
  		this.interactive = [];
  		this.obstacle = [];
  		this.scenery = [];
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		
	  		////work after this
	  		var x = 100;
			var y = 50;
			
			this.checkpoint[0] = CreateCheckpoint(x, y - 200, true);
			
			this.scenery.push(CreateBackground(SPRITES["SKY"]));
			
			//Floors
			//1
			makeBuilding.call(this, x, y, 7);
			x = fillBuilding.call(this, x, y, 7);
			
			//2
			x += 700;
			y = 700;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			//floor 2 obstacles
			this.obstacle.push(CreateDashElement(x - 1600, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateRunnerElement(x - 400, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			
			//3
			x += 400;
			y = 500;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			this.obstacle.push(CreateSlideElement(x - 1800, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateDashElement(x - 1600, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 900, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 700, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			
			//4
			x += 700;
			y = 400;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			this.obstacle.push(CreateRunnerElement(x - 800, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
			this.obstacle.push(CreateSlideElement(x - 100, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//5
			x += 700;
			y = 400;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			this.obstacle.push(CreateSlideElement(x - 2200, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateSlideElement(x - 1000, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			this.obstacle.push(CreateDashElement(x - 600, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			
			//6
			x += 700;
			y = 300;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//7
			x += 700;
			y = 400;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//8
			x += 700;
			y = 500;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			this.obstacle.push(CreateDashElement(x - 2000, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			
			//9
			x += 700;
			y = 400;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			this.obstacle.push(CreateRunnerElement(x, y-SPRITE_OFFSET["ROOF_CHIMNEY"]-100, SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x + 300, y-SPRITE_OFFSET["ROOF_CHIMNEY"]-350, SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x + 600, y-SPRITE_OFFSET["ROOF_CHIMNEY"]-300, SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			this.obstacle.push(CreateRunnerElement(x + 900, y-SPRITE_OFFSET["ROOF_CHIMNEY"]-500, SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			
			//10
			x += 700;
			y = 600;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//11
			x += 700;
			y = 500;
			makeBuilding.call(this, x, y, 1);
			x = fillBuilding.call(this, x, y, 1);
			
			//12
			x += 200;
			y = 600;
			makeBuilding.call(this, x, y, 2);
			x = fillBuilding.call(this, x, y, 2);
			
			//13
			x += 700;
			y = 550;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			
			
			//14
			x += 700;
			y = 600;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			this.obstacle.push(CreateRunnerElement(x - 200, y-SPRITE_OFFSET["ROOF_CHIMNEY"], SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
			
			//15
			x += 700;
			y = 550;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			//16
			x += 700;
			y = 550;
			makeBuilding.call(this, x, y, 0);
			x = fillBuilding.call(this, x, y, 0);
			
			//17
			x += 700;
			y = 550;
			makeBuilding.call(this, x, y, 0);
			x = fillBuilding.call(this, x, y, 0);
			
			//18
			x += 700;
			y = 550;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			
			//19
			x += 345;
			y = 700;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			
			//20
			x += 345;
			y = 800;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			this.obstacle.push(CreateSlideElement(x - 200, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//21
			x += 700;
			y = 900;
			makeBuilding.call(this, x, y, 5);
			x = fillBuilding.call(this, x, y, 5);
			this.obstacle.push(CreateDashElement(x - 800, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			this.obstacle.push(CreateDashElement(x - 400, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			
			//22
			x += 700;
			y = 700;
			makeBuilding.call(this, x, y, 4);
			x = fillBuilding.call(this, x, y, 4);
			this.obstacle.push(CreateDashElement(x - 400, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			
			//23
			x += 700;
			y = 500;
			makeBuilding.call(this, x, y, 4);
			x = fillBuilding.call(this, x, y, 4);
			this.obstacle.push(CreateDashElement(x - 400, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
			
			//24
			x += 700;
			y = 900;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			
			//25
			x += 700;
			y = 800;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			this.obstacle.push(CreateSlideElement(x - 400, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//26
			x += 700;
			y = 600;
			makeBuilding.call(this, x, y, 3);
			x = fillBuilding.call(this, x, y, 3);
			this.obstacle.push(CreateSlideElement(x - 400, y - SPRITE_OFFSET["ROOF_CONTAINER"], -5));
			
			//27
			x += 700;
			y = 550;
			makeBuilding.call(this, x, y, 10);
			x = fillBuilding.call(this, x, y, 10);
			
			///////work before this
			this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
			this.width += 600;
	  		this.constructed = true;
	  		player.checkpoint = this.checkpoint[0];
	  		player.body.SetTransform(player.checkpoint.body.GetPosition(), 0);
	  		player.ChangeState(PLAYER_STATE_RUNNER);
		};
		
		this.Reset = function() {
	  		for(var i = 0; i < this.obstacle.length; i++) if(this.obstacle[i].Reset) this.obstacle[i].Reset();
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.checkpoint = [];
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacle = [];
	  		this.scenery = [];
	  		this.width = 0;
	  		this.constructed = false;
	  	};
	}
	
	function RandomLevel() {
		if (arguments.callee._singletonInstance)
	    	return arguments.callee._singletonInstance;
	  	arguments.callee._singletonInstance = this;
	  	this.constructed = false;
	  	this.checkpoint = [];
  		this.floor = [];
  		this.fill = [];
  		this.interactive = [];
  		this.obstacle = [];
  		this.scenery = [];
	  	
	  	this.Construct = function() {
	  		if(this.constructed) return;
	  		var x = 100;
			var y = 350;
			this.checkpoint[0] = CreateCheckpoint(x, 120, true);
			this.scenery.push(CreateBackground(SPRITES["SKY"]));
			
			var length = Math.floor(Math.random() * 41) + 10;
			for(var i = 0; i < length; i++) {
				var building = Math.floor(Math.random() * 21);
				makeBuilding.call(this, x, y, building);
				x = fillBuilding.call(this, x, y, building);
				if(i > 0) {
					for(var j = building - 1; j >= 0; j--) {
						switch(Math.floor(Math.random() * 6)) {
							case 1:
								this.obstacle.push(CreateRunnerElement(x - j * 200, y-SPRITE_OFFSET["ROOF_DOOR"], SPRITE_W["ROOF_DOOR"], SPRITE_H["ROOF_DOOR"], SPRITES["ROOF_DOOR"], true, false, 0));
								j -= 2;
								break;
							case 2:
								this.obstacle.push(CreateRunnerElement(x - j * 200, y-SPRITE_OFFSET["ROOF_CHIMNEY"], SPRITE_W["ROOF_CHIMNEY"], SPRITE_H["ROOF_CHIMNEY"], SPRITES["ROOF_CHIMNEY"], true, false, 0));
								j -= 2;
								break;
							case 3:
								this.obstacle.push(CreateRunnerElement(x - j * 200, y-SPRITE_OFFSET["ROOF_AC"], SPRITE_W["ROOF_AC"], SPRITE_H["ROOF_AC"], SPRITES["ROOF_AC"], true, false, 0));
								j -= 2;
								break;
							case 4:
								this.obstacle.push(CreateSlideElement(x - j * 200, y-SPRITE_OFFSET["ROOF_CONTAINER"], -10));
								j -= 2;
								break;
							case 5:
								this.obstacle.push(CreateDashElement(x - j * 200, y-SPRITE_OFFSET["ROOF_CRATE"], -10));
								this.obstacle.push(CreateDashElement(x - j * 200, y-SPRITE_OFFSET["ROOF_CRATE"] - SPRITE_H["ROOF_CRATE"], -10));
								j -= 4;
								break;
							default:
								j -= 2;
								break;
						}
					}
				}
				x += (Math.floor(Math.random() * 5) + 2) * 100;
				y += (Math.floor(Math.random() * 5) - 2) * 100;
			}
	  		
	  		this.width = this.floor[0].width/2 + this.floor[this.floor.length-1].x - this.floor[0].x + this.floor[this.floor.length-1].width/2;
	  		this.constructed = true;
	  		player.checkpoint = this.checkpoint[0];
	  		player.body.SetTransform(player.checkpoint.body.GetPosition(), 0);
			player.ChangeState(PLAYER_STATE_RUNNER);
	  	};
	  	
	  	this.Reset = function() {
	  		for(var i = 0; i < this.obstacle.length; i++) if(this.obstacle[i].Reset) this.obstacle[i].Reset();
		};
		
		this.Destruct = function() {
	  		if(!this.constructed) return;
	  		for(var i = 0; i < this.checkpoint.length; i++) this.checkpoint[i].Destroy();
	  		for(var i = 0; i < this.fill.length; i++) this.fill[i].Destroy();
	  		for(var i = 0; i < this.floor.length; i++) this.floor[i].Destroy();
	  		for(var i = 0; i < this.interactive.length; i++) this.interactive[i].Destroy();
	  		for(var i = 0; i < this.obstacle.length; i++) this.obstacle[i].Destroy();
	  		for(var i = 0; i < this.scenery.length; i++) this.scenery[i].Destroy();
	  		this.checkpoint = [];
	  		this.floor = [];
	  		this.fill = [];
	  		this.interactive = [];
	  		this.obstacle = [];
	  		this.scenery = [];
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
		if(fixtureA == player.killSensor || fixtureB == player.killSensor) {
			player.killSensor.numContacts++;
			return;
		}
		if(fixtureA == player.climbUpper || fixtureB == player.climbUpper) {
			player.climbUpper.numContacts++;
			return;
		}
		if(fixtureA == player.climbMiddle || fixtureB == player.climbMiddle) {
			player.climbMiddle.numContacts++;
			return;
		}
		var objectA = fixtureA.GetBody().GetUserData();
		var objectB = fixtureB.GetBody().GetUserData();
		if(objectA == player || objectB == player) {
			var other;
			if(objectA == player) other = objectB;
			if(objectB == player) other = objectA;
			var interactives = States.current().level.interactive;
			if(interactives.indexOf(other) != -1) {
				player.near = true;
				player.interact = other;
				println("near");
				if(other.Enter) other.entered = true;
			}
	        if(other.type == "checkpoint") player.checkpoint = other;
	        if(other.fixture.IsSensor()) return;
	        if(other.type == "dash" && !other.broken && player.dashing) {
	        	other.broken = true;
	        } else if(other.type != "floor" && !player.sliding) {
	        	player.maxSpeed = PLAYER_RUN_SPEED;
				player.dashing = false;
				player.cooldown = 5;
				player.frameRate = 7.5;
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
		if(fixtureA == player.killSensor || fixtureB == player.killSensor) {
			player.killSensor.numContacts--;
		}
		if(fixtureA == player.climbUpper|| fixtureB == player.climbUpper) {
			player.climbUpper.numContacts--;
		}
		if(fixtureA == player.climbMiddle|| fixtureB == player.climbMiddle) {
			player.climbMiddle.numContacts--;
		}
		var objectA = fixtureA.GetBody().GetUserData();
		var objectB = fixtureB.GetBody().GetUserData();
		if(objectA == player || objectB == player) {
			var other;
			if(objectA == player) other = objectB;
			if(objectB == player) other = objectA;
			var interactives = States.current().level.interactive;
			if(interactives.indexOf(other) != -1) {
				player.near = false;
				player.interact = undefined;
				println("away");
				if(other.Exit) other.exited = true;
			}
		}	
	}
	
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
	function CreateText(x, y, fontSize, text, color) {
		var Text = new TextBox();
		Text.x = x;
		Text.y = y;
		Text.fontSize = fontSize;
		Text.text = text;
		Text.center = true;
		if(typeof(color) !== "undefined") Text.color = color;
		States.current().world.addChild(Text);
		Text.Destroy = function() {
			States.current().world.removeChild(this);
		};
		return Text;
	}
	
	//
	// CreatePlayer - creates the player sprite, physics body, and update functions
	//
	function CreatePlayer(x, y) {
		var player = CreateSprite(x, y, PLAYER_WIDTH_STANDING, PLAYER_HEIGHT_STANDING, SPRITES["PLAYER_WALK"], 0);
		CreateNormalAnimation(player);
		player.offsetY = -player.height;
		player.onGround = true;
		player.near = false;//check for whether or not the player is near an interactable obj
		
		var bodyDef = new b2.BodyDef();
		bodyDef.type = b2.Body.b2_dynamicBody;
		bodyDef.position.Set(player.x / PHYSICS_SCALE, (player.y - PLAYER_HEIGHT_RUNNING / 2) / PHYSICS_SCALE);
		player.body = physics.CreateBody(bodyDef);
		
		var fixDef = CreateFixtureDef(0, 0, 0);
		fixDef.shape = new b2.PolygonShape();
		
		// Kill sensor
		fixDef.shape.SetAsBox(55 / PHYSICS_SCALE, 5 / PHYSICS_SCALE, new b2.Vec2(PLAYER_WIDTH_RUNNING / 6 / PHYSICS_SCALE, -PLAYER_HEIGHT_RUNNING / 5 / PHYSICS_SCALE), 0);
		player.killSensor = player.body.CreateFixture(fixDef);
		player.killSensor.SetSensor(true);
		player.killSensor.numContacts = 0;
		
		// Creates the climb sensors
		fixDef.shape.SetAsBox(15 / PHYSICS_SCALE, 5 / PHYSICS_SCALE, new b2.Vec2(PLAYER_WIDTH_RUNNING / 2 / PHYSICS_SCALE, -PLAYER_HEIGHT_RUNNING / 1.2 / PHYSICS_SCALE), 0);
		player.climbUpper = player.body.CreateFixture(fixDef);
		player.climbUpper.SetSensor(true);
		player.climbUpper.numContacts = 0;
		
		fixDef.shape.SetAsBox(15 / PHYSICS_SCALE, 5 / PHYSICS_SCALE, new b2.Vec2(PLAYER_WIDTH_RUNNING / 2 / PHYSICS_SCALE, -PLAYER_HEIGHT_RUNNING / 3 / PHYSICS_SCALE), 0);
		player.climbMiddle = player.body.CreateFixture(fixDef);
		player.climbMiddle.SetSensor(true);
		player.climbMiddle.numContacts = 0;
		
		CreateStandingFixture(player);
		
		player.body.SetUserData(player);
		player.body.SetFixedRotation(true);
		
		player.state = PLAYER_STATE_NORMAL;
		player.maxSpeed = PLAYER_WALK_SPEED;
		player.dashing = false;
		player.sliding = false;
		player.cooldown = 0;
		player.latency = 0;
		
		player.ChangeState = function(newstate) {
			this.scaleX = 1;
			this.dashing = false;
			this.sliding = false;
			switch(newstate) {
				case PLAYER_STATE_NORMAL:
					this.state = PLAYER_STATE_NORMAL;
					this.maxSpeed = PLAYER_WALK_SPEED;
					CreateNormalAnimation(this);
					this.body.DestroyFixture(this.fixture);
					CreateStandingFixture(this);
					break;
				case PLAYER_STATE_RUNNER:
					this.state = PLAYER_STATE_RUNNER;
					this.maxSpeed = PLAYER_RUN_SPEED;
					CreateRunnerAnimation(this);
					this.body.DestroyFixture(this.fixture);
					CreateRunningFixture(this);
					break;
			}
		};
		
		var pressed = false;
		
		player.update = function(d) { 
			if(this.near && gInput.E && !pressed){
				pressed = true;
				if(this.interact.action) this.interact.action();
			}
			if(!this.near) HideIndicator(indicator);
			if(!gInput.E && pressed) pressed = false;
			// Movement code
			var velocity = this.body.GetLinearVelocity();
			this.latency -= d;
			this.cooldown -= d;
			this.onGround = this.foot.numContacts > 0;
			this.climbing = !this.climbing && this.climbMiddle.numContacts > 0 && this.climbUpper.numContacts == 0;
			switch(this.state) {
				case PLAYER_STATE_NORMAL:
					if(this.onGround) {
						if(gInput.right) {
							var deltaVelocity = this.maxSpeed - velocity.x;
							var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
							this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
							player.animation = "walk";
							this.scaleX = 1;
							this.frameRate = 3;
						}
						if(gInput.left) {
							var deltaVelocity = -this.maxSpeed - velocity.x;
							var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
							this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
							player.animation = "walk";
							this.scaleX = -1;
							this.frameRate = 3;
						}
						if(!gInput.right && !gInput.left) {
							player.animation = "idle";
							this.frameRate = .5;
						}
					}
					break;
				case PLAYER_STATE_RUNNER:
					if(this.onGround) {
						if(this.killSensor.numContacts > 0 && !this.dashing) this.Respawn();
						var deltaVelocity = this.maxSpeed - velocity.x;
						var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
						this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
						if(gInput.right && !this.dashing && this.cooldown < 0) {
							this.dashing = true;
							this.maxSpeed = PLAYER_DASH_SPEED;
							this.cooldown = PLAYER_DASH_DURATION;
							this.frameRate = this.maxSpeed / PLAYER_RUN_SPEED * 7.5;
						}
						if(this.dashing && this.cooldown < 0) {
							this.maxSpeed = PLAYER_RUN_SPEED;
							this.dashing = false;
							this.cooldown = 5;
							this.frameRate = 7.5;
						}
						if(gInput.up && !this.sliding && this.latency < 0) {
							this.onGround = false;
							this.latency = 5;
							var deltaVelocity = velocity.y - 6.25;
							var impulse = new b2.Vec2(0, this.body.GetMass() * deltaVelocity);
							this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
							CreateJumpAnimation(this);
							DestroyCurrentFixtures(this);
							CreateJumpingFixture(this);
							this.state = PLAYER_STATE_JUMPING;
						}
						if(gInput.down && !this.sliding && this.cooldown < 0) {
							CreateSlideAnimation(this);
							DestroyCurrentFixtures(this);
							CreateSlidingFixture(this);
							this.sliding = true;
							this.cooldown = PLAYER_SLIDE_DURATION;
							this.state = PLAYER_STATE_SLIDING;
						}
					} else {
						CreateJumpAnimation(this);
						DestroyCurrentFixtures(this);
						CreateJumpingFixture(this);
						this.state = PLAYER_STATE_JUMPING;
					}
					break;
				case PLAYER_STATE_JUMPING:
					this.animation = "inair";
					this.frameRate = 10;
					if(this.onGround && this.latency < 0) {
						CreateRunnerAnimation(this);
						DestroyCurrentFixtures(this);
						CreateRunningFixture(this);
						this.state = PLAYER_STATE_RUNNER;
					}
					if(this.climbing) {
						this.state = PLAYER_STATE_CLIMBING;
						CreateClimbAnimation(this);
						var pos = this.body.GetPosition();
						this.climbpos = new b2.Vec2(pos.x, pos.y);
						
					}
					break;
				case PLAYER_STATE_CLIMBING:
					this.body.SetTransform(this.climbpos, 0);
					if(Math.floor(this.frame) == this.frameCount - 1) {
						this.state = PLAYER_STATE_RUNNER;
						this.climbpos.x += .25;
						this.climbpos.y -= 1.5;
						this.body.SetTransform(this.climbpos, 0);
						CreateRunnerAnimation(this);
					}
					break;
				case PLAYER_STATE_SLIDING:
					if(this.killSensor.numContacts > 0 && !this.dashing) this.Respawn();
					var deltaVelocity = this.maxSpeed - velocity.x;
					var impulse = new b2.Vec2(this.body.GetMass() * deltaVelocity, 0);
					this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter(), true);
					if(this.sliding && (!gInput.down || this.cooldown < 0)) {
						CreateRunnerAnimation(this);
						DestroyCurrentFixtures(this);
						CreateRunningFixture(this);
						this.sliding = false;
						this.cooldown = 15;
						this.state = PLAYER_STATE_RUNNER;
					}
					break;
			}
			// Move the sprite according to the physics body
			var pos = this.body.GetPosition();
			this.x = pos.x * PHYSICS_SCALE;
			this.y = pos.y * PHYSICS_SCALE + this.height / 2;
			this.rotation = this.body.GetAngle();
			if(this.y > 1000 + this.height / 2) this.Respawn();
		};
		
		player.Respawn = function() {
			pos = this.checkpoint.body.GetPosition();
			this.body.SetTransform(pos, 0);
			States.current().level.Reset();
		};
		return player;
	}
	
	function CreateIndicator(xoffset, yoffset) {
		var indicator = CreateSprite(0, 0, SPRITE_W["KEY"], SPRITE_H["KEY"], "", 0);
		indicator.offsetX += xoffset;
		indicator.offsetY += yoffset;
		indicator.frameWidth = 284;
		indicator.frameHeight = 271;
		indicator.frameRate = 2.5;
		indicator.frameCount = 2;
		indicator.alpha = 0;
		indicator.Destroy = function() {
			States.current().world.removeChild(this);
		};
		return indicator;
	}
	
	function ShowIndicator(sprite, indicator, image) {
		indicator.image = Textures.load(image);
		indicator.x = sprite.x;
		indicator.y = sprite.y;
		indicator.alpha = 1;
	}
		
	function HideIndicator(indicator) {
		indicator.alpha = 0;
	}
	
	// Brine quirk: framecount has to be +1
	// Brine quirk: last animation length has to be +1
	
	function CreateNormalAnimation(sprite) {
		for(name in sprite.animations) sprite.animations[name] = null;
		sprite.width = PLAYER_WIDTH_STANDING;
		sprite.height = PLAYER_HEIGHT_STANDING;
		sprite.offsetX = -sprite.width / 2;
		sprite.offsetY = -sprite.height;
		sprite.image = Textures.load(SPRITES["PLAYER_WALK"]);
		sprite.frame = 0;
		sprite.frameHeight = 240;
		sprite.frameWidth = 150;
		sprite.frameCount = 8;
		sprite.frameRate = .5;
		sprite.addAnimation("idle", 0, 4);
		sprite.addAnimation("walk", 3, 5);
		sprite.animation = "idle";
	}
	
	function CreateRunnerAnimation(sprite) {
		for(name in sprite.animations) sprite.animations[name] = null;
		sprite.width = PLAYER_WIDTH_RUNNING;
		sprite.height = PLAYER_HEIGHT_RUNNING;
		sprite.offsetX = -sprite.width / 2;
		sprite.offsetY = -sprite.height;
		sprite.image = Textures.load(SPRITES["PLAYER_RUN"]);
		sprite.frame = 0;
		sprite.frameHeight = 220;
		sprite.frameWidth = 275;
		sprite.frameCount = 7;
		sprite.frameRate = 7.5;
		sprite.addAnimation("run", 0, 7);
		sprite.animation = "run";
	}
	
	function CreateJumpAnimation(sprite) {
		for(name in sprite.animations) sprite.animations[name] = null;
		sprite.width = PLAYER_WIDTH_JUMPING;
		sprite.height = PLAYER_HEIGHT_JUMPING;
		sprite.offsetX = -sprite.width / 2;
		sprite.offsetY = -sprite.height;
		sprite.image = Textures.load(SPRITES["PLAYER_JUMP"]);
		sprite.frame = 0;
		sprite.frameHeight = 220;
		sprite.frameWidth = 225;
		sprite.frameCount = 4;
		sprite.frameRate = 0;
		sprite.addAnimation("jump", 0, 1);
		sprite.addAnimation("inair", 1, 3);
		sprite.animation = "jump";
	}
	
	function CreateSlideAnimation(sprite) {
		for(name in sprite.animations) sprite.animations[name] = null;
		sprite.width = PLAYER_WIDTH_SLIDING;
		sprite.height = PLAYER_HEIGHT_SLIDING;
		sprite.offsetX = -sprite.width / 2;
		sprite.offsetY = -sprite.height;
		sprite.image = Textures.load(SPRITES["PLAYER_SLIDE"]);
		sprite.frame = 0;
		sprite.frameHeight = 117;
		sprite.frameWidth = 280;
		sprite.frameCount = 1;
		sprite.frameRate = 0;
		sprite.addAnimation("slide", 0, 1);
		sprite.animation = "slide";
	}
	
	function CreateClimbAnimation(sprite) {
		for(name in sprite.animations) sprite.animations[name] = null;
		sprite.width = PLAYER_WIDTH_CLIMBING;
		sprite.height = PLAYER_HEIGHT_CLIMBING;
		sprite.offsetX = -sprite.width / 6;
		sprite.offsetY = -sprite.height * .75;
		sprite.image = Textures.load(SPRITES["PLAYER_CLIMB"]);
		sprite.frame = 0;
		sprite.frameHeight = 425;
		sprite.frameWidth = 215;
		sprite.frameCount = 3;
		sprite.frameRate = 7.5;
		sprite.addAnimation("climb", 0, 4);
		sprite.animation = "climb";
	}
	
	//
	// CreateRunningFixture - creates the standing body for player
	//
	function CreateStandingFixture(sprite) {
		var fixDef = CreateFixtureDef(10.0, 1.0, 0);
		var scaled_width = sprite.width / PHYSICS_SCALE;
		var scaled_height = sprite.height / PHYSICS_SCALE;
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(scaled_width / 2, scaled_height / 2);
		sprite.fixture = sprite.body.CreateFixture(fixDef);
		CreateFootFixture(sprite);
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
		CreateFootFixture(sprite);
	}
	
	//
	// CreateJumpingFixture - creates the running body for player
	//
	function CreateJumpingFixture(sprite) {
		var fixDef = CreateFixtureDef(10.0, 1.0, 0);
		var scaled_width = sprite.width / PHYSICS_SCALE;
		var scaled_height = sprite.height / PHYSICS_SCALE;
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(scaled_width / 2, scaled_height / 2);
		sprite.fixture = sprite.body.CreateFixture(fixDef);
		CreateFootFixture(sprite);
	}
	
	//
	// CreateSlidingFixture - creates the sliding body for player
	//
	function CreateSlidingFixture(sprite) {
		var fixDef = CreateFixtureDef(10.0, 1.0, 0);
		var scaled_width = sprite.width / PHYSICS_SCALE;
		var scaled_height = sprite.height / PHYSICS_SCALE;
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(scaled_width / 2, scaled_height / 2);
		sprite.fixture = sprite.body.CreateFixture(fixDef);
		CreateFootFixture(sprite);
	}
	
	function CreateFootFixture(sprite) {
		var fixDef = CreateFixtureDef(0, 0, 0);
		fixDef.shape = new b2.PolygonShape();
		fixDef.shape.SetAsBox(sprite.width / 2.1 / PHYSICS_SCALE, 15 / PHYSICS_SCALE, new b2.Vec2(0, sprite.height / 2 / PHYSICS_SCALE), 0);
		sprite.foot = sprite.body.CreateFixture(fixDef);
		sprite.foot.SetSensor(true);
		sprite.foot.numContacts = 0;
	}
	
	function DestroyCurrentFixtures(sprite) {
		sprite.body.DestroyFixture(sprite.foot);
		sprite.body.DestroyFixture(sprite.fixture);
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
		element.entered = false;
		element.exited = false;
		element.update = function(d) {
			if(this.Enter && this.entered) {
				this.Enter();
				this.entered = false;
			}
			if(this.Exit && this.exited) {
				this.Exit();
				this.exited = false;
			}
		};
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
		var element = CreateWorldElement(x, y, width, height, image, solid, sensor, index);
		element.update = function(d) {
			if(this.Enter && this.entered) {
				this.Enter();
				this.entered = false;
			}
			if(this.Exit && this.exited) {
				this.Exit();
				this.exited = false;
			}
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
		return element;
	}
	
	//
	// CreateDashElement - creates a dash element that will break if the player hits it while dashing
	//
	function CreateDashElement(x, y, index) {
		var element = CreateWorldElement(x, y, SPRITE_W["ROOF_CRATE"], SPRITE_H["ROOF_CRATE"], SPRITES["ROOF_CRATE"], true, false, index);
		element.type = "dash";
		element.broken = false;
		element.respawn = 15;
		element.update = function(d) {
			if(this.broken) this.Break();
			if(Math.floor(this.frame) == this.frameCount - 1) {
				this.frameRate = 0;
			}
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
		element.Reset = function() {
			this.body.SetActive(true);
			this.width = SPRITE_W["ROOF_CRATE"];
			this.height = SPRITE_H["ROOF_CRATE"];
			this.offsetX = -SPRITE_W["ROOF_CRATE"] / 2;
			this.offsetY = -SPRITE_H["ROOF_CRATE"] / 2;
			this.image = Textures.load(SPRITES["ROOF_CRATE"]);
			this.frameWidth = 213;
			this.frameHeight = 177;
			this.frameCount = 1;
			this.frame = 0;
		};
		element.Break = function() {
			this.body.SetActive(false);
			this.width = SPRITE_W["ROOF_CRATE_DEATH"];
			this.height = SPRITE_H["ROOF_CRATE_DEATH"];
			this.offsetX = -SPRITE_W["ROOF_CRATE_DEATH"] / 2;
			this.offsetY = -SPRITE_H["ROOF_CRATE_DEATH"] / 2;
			this.image = Textures.load(SPRITES["ROOF_CRATE_DEATH"]);
			this.frameWidth = 350;
			this.frameHeight = 280;
			this.frameCount = 5;
			this.frameRate = 10;
			this.broken = false;
		};
		element.Destroy = function() {
			physics.DestroyBody(this.body);
			States.current().world.removeChild(this);
		};
		return element;
	}
	
	//
	// CreateSlideElement - creates a sliding element
	//
	function CreateSlideElement(x, y, index) {
		var element = CreateSprite(x, y, SPRITE_W["ROOF_CONTAINER"], SPRITE_H["ROOF_CONTAINER"], SPRITES["ROOF_CONTAINER"], index);
		var fixDef = CreateFixtureDef(1.0, 1, 0);
		var scaled_width = SPRITE_W["ROOF_CONTAINER"] / PHYSICS_SCALE;
		var scaled_height = SPRITE_H["ROOF_CONTAINER"] / PHYSICS_SCALE;
		fixDef.shape = new b2.PolygonShape();
		var vertices = [];
		//vertices.push(new b2.Vec2(0, -scaled_height / 2));
		vertices.push(new b2.Vec2(scaled_width / 2, -scaled_height / 3)); //TR
		vertices.push(new b2.Vec2(scaled_width / 2, scaled_height / 4.5)); //BR
		vertices.push(new b2.Vec2(-scaled_width / 2, scaled_height / 4.5)); //BL
		vertices.push(new b2.Vec2(-scaled_width / 2, -scaled_height / 3)); //TL
		fixDef.shape.Set(vertices, 4);
		ApplyBBox(element, b2.Body.b2_staticBody, fixDef);
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
		element.Destroy = function() {
			physics.DestroyBody(this.body);
			States.current().world.removeChild(this);
		};
		return element;
	}
	
	//
	// CreateFloorElement - creates a world element, if respawn is true, when it goes offscreen, it will be moved
	//						to create an infinite level
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
		element.type = "floor";
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
	// CreateDoorElement - creates a door element that opens and closes when player is near
	//                     NOTE: Always a sensor
	//
	function CreateDoorElement(x, y, width, height, image, index, locked) {
		var door = CreateWorldElement(x, y, width, height, image, true, true, index);
		if(image == SPRITES["MIDDLE_DOOR"]) {
			door.frameWidth = 500;
			door.frameHeight = 750;
			door.frameCount = 6;
			door.frameRate = 0;
		} else {
			door.frameWidth = 300;
			door.frameHeight = 1120;
			door.frameCount = 5;
			door.frameRate = 0;
		}
		if(!locked) {
			door.update = function(d) {
				if(this.Enter && this.entered) {
					this.Enter();
					this.entered = false;
				}
				if(this.Exit && this.exited) {
					this.Exit();
					this.exited = false;
				}
				if(this.frameRate > 0 && Math.floor(this.frame) == this.frameCount - 1) {
					this.frameRate = 0;
				}
				if(this.frameRate < 0 && Math.floor(this.frame) == 0) {
					this.frameRate = 0;
				}
			};
			door.Enter = function() {
				this.frameRate = 30;
				ShowIndicator(player, indicator, SPRITES["E"]);
			};
			door.Exit = function() {
				this.frameRate = -30;
	  			HideIndicator(indicator);
			};
		}
		return door;
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
	
	function CreateBackground(image) {
		var background = [];
		background[0] = CreateSprite(0, VIEWPORT_HEIGHT / 2 + 1038, 2400, 2076, image, 1000);
		background[0].update = function() {
			var xpos = this.x + States.current().world.x;
			if(xpos + this.width / 2 < 0) this.x += this.width * 2;
			if(xpos - this.width / 2 > VIEWPORT_WIDTH) this.x -= this.width * 2;
		};
		background[1] = CreateSprite(2400, VIEWPORT_HEIGHT / 2 + 1038, 2400, 2076, image, 1000);
		background[1].update = function() {
			var xpos = this.x + States.current().world.x;
			if(xpos + this.width / 2 < 0) this.x += this.width * 2;
			if(xpos - this.width / 2 > VIEWPORT_WIDTH) this.x -= this.width * 2;
		};
		background[2] = CreateSprite(0, VIEWPORT_HEIGHT / 2 - 1038, 2400, 2076, image, 1000);
		background[2].scaleY = -1;
		background[2].update = function() {
			var xpos = this.x + States.current().world.x;
			if(xpos + this.width / 2 < 0) this.x += this.width * 2;
			if(xpos - this.width / 2 > VIEWPORT_WIDTH) this.x -= this.width * 2;
		};
		background[3] = CreateSprite(2400, VIEWPORT_HEIGHT / 2 - 1038, 2400, 2076, image, 1000);
		background[3].scaleY = -1;
		background[3].update = function() {
			var xpos = this.x + States.current().world.x;
			if(xpos + this.width / 2 < 0) this.x += this.width * 2;
			if(xpos - this.width / 2 > VIEWPORT_WIDTH) this.x -= this.width * 2;
		};
		background.Destroy = function() {
			States.current().world.removeChild(this[0]);
			States.current().world.removeChild(this[1]);
			States.current().world.removeChild(this[2]);
			States.current().world.removeChild(this[3]);
		};
		return background;
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
	
	function makeBuilding(x, y, buildingLength) {
  		// Left
  		this.floor.push(CreateFloorElement(x, y, SPRITE_W["WALL"], SPRITE_H["WALL"], SPRITES["LEFT_WALL"], 0, true));
		x += SPRITE_W["WALL"];
		// Middle
		for(var i = 0; i < buildingLength; i++) {
			if(Math.random() < .5) this.floor.push(CreateFloorElement(x, y, SPRITE_W["WALL"], SPRITE_H["WALL"], SPRITES["MIDDLE_WALL"], 0, true));
			else this.floor.push(CreateFloorElement(x, y, SPRITE_W["WALL"], SPRITE_H["WALL"], SPRITES["MIDDLE_WALL_LIT"], 0, true));
			x += SPRITE_W["WALL"];
		}
		// Right
		this.floor.push(CreateFloorElement(x, y, SPRITE_W["WALL"], SPRITE_H["WALL"], SPRITES["RIGHT_WALL"], 0, true));
		return x;
	}
	function fillBuilding(x, y, buildingLength) {
		// Left
  		this.fill.push(CreateFloorElement(x + SPRITE_OFFSET["WALL_FILL_W"], y + SPRITE_OFFSET["WALL_FILL_H"], SPRITE_W["WALL_SIDE_FILL"], SPRITE_H["WALL_SIDE_FILL"], SPRITES["LEFT_WALL_FILL"], 0, true));
		x += SPRITE_W["WALL_FILL"];
		// Middle
		for(var i = 0; i < buildingLength; i++) {
			if(Math.random() < .5) this.fill.push(CreateRunnerElement(x, y + SPRITE_OFFSET["WALL_FILL_H"], SPRITE_W["WALL_FILL"], SPRITE_H["WALL_FILL"], SPRITES["MIDDLE_WALL_FILL"], false, false, 0));
			else this.fill.push(CreateRunnerElement(x, y + SPRITE_OFFSET["WALL_FILL_H"], SPRITE_W["WALL_FILL"], SPRITE_H["WALL_FILL"], SPRITES["MIDDLE_WALL_FILL_LIT"], false, false, 0));
			x += SPRITE_W["WALL_FILL"];
		}
		// Right
		this.fill.push(CreateFloorElement(x - SPRITE_OFFSET["WALL_FILL_W"], y + SPRITE_OFFSET["WALL_FILL_H"], SPRITE_W["WALL_SIDE_FILL"], SPRITE_H["WALL_SIDE_FILL"], SPRITES["RIGHT_WALL_FILL"], 0, true));
		return x;
	}
}());

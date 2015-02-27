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
var PLAYER_STATE_NORMAL = 0;
var PLAYER_STATE_RUNNER = 1;
var PLAYER_WALK_SPEED = 1;
var PLAYER_RUN_SPEED = 4;
var VIEWPORT_WIDTH = document.getElementById("recall").width;
var VIEWPORT_HEIGHT = document.getElementById("recall").height;

// Global Variables
var physics;
var player;

//OBJ
var black;
var door;
var objects = new Array();
var clouds;
var sky1;
var sky2;
var charSprite;
var Obstacles = new Array();


// Box2d Declarations for ease of use
var	b2Vec2 = Box2D.Common.Math.b2Vec2, 
	b2AABB = Box2D.Collision.b2AABB,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2ContactListener = Box2D.Dynamics.b2ContactListener,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

//
// Initialization
// Set up physics engine and brine engine
//
(function() {
	use2D = true;
	showConsole = DEBUGMODE;
	
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
	game.alwaysDraw = false;
	game.alwaysUpdate = false;
	physics = new b2World(new b2Vec2(0, 10), true);
	
	game.init = function() {
		
		var listener = new b2ContactListener();
		listener.BeginContact = beginContactListen;
		listener.EndContact = endContactListen;
		physics.SetContactListener(listener);
		
		if(DEBUGMODE) {
			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(ctx);
			debugDraw.SetDrawScale(PHYSICS_SCALE);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(10.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			physics.SetDebugDraw(debugDraw);
		}
		
		println("World Initialized");
		
		constructWorld();
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
	// Function definitions
	//
	function constructWorld() {
		player = CreatePlayer(100, 100, 50, 80, "sprites/Char.png");
		
		States.current().world.level = [];
		level = States.current().world.level;
		var x = 100;
		for(var i=0; i<10; i++)
		{
			level[i] = CreateWorldElement(x, 550, 100, 100, "sprites/Wall1.png", true, false, 0);
			x += 100;
		}
		x = 1150;
		for(var i=10; i<15; i++)
		{
			level[i] = CreateWorldElement(x, 500, 100, 100, "sprites/Wall2.png", true, false, 0);
			x += 100;
		}
		x = 1700;
		for(var i = 15; i<20; i++)
		{
			level[i] = CreateWorldElement(x, 620, 100, 100, "sprites/Wall2.png", true, false, 0);
			x += 100;
		}
		x = 2250;
		for(var i = 20; i<25; i++)
		{
			level[i] = CreateWorldElement(x, 450, 100, 100, "sprites/Wall2.png", true, false, 0);
			x += 100;
		}
		var y = 400
		x = 2800
		for(var i = 25; i<30; i++)
		{
			level[i] = CreateWorldElement(x, y, 100, 100, "sprites/Wall2.png", true, false, 0);
			x += 100;
			y -= 50;
		}
		//level[1] = CreateWorldElement(1200, 500, 800, 100, "sprites/trash.png", true, false, 1);
		level.width = level[0].width/2 + level[level.length-1].x - level[0].x + level[level.length-1].width/2;
		//OBJ
		sky1 = CreateWorldElement(0, 0, 3000, 1200, "sprites/Sky.png", false, false, 0);
		//sky2 = CreateWorldElement(3000, 0, 3000, 1200, "sprites/Sky.png", false, false, 0);
        door = CreateWorldElement(400, 454, 80, 100, "sprites/door.png", true, true, 0);
        door.action = printWords;//give it a function if the player interacts
        objects.push(door);
        
		Obstacles[0] = CreateWorldElement(250, 480, 80, 80, "sprites/Obstacle1.png", true, false, 0);
		Obstacles[1] = CreateWorldElement(700, 465, 80, 80, "sprites/Obstacle2.png", true, false, 0);
		Obstacles[2] = CreateWorldElement(900, 465, 80, 80, "sprites/Obstacle3.png", true, false, 0);
		Obstacles[3] = CreateWorldElement(1200, 420, 80, 80, "sprites/Obstacle4.png", true, false, 0);
        
        
        
        
        
}
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
			for (var i = 0; i < objects.length; i++ ) {//TODO fix logix if need
	        	if(other == objects[i]){ //check if it is specifically near the door
	        		player.near = true;
	        		player.ob = objects[i];//give it the object that it is near
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
				var deltaVelocity = (direction * 3);
				var impulse = new b2Vec2(player.body.GetMass() * deltaVelocity, player.body.GetMass() * -2);
				player.body.SetLinearVelocity(new b2Vec2(0, 0));
				player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
				player.onGround = false;
         	}/* else if(player.y - (floor.y + floor.height/2) < 1 && player.y < floor.y) {
         		var impulse = new b2Vec2(player.body.GetMass() * -1, player.body.GetMass() * -2);
				player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
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
			for (var i = 0; i < objects.length; i++ ) {
	        	if(other == objects[i]){	
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
	// CreatePlayer - creates the player sprite, physics body, and update functions
	//
	function CreatePlayer(x, y, width, height, image) {
		var player = CreateSprite(x, y, width, height, image, -9990);
		player.onGround = true;
		player.near = false;//check for whether or not the player is near an interactable obj
		
		var bodyDef = CreateBodyDef(player, b2Body.b2_dynamicBody);
		var fixDef = CreateFixtureDef(10.0, 1.0, 0);
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(player.width / 2 / PHYSICS_SCALE, player.height / 2 / PHYSICS_SCALE);
		
		player.body = physics.CreateBody(bodyDef);
		player.fixture = player.body.CreateFixture(fixDef);
		player.body.SetUserData(player);
		player.body.SetFixedRotation(true);
		
		player.state = PLAYER_STATE_NORMAL;
		player.maxSpeed = PLAYER_WALK_SPEED;
		player.update = function(d) {
			// Move the sprite according to the physics body
			var pos = this.body.GetPosition();
			this.x = pos.x * PHYSICS_SCALE;
			this.y = pos.y * PHYSICS_SCALE;
			this.rotation = this.body.GetAngle();
			//OBJ
			if(this.near && gInput.E){
				this.ob.action();
				//println("E");
			} 
			//
			// Movement code
			var velocity = this.body.GetLinearVelocity();
			if(this.state == PLAYER_STATE_NORMAL) {
				if(gInput.right && this.onGround) {
					var deltaVelocity = this.maxSpeed - velocity.x;
					var impulse = new b2Vec2(this.body.GetMass() * deltaVelocity, 0);
					this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
				}
				if(gInput.left && this.onGround) {
					var deltaVelocity = -this.maxSpeed - velocity.x;
					var impulse = new b2Vec2(this.body.GetMass() * deltaVelocity, 0);
					this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
				}
				if(gInput.space) {
					this.state = PLAYER_STATE_RUNNER;
					this.maxSpeed = PLAYER_RUN_SPEED;
				}
			} else if(this.state == PLAYER_STATE_RUNNER && this.onGround) {
				var deltaVelocity = this.maxSpeed - velocity.x;
				var impulse = new b2Vec2(this.body.GetMass() * deltaVelocity, 0);
				this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
				if(gInput.right && this.onGround) {
					var deltaVelocity = this.maxSpeed * 2 - velocity.x;
					var impulse = new b2Vec2(this.body.GetMass() * deltaVelocity, 0);
					this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
				}
			}
			if(gInput.up && this.onGround) {
				this.onGround = false;
				var deltaVelocity = velocity.y - 6;
				var impulse = new b2Vec2(0, this.body.GetMass() * deltaVelocity);
				this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
			}
		};
		return player;
	}
	
	//
	// CreateWorldElement - creates a world element that will spawn and despawn based on visibility
	// 						float x, float y, float width, float height, image, bool solid, bool sensor, int index
	//						Note: Sensor can't be true and not be solid
	//
	function CreateWorldElement(x, y, width, height, image, solid, sensor, index) {
		var element = CreateSprite(x, y, width, height, image, index);
		if(solid) ApplyRectBBox(element, b2Body.b2_staticBody, 1.0, 1, 0);
		if(sensor && solid) element.fixture.SetSensor(true);
		element.update = function(d) {
			var xpos = this.x + States.current().world.x;
			if(xpos + this.width/2 < world.x) {
				this.x += States.current().world.level.width;
				if(typeof(this.body) !== "undefined") {
					var pos = this.body.GetPosition();
					pos.x += States.current().world.level.width / PHYSICS_SCALE;
					this.body.SetPosition(pos);
				}
			}
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
		
		if(type == b2Body.b2_dynamicBody) {
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
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(sprite.width / 2 / PHYSICS_SCALE, sprite.height / 2 / PHYSICS_SCALE);
		
		ApplyBBox(sprite, type, fixDef);
	}
	
	//
	// CreateBodyDef - Creates a body definition for the input sprite
	//
	function CreateBodyDef(sprite, type) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = type;
		bodyDef.position.Set(sprite.x / PHYSICS_SCALE, sprite.y / PHYSICS_SCALE);
		return bodyDef;
	}
	
	//
	// CreateFixtureDef - Creates a basic fixture definition without a shape
	//
	function CreateFixtureDef(density, friction, restitution) {
		var fixDef = new b2FixtureDef();
		fixDef.density = typeof density !== 'undefined' ? density : 1.0;
		fixDef.friction = typeof friction !== 'undefined' ? friction : 0.5;
		fixDef.restitution = typeof restitution !== 'undefined' ? restitution : 0.2;
		return fixDef;
	}
}());


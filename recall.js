/**
 * @author Dylan
 */
var DEBUGMODE = true;

// Constant Declarations
var PHYSICS_SCALE = 100.0;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_SPACE = 32;
var PLAYER_STATE_NORMAL = 0;
var PLAYER_STATE_RUNNER = 1;
var VIEWPORT_WIDTH = document.getElementById("recall").width;
var VIEWPORT_HEIGHT = document.getElementById("recall").height;

//OBJ
var KEY_E = 69;

// Global Variables
var physics;
var player;

var door;

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
	
	//OBJ
	gInput.addBool(KEY_E, "E");
	
	initGame("recall");
	
	var game = new State();
	game.alwaysDraw = false;
	game.alwaysUpdate = false;
	physics = new b2World(new b2Vec2(0, 10), true);
	
	game.init = function() {
		
		var listener = new b2ContactListener();
		listener.BeginContact = beginContactListen;
		//OBJ
		listener.EndContact = endContactListen;
		//
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
		player = CreatePlayer(100, 100, 25, 50, "sprites/trash.png");
		
		States.current().world.level = [];
		level = States.current().world.level;
		level[0] = CreateWorldElement(400, 550, 800, 100, "sprites/trash.png", true, 0);
		level[1] = CreateWorldElement(1200, 500, 800, 100, "sprites/trash.png", true, 1);
		level.width = level[0].width/2 + level[level.length-1].x - level[0].x + level[level.length-1].width/2;
		//OBJ
        door = CreateWorldElement(400, 475, 60, 60, "sprites/door.png", true, 0);
        door.fixture.SetSensor(true);
                //
	}
	
	function beginContactListen(contact) {
		var objectA = contact.GetFixtureA().GetBody().GetUserData();
		var objectB = contact.GetFixtureB().GetBody().GetUserData();
		if(objectA == player || objectB == player) {
			var floor;//other obj
			if(objectA == player) floor = objectB;
			if(objectB == player) floor = objectA;
			//OBJ
	        if(floor == door){ //check if it is specifically near the door
	        	player.near = true;
	        	println("near");
	        }else //checks to see if it is on top of the ground
	        /////
         	if(Math.abs(player.x - floor.x) < floor.width/2 + player.width/4) {
         		player.onGround = true;
         	} else {
         		var direction = 1;
         		if(player.x < floor.x) direction = -1;
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
	
	//OBJ
	//Check to see when it is no longer in contact
	function endContactListen(contact) {
		var objectA = contact.GetFixtureA().GetBody().GetUserData();
		var objectB = contact.GetFixtureB().GetBody().GetUserData();
		if(objectA == player || objectB == player) {
			var obj;//other obj
			if(objectA == player) obj = objectB;
			if(objectB == player) obj = objectA;
			if(obj == door){ //check if it is specifically near the door
	        	player.near = false;
	        	println("away");
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
	// CreatePlayer - creates the player sprite, physics body, and update functions
	//
	function CreatePlayer(x, y, width, height, image) {
		var player = CreateSprite(x, y, width, height, image, -9999);
		player.onGround = true;
		player.near = false;//check for whether or not the player is near an interactable obj
		ApplyRectBBox(player, b2Body.b2_dynamicBody, 10.0, 1, 0);
		player.body.SetFixedRotation(true);
		
		player.state = PLAYER_STATE_NORMAL;
		player.update = function(d) {
			// Move the sprite according to the physics body
			var pos = player.body.GetPosition();
			player.x = pos.x * PHYSICS_SCALE;
			player.y = pos.y * PHYSICS_SCALE;
			player.rotation = player.body.GetAngle();
			//OBJ
			if(player.near){println("E");} 
			//
			// Movement code
			var velocity = player.body.GetLinearVelocity();
			if(player.state == PLAYER_STATE_NORMAL) {
				if(gInput.right && player.onGround) {
					var deltaVelocity = 2 - velocity.x;
					var impulse = new b2Vec2(player.body.GetMass() * deltaVelocity, 0);
					player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
				}
				if(gInput.left && player.onGround) {
					var deltaVelocity = -2 - velocity.x;
					var impulse = new b2Vec2(player.body.GetMass() * deltaVelocity, 0);
					player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
				}
				if(gInput.space) {
					player.state = PLAYER_STATE_RUNNER;
				}
			} else if(player.state == PLAYER_STATE_RUNNER && player.onGround) {
				var deltaVelocity = 4 - velocity.x;
				var impulse = new b2Vec2(player.body.GetMass() * deltaVelocity, 0);
				player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
			}
			if(gInput.up && player.onGround) {
				player.onGround = false;
				var deltaVelocity = velocity.y - 3.75;
				var impulse = new b2Vec2(0, player.body.GetMass() * deltaVelocity);
				player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
			}
		};
		return player;
	}
	
	//
	// CreateWorldElement - creates a world element that will spawn and despawn based on visibility
	//
	function CreateWorldElement(x, y, width, height, image, solid, index) {
		var element = CreateSprite(x, y, width, height, image, index);
		ApplyRectBBox(element, b2Body.b2_staticBody, 1.0, 1, 0);
		element.update = function(d) {
			var xpos = this.x + States.current().world.x;
			if(xpos + this.width/2 < world.x) {
				this.x += States.current().world.level.width;
				var pos = this.body.GetPosition();
				pos.x += States.current().world.level.width / PHYSICS_SCALE;
				this.body.SetPosition(pos);
			}
		};
		return element;
	}
	
	//
	// applyBBox - takes sprite and fixture definition and applies the bounding box to sprite
	//
	function ApplyBBox(sprite, type, fixDef) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = type;
		bodyDef.position.Set(sprite.x / PHYSICS_SCALE, sprite.y / PHYSICS_SCALE);
		
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
		var fixDef = new b2FixtureDef();
		fixDef.density = typeof density !== 'undefined' ? density : 1.0;
		fixDef.friction = typeof friction !== 'undefined' ? friction : 0.5;
		fixDef.restitution = typeof restitution !== 'undefined' ? restitution : 0.2;
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(sprite.width / 2 / PHYSICS_SCALE, sprite.height / 2 / PHYSICS_SCALE);
		
		ApplyBBox(sprite, type, fixDef);
	}
}());


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

// Global Variables
var physics;
var player;

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
	
	initGame("recall");
	
	var game = new State();
	game.alwaysDraw = false;
	game.alwaysUpdate = false;
	physics = new b2World(new b2Vec2(0, 10), true);
	
	game.init = function() {
		
		var listener = new b2ContactListener();
		listener.BeginContact = contactListen;
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
		player = CreatePlayer(100, 100, 25, 50, "http://www.jar42.com/brine/box2d_test/images/trash.png");
				
		var ground = CreateSprite(400, 550, 800, 100, "images/trash.png");
		ApplyRectBBox(ground, b2Body.b2_staticBody, 1.0, 1, 0);
		
		var ground2 = CreateSprite(400, 550, 800, 100, "images/trash.png");
		ApplyRectBBox(ground2, b2Body.b2_staticBody, 1.0, 1, 0);
		ground2.rotation = -1 * Math.PI / 8;
		ground2.body.SetAngle(-1 * Math.PI / 8);
	}
	
	function contactListen(contact) {
		var objectA = contact.GetFixtureA().GetBody().GetUserData();
		var objectB = contact.GetFixtureB().GetBody().GetUserData();
		if(objectA == player || objectB == player) {
         player.onGround = true;
         println(objectB.body.GetAngle());
         player.body.SetAngle(player.body.GetAngle() + Math.PI / 4);
      }
	}
}());


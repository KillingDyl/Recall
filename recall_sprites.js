/**
 * @author Dylan
 */

//
// createSprite - function to create a basic sprite to be displayed
//
function CreateSprite(x, y, width, height, image) {
	var sprite = new Sprite();
	sprite.x = x;
	sprite.y = y;
	sprite.width = width;
	sprite.height = height;
	sprite.xoffset = -width/2;
	sprite.yoffset = -height/2;
	sprite.image = Textures.load(image);
	States.current().world.addChild(sprite);
	return sprite;
}

//
// createPlayer - creates the player sprite, physics body, and update functions
//
function CreatePlayer(x, y, width, height, image) {
	var player = CreateSprite(x, y, width, height, image);
	player.onGround = true;
	ApplyRectBBox(player, b2Body.b2_dynamicBody, 10.0, 1, 0);
	player.body.SetFixedRotation(true);
	player.update = function(d) {
		// Move the sprite according to the physics body
		var pos = player.body.GetPosition();
		player.x = pos.x * PHYSICS_SCALE;
		player.y = pos.y * PHYSICS_SCALE;
		player.rotation = player.body.GetAngle();
		
		// Movement code
		var velocity = player.body.GetLinearVelocity();
		if(gInput.right && player.onGround) {
			var deltaVelocity = 2 - velocity.x;
			var impulse = new b2Vec2(player.body.GetMass() * deltaVelocity, 0);
			player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
		}
		if(gInput.left && player.onGround) {
			var deltaVelocity = 2 + velocity.x;
			var impulse = new b2Vec2(player.body.GetMass() * -deltaVelocity, 0);
			player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
		}
		if(gInput.up && player.onGround) {
			player.onGround = false;
			var deltaVelocity = velocity.y - 3;
			var impulse = new b2Vec2(0, player.body.GetMass() * deltaVelocity);
			player.body.ApplyImpulse(impulse, player.body.GetWorldCenter());
		}
	};
	return player;
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

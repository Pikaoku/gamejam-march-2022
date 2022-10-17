import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
	active: false,
	visible: false,
	key: "Game",
};

class Planet extends Phaser.Physics.Arcade.Sprite {
	private path: Phaser.Curves.Ellipse;
	private pathIndex: number;
	private speed: number;
	private pathSpeed: number;
	private pathVector: Phaser.Math.Vector2;
	private sprite;

	constructor(scene, x, y, width, height, speed) { 
		super(scene, x, y, width, height); // config
		this.speed = speed;
		Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, "planet");
		this.path = new Phaser.Curves.Ellipse(x, y, width, height);
		this.pathIndex = 0;
		this.pathSpeed = this.speed;
		this.pathVector = new Phaser.Math.Vector2();
		this.path.getPoint(0, this.pathVector);
		this.setPosition(this.pathVector.x, this.pathVector.y);
	}

	preUpdate(time, delta) {
		this.anims.update(time, delta);

		this.path.getPoint(this.pathIndex, this.pathVector);

		this.setPosition(this.pathVector.x, this.pathVector.y);

		this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
	}
}

class GameScene extends Phaser.Scene {
	private minimap;
	private player;
	private cursors;
	private speed = 300;
	private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

	constructor() {
		super(sceneConfig); // config
	}

	public preload() {
		this.load.image("space-background", "/assets/space-background.jpg");
		this.load.image("sun", "/assets/sun.png");
		this.load.image("planet", "/assets/first-rock-from-the-sun.png");
		this.load.image("ship", "/assets/orangeship3.png");
		this.load.image("spark", "/assets/blue.png");
		this.load.image("asteroid", "/assets/asteroid.png");
	}

	create() {
		this.matter.world.setBounds(0, 0, 3200, 600);
		this.cameras.main.setBounds(0, 0, 3200, 600).setName("main");
		this.minimap = this.cameras
			.add(200, 10, 400, 100)
			.setZoom(0.2)
			.setName("mini");
		this.minimap.setBackgroundColor(0x002244);
		this.minimap.scrollX = 1600;
		this.minimap.scrollY = 300;
		//  Add a player ship and camera follow
		this.player = this.matter.add
			.sprite(1600, 200, "ship")
			.setFixedRotation()
			.setMass(30);
		//TODO add   .setFrictionAir(0.05);

		this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
		this.cursors = this.input.keyboard.createCursorKeys();

		this.ship = this.physics.add.sprite(20, 30, "ship");
		this.ship.setBounce(0.2);
		this.ship.setCollideWorldBounds(true);
		this.ship.setDrag(100);
		this.ship.setMaxVelocity(900);

		this.ship.setMaxVelocity(1800);

		this.emitter = this.add.particles("spark").createEmitter({
			angle: { min: 180, max: 360 },
			speed: 200,
			lifespan: 400,
			quantity: 8,
			scale: { start: 0.2, end: 0.0 },

			blendMode: "ADD",
		});
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.thrustBack(0.1);
			this.player.flipX = true;
			this.ship.setAngularVelocity(-300);
		} else if (this.cursors.right.isDown) {
			this.player.thrust(0.1);
			this.player.flipX = false;
			this.ship.setAngularVelocity(300);
		} else {
			this.ship.setAngularVelocity(0);
		}
		if (this.cursors.up.isDown) {
			this.player.thrustLeft(0.1);
			this.physics.velocityFromRotation(
				this.ship.rotation,
				200,
				this.ship.body.acceleration
			);
		} else if (this.cursors.down.isDown) {
			this.player.thrustRight(0.1);
			this.ship.setAcceleration(0);
		} else {
			this.ship.setAcceleration(0);
		}
		//  And this camera is 400px wide, so -200
		this.minimap.scrollX = Phaser.Math.Clamp(this.player.x - 200, 800, 2000);
		this.emitter.setPosition(this.ship.x, this.ship.y);
		this.emitter.setAngle(this.ship.rotation);
	}
}

export class MapScene extends Phaser.Scene {

   	private minimap;
	private cursors;
	private speed = 300;
	private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

	constructor() {
		super(sceneConfig);
	}

	public preload() {
		this.load.image("space-background", "/assets/space-background.jpg");
		this.load.image("sun", "/assets/sun.png");
		this.load.image("planet", "/assets/first-rock-from-the-sun.png");
		this.load.image("space-background", "/assets/space-background.jpg");
		this.load.image("ship", "/assets/orangeship3.png");
		this.load.image("spark", "/assets/blue.png");
		this.load.image("asteroid", "/assets/asteroid.png");
	
	}

	public create() {
		const background = this.add.image(
			this.cameras.main.width / 2,
			this.cameras.main.height / 2,
			"space-background"
		);
		let scaleX = this.cameras.main.width / background.width;
		let scaleY = this.cameras.main.height / background.height;
		let scale = Math.max(scaleX, scaleY);
		background.setScale(scale).setScrollFactor(0);

		const screenCenterX =
			this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY =
			this.cameras.main.worldView.y + this.cameras.main.height / 2;
		const sun = this.add
			.image(screenCenterX, screenCenterY, "sun")
			.setOrigin(0.5);

		const planets = this.physics.add.group({ allowGravity: false });
		planets.add(
			new Planet(this, screenCenterX, screenCenterY, 700, 700, 0.0003),
			true
		);
		planets.add(
			new Planet(this, screenCenterX, screenCenterY, 350, 350, 0.0005),
			true
		);

		//TODO add   .setFrictionAir(0.05);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.ship = this.physics.add.sprite(20, 30, "ship");
		this.ship.setBounce(0.2);
		this.ship.setCollideWorldBounds(true);
		this.ship.setDrag(100);
		this.ship.setMaxVelocity(900);

		this.ship.setMaxVelocity(1800);

		this.emitter = this.add.particles("spark").createEmitter({
			angle: { min: 180, max: 360 },
			speed: 200,
			lifespan: 400,
			quantity: 8,
			scale: { start: 0.2, end: 0.0 },

			blendMode: "ADD",
		});

		

	}
	
	update() {
		  if (this.cursors.left.isDown) {
            this.ship.setAngularVelocity(-300);
        } else if (this.cursors.right.isDown) {
            this.ship.setAngularVelocity(300);
        } else {
            this.ship.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(
                this.ship.rotation,
                200,
                this.ship.body.acceleration
            );
        } else {
            this.ship.setAcceleration(0);
        }
        this.emitter.setPosition(this.ship.x, this.ship.y);
        this.emitter.setAngle(this.ship.rotation);
	}
}

const mapConfig: Phaser.Types.Core.GameConfig = {
	title: "Sample",
	type: Phaser.AUTO,
	scene: MapScene,
	scale: {
		width: window.innerWidth,
		height: window.innerHeight,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: true,
		}
	},
	parent: "game",
};

export const map = new Phaser.Game(mapConfig);

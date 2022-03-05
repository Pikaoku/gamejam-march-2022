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

	constructor(scene, x, y, width, height, speed) {
		console.log("Test2");
		super(scene, x, y, width, height); // config
		this.speed = speed;
		Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, "planet");
		this.path = new Phaser.Curves.Ellipse(x, y, width, height);
		this.pathIndex = 0;
		this.pathSpeed = this.speed;
		this.pathVector = new Phaser.Math.Vector2();
		this.path.getPoint(0, this.pathVector);
		this.setPosition(this.pathVector.x, this.pathVector.y);
		console.log("Test1");
	}

	create(scene, x, y, width, height) {
		console.log("Test1");
		this.path = new Phaser.Curves.Ellipse(x, y, width, height);
		this.pathIndex = 0;
		this.pathSpeed = this.speed;
		this.pathVector = new Phaser.Math.Vector2();

		this.path.getPoint(0, this.pathVector);

		this.setPosition(this.pathVector.x, this.pathVector.y);
	}

	preUpdate(time, delta) {
		console.log("Test1");
		this.anims.update(time, delta);

		this.path.getPoint(this.pathIndex, this.pathVector);

		this.setPosition(this.pathVector.x, this.pathVector.y);

		this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
	}
}

export class MapScene extends Phaser.Scene {
	constructor() {
		super(sceneConfig);
	}

	public preload() {
		this.load.image("space-background", "/assets/space-background.jpg");
		this.load.image("sun", "/assets/sun.png");
		this.load.image("planet", "/assets/planet2.jpg");
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
		planets.add(new Planet(this, 150, 100, 1000, 1000, 0.005), true);
		planets.add(new Planet(this, 150, 800, 1000, 1000, 0.005), true);
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
		},
	},
	parent: "game",
};

export const map = new Phaser.Game(mapConfig);

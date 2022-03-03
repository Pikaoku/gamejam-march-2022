import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
	active: false,
	visible: false,
	key: "Game",
};

export class MapScene extends Phaser.Scene {
	constructor() {
		super(sceneConfig);
	}

	public preload() {
		this.load.image("space-background", "/assets/space-background.jpg");
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

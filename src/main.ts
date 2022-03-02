import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private background!: Phaser.GameObjects.Image;

  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.image("player", "../assets/green_ship.png");
    this.load.image("background", "../assets/blue-background.jpg");
  }

  public create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);
    this.background.setAlpha(1);
    this.background.setBlendMode(Phaser.BlendModes.DARKEN);
    this.background.displayWidth = window.innerWidth;
    this.background.displayHeight = window.innerHeight;

    this.player = this.physics.add.sprite(500, 550, "player", 1);
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.5);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds();
    this.player.body.drag.setTo(400, 400);
  }

  private forwardThrust: number = 0;

  update() {
    
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
  type: Phaser.AUTO,
  scene: GameScene,
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
  backgroundColor: "#0000ff",
};

export const game = new Phaser.Game(gameConfig);

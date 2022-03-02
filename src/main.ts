import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Game",
};

export class GameScene extends Phaser.Scene {
    private speed = 300;
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private cursors;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.image("orc-man", "/assets/orangeship3.png");
        this.load.image("spark", "/assets/blue.png");
    }

    public create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.sprite(20, 30, "orc-man");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setDrag(100);
        this.player.setMaxVelocity(900);
        this.emitter = this.add.particles("spark").createEmitter({
            angle: { min: 180, max: 360 },
            speed: 200,
            lifespan: 400,
            quantity: 8,
            scale: { start: 0.2, end: 0.0 },

            blendMode: "ADD",
        });
    }

    public update() {
        if (this.cursors.left.isDown) {
            this.player.setAngularVelocity(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setAngularVelocity(300);
        } else {
            this.player.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(
                this.player.rotation,
                200,
                this.player.body.acceleration
            );
        } else {
            this.player.setAcceleration(0);
        }
        this.emitter.setPosition(this.player.x, this.player.y);
        this.emitter.setAngle(this.player.rotation);
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
    backgroundColor: "#667766",
};

export const game = new Phaser.Game(gameConfig);

import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Game",
};

export class GameScene extends Phaser.Scene {
    private speed = 300;
    private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private cursors;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.image("orc-man", "/assets/orangeship3.png");
        this.load.image("spark", "/assets/blue.png");
        this.load.image("asteroid", "/assets/asteroid.png");
    }

    public create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.ship = this.physics.add.sprite(500 ,500, "orc-man");
        this.ship.setBounce(0.2);
        this.ship.setCollideWorldBounds(true);
        this.ship.setDrag(100);
        this.ship.setMaxVelocity(900);

        const asteroid = this.physics.add.sprite(200, 300, "asteroid");
        asteroid.setScale(0.2);
        asteroid.setAngularVelocity(100);
        asteroid.setVelocity(800, 600);
        asteroid.setBounce(0.6);
        asteroid.setCollideWorldBounds(true);

        this.ship.setMaxVelocity(1800);
        this.physics.add.collider(this.ship, asteroid);

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

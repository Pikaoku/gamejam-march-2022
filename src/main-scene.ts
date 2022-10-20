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

export class MapScene extends Phaser.Scene {
  private minimap;
  private cursors;
  private speed = 300;
  private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private background;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.image("space-background", "/assets/space.png");
    this.load.image("sun", "/assets/sun.png");
    this.load.image("planet", "/assets/first-rock-from-the-sun.png");
    this.load.image("space-background", "/assets/space-background.jpg");
    this.load.image("ship", "/assets/orangeship3.png");
    this.load.image("spark", "/assets/blue.png");
    this.load.image("asteroid", "/assets/asteroid.png");
  }

  public create() {
    this.background = this.add
      .tileSprite(0, 0, 5700, 6000, "space-background")
      .setScrollFactor(0);

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const sun = this.physics.add.staticImage(600, 300, "sun");

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

    this.ship = this.physics.add.sprite(screenCenterX, screenCenterY, "ship");
    this.ship.setOrigin(0.5);
    this.ship.setBounce(0.2);
    this.ship.setCollideWorldBounds(false);
    this.ship.setDrag(100);
    this.ship.setMaxVelocity(600);

    this.cameras.main.startFollow(this.ship);

    this.emitter = this.add.particles("spark").createEmitter({
      angle: { min: 180, max: 360 },
      speed: 200,
      lifespan: 400,
      quantity: 8,
      scale: { start: 0.2, end: 0.0 },

      blendMode: "ADD",
    });

    // Same:
    // this.physics.accelerateTo(clown, block.x, block.y, 60, 300, 300);
  }

  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-150);
    } else if (this.cursors.right.isDown) {
      this.ship.setAngularVelocity(150);
    } else {
      this.ship.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(
        this.ship.rotation,
        600,
        this.ship.body.acceleration
      );
    } else {
      this.ship.setAcceleration(0);
    }

    this.background.tilePositionX += this.ship.body.deltaX() * 0.5;
    this.background.tilePositionY += this.ship.body.deltaY() * 0.5;
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
    },
  },
  parent: "game",
};

export const map = new Phaser.Game(mapConfig);

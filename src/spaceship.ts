import * as Phaser from "phaser";

// Stores the current output and max output of the thruster. When ignited the output rises to the max
class Thruster {
  private gain: number = 10;
  private loss: number = 5;
  private thrust: number = 0;
  private maxThrust: number = 200;

  constructor(rate: number, loss: number, maximumThrust: number) {
    this.gain = rate;
    this.loss = loss;
    this.maxThrust = maximumThrust;
  }

  ignite() {
    this.thrust = Math.min(this.thrust + this.gain, this.maxThrust);
  }

  extinguish() {
    this.thrust = Math.max(this.thrust + this.loss, this.maxThrust);
  }
}

class Spaceship extends Phaser.GameObjects.Sprite, Phaser.
  private mass: number = 100;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "spaceship");

    this.setOrigin(0.5, 0.5);
    this.setScale(0.5);
    this.setBounce(0.2);
    this.setCollideWorldBounds();
    this.body.drag.setTo(400, 400);
  }

  move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.cursors.left.isDown) {
      this.setAccelerationX(150 * -1 * Math.sin(this.player.rotation));
      this.player.setAngularVelocity(this.forwardThrust * 0.25 * -1);
    } else if (this.cursors.right.isDown) {
      this.forwardThrust = Math.min(this.forwardThrust + 5, 300);
      this.player.setAccelerationX(150);
      this.player.setAngularVelocity(this.forwardThrust * 0.25);
    } else {
      this.player.setAccelerationX(0);
      this.player.setAngularVelocity(0);
    }

    // if up is down
    if (this.cursors.up.isDown) {
      this.forwardThrust = Math.min(this.forwardThrust + 10, 300);
      this.player.setVelocity(
        this.forwardThrust * Math.sin(this.player.rotation),
        this.forwardThrust * -1 * Math.cos(this.player.rotation)
      );
    } else {
      this.forwardThrust = Math.max(this.forwardThrust - 5, 0);
    }
  }
}

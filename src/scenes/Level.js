
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// homeBg
		this.add.image(540, 960, "homeBg");

		// logo
		this.add.image(540, 320, "logo");

		// ring
		const ring = this.add.image(295, 260, "ring");

		// playBtn
		const playBtn = this.add.image(540, 1554, "playBtn");

		this.ring = ring;
		this.playBtn = playBtn;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	ring;
	/** @type {Phaser.GameObjects.Image} */
	playBtn;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();
		this.pointerOverAndOut();

		this.add.tween({
			targets: this.ring,
			angle: 360,
			duration: 5000,
			repeat: -1,
			ease: 'Linear'
		});

		this.playBtn.setInteractive().on('pointerdown', () => {
			this.tweens.add({
				targets: this.playBtn,
				scaleX: 0.9,
				scaleY: 0.9,
				duration: 80,
				yoyo: true,
				onComplete: () => {
					this.scene.start("GamePlay");
				}
			});
		});
	}

	pointerOverAndOut() {
		this.pointerOver = (aBtn, scale) => {
			this.input.setDefaultCursor('pointer');
			this.tweens.add({
				targets: aBtn,
				scaleX: scale + 0.05,
				scaleY: scale + 0.05,
				duration: 50
			})
		}
		this.pointerOut = (aBtn, scale) => {
			this.input.setDefaultCursor('default');
			this.tweens.add({
				targets: aBtn,
				scaleX: scale,
				scaleY: scale,
				duration: 50,
				onComplete: () => {
					aBtn.forEach((btn) => {
						btn.setScale(scale);
					});
				}
			})
		}
		this.playBtn.on('pointerover', () => this.pointerOver([this.playBtn], 1));
		this.playBtn.on('pointerout', () => this.pointerOut([this.playBtn], 1));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

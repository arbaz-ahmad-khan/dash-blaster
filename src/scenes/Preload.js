
// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// preloadBg
		this.add.image(540, 960, "preloadBg");

		// logo
		this.add.image(540, 320, "logo");

		// ring
		this.add.image(295, 260, "ring");

		// bar_base
		this.add.image(571, 1598, "bar_base");

		// innerBar
		const innerBar = this.add.image(260, 1597, "Bar");
		innerBar.setOrigin(0, 0.5);

		// ball
		const ball = this.add.image(289, 1597, "preloadBall");
		ball.visible = false;

		this.innerBar = innerBar;
		this.ball = ball;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	innerBar;
	/** @type {Phaser.GameObjects.Image} */
	ball;

	/* START-USER-CODE */

	// Write your code here

	preload() {

		this.editorCreate();

		this.editorPreload();

		this.isGameLoaded1 = false;
		this.isGameLoaded2 = false;

		this.loadingProgress();
	}

	loadingProgress() {
		this.load.on(Phaser.Loader.Events.COMPLETE, (p) => {
			this.isGameLoaded1 = true;
		});

		this.innerBarWidth = this.innerBar.displayWidth;

		this.maskGraphics = this.make.graphics();
		this.maskGraphics.fillStyle(0xffffff);
		this.maskGraphics.fillRect(
			this.innerBar.x,
			this.innerBar.y - this.innerBar.displayHeight / 2,
			this.innerBar.displayWidth,
			this.innerBar.displayHeight
		);
		this.innerBar.setVisible(false);

		this.innerBar.setMask(this.maskGraphics.createGeometryMask());

		const loadingDuration = 3000;
		const intervalDuration = 30;
		const numIntervals = loadingDuration / intervalDuration;
		let currentInterval = 0;
		const progressIncrement = 1 / numIntervals;

		const updateProgressBar = () => {
			this.innerBar.setVisible(true);
			const currentProgress = currentInterval * progressIncrement;
			this.maskGraphics.clear();
			this.maskGraphics.fillStyle(0xffffff);
			this.maskGraphics.fillRect(
				this.innerBar.x - 30,
				this.innerBar.y - this.innerBar.displayHeight / 2,
				this.innerBarWidth * currentProgress,
				this.innerBar.displayHeight
			);

			currentInterval++;

			this.ball.x = this.innerBar.x - 30 + (this.innerBarWidth * currentProgress);

			if (currentProgress >= 1) {
				clearInterval(progressInterval);
				this.isGameLoaded2 = true;
			}
		};

		const progressInterval = setInterval(updateProgressBar, intervalDuration);

		this.tweens.add({
			targets: this.ball,
			duration: 3000,
			angle: 360 * 2,
			repeat: 1,
		});
	}

	update() {
		if (this.ball.x >= 285) this.ball.setVisible(true);
		if (this.isGameLoaded1 && this.isGameLoaded2) {
			this.scene.stop("Preload");
			this.scene.start("Level");
		}
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

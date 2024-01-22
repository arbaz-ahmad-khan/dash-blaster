
// You can write more code here

/* START OF COMPILED CODE */

class GamePlay extends Phaser.Scene {

	constructor() {
		super("GamePlay");

		/* START-USER-CTR-CODE */
		// Write your code here.
		this.gameOptions = {
			numCircles: 4,
			circleRadiusRange: [120, 200],
			circleDistanceRange: [600, 750],
			bottomDistance: 150,
			distanceFromCenter: [0, 150],
			speed: 2000,
			// circleColors: [0x4deeea, 0x74ee15, 0xffe700, 0xf000ff, 0x001eff],
			circleColors: [0xFF0D0D, 0xEA02CF, 0xFF6200, 0x4DFFF9, 0xFEF600, 0x0800FF, 0x00FF3C,
				0x780404, 0x040054, 0x4F0039, 0xEB9CFF],
			arcsOnCircle: 3,
			arcLength: [10, 90],
			rotateSpeed: 1000,
		}
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// gamePlayBg
		this.add.image(540, 960, "gamePlayBg");

		// score
		const score = this.add.image(110, 1824, "Score");
		score.scaleX = 2;
		score.scaleY = 2;

		// score_base
		const score_base = this.add.image(100, 1754, "score-base");
		score_base.scaleX = 2;
		score_base.scaleY = 2;

		// container_game_play
		const container_game_play = this.add.container(0, 1);

		// scoreText
		const scoreText = this.add.text(101, 1750, "", {});
		scoreText.setOrigin(0.5, 0.5);
		scoreText.text = "0";
		scoreText.setStyle({ "color": "#754027", "fontFamily": "LeagueSpartan-Bold", "fontSize": "50px" });
		container_game_play.add(scoreText);

		// container_particle
		const container_particle = this.add.container(0, 0);

		// gameOverContainer
		const gameOverContainer = this.add.container(0, 0);
		gameOverContainer.visible = false;

		// gameOverBg
		const gameOverBg = this.add.image(540, 960, "gameOverBg");
		gameOverBg.alpha = 0.6;
		gameOverBg.alphaTopLeft = 0.6;
		gameOverBg.alphaTopRight = 0.6;
		gameOverBg.alphaBottomLeft = 0.6;
		gameOverBg.alphaBottomRight = 0.6;
		gameOverContainer.add(gameOverBg);

		// ui_base
		const ui_base = this.add.image(540, 960, "ui_base");
		gameOverContainer.add(ui_base);

		// highScoreText
		const highScoreText = this.add.text(446, 990, "", {});
		highScoreText.setOrigin(0.5, 0.5);
		highScoreText.text = "0";
		highScoreText.setStyle({ "color": "#754027", "fontFamily": "LeagueSpartan-Bold", "fontSize": "100px" });
		gameOverContainer.add(highScoreText);

		// yourScoreText
		const yourScoreText = this.add.text(681, 990, "", {});
		yourScoreText.setOrigin(0.5, 0.5);
		yourScoreText.text = "0";
		yourScoreText.setStyle({ "color": "#754027", "fontFamily": "LeagueSpartan-Bold", "fontSize": "100px" });
		gameOverContainer.add(yourScoreText);

		// homeBtn
		const homeBtn = this.add.image(422, 1160, "homeBtn");
		gameOverContainer.add(homeBtn);

		// replayBtn
		const replayBtn = this.add.image(710, 1160, "replayBtn");
		gameOverContainer.add(replayBtn);

		this.scoreText = scoreText;
		this.container_game_play = container_game_play;
		this.container_particle = container_particle;
		this.highScoreText = highScoreText;
		this.yourScoreText = yourScoreText;
		this.homeBtn = homeBtn;
		this.replayBtn = replayBtn;
		this.gameOverContainer = gameOverContainer;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Text} */
	scoreText;
	/** @type {Phaser.GameObjects.Container} */
	container_game_play;
	/** @type {Phaser.GameObjects.Container} */
	container_particle;
	/** @type {Phaser.GameObjects.Text} */
	highScoreText;
	/** @type {Phaser.GameObjects.Text} */
	yourScoreText;
	/** @type {Phaser.GameObjects.Image} */
	homeBtn;
	/** @type {Phaser.GameObjects.Image} */
	replayBtn;
	/** @type {Phaser.GameObjects.Container} */
	gameOverContainer;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
		this.stuffGroup = this.add.group();
		this.bestScore = parseInt(localStorage.getItem('dash-blaster-best')) || 0;

		// this.bestScoreText = this.add.text(730, 40, 'Best Score: ' + this.bestScore, {
		// 	fontFamily: "toJapan",
		// 	fontSize: '32px',
		// 	fill: '#fff',
		// }).setOrigin(0, 0.5);

		this.canShoot = true;
		this.circles = [];
		this.landingSpots = [];
		this.arcs = [];
		this.arcTweens = [];
		this.bottomCircle = 0;
		this.levelScore = 0
		this.setStage(1);

		for (let i = 0; i < this.gameOptions.numCircles; i++) {
			this.circles[i] = this.add.graphics();
			this.container_game_play.add(this.circles[i])
			this.stuffGroup.add(this.circles[i]);
			this.arcs[i] = this.add.graphics();
			this.container_game_play.add(this.arcs[i])
			this.stuffGroup.add(this.arcs[i]);
			this.arcTweens[i] = this.tweens.add({
				targets: this.arcs[i],
				angle: 360,
				duration: this.gameOptions.rotateSpeed, // rotate speed
				repeat: -1,
			})
			this.landingSpots[i] = this.add.sprite(0, 0, "ball");
			this.landingSpots[i].alpha = 0.5;
			this.stuffGroup.add(this.landingSpots[i]);
			this.drawCircle(i);
		}

		this.ball = this.add.sprite(this.circles[0].x, this.circles[0].y, "ball-2");
		// this.ball.setDepth(2);
		this.stuffGroup.add(this.ball);
		this.input.on("pointerdown", this.shootBall, this);
	}

	setStage(stage) {
		switch (stage) {
			case 1:
				this.gameOptions.arcsOnCircle = 2;
				break;
			case 2:
				this.gameOptions.arcsOnCircle = 3;
				break;
			case 3:
				this.gameOptions.arcsOnCircle = 4;
				break;
			case 4:
				this.gameOptions.arcsOnCircle = 5;
				break;
			default:
				this.gameOptions.arcsOnCircle = 3;
				break;
		}
	}

	drawCircle(i) {
		this.circles[i].clear();
		// this.circles[i].lineStyle(8, 0x888888, 1);
		this.circles[i].lineStyle(8, 0xFFD9A7, 1);
		let radius = this.randomOption(this.gameOptions.circleRadiusRange);
		this.circles[i].radius = radius;
		this.circles[i].x = 1080 / 2 + this.randomOption(this.gameOptions.distanceFromCenter) * Phaser.Math.RND.sign();
		if (i == 0 && this.bottomCircle == 0) {
			this.circles[i].y = 1920 - radius - this.gameOptions.bottomDistance;
		}
		else {
			this.circles[i].y = this.circles[Phaser.Math.Wrap(i - 1, 0, this.gameOptions.numCircles)].y - this.randomOption(this.gameOptions.circleDistanceRange);
		}
		this.arcs[i].x = this.circles[i].x
		this.arcs[i].y = this.circles[i].y
		this.circles[i].strokeCircle(0, 0, radius);
		this.landingSpots[i].x = this.circles[i].x;
		this.landingSpots[i].y = this.circles[i].y;
		this.arcs[i].x = this.circles[i].x
		this.arcs[i].y = this.circles[i].y
		this.arcs[i].clear();
		this.arcs[i].arcCoords = [];
		this.arcs[i].lineStyle(18, Phaser.Utils.Array.GetRandom(this.gameOptions.circleColors), 1);
		for (let j = 0; j < this.gameOptions.arcsOnCircle; j++) {
			this.arcs[i].beginPath();
			let arcStart = Phaser.Math.Between(0, 360)
			let arcEnd = arcStart + this.randomOption(this.gameOptions.arcLength);
			this.arcs[i].arc(0, 0, radius, Phaser.Math.DegToRad(arcStart), Phaser.Math.DegToRad(arcEnd), false);
			this.arcs[i].strokePath();
			this.arcs[i].arcCoords[j] = [arcStart - 8, arcEnd + 8]
		}
		this.arcTweens[i].timeScale = Phaser.Math.RND.realInRange(0.3, 0.5);
	}

	randomOption(option) {
		return Phaser.Math.Between(option[0], option[1]);
	}

	shootBall() {
		if (this.canShoot) {
			this.canShoot = false;
			let targetIndex = Phaser.Math.Wrap(this.bottomCircle + 1, 0, this.gameOptions.numCircles);
			let distance = Phaser.Math.Distance.Between(this.landingSpots[this.bottomCircle].x, this.landingSpots[this.bottomCircle].y, this.landingSpots[targetIndex].x, this.landingSpots[targetIndex].y);
			this.ballTween = this.tweens.add({
				targets: this.ball,
				x: this.landingSpots[targetIndex].x,
				y: this.landingSpots[targetIndex].y,
				duration: distance * 1000 / this.gameOptions.speed,
				callbackScope: this,
				onUpdate: function () {
					this.ballParticle(this.ball)
					this.checkCollision(this.bottomCircle);
					this.checkCollision(Phaser.Math.Wrap(this.bottomCircle + 1, 0, this.gameOptions.numCircles));
				},
				onComplete: function () {
					this.container_particle.getAll().forEach(item => {
						item.destroy();
					})
					let yScroll = 1920 - this.circles[targetIndex].radius - this.gameOptions.bottomDistance - this.circles[targetIndex].y
					this.tweens.add({
						targets: this.stuffGroup.getChildren(),
						props: {
							y: {
								value: "+=" + yScroll
							}
						},
						duration: 250,
						callbackScope: this,
						onComplete: function () {
							this.levelScore++;
							this.scoreText.text = this.levelScore
							if (this.levelScore > 4 && this.levelScore <= 10) {
								this.setStage(2);
							}
							else if (this.levelScore > 10 && this.levelScore <= 16) {
								this.setStage(3);
							}
							else if (this.levelScore > 16) {
								this.setStage(4);
							}
							let currentCircle = this.bottomCircle;
							this.bottomCircle = Phaser.Math.Wrap(this.bottomCircle + 1, 0, this.gameOptions.numCircles);
							this.drawCircle(Phaser.Math.Wrap(currentCircle, 0, this.gameOptions.numCircles))
							this.canShoot = true;
						}
					})
				}
			})
		}
	}

	checkCollision(i) {
		let distance = Phaser.Math.Distance.Between(this.circles[i].x, this.circles[i].y, this.ball.x, this.ball.y);
		if (Math.abs(distance - this.circles[i].radius) < this.ball.width / 2) {
			let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.circles[i].x, this.circles[i].y, this.ball.x, this.ball.y));
			this.arcs[i].arcCoords.forEach(function (p) {
				let arcStart = Phaser.Math.Angle.WrapDegrees(p[0] + this.arcs[i].angle);
				let arcEnd = Phaser.Math.Angle.WrapDegrees(p[1] + this.arcs[i].angle);
				if (angle >= arcStart && angle <= arcEnd) {
					this.container_particle.getAll().forEach(item => {
						item.destroy();
					})
					this.ballTween.stop();
					this.arcTweens[i].stop();
					this.cameras.main.shake(500, 0.01);
					this.time.addEvent({
						delay: 2000,
						callbackScope: this,
						callback: function () {
							if (this.levelScore > this.bestScore) {
								this.bestScore = this.levelScore;
								localStorage.setItem('dash-blaster-best', this.bestScore);
							}
							// this.scene.start("GamePlay");
							this.highScoreText.text = this.bestScore;
							this.yourScoreText.text = this.levelScore;
							this.gameOverContainer.setDepth(1);
							this.gameOverContainer.visible = true;
							this.pointerOverAndOut();
							this.buttonInteractive();
						}
					});
				}
			}.bind(this))
		}
	}

	ballParticle(ball) {
		let ballParticles = this.add.particles('ball');
		this.container_particle.add(ballParticles)

		this.emitter = ballParticles.createEmitter({
			x: ball.x,
			y: ball.y,
			angle: { min: 0, max: 360 },
			scale: { start: 0.8, end: 0 },
			frequency: 1,
			lifespan: 250,
		});

		this.emitter.startFollow(ball)
		this.emitter.stop();

		this.emitter.setPosition(ball.x, ball.y);
		this.emitter.explode(100, ball.x, ball.y);
	}

	buttonInteractive() {
		this.homeBtn.setInteractive().on('pointerdown', () => {
			this.tweens.add({
				targets: this.homeBtn,
				scaleX: 0.9,
				scaleY: 0.9,
				duration: 80,
				yoyo: true,
				onComplete: () => {
					this.scene.start("Level");
				}
			});
		});
		this.replayBtn.setInteractive().on('pointerdown', () => {
			this.tweens.add({
				targets: this.replayBtn,
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
		this.homeBtn.on('pointerover', () => this.pointerOver([this.homeBtn], 1));
		this.homeBtn.on('pointerout', () => this.pointerOut([this.homeBtn], 1));
		this.replayBtn.on('pointerover', () => this.pointerOver([this.replayBtn], 1));
		this.replayBtn.on('pointerout', () => this.pointerOut([this.replayBtn], 1));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

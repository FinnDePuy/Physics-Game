var timeCheck;function timegate(){timeCheck = game.time;}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.add.text(50,50, "Lost at Sea").setFontSize(50);
        this.add.text(50,100, "Click anywhere to play.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('level1'));
        });
    }
}

var inZone = false;
var finish = false;

class levelOne extends Phaser.Scene {
    constructor(){
        super('level1')
    }
    preload(){
        this.load.path = './assets/'
        this.load.image('floor', 'floor.jpg');
        this.load.image('glass', 'glass.jpg')
        this.load.image('player', 'Player.png');
        this.load.image('flag', 'Flag.png')
        this.load.image('playerflip', 'Player_flip.png')
        this.load.image('buildingOne', 'BuildingOne.png');
        this.load.image('buildingTwo', 'BuildingTwo.png');
        this.load.image('buildingThree', 'BuildingThree.png');
        
    }
    create(){
        this.platform1 = this.physics.add.staticGroup();
        this.platform2 = this.physics.add.staticGroup();
        this.platform3 = this.physics.add.staticGroup();
        this.platform4 = this.physics.add.staticGroup();
        this.platform5 = this.physics.add.staticGroup();
        this.platform6 = this.physics.add.staticGroup();


        var floor = this.physics.add.staticImage(950, 1710, 'floor').setScale(2).refreshBody();
        var invisfloor = this.physics.add.staticImage(950, 1690, 'floor').setScale(2).refreshBody();

        this.platform1.create(400, 950, 'buildingTwo').setScale(3).refreshBody();
        this.platform2.create(700, 878, 'buildingOne').setScale(3).refreshBody();
        this.platform3.create(1500, 700, 'buildingThree').setScale(10).refreshBody();
        this.platform4.create(1000, 878, 'buildingOne').setScale(3).refreshBody();
        this.platform5.create(100, 870, 'buildingTwo').setScale(5).refreshBody();
        this.platform6.create(1000, 450, 'buildingOne').setScale(3).refreshBody();
        //this.floor.create(950, 1710, 'floor').setScale(2).refreshBody();

        


        this.player = this.physics.add.sprite(100, 540, 'player').setScale(.1)
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.addKeys('w,s,a,d,q,e,space');

        this.physics.add.collider(this.player, this.platform1);
        this.physics.add.collider(this.player, this.platform2);
        this.physics.add.collider(this.player, this.platform3);
        this.physics.add.collider(this.player, this.platform4);
        this.physics.add.collider(this.player, this.platform5);
        this.physics.add.collider(this.player, this.platform6);



        this.startTime = new Date();
        this.totalTime = 120;
        this.timeElapsed = 0;

        this.createTimer();
        this.gameTimer = this.time.addEvent({
            delay: 100,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(floor, this.player, function(){
            inZone = true;
        });
    }
    createTimer(){
        this.timeLabel = this.add.text(this.cameras.main.centerX, 100, "00:00", {
            fontFamily: "Arial",
            fontSize: "100px",
            fill: "#fff"
          });
          this.timeLabel.setOrigin(0.5, 1);
          this.timeLabel.setAlign('center');
    }
    updateTimer(){
        var currTime = new Date();
        var timeDiff = this.startTime.getTime() - currTime.getTime();

        this.timeElapsed = Math.abs(timeDiff/ 1000);

        var timeRemaining = this.timeElapsed;

        var minutes = Math.floor(timeRemaining / 60);
        var seconds = Math.floor(timeRemaining) - (60 * minutes);

        var result = (minutes < 10) ? "0" + minutes : minutes;

        result += (seconds < 10) ? ":0" + seconds : ":" + seconds;

        this.timeLabel.setText(result);
    }
    update() {
        var speed = 500;
        const {a,d,w,s,q,e,space} = this.cursors;

        if (a.isDown)//left
        {
            this.player.setVelocityX(-speed);
        }
        else if (d.isDown)//right
        {
            this.player.setVelocityX(speed);
        }
        else//idle
        {
            this.player.setVelocityX(0);
        }

        if (w.isDown || space.isDown)//jump
        {
            if(this.player.body.touching.down){
                this.player.setVelocityY(-speed * 2);
            }
            if(this.player.body.touching.right){
                this.player.setVelocityY(-speed * 2);             
            }
            if(this.player.body.touching.left){
                this.player.setVelocityY(-speed * 2);             
            }
        }

        if (s.isDown && !this.player.body.touching.down)//fall faster
        {
            this.player.setVelocityY(speed * 2);
        }
        if (q.isDown){//left dash
            this.player.setVelocityX(-speed * 3);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }
        if (e.isDown){//right dash
            this.player.setVelocityX(speed * 3);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }

        if(inZone){
            this.player.setPosition(100, 540);
            inZone = false;
        }
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "You sleep in the hut and realize its comfort is good enough to \nsurvive. The hut has a desalination kit and farming equipment. \nSet for a little while longer.").setFontSize(50);
        this.add.text(50, 250, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 2000}
        }
    },
    backgroundColor: '#1cb2f5', 
    scene: [Intro, levelOne, Outro],
    title: "Adventure Game",
});
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
            this.time.delayedCall(1000, () => this.scene.start('level1'));//needs to go back
        });
    }
}

var inZone = false;
var finish = false;
var resets = 0;
var time = 0;
var score = 0;

class levelOne extends Phaser.Scene {
    constructor(){
        super('level1')
    }
    preload(){
        this.load.path = './assets/'
        this.load.image('floor', 'floor.png');
        this.load.image('player', 'Player.png');
        this.load.image('flag', 'Flag.png')
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


        var floor = this.physics.add.staticImage(900, 1370, 'floor').setScale(1.5).refreshBody();
        var flag = this.physics.add.staticImage(1500, 200, 'flag').setScale(1).refreshBody();

        this.platform1.create(400, 950, 'buildingTwo').setScale(3).refreshBody();
        this.platform2.create(700, 970, 'buildingOne').setScale(3).refreshBody();
        this.platform3.create(1500, 700, 'buildingThree').setScale(10).refreshBody();
        this.platform4.create(1000, 970, 'buildingOne').setScale(3).refreshBody();
        this.platform5.create(100, 900, 'buildingTwo').setScale(5).refreshBody();
        this.platform6.create(1000, 500, 'buildingOne').setScale(4).refreshBody();
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
        this.physics.add.overlap(flag, this.player, function(){
            finish = true;
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

        time = result;
        console.log(result);
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
            this.player.setVelocityY(0);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }
        if (e.isDown){//right dash
            this.player.setVelocityX(speed * 3);
            this.player.setVelocityY(0);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }
        if(inZone){
            this.player.setPosition(100, 540);
            inZone = false;
            resets++;
        }
        if(finish){
            this.scene.start('summary1');
            finish = false;
            this.gameTimer.paused = true;
        }
    }
}

var fasttime = '00:04';
var mediumtime = '00:10';
var slowtime = '00:20';

class summaryOne extends Phaser.Scene {
    constructor(){
        super('summary1')
    }
    create(){
        //could not for the life of me get the inputs to count at all correctly it was always a few hundred over
        let timerValue = this.add.text(100, 150, 'time: ' + time, { font: '32px Arial', fill: '#ffffff' });
        let resetsvalue = this.add.text(100, 200, 'resets: ' + resets, { font: '32px Arial', fill: '#ffffff' });
        if(time <= fasttime){
            score += 10;
        }else if(time <= mediumtime){
            score += 7;
        }else if(time <= slowtime){
            score += 3;
        }
        score -= resets;
        if(score < 0){
            score = 0;
        }
        let scorevalue = this.add.text(100, 250, 'score: ' + score, { font: '32px Arial', fill: '#ffffff' });
        this.add.text(100, 300, 'Good luck on the next level.\nClick anywhere to continue' ,{ font: '50px Arial', fill: '#ffffff' });
        time = 0;
        resets = 0;
        score = 0;
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('level2'));
        });
    }
}

class levelTwo extends Phaser.Scene {
    constructor(){
        super('level2')
    }
    preload(){
        this.load.path = './assets/'
        this.load.image('floor', 'floor.png');
        this.load.image('player', 'Player.png');
        this.load.image('flag', 'Flag.png')
        this.load.image('bad', 'Bad.png')
        this.load.image('buildingOne', 'BuildingOne.png');
        this.load.image('buildingTwo', 'BuildingTwo.png');
        this.load.image('buildingThree', 'BuildingThree.png');
        this.load.image('buildingRed', 'BuildingRed.png')
    }
    create(){
        this.platform1 = this.physics.add.staticGroup();
        this.platform2 = this.physics.add.staticGroup();
        this.platform3 = this.physics.add.staticGroup();
        this.platform4 = this.physics.add.staticGroup();
        this.platform5 = this.physics.add.staticGroup();
        this.platform6 = this.physics.add.staticGroup();
        this.platform7 = this.physics.add.staticGroup();



        var floor = this.physics.add.staticImage(900, 1370, 'floor').setScale(1.5).refreshBody();
        var flag = this.physics.add.staticImage(1500, 840, 'flag').setScale(1).refreshBody();
        var red = this.physics.add.staticImage(420, 500, 'buildingRed').setScale(4).refreshBody();


        this.platform1.create(420, 953, 'buildingTwo').setScale(3.5).refreshBody();
        this.platform2.create(600, 350, 'buildingThree').setScale(7).refreshBody();//left building
        this.platform3.create(1100, 620, 'buildingThree').setScale(9).refreshBody();//right building
        this.platform4.create(1500, 950, 'buildingOne').setScale(3).refreshBody();
        this.platform5.create(150, 720, 'buildingThree').setScale(7).refreshBody();
        this.platform6.create(590, 950, 'buildingOne').setScale(4).refreshBody();
        this.platform7.create(780, 950, 'buildingOne').setScale(4).refreshBody();

        var bad = this.physics.add.staticImage(1099.5, 300, 'bad').setScale(9).refreshBody();
        var bad1 = this.physics.add.staticImage(1099.5, 1000, 'bad').setScale(9).refreshBody();
        var bad2 = this.physics.add.staticImage(1099.5, 700, 'bad').setScale(9).refreshBody();
        var bad3 = this.physics.add.staticImage(601, 100, 'bad').setScale(7).refreshBody();
        var bad4 = this.physics.add.staticImage(601, 600, 'bad').setScale(7).refreshBody();
        var bad5 = this.physics.add.staticImage(601, 400, 'bad').setScale(7).refreshBody();



        
        this.player = this.physics.add.sprite(100, 140, 'player').setScale(.1)
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.addKeys('w,s,a,d,q,e,space');

        this.physics.add.collider(this.player, this.platform1);
        this.physics.add.collider(this.player, this.platform2);
        this.physics.add.collider(this.player, this.platform3);
        this.physics.add.collider(this.player, this.platform4);
        this.physics.add.collider(this.player, this.platform5);
        this.physics.add.collider(this.player, this.platform6);
        this.physics.add.collider(this.player, this.platform7);




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

        this.physics.add.overlap(red, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(bad, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(bad1, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(bad2, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(bad3, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(bad4, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(bad5, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(floor, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(flag, this.player, function(){
            finish = true;
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

        time = result;
        console.log(result);
        this.timeLabel.setText(result);
    }
    update(){
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
            this.player.setVelocityY(0);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }
        if (e.isDown){//right dash
            this.player.setVelocityX(speed * 3);
            this.player.setVelocityY(0);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }
        if(inZone){
            this.player.setPosition(100, 140);
            inZone = false;
            resets++;
        }
        if(finish){
            this.scene.start('summary2');
            finish = false;
            this.gameTimer.paused = true;
        }
    }
}



class summaryTwo extends Phaser.Scene {
    constructor(){
        super('summary2')
    }
    create(){
        fasttime = '00:08';
        mediumtime = '00:15';
        slowtime = '00:30';
                //could not for the life of me get the inputs to count at all correctly it was always a few hundred over
        let timerValue = this.add.text(100, 150, 'time: ' + time, { font: '32px Arial', fill: '#ffffff' });
        let resetsvalue = this.add.text(100, 200, 'resets: ' + resets, { font: '32px Arial', fill: '#ffffff' });
        if(time <= fasttime){
            score += 10;
        }else if(time <= mediumtime){
            score += 5;
        }else if(time <= slowtime){
            score += 1;
        }
        score -= resets/2;
        let scorevalue = this.add.text(100, 250, 'score: ' + score, { font: '32px Arial', fill: '#ffffff' });
        time = 0;
        resets = 0;
        score = 0;
        this.add.text(100, 300, 'Good luck on the next level.' ,{ font: '50px Arial', fill: '#ffffff' });
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('level3'));
        });
    }
}
class levelThree extends Phaser.Scene {
    constructor(){
        super('level3')
    }
    preload(){
        this.load.path = './assets/'
        this.load.image('floor', 'floor.png');
        this.load.image('player', 'Player.png');
        this.load.image('flag', 'Flag.png')
        this.load.image('bad', 'Bad.png')
        this.load.image('buildingOne', 'BuildingOne.png');
        this.load.image('buildingTwo', 'BuildingTwo.png');
        this.load.image('buildingThree', 'BuildingThree.png');
        this.load.image('buildingRed', 'BuildingRed.png')
    }
    create(){
        this.platform1 = this.physics.add.staticGroup();
        this.platform2 = this.physics.add.staticGroup();
        this.platform3 = this.physics.add.staticGroup();
        this.platform4 = this.physics.add.staticGroup();
        this.platform5 = this.physics.add.staticGroup();
        this.platform6 = this.physics.add.staticGroup();
        this.platform7 = this.physics.add.staticGroup();


        var floor = this.physics.add.staticImage(900, 1370, 'floor').setScale(1.5).refreshBody();
        var flag = this.physics.add.staticImage(1800, 840, 'flag').setScale(1).refreshBody();
        var red = this.physics.add.staticImage(420, 375, 'buildingRed').setScale(4).refreshBody();
        var red2 = this.physics.add.staticImage(420, -50, 'buildingRed').setScale(4).refreshBody();



        this.platform1.create(1050, 950, 'buildingOne').setScale(3).refreshBody();
        this.platform2.create(900, 950, 'buildingOne').setScale(3).refreshBody();
        this.platform3.create(700, 720, 'buildingThree').setScale(7).refreshBody();
        this.platform4.create(1800, 965, 'buildingThree').setScale(2).refreshBody();
        this.platform5.create(150, 720, 'buildingThree').setScale(7).refreshBody();
        this.platform6.create(1050, 400, 'buildingThree').setScale(6).refreshBody();
        this.platform7.create(1300, 900, 'buildingThree').setScale(6).refreshBody();

        //var bad = this.physics.add.staticImage(1099.5, 300, 'bad').setScale(9).refreshBody();
        //var bad1 = this.physics.add.staticImage(1099.5, 1000, 'bad').setScale(9).refreshBody();
        //var bad2 = this.physics.add.staticImage(1099.5, 700, 'bad').setScale(9).refreshBody();
        //var bad3 = this.physics.add.staticImage(601, 100, 'bad').setScale(7).refreshBody();
        //var bad4 = this.physics.add.staticImage(601, 600, 'bad').setScale(7).refreshBody();
        //var bad5 = this.physics.add.staticImage(601, 400, 'bad').setScale(7).refreshBody();



        


        this.player = this.physics.add.sprite(100, 140, 'player').setScale(.1)
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.addKeys('w,s,a,d,q,e,space');

        this.physics.add.collider(this.player, this.platform1);
        this.physics.add.collider(this.player, this.platform2);
        this.physics.add.collider(this.player, this.platform3);
        this.physics.add.collider(this.player, this.platform4);
        this.physics.add.collider(this.player, this.platform5);
        this.physics.add.collider(this.player, this.platform6);
        this.physics.add.collider(this.player, this.platform7);




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

        this.physics.add.overlap(red, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(red2, this.player, function(){
            inZone = true;
        });
        // this.physics.add.overlap(bad1, this.player, function(){
        //     inZone = true;
        //     resets++;
        // });
        // this.physics.add.overlap(bad2, this.player, function(){
        //     inZone = true;
        //     resets++;
        // });
        // this.physics.add.overlap(bad3, this.player, function(){
        //     inZone = true;
        //     resets++;
        // });
        // this.physics.add.overlap(bad4, this.player, function(){
        //     inZone = true;
        //     resets++;
        // });
        // this.physics.add.overlap(bad5, this.player, function(){
        //     inZone = true;
        //     resets++;
        // });
        this.physics.add.overlap(floor, this.player, function(){
            inZone = true;
        });
        this.physics.add.overlap(flag, this.player, function(){
            finish = true;
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

        time = result;
        console.log(result);
        this.timeLabel.setText(result);
    }
    update(){
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
            this.player.setVelocityY(0);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }
        if (e.isDown){//right dash
            this.player.setVelocityX(speed * 3);
            this.player.setVelocityY(0);
            if(game.time - timeCheck > 700) {
                this.player.setVelocityX(0);
            }
        }
        if(inZone){
            this.player.setPosition(100, 140);
            inZone = false;
            resets++;
        }
        if(finish){
            this.scene.start('summary2');
            finish = false;
            this.gameTimer.paused = true;
        }
    }
}


class summaryThree extends Phaser.Scene {
    constructor(){
        super('summary3')
    }
    create(){
        fasttime = '00:04';
        mediumtime = '00:06';
        slowtime = '00:10';
            //could not for the life of me get the inputs to count at all correctly it was always a few hundred over
            let timerValue = this.add.text(100, 150, 'time: ' + time, { font: '32px Arial', fill: '#ffffff' });
            let resetsvalue = this.add.text(100, 200, 'resets: ' + resets, { font: '32px Arial', fill: '#ffffff' });
            if(time <= fasttime){
                score += 10;
            }else if(time <= mediumtime){
                score += 5;
            }else if(time <= slowtime){
                score += 1;
            }
            score -= resets;
            let scorevalue = this.add.text(100, 250, 'score: ' + score, { font: '32px Arial', fill: '#ffffff' });
            time = 0;
            resets = 0;
            score = 0;
            this.add.text(100, 300, 'Good luck on the next level.' ,{ font: '50px Arial', fill: '#ffffff' });
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.time.delayedCall(1000, () => this.scene.start('level3'));
            });
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
    scene: [Intro, levelOne, summaryOne, levelTwo, summaryTwo, levelThree, summaryThree, Outro],
    title: "Adventure Game",
});
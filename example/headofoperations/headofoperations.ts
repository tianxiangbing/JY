/// <reference path="../../src/index.ts" />
(function () {
    class G extends JY {
        interval: 20;
        role:Sprite;
        roleSize:10;
        newGame() {
            this.createRole();
            super.newGame();
        }
        createRole(){
            this.role = new Sprite(this.context, 'head.png');
            this.role.shape = SHAPE.circle;
            this.role.setSize(this.roleSize,this.roleSize);
            this.role.x = this.stage.width /2;
            this.role.y = this.stage.height/2;
        }
        running() {
            console.log(this.controlStage.getAngle())
            super.running();
            this.role.draw();
        }
        gameOver() {
            super.gameOver();
            this.gameOverStage.setText('得分：');
        }
        loading() {
            console.log('loading...')
            super.loading();
        }
    }
    let view = document.getElementById('view');
    let w = view.offsetWidth;
    let h = view.offsetHeight;
    let stage = new Stage(w, h);
    let descript = new Discript('start');
    descript.text = '<p class="title">头头大作战</p>'
    let gameOver = new GameOver('restart');
    let title = new Title('头头大作战');
    let control = new Control();
    control.rect = [100, 100]
    let game = new G(view, stage, title, descript, gameOver,control);
    game.files = { image: ['head.png'] };
    game.setup();
})();
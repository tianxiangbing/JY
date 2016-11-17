/// <reference path="index.ts" />
class G extends JY {
    count = 1;
    role:Sprite;
    newGame() {
        this.count = 1;
        super.newGame();
        this.createRole();
    }
    running() {
        this.count++;
        if (this.count > 10000) {
            this.over();
            return;
        }
        // console.log(this.count)
        this.context.clearRect(0,0,this.stage.width,this.stage.height);
        this.role.draw();
        super.running();
    }
    gameOver() {
        super.gameOver();
    }
    loading() {
        console.log('loading...')
        super.loading();
    }
    //创建英雄
    createRole(){
        this.role = new Sprite(this.context,'ball.png');
        this.role.setSize(this.stage.width/3,this.stage.width/3);
        this.role.setPosition(this.stage.width/3,this.stage.height - this.role.h);
    }
}
let view = document.getElementById('view');
let w = view.offsetWidth;
let h = view.offsetHeight;
let stage = new Stage(w, h);
let descript = new Discript('start');
descript.text= '<p class="title">DodgeBall</p>'
let gameOver = new GameOver('restart');
let title = new Title('DodgeBall');
let control = new Control();
control.rect = [100, 100]
let game = new G(view, stage, title, descript, gameOver);
game.files = {image: ['ball.png','boll.jpg']};
game.setup();

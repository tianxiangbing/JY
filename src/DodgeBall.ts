/// <reference path="index.ts" />
class G extends  Game{
    count = 1;
    newGame(){
        this.count= 1;
        super.newGame();
    }
    running(){
        this.count++;
        if(this.count>10000){
            this.over();
            return;
        }
        // console.log(this.count)
        super.running();
    }
    gameOver(){
        super.gameOver();
    }
    loading(){
        console.log('loading...')
        super.loading();
    }
}
 let stage = new Stage(1000,1000);
 let descript = new Discript('start');
 let gameOver = new GameOver('restart');
 let title = new Title('躲避球');
 let control = new Control();
 control.rect = [100,100]
 let game = new G(document.getElementById('view'),stage,title,descript,gameOver,control);

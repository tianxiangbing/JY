/// <reference path="index.ts" />
class G extends  Game{
    count = 1;
    newGame(){
        this.count= 1;
        super.newGame();
    }
    running(){
        this.count++;
        if(this.count>10){
            this.over();
            return;
        }
        console.log(this.count)
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
 let game = new G(document.getElementById('view'),stage,descript,gameOver);
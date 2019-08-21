var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])};return function(e,i){function s(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(s.prototype=i.prototype,new s)}}();!function(){var t=function(t){function e(e,i,s,o,h,r){void 0===h&&(h="head-a.png"),void 0===r&&(r=10);var n=t.call(this,e,h)||this;return n.name="游客"+(new Date).getTime().toString().substr(-5),n.score=0,n.score=r,n.setSize(),n.url=h,n.shape=SHAPE.circle,n.name=o||n.name,n}return __extends(e,t),e.prototype.draw=function(e){this.setSize(),t.prototype.draw.call(this,e),new WriteText(this.context).write(this.name,this.x,this.y+this.r,null,"#cccccc")},e.prototype.drop=function(t){this.setPosition(this.x,this.y+t)},e.prototype.eat=function(t){var e=this;void 0===t&&(t="eat-a.png"),this.setImg(t),setTimeout(function(){return e.setImg(e.url)},300)},e.prototype.setSize=function(){var e=5*Math.sqrt(this.score);t.prototype.setSize.call(this,2*e,2*e)},e}(Sprite),e=function(t){function e(e){var i=t.call(this,e,10,10,void 0,"head.png")||this;i.context=e,i.score=0,i.angle=0,i.v=1,i.vx=i.v,i.vy=i.v;var s=10+Math.floor(10*Math.random());i.score=s;var o=Math.floor(Math.random()*names.length-1);return i.name=names[o],names.splice(o,1),i.trans(),i.setSize(),i}return __extends(e,t),e.prototype.trans=function(){return this.angle=Math.atan2(2*Math.random()-1,2*Math.random()-1),this.angle},e.prototype.move=function(t){var e=0;1e3*Math.random()<3&&this.trans(),e=-this.angle,0!=e&&(this.vx=Math.cos(e)*this.v,this.vy=Math.sin(e)*this.v),this.x=this.vx+this.x,this.y=this.y-this.vy,this.x=Math.max(0,this.x),this.x=Math.min(this.x,t.width-this.w),this.y=Math.max(0,this.y),this.y=Math.min(this.y,t.height-this.h),0!=this.x&&0!=this.y&&this.x!=t.width-this.w&&this.y!=t.height-this.h||this.trans()},e.prototype.draw=function(){t.prototype.draw.call(this,this.angle)},e.prototype.eat=function(){t.prototype.eat.call(this,"eat.png")},e}(t),i=function(i){function o(){var t=null!==i&&i.apply(this,arguments)||this;return t.roleSize=10,t.v=1,t.av=0,t.vx=t.v,t.vy=t.v,t.ballList=[],t.score=10,t.zdList=[],t.robotList=[],t.decompose=!1,t.decomposeV=0,t}return __extends(o,i),o.prototype.newGame=function(){this.init(),this.createRole(),this.createZd(),this.createRobot(),i.prototype.newGame.call(this),this.createAccelerate()},o.prototype.createAccelerate=function(){var t=this;this.accelerate=new s,this.view.appendChild(this.accelerate.create(function(e){t.v=5,t.decompose=!0},function(e){t.v=1,t.decompose=!1}))},o.prototype.init=function(){this.score=10,this.ballList=[],this.zdList=[],this.robotList=[]},o.prototype.createRobot=function(){for(var t=this.robotList.length;t<15;t++){var i=new e(this.context);i.x=Math.random()*this.stage.width,i.y=Math.random()*this.stage.height,i.r=i.h/2,this.robotList.push(i)}this.decomposeV<=0&&(this.decomposeV=20),this.decompose&&this.decomposeV>=20&&this.role.score>0&&(this.decompose=!1,this.createCopy(),this.role.setSize())},o.prototype.createCopy=function(){if(this.decomposeV>=20){var t=new e(this.context);t.name="分身",t.score=Math.ceil(this.role.score/2),t.setSize(),t.x=this.vx>0?this.role.x+this.role.r-1*(this.vx+this.role.w):this.role.x+this.role.w-this.vx,t.y=this.vy<0?this.role.y+this.role.r-1*(this.vy+this.role.h):this.role.y+this.role.h+this.vy,t.shape=SHAPE.circle,t.setPosition(t.x,t.y),this.role.score=Math.floor(this.role.score/2),this.robotList.push(t)}},o.prototype.createRole=function(){this.role=new t(this.context,this.roleSize,this.roleSize),this.role.x=this.stage.width/2,this.role.y=this.stage.height/2,this.role.r=this.role.h/2},o.prototype.running=function(){i.prototype.running.call(this),this.move(),this.role.draw(this.angle),this.createBallList(),this.drawBallList(),this.checkHits(),this.drawZdList(),this.drawRobot(),this.createRobot(),this.moveScreen(),this.scoreScreen.change("得分："+this.role.score.toString()),this.decomposeV>0&&this.decomposeV--},o.prototype.moveScreen=function(){var t=this.view.clientHeight,e=this.view.clientWidth,i=Math.floor(this.role.x+this.role.r-e/2),s=Math.floor(this.role.y+this.role.r-t/2),o=this.stage.width-e,h=this.stage.height-t;this.stage.elem.style.left=-Math.min(o,Math.max(0,i))+"px",this.stage.elem.style.top=-Math.min(h,Math.max(0,s))+"px"},o.prototype.drawZdList=function(){this.zdList.forEach(function(t){t.draw()})},o.prototype.drawRobot=function(){var t=this;this.robotList.forEach(function(e){e.move(t.stage),e.draw()})},o.prototype.createZd=function(){for(var t=0;t<4;t++){var e=new Sprite(this.context,"zd.png");this.zdList.push(e),e.setSize(10,10);var i=this.stage.width/4,s=this.stage.height/4;0==t&&e.setPosition(i,s),1==t&&e.setPosition(this.stage.width-i,s),2==t&&e.setPosition(i,this.stage.height-s),3==t&&e.setPosition(this.stage.width-i,this.stage.height-s),e.shape=SHAPE.circle}},o.prototype.checkHits=function(){var t=this;this.ballList.forEach(function(e,i){t.hits(t.role,e)&&(t.role.score++,t.role.setSize(),t.ballList.splice(i,1),t.role.eat()),t.robotList.forEach(function(s,o){t.hits(s,e)&&(s.score++,s.setSize(),t.ballList.splice(i,1),s.eat()),t.hits(s,t.role)&&(s.score>t.role.score?t.over():s.score<t.role.score&&(t.role.score+=s.score,t.robotList.splice(o,1)))})}),this.robotList.forEach(function(e,i){t.robotList.forEach(function(s,o){i!=o&&t.hits(e,s)&&e.score!=s.score&&(e.score>s.score?(e.score+=s.score,t.robotList.splice(o,1)):(s.score+=e.score,t.robotList.splice(i,1)))})}),this.zdList.forEach(function(e){t.hits(t.role,e)&&(t.decomposeV<=0&&(t.decomposeV=20),t.createCopy()),t.robotList.forEach(function(i,s){t.hits(i,e)&&t.robotList.splice(s,1)})})},o.prototype.drawBallList=function(){this.ballList.forEach(function(t){t.draw()})},o.prototype.createBallList=function(){for(var t=300-this.ballList.length,e=0;e<t;e++){var i=new Sprite(this.context,"head.png");this.ballList.push(i),i.setSize(5,5),i.x=Math.random()*this.stage.width,i.y=Math.random()*this.stage.height,i.shape=SHAPE.circle}},o.prototype.move=function(){var t=this.controlStage.getAngle();this.angle=-t,0!=t&&(this.vx=Math.cos(t)*this.v,this.vy=Math.sin(t)*this.v),this.role.x=this.vx+this.role.x,this.role.y=this.role.y-this.vy,this.role.x=Math.max(0,this.role.x),this.role.x=Math.min(this.role.x,this.stage.width-this.role.w),this.role.y=Math.max(0,this.role.y),this.role.y=Math.min(this.role.y,this.stage.height-this.role.h)},o.prototype.gameOver=function(){i.prototype.gameOver.call(this),this.gameOverStage.setText("得分："+this.role.score),this.accelerate.remove()},o.prototype.loading=function(){console.log("loading..."),i.prototype.loading.call(this)},o}(JY),s=function(){function t(){}return t.prototype.create=function(t,e){return this.elem=document.createElement("div"),this.elem.className="accelerate",this.elem.style.position="absolute",this.elem.style.right="10%",this.elem.style.bottom="10%",this.elem.addEventListener("touchstart",function(e){t(e)},!1),this.elem.addEventListener("touchend",function(t){e(t)},!1),this.elem},t.prototype.remove=function(){this.elem&&this.elem.parentNode.removeChild(this.elem)},t}();setTimeout(function(){var t=document.getElementById("view"),e=t.offsetWidth,s=t.offsetHeight,o=new Stage(3*e,3*s),h=new Discript("start");h.text='<p class="title">大头吃小头</p>';var r=new GameOver("restart"),n=new Title("大头吃小头"),a=new Control;a.rect=[100,100];var c=new i(t,o,n,h,r,a);c.files={image:["act.png","head.png","head-a.png","eat-a.png","eat.png","zd.png"]},c.setup()},1e3)}();
//# sourceMappingURL=headofoperations.js.map

/*createMap*/
JY.ready(function(){
	var DrawType = JY.query("[name='rtype']:checked").value;
	JY.query("[name='rtype']").bind("click",function(){
		DrawType = this.value;
		return true;
	});

	var start = null;
	var pathArr = [];
	var positionArr = [];
	var result = {path:{},position:{}};
	var cxt = JY.byId("path").getContext("2d");	
	cxt.fillStyle="gray";
	JY.bind("gameboard", "mousedown",function(event){
		if (DrawType == "path"){
			if (start){
				pathArr [pathArr.length-1].push ({start:start,end:{x: event. offsetX , y:event.offsetY } });			
				//console.log(pathArr)
				start = {x: event. offsetX , y:event.offsetY } ;				
				if ( event.button==2){
					start = null;
					result . path = pathArr ;
					JY.byId("result").innerHTML = JSON.stringify(result);
					return;
				}
			}else{		
				pathArr.push([]);
				start ={x: event. offsetX , y:event.offsetY };
			}
		}else if (DrawType =="location"){
			start ={x: event. offsetX , y:event.offsetY };
			drawRect(true);
		}
	});
	var drawPath = function (){
		for (var i =0 , len = pathArr.length ; i <len ; i++ ){
			var path = pathArr[i];
			for ( var l= path.length; l-- ; ){
				var item = path [l];
				cxt.beginPath();
				cxt.moveTo(item.start.x , item.start.y);
				cxt.lineTo(item.end.x,item.end.y);
				cxt.stroke();
			}
		}
	};
	JY.bind(document,"mousemove",function(event){
		if (DrawType == "path" && start){	
			//cxt.beginPath();	
			cxt.save();
			cxt.clearRect(0,0,640,640);
			cxt.restore();
			drawPath();
			cxt.beginPath();
			cxt.moveTo(start.x , start.y);
			cxt.lineTo(event. offsetX,event.offsetY);
			//cxt.closePath();
			cxt.stroke();
		}
	});
	JY.bind("gameboard","mouseup",function(event){
		 if (DrawType ==  "location"){
			 end =  {x: event. offsetX + JY.byId("txt_width").value , y : event.offsetY + JY.byId("txt_height").value };
			 drawRect(false);
			 start = null;
		 }
	});
	var drawRect  = function (bool){
		if (bool){
			var w = JY.byId("txt_width").value;
			var h = JY.byId("txt_height").value;
			var rect = new Sprite(w ,h ,{background:"white"});
			rect.setPosition(start.x,start.y);
			JY.append(JY.byId("gameboard"), rect.DOM);
			positionArr .push({ x:start.x,y :start.y,w:w ,h:h });
			result . position = positionArr ;
			JY.byId("result").innerHTML = JSON.stringify(result);
		}
	}
});
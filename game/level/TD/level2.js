window.levelObject["level2"] ={
	config:{
		title:"第2关",
		money :100,
		monster:[{type:"monster1",life:100,speed:3,Def:10,MDef:10,num:10,money:100,index:0},{type:"monster2",life:100,speed:3,Def:20,MDef:10,num:10,money:200,index:0},{type:"monster2",life:100,speed:3,Def:10,MDef:10,num:10,money:30,index:0},{type:"monster2",life:200,speed:3,Def:30,MDef:10,num:10,money:50,index:0},{type:"monster2",life:200,speed:3,Def:30,MDef:10,num:10,money:50,index:0}],
		user:[{type:"archerTower",attack:30,Mattack:30,attSpeed:5,decelerate:0,decelerateTime:0,money:100,range:100},{type:"MTower",attack:20,Mattack:50,attSpeed:5,decelerate:0,decelerateTime:0,money:150,range:120}]//decelerate减速deceleratetime:减速时间
	},
	map:{
		"path":[[{"start":{"x":2,"y":26},"end":{"x":159,"y":178}},{"start":{"x":159,"y":178},"end":{"x":160,"y":282}},{"start":{"x":160,"y":282},"end":{"x":367,"y":365}},{"start":{"x":367,"y":365},"end":{"x":625,"y":630}}]],"position":[{"x":50,"y":160,"w":"30","h":"30"},{"x":206,"y":139,"w":"30","h":"30"},{"x":264,"y":211,"w":"30","h":"30"},{"x":314,"y":281,"w":"30","h":"30"},{"x":197,"y":340,"w":"30","h":"30"},{"x":356,"y":491,"w":"30","h":"30"},{"x":572,"y":453,"w":"30","h":"30"},{"x":504,"y":389,"w":"30","h":"30"}]
		}
};
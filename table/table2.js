/*
*2014/1/1
*表格格式化插件
*by 田想兵  55342775@qq.com
*注：我的代码你不懂，请勿随意修改
*/
$(function(){
	var tableList = []; //按级别序列化列表
		var cache ={};//
	//计算边框
	function computeBorder(){
		$(".table").each(function(){
			var row = $(this).children();
			row.children().css("borderBottomWidth",1);	
			row.last().children().css("borderBottomWidth",0);		
			row.each(function(i,d){
				var rowW = $(this).width();
				var td = $(this).children();
				var sumW = 0 ;
				for(var i =0,l =td.length-1;i<l;i++){
					sumW += $(td[i]).outerWidth();
				}
				var last = td.last();
				last.css("borderRightWidth",0);
				//console.log(sumW)
				var tmpW = last.outerWidth ()-last.width();
				last.width(rowW - sumW-tmpW);
				//computeHeight($(this));
			});
		});
	}
	computeBorder();
	resetHeight($("body"));
	//重置高度
	function resetHeight(rage){
		$(".cell",rage).height("auto");
		var tmp = [];
		$("[leaf]",rage).each(function(){
			 tableList[$(this).attr("leaf")] = tableList[$(this).attr("leaf")]||[];
			 tableList[$(this).attr("leaf")].push( $(this) );
			 tmp[$(this).attr("leaf")] = tmp[$(this).attr("leaf")]||[];
			 tmp[$(this).attr("leaf")].push( $(this) );
		});
		//console.log(rage.children(".table").children())
		for( var i in tmp){
			$.each(tmp[i],function(){
				var arr = $(this).children();
				JY.resolve(function(v,i){
				//$(this).children().each(function(){
					computeHeight($(this));
				//});
				},0,arr.length,arr,function(){
					var c = null;
					if (rage.hasClass("row")){
						c = rage;
					}else{
						c = rage.children(".table").children();
					};
					c.each(function(){
						computeHeight($(this));
					});	
				});
			});
		};	
	}
	function computeHeight(row){
		var max = 0;
		var child = $(row).children();
		child.height("auto");
		child.each(function(){
			if ($(this).outerHeight()>max) {
				max = $(this).height();
			}
		});
		//console.log(max);
		child.each(function(d){
			$(this).height(max);
			JY.resolve(function(v,i){
				//$(this).children().each(function(){
					$(v).css("marginTop",(max-$(v).height()) /2)
				//});
			},0,$(this).children().length,$(this).children());
		});
	};
	//
	function setCache(){
		var key =0 ;
		/*
		$(".table").each(function(){
			$(this).attr("cache",key);
			cache[key]=$(this).children(":not(.title)").last().clone();
			key++;
		});
		console.log(tableList)
		*/
		for (var i = tableList.length-1 ; i>=0 ;i-- ){
			var arr = tableList[i];
			$.each(arr,function(){
				$(this).attr("cache",key);
				cache[key]=$(this).children(":not(.title)").last().clone();
				key++;
			});
		}
	};
	setCache();
	$(".add").live('click',function(){
		var row = $(this).closest(".row");
		var table = row.closest(".table");
		var key = table.attr("cache");
		var tmp = cache[key].clone();	
		row.after(tmp);	
		computeBorder();
		//console.log($(this).parents(".row").last())
		resetHeight($(this).parents(".row").last());
		computeNum(table);
	});
	$(".del").live('click',function(){
		var row = $(this).closest(".row");
		var table = row.closest(".table");
		var last = $(this).parents(".row").last();
		if (table .children() .size() >1){
			row.remove();
			computeBorder();
			resetHeight(last);
			computeNum(table);
		}
	});
	function computeNum(table){
		var leafIndex = $(table).attr("leaf")||0;
		var numList = $(table).find("[leafIndex='"+leafIndex+"']");
		numList.each(function(i){
			$(this).html(i+1);
		});
	}
});
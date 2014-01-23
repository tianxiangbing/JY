
$(function(){
	//$(".tree").each(function(){
	//	var tree = $(this);
	//	tree.find("[leaf]").each(function(){
		$(".tree").delegate(".ext",'click',function(){
				var tree = $(this).closest('.tree');
				var row = $(this).closest('[leaf]');
				var leaf = row.attr('leaf');
				var nodeid= $(row).attr('nodeid');
				var pid=  row.attr('parentid');
				$(this).toggleClass("iExted");
				var exted = $(this).hasClass ('iExted');
				$('[parentid="'+nodeid+'"]',tree).toggle();
				return;
				//	console.log(leaf)
				//$(row).nextUntil('[leaf="'+leaf+'"]').toggle();
				$(row).nextAll().each(function(){
					var cleaf = $(this).attr('leaf');
					//console.log(cleaf)
						//$(this).toggle();
						if ( exted ){
							if (cleaf -1==leaf){
								$(this).show();
							}
						}else{
							if (cleaf >leaf){
								$(this).hide();
								$(this).find('.ext').removeClass('iExted');
							}
						}
				});
			});
	//	});
	//});
	//添加
	$(".tree").delegate(".plus",'click',function(){
		var key = +new Date();
		var tmp = $("#tempRow").children().clone();
		var row = $(this).closest(".row");
		var nodeid= $(row).attr('nodeid');
		var lastChild= $('[parentid="'+nodeid+'"]').last() ;
		if (lastChild.size() == 0){
			lastChild = row;
		}
		var level = parseInt(row .attr('leaf'));
		var grade = $.trim(row.find('.gradeName').html());
		tmp.find('.gradeName select').val(grade);
		tmp.find('.edit').hide();
		tmp.addClass(returnLevelColor(level)).attr('leaf',level).attr('nodeid',key)//.attr('parentid',nodeid);
		lastChild.after(tmp);
		computeNO($(this).closest('.tree'));
	});
	var gradeArr = ['里程碑','一级','二级','三级','四级','五级','六级','七级'];
	//添加子级
	$(".tree").delegate(".pluschild",'click',function(){
		var tmp = $("#tempRow").children().clone();
		var row = $(this).closest(".row");
		row.find('.ext').removeClass('hide');
		var nodeid= $(row).attr('nodeid');
		var lastChild= $('[parentid="'+nodeid+'"]').last() ;
		if (lastChild.size() == 0){
			lastChild = $('<div class="con" parentid="'+nodeid+'"/>');
			row.after(lastChild)
		};
		var level = parseInt(row .attr('leaf'))+1;
		var grade = $.trim(row.find('.gradeName').html());
		for (var i = 0,l =gradeArr.length ;i<l ;i++ ){
			if (grade == gradeArr[i]){
				grade = gradeArr[i+1];
				break;
			}
		}
		var key = +new Date();
		tmp.find('.gradeName select').val(grade);
		tmp.addClass(returnLevelColor(level)).attr('leaf',level).attr('nodeid',key)//.attr('parentid',nodeid);
		lastChild.prepend(tmp);
		tmp.find('.edit').hide();
		computeNO($(this).closest('.tree'));
	});
	//编辑
	$(".tree").delegate(".edit",'click',function(){
		var row = $(this).closest(".row");
		var tmp = $("#tempRow").children().clone();
		var childs= row.children();
		var tmpChilds= tmp.children();
		row.hide();
		if (childs.eq(0).find("ext").hasClass('hide')){
			tmpChilds.eq(0).find(".ext").hide();
		}else{
			tmpChilds.eq(0).find(".ext").removeClass('hide');
		}
		//tmpChilds.eq(1).html(childs.eq(1).html());
		tmp.attr({'nodeid':row.attr('nodeid'),"leaf":row.attr('leaf')})
		tmpChilds.eq(1).find('select').val($.trim(childs.eq(1).html()));
		tmpChilds.eq(2).find('select').val($.trim(childs.eq(2).html()));
		tmpChilds.eq(3).find('select').val($.trim(childs.eq(3).html()));
		tmpChilds.eq(4).html($.trim(childs.eq(4).html()));
		tmpChilds.eq(5).find('input').val($.trim(childs.eq(5).html()));
		tmpChilds.eq(6).find('input').val($.trim(childs.eq(6).html()));
		tmpChilds.eq(7).find('input').val($.trim(childs.eq(7).html()));
		tmpChilds.eq(8).find('input').val($.trim(childs.eq(8).html()));
		tmpChilds.eq(9).find('input').val($.trim(childs.eq(9).html()));
		tmpChilds.eq(10).html('<span class="colorff5a">编辑中</span>');
		tmpChilds.eq(11).find('.edit').removeClass('edit').addClass('undo').removeClass('iEdit').addClass('iUndo');
		row.after(tmp);

	});
	//撤消
	$(".tree").delegate(".undo",'click',function(){
		var row = $(this).closest(".row");
		row.prev().show();
		row.remove();
	});
	//删除
	$(".tree").delegate(".minus","click",function(){
		var row = $(this).closest(".row");
		var nodeid= $(row).attr('nodeid');
		var lastChild= $('[parentid="'+nodeid+'"]');
		var parent = $('[nodeid="'+ parseInt($(this).closest('.con').attr('parentid')) +'"]');
		if (lastChild.size() ===0){
			var tree = $(this).closest('.tree');
			if(row.siblings().size()==0){
				parent.find('.ext').addClass('hide');
			}
			row.remove();
			computeNO(tree);
			
		}else{
			alert('请先清空子级!');
		}
	});
	//返回级别颜色 
	function returnLevelColor(level){
		switch(parseInt(level)){
			case 0:{
				return 'bgef9'
				}break;
			case 1:{				
				return 'bgf8'
			}break;
			default:{
				return "";
			}
		}
	}
	function computeNO(tree){
		tree.find('.row[leaf="0"]:visible').each(function(i){
			$(this).find('em').html(i+1);
			setIndex($(this),i+1);
		});
	};
	function setIndex (row,i){
		var nodeid = row.attr('nodeid');
		//console.log(nodeid)
		if (!nodeid){
			return;
		}
		$('[parentid="'+nodeid+'"]').children(':not(".con"):visible').each(function(d){
			var level = $(this).attr('leaf');
			var k = d+1;
			var str = i+'.'+k;
			if (level >=2){
				str= ''+str;
			}
			$(this).find('em').html(str);			
			setIndex($(this),str)
		});
	}
});
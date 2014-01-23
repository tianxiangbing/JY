/*通用流程  by 田想兵*/
$(function(){	
	var user_arr = [];// 用于保存抄送人员
	$("body").delegate(".delhq",'click',function(){
		var table = $(this).closest(".table");
		var row = $(this).closest('.row');
		var size = table.find(".row").size();
		if (size >1){
			row.remove();
			computeNum(table);
		}
	});
	$('body').delegate('.addRen','click',function(){
		$('.addStaffBox').dialog({
			modal:true,
			width:680,
			height:580
		});
		
		common.f.initStaff('many', 'send_users', function(ret) {
			user_arr = ret;
		},user_arr);
	});
	$(".addNode").click(function(){
		var addNodeBox = $(this).closest(".addNodeBox").children().clone();
		addNodeBox.find(".addnode").removeClass("addnode").addClass("addNode");
		$(".addbox").children().height("auto");
		$(".addbox").children().html (addNodeBox);
		$(".addbox").find(".aplus").remove();
		$(".addbox").find('textarea').val($(this).closest(".addNodeBox").find('textarea').val());
		$('.addbox').dialog({
			autoOpen: true,
			modal:false,
			width:655,
			resizable:false
		});
		$(".addbox").find(".addNode").click(function(){
			addNode(this);
		});
	});
	
	$("body").delegate(".addnode",'click',function(){
		var table = $(this).closest(".table");
		var size = table.find(".row").size();
		if (size >1 ){
			$(".addNode").click();
		}else{
			addNode(this);
		}
	});
	function addNode(_this){
		var table = $(_this).closest(".table");
		var last = $(table).find('.row').last();
		var tmpRow = last.clone();
		last.after(tmpRow);
		computeNum(table);
	};
	function computeNum(table){
		$(table).find("em").each(function(i){
			$(this).html(i+1);
		});
	};
	$(".aliSearch li").click(function(){
		$(this).siblings().removeClass('current').end().addClass('current');
		$('.searType').val($(this).attr('ref'));
	});
	$('.searIcon').click(function(){
		var form = $(this).closest('form');
		form.submit();
	});
});
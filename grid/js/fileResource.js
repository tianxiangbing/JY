$(function() { 
	
var $btn = $('#btn');

$btn.bind('click', function(){
	var target = this;
	var url =  'json.txt?_='+new Date().getTime();
    CLOUDISK_CF_APPURL = 'https://yunpan.taobao.com';
    CLOUDISK_CF_CODE = '';
    CLOUDISK_CF_CHOICE = false; //设置为单选
    CLOUDISK_CF_APPKEY = 'rocky';
    CLOUDISK_CF_PREVIEW = true; //打开预览
    CLOUDISK_CF_UPLOAD=true;
	
	if(this.__getFileXHR){
		this.__getFileXHR.abort();
	}
	
    this.__getFileXHR = $.ajax({
      type:"get",
      url:url,
      dataType:"json",
      async:true,
      success:function() {
          var res = arguments[0].content;
          if (res && res.isSuccess) {
              // 云盘认证通过
              var token = res.returnValue.accessToken;
              CLOUDISK_CF_CODE = token;
              if (target) {
            	JCloudisk.init();
				JCloudisk.choose(target);
				JCloudisk.chooseSuccess(target, function (data) {
					console.log(data)
					var files = document.getElementById("downUrl").innerHTML;
					if($.trim(files)!="") {
						files+="&nbsp;";
					}
					var fileIds = jQuery("#fileUploadIds").val();
					var fileIdsArr=[];
					if(fileIds == undefined || fileIds == null || $.trim(fileIds)=="") {
						fileIds = "#";
					} else {
						var temp = fileIds.split("#");
						fileIds = "#";
						for (var i in temp) {
							if($.trim(temp[i])!=''){
								fileIdsArr.push($.trim(temp[i]));
							}
						}
					}
					jQuery.each(data.files, function (index, file) {
					 //console.log(file);
						var params = {
								fileId : file.id,
								downloadUrl : file.downloadUrl,
								fileName : file.name,
								accessUrl: file.previewUrl ? file.previewUrl : ''
							}		
						if(file.previewUrl){
							files+="<b><a name="+file.id+ " href=javascript:; onclick=openImg('"+file.previewUrl+"')>"+file.name+"</a><span>x</span></b>";
						} else {
							files += "<b><a href=" +  file.downloadUrl +" name="+file.id+ ">" + file.name + "</a><span>x</span></b>" ;
						}
						fileIdsArr.push(file.id);
						if((index+1)!= data.files.length){
							files+="&nbsp;";
						}
						fileResourcesPost(params);
					});
					
					for(var j=0; j<fileIdsArr.length;j++){
						fileIds+=fileIdsArr[j]+"#";
					}
					jQuery("#fileUploadIds").val(fileIds);
					document.getElementById("downUrl").innerHTML = files;
				});
              }
          }
          
      }
    });
	
	return false;
});

function fileResourcesPost(params) {
	$.ajax({
		type : "POST",
		url : "/rocky/commonservice/fileResourceRpc/insertResrouce.json",
		dataType : "json",
		data : $.param(params)+'&_='+ new Date().getTime(),
		success : function() {
			
		},
		error:function(){
			$.jBox.info("云盘文件上传错误 请联系管理人员!","提示",{closed: function () {  }, timeout: 2000, height:120});
		}
	});
}

function openImg(url){
	window.open(url);
}


				
jQuery("#downUrl span").live("click",function(){
	jQuery(this).parent().remove();
	fId = jQuery(this).prev().attr("name");
	
	var fileIds = jQuery("#fileUploadIds").val();
	var fileIdsArr = [];
	if(fileIds == undefined || fileIds == null || $.trim(fileIds)=="") {
		fileIds = "#";
	} else {
		var temp = fileIds.split("#");
		fileIds = "#";
		for (var i in temp) {
			if($.trim(temp[i])!=''){
				fileIdsArr.push($.trim(temp[i]));
			}
		}
	}
	for(var i=0; i<fileIdsArr.length;i++){
		if(fileIdsArr[i] == fId){
			fileIdsArr.splice(i,1); 
		}
	}
	for(var j=0; j<fileIdsArr.length;j++){
		fileIds+=fileIdsArr[j]+"#";
	}
	jQuery("#fileUploadIds").val(fileIds);
});
});



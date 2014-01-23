
var common = {};

// 全局变量
common.v = {
	GET: 'GET',
	POST: 'POST',
	ERROR_MSG: '服务器或网络故障，请检查网络！',
	SAVE_OK: '保存成功！',
	ADD_OK: '新增成功！',
	SUBMIT_OK: '提交成功！',
	SUBMIT_TITLE: '提交确认',
	DEL_MSG: '确定删除？',
	SPLIT: ',',
	FORMAT_STR: 'yyyy-MM-dd',
	FLOW_VIEW: 'FLOW_VIEW',
	FLOW_DEAL: 'FLOW_DEAL',
	MSG_DOCUMENT: 'document_change_alarm',
	FLOW_TYPE: {
		DOC: 'DOC',
		PROJECT_EVENT: 'PROJECT_EVENT',
	    DOC_BORROW: 'DOC_BORROW',
	    PLAN_ONE_LEVEL: 'PLAN_ONE_LEVEL',
	    PLAN_TWO_LEVEL_CW: 'PLAN_TWO_LEVEL_CW',
	    PLAN_TWO_LEVEL_PT: 'PLAN_TWO_LEVEL_PT',
	    PLAN_TWO_LEVEL_GC: 'PLAN_TWO_LEVEL_GC',
	    COMMON_WORK_FLOW: 'COMMON_WORK_FLOW'
	},
	FLOW_TYPE_URL: {
		DOC: "/rocky/document/document/docHandleView.htm",
		PROJECT_EVENT: '/rocky/report/event/editEventView.htm',
	    DOC_BORROW: "/rocky/document/docborrow/docBorrowHandleView.htm",
	    PLAN_LEVEL: '/rocky/plan/view/planApproval.htm',
	    PLAN_LEVEL_VIEW: '/rocky/plan/view/planApprovalView.htm',
	    COMMON_WORK_FLOW:'/rocky/index/flow/editCommonFlow.vm'
// PLAN_TWO_LEVEL: '/rocky/plan/view/planApproval.htm',
// PLAN_TWO_LEVEL_VIEW: '/rocky/plan/view/planApprovalView.htm'
	},
	EVENT_STATUS: {
		DRAFT: 'DRAFT',
		AUDITING: 'AUDITING',
		AUDITED_SUCCESS: 'AUDITED_SUCCESS',
		CLOSE: 'CLOSE'
	},
	EVENT_STATUS_NAME: {
		DRAFT: '草稿',
		AUDITING: '处理中',
		AUDITED_SUCCESS: '处理完成',
		CLOSE: '关闭'
	},
	
	// ajax返回数据类型
	DATA_TYPE: {
		JSON: 'json',
		JSONP: 'jsonp',
		TEXT: 'text',
		HTML: 'html',
		XML: 'xml',
		SCRIPT: 'script'
	},
	// 报告类型
	DOC_TYPE: {
		DOC: 'DOC',
		DOC_BORROW: 'DOC_BORROW'
	},
	
	// 报告类型
	REPORT_TYPE: {
		DAY: 'DAY',
		WEEK: 'WEEK',
		MONTH: 'MONTH',
		SPECIAL: 'SPECIAL'
	},
	
	// 报告类型
	REPORT_TYPE_NAME: {
		DAY: '日报',
		WEEK: '周报',
		MONTH: '月报',
		SPECIAL: '专项'
	},
	
	// 报告SCOP
	REPORT_SCOP: {
		PROJECT: 'PROJECT',// 项目
		NOPROJECT: 'NOPROJECT'// 非项目（部门）
	},
	
	// 报告状态
	REPORT_STATUS: {
		DRAFT: 'DRAFT',// 草稿
		FINISH: 'FINISH'// 完成
	},
	
	// 专业类型
	PROFESSIONAL_TYPE: {
		BULID: 'BULID',// 土建
		FIX: 'FIX'// 安装
	},
	
	I_WANT_AT: "ORGANIZATION"
	
}

// 全局方法
common.f = {
	
	/**
	 * 通用post方式ajax请求
	 * 
	 * url: 请求的url param: 请求参数 ok_call_back: 成功后的回调函数
	 */
	ajaxPost: function(url, param, ok_call_back, asyncFlag, errHandel) {
		common.f.ajax(url, param, ok_call_back, asyncFlag,errHandel, common.v.POST);
	},
	
	/**
	 * 通用post方式ajax请求
	 * 
	 * url: 请求的url param: 请求参数 ok_call_back: 成功后的回调函数
	 */
	commonAjaxGet: function(url, param, ok_call_back, asyncFlag, errHandel) {
		common.f.ajax(url, param, ok_call_back, asyncFlag,errHandel, common.v.GET);
	},
	
	/**
	 * 通用ajax请求
	 * 
	 * url: 请求的url param: 请求参数 {}, String都可以 ok_call_back: 成功后的回调函数 type
	 * 请求方式(GET,POST)
	 */
	ajax: function(url, param, ok_call_back, asyncFlag, errHandel, type) {
		if(typeof asyncFlag == "undefined"){
			asyncFlag = true;// 默认走异步
		}
		$.ajax({
			url: url,
	    	type: type,
	    	data: param,
	    	async: asyncFlag,
			dataType: common.v.DATA_TYPE.JSON,
	    	success: function(data) {
    			if(!data.hasError) {
					ok_call_back(data);
				} else {
					if(data.errors[0].code == "rpc_invalid_arg"){
    					$.jBox.error("抱歉，您传入的参数非法","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
					else if(data.errors[0].code == "rpc_state_exception"){
    					$.jBox.error("抱歉，您操作的数据状态异常","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
					else if(data.errors[0].code == "rpc_buc_exception"){
    					$.jBox.error("抱歉，调用BUC接口出错了","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
					else if(data.errors[0].code == "rpc_ntfe_exception"){
    					$.jBox.error("抱歉，调用工作流出错了","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
					else if(data.errors[0].code == "rpc_access_exception"){
    					$.jBox.error("抱歉，您没有权限访问该数据，请联系管理员","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
					else if(data.errors[0].code == "rpc_sys_exception"){
    					$.jBox.error("系统异常，请联系管理员","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
    				else if(data.errors[0].code == "500"){
    					$.jBox.error("系统出错了","提示",{closed: function () {
    					    // 临时添加 没有添加回调
    					    $("#WaitImage") && $("#WaitImage").hide();
    					}, timeout: 200000,top:"36%"});
    				}
    				else if(data.errors[0].code == "404"){
    					$.jBox.error("无法找到您访问的资源","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
    				else if(data.errors[0].code == "rpc_data_exception"){
    					$.jBox.error("数据异常，请联系管理员","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}
    				else if(data.errors[0].code == "rpc_unkown_exception"){
    					$.jBox.error("系统出错了","提示",{closed: function () {  }, timeout: 200000,top:"36%"});
    				}else if(errHandel && typeof errHandel == 'function'){
						errHandel(data.errors[0]);
					}
				}
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				// $.jBox.error(common.v.ERROR_MSG,"提示",{closed: function () {
				// }, timeout: 200000,top:"36%"});
// $.jBox.error(textStatus +"##" + errorThrown,"提示",{closed: function () { },
// timeout: 200000});
			}
	    });
	},
	
	format: function(date, format) {
		var o = {
			'M+': date.getMonth() + 1, // month
			'd+': date.getDate(), // day
			'h+': date.getHours(), // hour
			'm+': date.getMinutes(), // minute
			's+': date.getSeconds(), // second
			'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
			'S': date.getMilliseconds()// millisecond
		};

		if (/(y+)/.test(format)) {
			
			var str =  (date.getFullYear() + '')
				.substr(4 - RegExp.$1.length);
			
			format = format.replace(RegExp.$1, str);
		}

		for (var k in o) {
			
			if (new RegExp('(' + k + ')').test(format))
				format = format.replace(RegExp.$1,
						RegExp.$1.length == 1 ? o[k] : ('00' + o[k])
								.substr(('' + o[k]).length));
		}
		
		return format;
	},
	
	getMonthBefore:function (beforeMonNum, date){ 
		if(!date) date = new Date();
		var retureValue = "";
		date.setMonth(date.getMonth()-beforeMonNum);
		retureValue = this.format(date, 'yyyy-MM-dd');
		return retureValue;
	},

	/***************************************************************************
	 * 将时间戳转化成字符串
	 */
	changeTimeToStr:function(timestamp){
		if(!timestamp) return "";
		var timer = new Date(timestamp);
		var mon = timer.getMonth() +1;
		var dateVal = timer.getDate() < 10? "0"+timer.getDate() : timer.getDate();
		return timer.getFullYear()+"-"+(mon<10?"0"+mon : mon)+"-"+dateVal;
	},
	getUrlParams:function(){
		var url = location.search;
	    var requestParam = {};
	    if (url.indexOf("?") != -1) {
	      var str = url.substr(1);
	      strs = str.split("&"),
			name=null,
			value=null;
	      for(var i = 0; i < strs.length; i ++) {
			name = decodeURIComponent(strs[i].split("=")[0]);
			value = decodeURIComponent(strs[i].split("=")[1]);
	         requestParam[name]=value;
	      }
	    }
	    return requestParam;
	},
	/***************************************************************************
	 * 将对象数组转化为JSON 格式
	 */
	paserSerializeArrayToJson:function(formId) {
		var st = "{";
		$.each($("#" +　formId).serializeArray(), function (i, field) {
			st += '\"' + field.name + '\"' + ":" + '\"' + field.value + '\"' + ",";
		});
		st = st.substring(0, st.length - 1) + "}";
		return  $.parseJSON(st);
	},
	
	/**
	 * 流程历史记录弹出框
	 */
	indexFlow: function(bizId, bizType) {
		$("#workflowShowDiv").load("/rocky/commonservice/showWorkflowLog?_=" 
				+ new Date().getTime()+"&bizId=" +bizId +"&bizType=" + bizType + "");
		$("#workflowShowDiv").show();
		$("#workflowShowDiv").dialog("open");
	},
	
	/**
	 * 编辑器初始化，完成后执行指定方法
	 * 
	 * preFunction: 指定的方法 param: 指定方法的参数
	 */
	richTextInit: function(preFunction, param) {
		
		seajs.config({
			alias: {
				'tinyMCE':'/lib_rocky/RichText/plugins/tinymce4/tinymce.js'
			} ,
			charset: 'UTF-8',
			timeout: 0,
			debug: 0
		});
		
		seajs.use(["tinyMCE"],function(){
			 var plugins = [ "advlist", "autolink", "lists", "hr", "togglemore", "emoticons", "textcolor", "insertdatetime", "link", "table", "paste", "imageuploader", "fullscreen","preview"];
		        var toolbar_1 = [ "preview fullscreen undo redo", "fontselect fontsizeselect", "bold italic underline strikethrough removeformat", "forecolor backcolor", "imageuploader togglemore", "emoticons" ];
		        var toolbar_2 = [ "alignleft aligncenter alignright alignjustify", "bullist numlist outdent indent", "table hr inserttime" ];
		        tinyMCE.DOM.events.domLoaded = true;
		        tinyMCE.init({
		            selector: ".richtextarea",
		            theme: "modern",
		            height: 400,
		            resize: true,
		            //是否可以鼠标拖动编辑器改变大小
		            border_width: 1,
		            //编辑器的边框宽度，alimail有两种情况，编辑写信是1，设置签名是没有边框的编辑器，所以设置了0
		            target_list: false,
		            convert_urls: false,
		            //当你insertContent的时候，取消一些节点src的转换
		            visual: false,
		            //table的虚框是否显示，由于大文本设置虚框很耗性能，所以取消掉
		            keep_values: false,
		            //必须设置false用来提高性能
		            forced_root_block: "div",
		            //当空文本的时候，tinymce会设置一个根节点，默认是P，我们要改成div比较合理
		            show_system_default_font: true,
		            // 是否开启系统字体的探测，alimail这边是开启的，这个是alimail新增的功能。
		            //        content_style : aym.global.HtmlTemplateCache.getTemplate('editorContentCss'),//alimail 这边是直接设置文本进去的，content_css是ajax加载的，效果一样，设置文本节省一个请求
		            content_css: "/lib_rocky/RichText/plugins/tinymce4/styles/editorContentCss.css",
		            //        local_image : true,//alimail 插件使用的
		            //        attach_owner : aym.global.UserData.getEmail(),//alimail 插件使用的
		            plugins: plugins,
		            preformatted: true,
		            body_id: "richbodyid",
		            body_class: " J-copy-image-upload-mark",
		            toolbar_1: toolbar_1.join(" | "),
		            toolbar_2: toolbar_2.join(" | "),
		            i18n_messages: {
		                //国际化
		                //tinymce.js
		                "default.font": "系统默认",
		                "button.ok": "确定",
		                "button.cancel": "取消",
		                "button.bold": "粗体（Ctrl+B）",
		                "button.italic": "斜体（Ctrl+I）",
		                "button.underline": "下划线（Ctrl+U）",
		                "button.strikethrough": "删除线",
		                "button.outdent": "减少缩进",
		                "button.indent": "增加缩进",
		                "button.horizontal.line": "插入横线",
		                "button.remove.format": "清除格式",
		                "button.align.left": "左对齐",
		                "button.align.center": "居中对齐",
		                "button.align.right": "右对齐",
		                "button.align.justify": "两端对齐",
		                "button.undo": "撤销（Ctrl+Z）",
		                "button.redo": "重做（Ctrl+Y）",
		                "font.family.list": "宋体=simsun;黑体=simhei;楷体=kaiti;隶书=隶书;幼圆=幼圆;微软雅黑=microsoft yahei" + ";" + "Arial=arial;Arial Black=arial black;Book Antiqua=book antiqua;Calibri=calibri;Comic Sans MS=comic sans MS;Courier New=courier new;Garamond=garamond;Georgia=georgia;Helvetica=helvetica;Impact=impact;Narrow=narrow;Sans Serif=sans-serif;Serif=serif;Symbol=@symbol;Tahoma=tahoma;Times New Roman=times new roman;Trebuchet MS=trebuchet MS;Verdana=verdana;Webdings=@webdings;Wide=wide;Wingdings=@wingdings",
		                "button.font.family": "字体",
		                "font.size.list": "10px;13px;14px;16px;18px;24px;32px;48px",
		                "button.font.size": "字号",
		                //advlist/plugin.js
		                "button.number.list": "项目编号",
		                "number.default": "默认",
		                "number.lower.alpha": "小写英文字母",
		                "number.lower.greek": "小写希腊字母",
		                "number.lower.roman": "小写罗马字母",
		                "number.upper.alpha": "大写英文字母",
		                "number.upper.roman": "大写罗马字母",
		                "button.bullet.list": "项目符号",
		                "bullet.default": "默认",
		                "bullet.circle": "圆形",
		                "bullet.disc": "碟形",
		                "bullet.square": "方形",
		                //togglemore/plugin.js
		                "button.toggle.more": "切换功能",
		                //fullscreen/plugin.js
		                "button.fullscreen": "全屏（Ctrl+Alt+F）",
		                //insertdatetime/plugin.js
		                "button.date.time": "日期/时间",
		                //textcolor/plugin.js
		                "button.text.color": "选择文字颜色",
		                "button.background.color": "选择背景颜色"
		            },
		            //        default_style_fun : aym.util.getDefaultFontStyle, //alimail 使用的 ，获取默认字体styles的function
		            //        render_empty_fun : aym.util.renderEmptyNodeWithDefaultFontStyle,//alimail 使用的 ，获取默认字体的div文本的function
		            init_instance_callback: function() {
		            	preFunction(param);
		                //初始化成功后的回调，alimail这里做了比较多的事情，参考代码
		                window.editor = this;
		                //console.info(this.get(".mce-i-fullscreen"));
		                var editor = this;
		                //console.log('editor',editor)
		                //editor.setContent("");
		                var oPanelItems = this.theme.panel.items();
		                var oContainerElm = this.getContainer();
		                var nContainerHeight = $(oContainerElm).children().height();
		                var oBottomToolbar = oPanelItems[0].items()[1];
		                oBottomToolbar.hide();
		                var fullscreen = oPanelItems[0].items()[0].items()[0];
		                var style = fullscreen.getEl().style;
		                $(fullscreen.getEl()).css({
		                    "margin-right": "2px",
		                    clear: "both",
		                    "float": "right"
		                });
		                $(fullscreen.getEl()).on("click", function() {
		                    $("#___xiuxiu-temp-container-div").hide();
		                });
		               /* atsel.initData({
		                    renderType: "outline"
		                });*/
		                function subevent() {
		                    var ifr_body = $("#tinymce_container_ifr").contents().find("body");
		                    ifr_body.on("focus", function() {
		                       /* ifr_body.imagePaste(function(data) {
		                            console.info(data.content.downloarUrl);
		                            try {
		                                editor.execCommand("mceInsertContent", false, '<br><img alt="" src="//work.alibaba-inc.com' + data.content.downloarUrl + '" />');
		                            } catch (e) {}
		                        });*/
		                        //For due-date select hide use  Modified by wenwen.caoww
		                        $("#reportForm").trigger("click");
		                    });
		                    /*dragupload.connectTo($(".mce-tinymce"), function(data, url) {
		                        editor.execCommand("mceInsertContent", false, '<br><img alt="" src="//work.alibaba-inc.com' + url + '" />');
		                    });*/
		                }
		                subevent();
		                editor.dom.bind(editor.getBody(), "ObjectResized", function() {
		                    console.info("++++++++++resize++++++++");
		                });

		                //use setTimeout fix the IE8 editor instanc not ready script issue
		                setTimeout(function(){
		                    editor.focus();
		                },400);


		                //PageBus.publish("ais.global.tinymce.inited",{});
		            },
		            menu_class: "aym_scroll mce-y-scroll",
		            //下拉菜单的样式，alimail这边主要是设置滚动条的样式，比如字体下拉菜单
		            iframe_class: "aym_scroll aym_scroll_auto",
		            //iframe的样式，alimail这边主要是设置滚动条的样式
		            full_screen_compute_top_fun: function() {
		                //全屏的时候，alimail这边页面最上面有广告的，所以全屏的时候不能挡住广告，所以搞个计算top的function
		                var top = "0px", oWrapNode = $(".aym_page_wrap");
		                if (oWrapNode.length > 0) {
		                    top = oWrapNode.offset().top + "px";
		                }
		                return top;
		            },
		            cssFiles: [ "styles/skin.css", "styles/skin-ext.css" ]
		        });
		});
/*		seajs.config({
			alias: {
				'tinyMCE':'/lib_rocky/RichText/plugins/tinymce4/tinymce.js'
			} ,
			charset: 'UTF-8',
			timeout: 0,
			debug: 0
		});
		
		seajs.use(['tinyMCE'], function() {
	    	
			var plugins = [
			    'advlist', 'link', 'lists', 'hr', 'textcolor', 'insertdatetime',
			    'table', 'contextmenu', 'paste', 'togglemore',
				 'imageuploader'
			];

			var toolbar_1 = [
			    'undo redo Separate',
				'fontselect fontsizeselect',
				'Separate bold italic underline strikethrough removeformat',
				'forecolor backcolor', 'imageuploader', 'emoticons togglemore'
			];

			var toolbar_2 = [
				'alignleft aligncenter alignright alignjustify Separate',
				'bullist numlist outdent indent Separate', 'link unlink',
				'Separate table  hr insertdatetime'
			];
			
			var cursorindex;
			
			tinyMCE.DOM.events.domLoaded = true;

			tinyMCE.init({
				selector: '.richtextarea',
				theme: 'modern',
				skin: 'bluth',
				target_list: false,
				convert_urls: false,
				local_image: '',
				body_id: 'richbodyid',
				body_class: 'g-has-atfeature J-copy-image-upload-mark bluthSkin',
				plugins: plugins,
				toolbar1: toolbar_1.join(' | '),
				toolbar2: toolbar_2.join(' | '),
				height:300,
				init_instance_callback: function() {
					
					preFunction(param);// 业务方法
					
					var editor = this;
					var oPanelItems = this.theme.panel.items();
					var oContainerElm = this.getContainer();
					var nContainerHeight = jQuery(oContainerElm).children().height();
					var oBottomToolbar = oPanelItems[0].items()[1];
					oBottomToolbar.show();

					var fullscreen = oPanelItems[0].items()[0].items()[0];
					var style = fullscreen.getEl().style;

					jQuery(fullscreen.getEl()).css({
						'margin-right': '2px',
						'clear': 'both',
						'float': 'right'
					});

					jQuery(fullscreen.getEl()).bind('click', function() {
						jQuery('#___xiuxiu-temp-container-div').hide(); // todo
																		// use
																		// message
																		// pub
					});

				}
			});
		});*/
		
		/*seajs.use("plugins/tinymce4/tinymcewidget",function(){
			console.log("++++tinymcewidget loaded+++");
		});*/
	},
	
	/**
	 * 人员搜索
	 * 
	 * type: null单选 非空多选 className: 样式的class名称 call_back: 选择完成确定后的回调方法
	 */
	
	// 删除事件
	regSelectedRemoveEvent: function(ret) {		
		$(".selectedName span").click(function() {
			$(this).parent().remove();
			var email = $(this).parent().attr("email");
			
			for(var i=0; i<ret.length;i++) {				
				if(ret[i].email == email) {
					ret.splice(i, 1);
				}
			}
		});
		
	},
	// 弹出框显示
	reviewReceivers: function(ret) {
		if (!ret || !ret instanceof Array) return;		
		var l = ret.length, dom_str = ''		
		for (var i = 0; i < l; i++) {
			var receiver = ret[i];			
			dom_str += '<a class="selectedName" email="'
				+ receiver.email
				+ '">' + receiver.userName
				+ '<span>x</span></a>';
		}
		
		$("#selectedStaff").empty();
		$("#selectedStaff").append(dom_str);
		common.f.regSelectedRemoveEvent(ret);
	},
	// 多选时页面显示
	viewReceivers: function(id, ret) {		
		if (!ret || !ret instanceof Array) return;		
		var l = ret.length, dom_str = '';		
		for (var i = 0; i < l; i++) {			
			var receiver = ret[i];			
			dom_str += '<a class="selectedName" email="'
				+ receiver.email
				+ '">' + receiver.userName + '<span>x</span></a>';
		}
		
		$('#' + id).empty();
		$('#' + id).append(dom_str);
		
		common.f.regSelectedRemoveEvent(ret);
	},
	
	// id为页面显示的ID
	initStaff: function(type, id, call_back, ret) {
		var url = 'user.txt';
		var btns = '<div class="btns"><a class="orange ok">确定</a>';
				
		if (type) {			
			common.f.reviewReceivers(ret);	
		} else{
			var userName = $("#"+id).val();
			if(userName.length==0){
				$("#selectedStaff").empty();
			}else{
				var email = $("#"+id).attr("email");				
				var dom_str = '<a class="selectedName" email="' + email + '">' + userName + '<span>x</span></a>';
				$("#selectedStaff").empty();
				$("#selectedStaff").append(dom_str);
				$(".selectedName span").click(function(){
					$(this).parent().remove();
					$("#"+id).val("");
				});
			}
			
		}
		
		
		var table = ''
		+ '<div class="staffView report_list">'
		+ '  <table id="table_report_list" width="100%" border="0" cellspacing="1" cellpadding="0">'
		+ '    <tr><th>操作</th><th>工号</th><th>姓名</th><th>邮箱</th></tr>';
		
		var setListDom = function(data) {
			var dom_str = table;			
			$.each(data, function(k, v) {
				dom_str += ''
					+ '<tr>'
					+ '  <td align="center"><a class="checkStaff">选择</a></td>'
					+ '  <td>' + v.workNo + '</td>'
					+ '  <td>' + v.userName + '</td>'
					+ '  <td>' + v.email + '</td>'
					+ '</tr>';
			});
			
			$(".addStaffBox .btns").remove();
			$("#user_list").empty();
			$("#user_list").append(dom_str);
			$(".addStaffBox").append(btns);
		};
		
		var setDeptClass = function() {
			$('.staffTab li:first').addClass("on").siblings().removeClass("on");
		};
		
		var setFindClass = function() {
			$('.staffTab li:eq(1)').addClass("on").siblings().removeClass("on");
		};
		
		var removeSame = function(ca) {// 删除重复的
			for (var i = 0; i < ret.length; i++) {				
				if(ret[i].email == ca.email) {					
					ret.splice(i, 1);
				}
			}
		};
		
		var loadUsers = function(url, param) {// 加载数据
			common.f.ajax(url, param, function(data) {
				var data = data.content.returnValue;				
				if(!data || data.length == 0) {					
					$("#user_list").html("<div style='border:1px solid #ccc; padding:20px;'>未查询到结果！</div>");
				}else{					
					setListDom(data);// 构造查询结果列表
					regSelectEvent();
				}
			});
		};
		
		var regSelectEvent = function() {// 选择事件
			$(".checkStaff").click(function() {				
				var code = $(this).parent().next().text(),
					email = $(this).parent().next().next().next().html()
					cCode = $("#selectedStaff" + " a[email='" + email + "']"),
					userName = $(this).parent().next().next().html(),
					a = '<a class="selectedName" email="'+ email + '">' + userName + '<span>x</span></a>';
				
				if (type) {// 多选
					if(cCode.length > 0) {// 第二次点击 取消
						$("#selectedStaff" + " a[email='"+email+"']").remove();
					}
					var len = $("#selectedStaff a").length;
					if(len < 50){
						$("#selectedStaff").append(a);
						var ca = {code: code, userName: userName, email: email};
						removeSame(ca);// 先删除重复的
						ret.push(ca);
					}else{
						$.jBox.info("最多能抄送50个人！","提示",{closed: function () {  }, timeout: 2000, height:120});
					}					
					
					
					common.f.regSelectedRemoveEvent(ret);
					call_back(ret);
					$(".ok").click(function() {// 确定按钮事件
						common.f.viewReceivers(id,ret);  // 页面显示
						call_back(ret);
						common.f.removeEvents();						
						$(".addStaffBox").dialog("close");
					});
					
					
				} else {// 单选
					ret = [];
					$("#selectedStaff").empty();
					$("#selectedStaff").append(a);
					
					var ca = {code: code, userName: userName, email: email};
					ret.push(ca);
					
					$("#"+id).val(userName).attr("email",email);
					call_back(ret);
					common.f.removeEvents();
					
					$(".addStaffBox").dialog("close");
				}			
				

			});
			
			$(".ok").click(function() {// 确定按钮事件
				common.f.removeEvents();
				$(".addStaffBox").dialog("close");
			});					
		};			
		
		// 同一部门
		$(".staffTab li:first").click(function() {
			$(this).addClass("on").siblings().removeClass("on");
			loadUsers(url, {dept: 'dept'});
		});
		
		// 查询结果
		$(".staffTab li:eq(1)").click(function() {
			$(this).addClass("on").siblings().removeClass("on");
			$("#user_find").trigger("click");
		});
		
		// 查找按钮
		$("#user_find").click(function() {
			setFindClass();
			var v = $("#user_text_find").val();			
			if (!v ) {
				$("#user_list").html("<div style='border:1px solid #ccc; padding:20px;'>未查询到结果！</div>");
				return;
			}			
			loadUsers(url, {fuzzyStr: v});
		});
		// 按回车键提交查询
		$(".addStaffBox").keyup(function(event){
			if(event.keyCode ==13){
				$("#user_find").trigger("click");
				return false;
			}
		});
		
		// 关闭事件
		$(".ui-dialog .ui-dialog-titlebar-close").click(function() {
			common.f.removeEvents();
			$(".addStaffBox").dialog("close");
		});
		
		$(".staffTab li:first").trigger("click");		
		
	},
	
	/**
	 * 移除事件
	 */
	removeEvents: function() {
		$(".staffTab li:first").unbind('click');
		$(".staffTab li:eq(1)").unbind('click');
		$("#user_find").unbind('click');
	}
}
$(function(){
	$(".orange").live("mouseover", function(){
		$(this).removeClass("orange").addClass("orangeHover");
	});
	$(".orangeHover").live("mouseout", function(){
		$(this).removeClass("orangeHover").addClass("orange");
	});
	$(".gray").live("mouseover", function(){
		$(this).removeClass("gray").addClass("grayHover");
	});
	$(".grayHover").live("mouseout", function(){
		$(this).removeClass("grayHover").addClass("gray");
	});
	
});

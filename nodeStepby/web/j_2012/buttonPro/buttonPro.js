
/*
 *作    者: 张勇辉 
 *版    本: 1.0 
 *完成时间: 2011-07-12 
 *描    述: buttonPro 
 *关联文件: jQuery.js|jquery-ui.js 
 */	
(function($,undefined){
    /** 
	* @class 标准按钮插件
    * @name buttonPro
    * @description 标准按钮插件
	* @version 1.0 
    */
	$.widget("ui.buttonPro",
	/** @lends buttonPro.prototype */		 
	{
		options:{},
		_create:function(){
			var _self = this.element,//元素自身 
				o = this.options,
				_img = _self.attr("data-img") || "s",//图片的路径 
				_width = _self.attr("data-width") || "",
				_btnBody = $("<span />").addClass("ui-buttonPro").append("<span class='buttonPro-con'/>")	;
				_self.wrap(_btnBody)
				.before(function(){
						var _ico = $("<div />")	;
						if(_img!=="s"){
							_ico.addClass("ico").attr("style","background-image:url("+_img+")");
						}else{
							_ico.addClass("s");
						}
						return _ico;
				});//生成形态 
				if(_self.is("[data-img]") && _self.is("[data-width]") && _self.attr("data-width")!="standard"){
						_self.width(_width-30);
					}else if(_self.is("[data-width]") && _self.attr("data-width")!="standard"){
						_self.width(_width-10);
					}else if(_self.is("[data-img]")&&_self.attr("data-width")=="standard"){
						_self.width(46);
					}else if(_self.attr("data-width")=="standard"){
						_self.width(66);
					}
			
		},
		_init:function(){
			var o=this.options,
				_self = this.element,//元素自身 
				_type=_self.attr("data-type")||"normal",//按钮类型
				_menu=$("<span class='triangle'/>"),
				_btnBody = _self.parent().parent();
			function h(){
				if(_self.is(":disabled")){
					_btnBody.addClass("ui-buttonPro-d");
					}else{
						_btnBody.addClass("ui-buttonPro-h");
					}
				}
			function h2(){
				if(_self.is(":disabled")){
						_btnBody.addClass("ui-buttonPro-d");
					}else{
						_btnBody.removeClass("ui-buttonPro-h");
					}
				}
			function md(){
				if(_self.is(":disabled")){
					_btnBody.addClass("ui-buttonPro-d");
					}else{
						_btnBody.addClass("ui-buttonPro-c");
					}
				}
			function mu(){
				if(_self.is(":disabled")){
						_btnBody.addClass("ui-buttonPro-d");
					}else{
						_btnBody.removeClass("ui-buttonPro-c");
					}
				}
			function mo(){
				if(_self.is(":disabled")){
					_btnBody.addClass("ui-buttonPro-d");
					}else{
						_btnBody.removeClass("ui-buttonPro-c");
					}
				}	
				if(_self.is(":disabled")){
					_btnBody.addClass("ui-buttonPro-d");
				}else{
					_btnBody.removeClass("ui-buttonPro-d");
				}
				if(_type=="menu"){
					_btnBody.find("span.buttonPro-con").append(_menu);
				}
				if(_self.css("display") == "none"){
					_btnBody.hide();
				}else {
					_btnBody.show();
				}
			_btnBody.hover(function(){
							h();
						 },function(){
							h2();
						}).mousedown(function(){
							md();
						}).mouseup(function(){
							mu();
						}).mouseout(function(){
							mo();
						}).unbind("click").bind("click",function(e){
							if(_self.is(":disabled")){
								}else if(e.target.tagName!="INPUT" && e.target.tagName!="BUTTON"){
										_self[0].click();
							}
						});
			return _btnBody;
		},
		/**
		* @description 显示按钮
		* @return {buttonPro} buttonPro对象
		* @example
		* $("#logo").buttonPro('show');
		*/
		show:function(){
			this.element.show().parent().parent().show();
			return this.element;
		},
		/**
		* @description 隐藏按钮
		* @return {buttonPro} buttonPro对象
		* @example
		* $("#logo").buttonPro('hide');
		*/
		hide:function(){
			this.element.parent().parent().hide();
			return this.element;
		},
		/**
		* @description 禁用按钮
		* @return {buttonPro} buttonPro对象
		* @example
		* $("#logo").buttonPro('disable');
		*/
		disable:function(){
			this.element.attr("disabled",true).parent().parent().addClass("ui-buttonPro-d");
			return this.element;
		},
		/**
		* @description 启用按钮
		* @return {buttonPro} buttonPro对象
		* @example
		* $("#logo").buttonPro('enable');
		*/
		enable:function(){
			this.element.attr("disabled",false).parent().parent().removeClass("ui-buttonPro-d");
			return this.element;
		},
		/**
		* @description 销毁按钮
		* @return {buttonPro} buttonPro对象
		* @example
		* $("#logo").buttonPro('destroy');
		*/
		destroy:function(){
			this.element.parent().parent().before(this.element);
			this.element.next(".ui-buttonPro").remove();
			return this;
		}
	});
	
$.extend($.ui.buttonPro, {
	version: "1.0"
});

})(jQuery);
//initialize
$(function(){
		 $(".buttonPro").buttonPro();  
});
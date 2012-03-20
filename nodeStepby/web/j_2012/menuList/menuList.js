
/*
 *作    者: 张勇辉 
 *版    本: 1.0 
 *完成时间: 2011-07-12 
 *描    述: menuList 
 *关联文件: jQuery.js|jquery-ui.js 
 */	
(function($,undefined){
    /** 
	* @class 下拉菜单插件
    * @name menuList
    * @description 下拉菜单插件
	* @version 1.0 
    */
	$.widget("ui.menuList",
	/** @lends menuList.prototype */		 
	{
		options:{
        /**  
        * @name menuList#json  
        * @param {menuList} menuList menuList对象 
        * @description JSON数据源
		* @default {menuList} ""
		* @example
		* $("#link").menuList({json:"json.js"});
        */
		json : "",
        /**  
        * @name menuList#fn  
        * @param {menuList} menuList menuList对象 
        * @description 执行函数
		* @default {menuList} function(){}
		* @example
		* $("#link").menuList({
		* 	fn:function(){
		*		$("#aa").live("click",function(event){
		*			if($(event.target).is("li")){
		*				alert($(event.target).attr("id"));
		* 			}
		*		}
		* });
        */
		fn : function(){},
        /**  
        * @name menuList#listId  
        * @param {menuList} menuList menuList对象 
        * @description 下拉列表的ID，用于对下拉列表操作
		* @default {menuList} ""
		* @example
		* $("#link").menuList({listId:"listBox_1"});
        */
		listId :""
		},
		_create:function(){
			
		},
		_init:function(){
			var o = this.options,
				_self = this.element,
				_menuList = $("<div />").addClass("ui-menuList").append("<ul />").attr("id",o.listId);
				_menuList.find("ul").append("<li>菜单列表</li><li>菜单列表</li><li>菜单列表</li><li>菜单列表</li>"),
				fn = o.fn;
				//Get JSON
				$.getJSON(o.json,function(data){
					_menuList.find("ul").empty();
					$.each(data,function(entryIndex,entry){
						var html = "<li id='" + entry['id'] + "'>" + entry['menuList'] +"</li>"
						_menuList.find("ul").append(html);
					});

				_menuList.find("li").hover(function(){
						$(this).addClass("h");
				},function(){
						$(this).removeClass("h");
				});
					return false;
				});
			
				if(_self.is(".buttonPro")){
					_self = _self.parent().parent();
				}
				_menuList.insertAfter(_self);
				_menuList.position({
						of:_self,
						my:"left top",
						at:"left bottom",
						collision:"flip"
					});
				_self.unbind("click").bind("click",function(event){
					_menuList.bind("click",function(event){
						//return false;
						//event.stopPropagation();
						});
					$(".ui-menuList").slideUp(100);
					_menuList.slideToggle(100);
					event.stopPropagation();
					//return false;
				});
				fn();
				$(window).bind("click resize",function(){
						$(".ui-menuList").slideUp(100);
				});
				//For IE
				$(document).bind("click resize",function(){
						$(".ui-menuList").slideUp(100);
				});
		},
		/**
		* @description 销毁下拉菜单
		* @example
		* $("#link").menuList('destroy');
		*/
		destroy:function(){
			if(_self.is(".buttonPro")){
				this.element.unbind("click").parent().parent().next(".ui-menuList").remove();
			}else{
				this.element.unbind("click").next(".ui-menuList").remove();
			}
		}
	});
	
$.extend($.ui.menuList, {
	version: "1.0"
});

})(jQuery);
//initialize
/*$(function(){
		 $(".menuList").menuList();  
});*/
// toolbar
(function($,undefined){
	$.widget("ui.toolbar",
	{
		options:{},
		_create:function(){
			var _self = this.element,
				o = this.options,
				_type = _self.attr("data-type") || "top";
			_self.addClass("ui-toolbar");
			if(_type == "bottom"){
				_self.addClass("ui-toolbarBottom");
			}else if(_type == "top"){
				_self.addClass("ui-toolbarTop");
			}
		},
		_init:function(){},
		show:function(){},
		hide:function(){},
		destroy:function(){
			this.element.removeClass("ui-toolbar ui-toolbarBottom ui-toolbarTop");
		}
		
	});
})(jQuery);
//initialize
$(function(){
		 $(".toolbar").toolbar();
});
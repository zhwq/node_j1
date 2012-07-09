/**
 * @author feiwen
 * http://www.css88.com/archives/722
 */
(function ($) {
    $.fn.blockSlide = function (settings) {
        settings = jQuery.extend({
            speed:"normal",
            num:4,
            timer:1000,
            flowSpeed:300
        }, settings);
        return this.each(function () {
            $.fn.blockSlide.scllor($(this), settings);
        });
    };
    $.fn.blockSlide.scllor = function ($this, settings) {
        var index = 0;
        $('<div id="flow"></div>').appendTo($this);
        var ul = $("ul:eq(0)", $this);
        var imgScllor = $("div:eq(0)>div", $this);
        var timerID;
        var li = ul.children();
        //滑动导航改变内容
        $(li).hover(function () {
            if (MyTime) {
                clearInterval(MyTime);
            }
            index = $(li).index(this);
            MyTime = setTimeout(function () {
                $(imgScllor).stop();
                ShowjQueryFlash(index);
            }, 400);

        }, function () {
            clearInterval(MyTime);
            MyTime = setInterval(function () {
                ShowjQueryFlash(index);

                index++;
                if (index == settings.num)
                    index = 0;
            }, settings.timer);
        });
        //滑入 停止动画，滑出开始动画.
        $(imgScllor).hover(function () {
            if (MyTime) {
                clearInterval(MyTime);
            }
        }, function () {
            MyTime = setInterval(function () {
                ShowjQueryFlash(index);

                index++;
                if (index == settings.num)
                    index = 0;
            }, settings.timer);
        });
        //自动播放
        var MyTime = setInterval(function () {
            ShowjQueryFlash(index);
            //alert(index);
            index++;
            if (index == settings.num)
                index = 0;
        }, settings.timer);
        var ShowjQueryFlash = function (i) {
            $(imgScllor).eq(i).animate({opacity:1}, settings.speed).css({"z-index":"1"}).siblings().animate({opacity:0}, settings.speed).css({"z-index":"0"});
            $("#flow").animate({ left:i * 122 + 5 + "px"}, settings.flowSpeed); //滑块滑动
            $(li).eq(i).addClass("current").siblings().removeClass("current");
        }
    }
})(jQuery);
/*
 jQuery(function($){
 var index = 0;
 $('<div id="flow"></div>').appendTo("#myjQuery");

 //滑动导航改变内容
 $("#myjQueryNav li").hover(function(){
 if(MyTime){
 clearInterval(MyTime);
 }
 index  =  $("#myjQueryNav li").index(this);
 MyTime = setTimeout(function(){
 ShowjQueryFlash(index);
 $('#myjQueryContent').stop();
 } , 400);

 }, function(){
 clearInterval(MyTime);
 MyTime = setInterval(function(){
 ShowjQueryFlash(index);
 index++;
 if(index==4){index=0;}
 } , 3000);
 });
 //滑入 停止动画，滑出开始动画.
 $('#myjQueryContent').hover(function(){
 if(MyTime){
 clearInterval(MyTime);
 }
 },function(){
 MyTime = setInterval(function(){
 ShowjQueryFlash(index);
 index++;
 if(index==4){index=0;}
 } , 3000);
 });
 //自动播放
 var MyTime = setInterval(function(){
 ShowjQueryFlash(index);
 index++;
 if(index==4){index=0;}
 } , 3000);
 });
 function ShowjQueryFlash(i) {
 $("#myjQueryContent div").eq(i).animate({opacity: 1},1000).css({"z-index": "1"}).siblings().animate({opacity: 0},1000).css({"z-index": "0"});
 $("#flow").animate({ left: i*122+5 +"px"}, 300 ); //滑块滑动
 $("#myjQueryNav li").eq(i).addClass("current").siblings().removeClass("current");
 }
 */
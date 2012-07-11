/**
 * 图片轮播控件
 * 1. 控件尺寸自定义
 * 2. 使用悬浮1-2-3方式定制点播(默认放置在右下角)
 * 3. 最多6张
 */
$(function(){
    //左右
    var current = 0;
    var $slideHost = $( "div.slide-controller" );
    var left = 438;
    var total = 4;
    setInterval(function(){
        var $currentSlide = $slideHost.children(":eq("+current+")");
        var $targetSlide;
        if ( current == total -1 ) {
            $targetSlide = $slideHost.children(":eq(0)");
            current = 0;
        } else {
            $targetSlide = $currentSlide.next();
            current = $targetSlide.index();
        }
        $targetSlide.css({
            left: 2*left + "px",//互补容器left值为0,处理滑动空白帧显示问题
            display: "block"
        });
        $slideHost.animate({left:-2*left+"px"},350,function(){
            $slideHost.css({left:-left+"px"});

            $currentSlide.css({
                left: left + "px",
                display: "none",
                zIndex: 0
            });
            $targetSlide.css({
                left: left + "px",
                zIndex: 5
            });
        });
    },2000);
    //上下
//    var current = 0;
//    var $slideHost = $( "div.slide-controller" );
//    var top = 350;
//    var total = 4;
//    setInterval(function(){
//        var $currentSlide = $slideHost.children(":eq("+current+")");
//        var $targetSlide;
//        if ( current == total -1 ) {
//            $targetSlide = $slideHost.children(":eq(0)");
//            current = 0;
//        } else {
//            $targetSlide = $currentSlide.next();
//            current = $targetSlide.index();
//        }
//        $targetSlide.css({
//            top: 2*top + "px",//互补容器left值为0,处理滑动空白帧显示问题
//            display: "block"
//        });
//        $slideHost.animate({top:-2*top+"px"},350,function(){
//            $slideHost.css({top:-top+"px"});
//
//            $currentSlide.css({
//                top: top + "px",
//                display: "none",
//                zIndex: 0
//            });
//            $targetSlide.css({
//                top: top + "px",
//                zIndex: 5
//            });
//        });
//    },2000);
});
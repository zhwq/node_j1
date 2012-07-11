(function ($) {
  $.fn.slide = function (option) {
    //加载默认配置和用户自定义配置
    option = $.extend({}, $.fn.slide.option, option || {});
    return this.each(function () {
      var $elem = $(this);
      var $container = $elem.find('.' + option.container);
//            var $control = $('<div class="slide-control"/>'); //此时和dom节点中的不关联;更新dom后获取
      var $slides = $container.children();
      var total = $slides.size();//幻灯片数目
      //如果获取准确的宽高
      var width = option.width || $slides.outerWidth();
      var height = option.height || $slides.outerHeight();
      var start = option.start - 1;
      var next = 0;
      var prev = 0;
//            var number = 0;//生成点播记号用<多余>
      var current = 0;//重置默认配置为0
      var loaded;  //资源就绪
      var active;  //锁,值为false值时才能开启一次动画
      var clicked; //手动选择的图片
      var position;
      var effect = option.effect;
      var slideDir = option.slideDir;
//            var leftOrTop = (option.slideDir === "h") ? "left" : "top";
      var direction; //正(左、上)、负向
//            var imageParent;//预加载时使用
      var pauseTimeout;
      var playInterval;
      if (total > option.maxNum) {
        alert("最多允许6张图片!");
        return;
      }
      //设定容器的宽高
      //确定控件容器拥有样式: overflow: hidden; position: relative;
      $container.css({
        "overflow":"hidden",
        "position":"relative",
        "width":width + "px",
        "height":height + "px"
      });
      //将控件容器下的的幻灯片节点使用div.slide-control包裹
      $slides.wrapAll(/*$control*/$('<div class="slide-control"/>'));
      //设定幻灯片的样式
      $slides.css({
        "position":"absolute",
        "display":"none",
        "top":height + "px",
        "left":width + "px",
        "z-index":0
      });
      //设定控制容器的样式
      var $control = $container.find(">div.slide-control");
      $control.css({
        "position":"relative",
        "top":-height + "px", //slide control
        "left":-width + "px", //slide control
        "width":total * width + "px",
        "height":total * height + "px"
      });
      if (total < 2) { //只有一帧
        $container.fadeIn(option.slideSpeed, function () {
          loaded = true;
          option.slideLoaded();
        });
        return false;
      }
      if (start < 0) {
        start = 0;
      }
      if (start > total) {
        start = total - 1;
      }
      //根据配置的开始帧 设置 当前帧 下标
      if (option.start) {
        current = start;
      }

      //显示控件
      $container.css("display", "block");

      //此时只是简单的显示开始帧
      $control.children(":eq(" + start + ")").fadeIn(option.slideSpeed, function () {
        loaded = true;
        option.slideLoaded();
      });
      //生成手动操作入口
      if (option.pagination) {
        var ulCss = {"position":"absolute", "right":"25px", "bottom":"12px", "z-index":6};
        var ul = '<ul class=' + option.paginationClass + '>';
        for (var i = 0; i < total; i++) {
          ul += '<li><a href="javascript:;">' + (i) + '</a></li>';
        }
        ul += '</ul>';
        $(ul).appendTo($container).css(ulCss);
        $elem.find('.' + option.paginationClass + ' li:eq(' + start + ')').addClass(option.currentClass);
      }
      //绑定手动播放事件
      $elem.find("ul." + option.paginationClass + ">li>a").click(function () {
        if (option.play) {
          _pause();
        }
        clicked = parseInt($(this).text(), 10);
        if (current != clicked) {
          _animate('pagination', effect, slideDir, clicked);
        }
        return false;
      });
      //开始图片播放
      if (option.play) {
        playInterval = setInterval(function () {
          _animate('next', effect, slideDir);
        }, option.play);
        $elem.data("interval", playInterval);
      }
      function _animate(direction, effect, slideDir, clicked) {
        if (!loaded || active) return;
        //动画开始前调用
        option.animationStart(current + 1);
        //根据动画方向 更新配置参数
        switch (direction) {
          case "next":
            prev = current;
            next = current + 1;
            next = ( total === next ) ? 0 : next;
            current = next;
            if (slideDir) {
              if (slideDir == "h") {
                position = width * 2;
                direction = -position;
              } else if (slideDir == "v") {
                position = height * 2;
                direction = -position;
              }
            }
            break;
          case "prev":
            prev = current;
            next = current - 1;
            next = ( next = -1 ) ? total - 1 : next;
            position = direction = 0;
            current = next;
            break;
          case "pagination":
            prev = $elem.find('.' + option.paginationClass + ' li.' + option.currentClass + ">a").text();
            prev = parseInt(prev, 10);
            next = clicked;
            if (prev < next) {
              if (slideDir) {
                if (slideDir == "h") {
                  position = width * 2;
                  direction = -position;
                } else if (slideDir == "v") {
                  position = height * 2;
                  direction = -position;
                }
              }
            } else {
              position = direction = 0;
            }
            current = next;
            break;
          //其他
        }
        if (effect == "slide") {
          if ("h" == slideDir) {
            $control.children(":eq(" + next + ")").css({
              "left":position + "px",
              "display":"block"
            });
            $control.animate({
              "left":direction + "px"
            }, option.animateSpeed, function () {
              // after animation reset control position
              $control.css({
                "left":/*direction / 2*/ -width + "px"
              });
              // reset and show next
              $control.children(':eq(' + next + ')').css({
                "left":/*position / 2*/width + "px",
                zIndex:5
              });
              // reset previous slide
              $control.children(':eq(' + prev + ')').css({
                "left":/*position / 2*/width + "px",
                display:'none',
                zIndex:0
              });
              // end of animation
              option.animationComplete(next + 1);
              active = false;
            });
          } else if ("v" == slideDir) {
            $control.children(":eq(" + next + ")").css({
              "top":position + "px",
              "display":"block"
            });
            $control.animate({
              "top":direction + "px"
            }, option.animateSpeed, function () {
              // after animation reset control position
              $control.css({
                "top":/*direction / 2*/-height + "px"
              });
              // reset and show next
              $control.children(':eq(' + next + ')').css({
                "top":/*position / 2*/height + "px",
                zIndex:5
              });
              // reset previous slide
              $control.children(':eq(' + prev + ')').css({
                "top":/*position / 2*/height + "px",
                display:'none',
                zIndex:0
              });
              // end of animation
              option.animationComplete(next + 1);
              active = false;
            });
          }
        }
        // 更新手动操作样式
        if (option.pagination) { //可直接替换
          //删除
          $elem.find('.' + option.paginationClass + ' li.' + option.currentClass).removeClass(option.currentClass);
          // 添加
          $elem.find('.' + option.paginationClass + ' li:eq(' + next + ')').addClass(option.currentClass);
        }
      }

      function _stop() {
        clearInterval($elem.data('interval'));
      }

      function _pause() { //清除定时器;延时添加定时器
        if (option.pause) {
          clearTimeout($elem.data('pause'));
          clearInterval($elem.data('interval'));
          pauseTimeout = setTimeout(function () {
            clearTimeout($elem.data('pause'));
            playInterval = setInterval(function () {
              _animate('next', effect, slideDir);
            }, option.play);
            $elem.data("interval", playInterval);
          }, option.pause);
          $elem.data('pause', pauseTimeout);
        } else {
//          _stop();//这种需求很少
        }
      }
    });
  };
  //默认配置
  $.fn.slide.option = {
    maxNum:6, //最多允许6张图片
    width:undefined, //数字 控件的宽
    height:undefined, //数字 控件的高
    container:'slide-container', //字符串 控件容器class值
//    preload: false, //  布尔型;控制预加载slideshow下的img的图片；
//    preloadImage: '/img/loading.gif', // 字符串;设定预加载时的加载中标识...(默认值:/img/loading.gif)
    pagination:true, //手动选择显示的幻灯图片
    paginationClass:'pagination', // 手动选择入口的容器节点class值
    currentClass:'current', // 字符串(当前显示动画节点的class值)
    animateSpeed:600, //动画时间
    start:1, // 数字 第一帧
    effect:"slide", //动画效果 暂时只做slide切换
    slideDir:"h", //字符串 slide切换方向 可选值("h"水平,"v"垂直) 默认为“h”
    play:0, // 数字, 自动播放, 设定为>0的数字将开启自动播放,数值为播放的间隔(表述不准确)
    pause:0, // 数字, 控制手动播放时停止播放. 定为>0的数字将开启停止播放功能,数值为停止的间隙(表述不准确)
    hoverPause:false, // 布尔型 设置成ture 鼠标悬浮时会暂停动画
//    bigTarget:false, // 布尔型 设置成true后点击一张图片将链接到下一张图片 注意img父节点a标签的点击事件
    animationStart:function () {
    }, // 动画执行开始前调用的方法
    animationComplete:function () {
    }, // 动画执行完毕后的回调方法
    slideLoaded:function () {
    } // 当幻灯片都加载好后调用的方法
  }
})(jQuery);
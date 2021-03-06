/**
 * 该脚本修改自Slides脚本
 * jQuery动画连续播放:
 * 1,动画元素
   1.1 定位
   1.1.1<控制容器和子项的offset,利用差值显示对应的子项>
   position:absolute;left:0;top:0;
   1.1.2<控制容器的滚动条>
   scrollLeft;scrollTop;//首位图片切换时,过渡快闪
   1.2 淡入淡出:fadeIn;fadeOut;透明度
   opacity: 1;opacity:0;
 * 当前脚本采用1.1.1和1.2实现播放效果
 */
/*
 *
 * Slides, A Slideshow Plugin for jQuery
 * Intructions: http://slidesjs.com
 * By: Nathan Searles, http://nathansearles.com
 * Version: 1.1.9
 * Updated: September 5th, 2011
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {
  $.fn.slide = function (option) {
    //默认配置
    var defaults = {
      maxNum:6, //最多允许6张图片
      width:undefined, //数字 控件的宽
      height:undefined, //数字 控件的高
      container:'slide-container', //字符串 控件容器class值
//    preload: false, //  布尔型;控制预加载slideshow下的img的图片；
//    preloadImage: '/img/loading.gif', // 字符串;设定预加载时的加载中标识...(默认值:/img/loading.gif)
      pagination:true, //手动选择显示的幻灯图片
      paginationType: "click",//手动触发方式;暂时不提供配置
      paginationClass:'pagination', // 手动选择入口的容器节点class值
      currentClass:'current', // 字符串(当前显示动画节点的class值)
      duration:600, //动画时间  animateSpeed-->duration
      start:1, // 数字 第一帧
      effect:"h", //动画效果;1,fade,淡入淡出;2,slide:h 水平;v 垂直
      play:0, // 数字, 自动播放, 设定为>0的数字将开启自动播放,数值为播放的间隔(表述不准确)
      pause:0, // 数字, 控制手动播放时停止播放. 定为>0的数字将开启停止播放功能,数值为停止的间隙(表述不准确)
      hoverPause:false, // 布尔型 设置成ture 鼠标悬浮时会暂停动画
//    bigTarget:false, // 布尔型 设置成true后点击一张图片将链接到下一张图片 注意img父节点a标签的点击事件
      animationStart:function () {}, // 动画执行开始前调用的方法
      animationComplete:function () {}, // 动画执行完毕后的回调方法
      slideLoaded:function () {} // 当幻灯片都加载好后调用的方法
    };
    //加载默认配置和用户自定义配置
    option = $.extend({}, defaults, option || {});
    return this.each(function () {
      var $elem = $(this);
      var $container = $elem.find('.' + option.container);
      //将控件容器下的的幻灯片节点使用div.slide-control包裹
      //在html结构中限定
      //$slides.wrapAll(/*$control*/$('<div class="slide-control"/>'));
      var $control = $container.find(">div.slide-controller");
//            var $control = $('<div class="slide-control"/>'); //此时和dom节点中的不关联;更新dom后获取
      var $slides = /*$container*/$control.children();
      var total = $slides.size();//幻灯片数目
      //如果获取准确的宽高
      //1.显式配置;2.在img上设置width,height属性;3,通过脚本判断获取(TODO:未完成)
      var width = option.width || $slides.outerWidth();
      var height = option.height || $slides.outerHeight();
      var start = option.start - 1;
      var next = 0;
      var prev = 0;
      var current = 0;//重置默认配置为0
      var loaded;  //资源就绪
      var active;  //锁,值为false值时才能开启一次动画
      var clicked; //手动选择的图片
      var position;
      var effect = option.effect;
      var direction; //正(左、上)、负向
//            var imageParent;//预加载时使用
      var duration = option.duration;
      var pauseTimeout;
      var playInterval;
      if (total > option.maxNum) {
        alert("最多允许6张图片!");
        return;
      }
      if ( (!option.width || !option.height) && (!$slides.attr("width") || !$slides.attr("height")) ) {
        alert("控件宽高调用错误!");
        return;
      }
      //设定图片的宽、高;在自定义控件宽高时使用
      //此时不使用等比缩放、简单的将容器的宽、高赋值
      $slides.find("img").attr("width", width).attr("height", height);
      //设定容器的宽高
      //确定控件容器拥有样式: overflow: hidden; position: relative;
      //设定控制容器的样式
      $container.css({
        "overflow":"hidden",
        "position":"relative",
        "width":width + "px",
        "height":height + "px"
      });
      $control.css({
        "position":"relative",
        "top":-height + "px", //slide control
        "left":-width + "px", //slide control
        "width":total * width + "px",
        "height":total * height + "px"
      });
      //设定幻灯片的样式
      $slides.css({
        "position":"absolute",
        "display":"none",
        "top":height + "px",
        "left":width + "px",
        "z-index":0
      });
      if (total < 2) { //只有一帧
        $container.fadeIn(duration, function () {
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
      $control.children(":eq(" + start + ")").fadeIn(duration, function () {
        loaded = true;
        option.slideLoaded();
      });
      //生成手动操作入口
      console.log( option.pagination );
      if (option.pagination) {
        var ulCss = {"position":"absolute", "right":"25px", "bottom":"12px", "z-index":6};
        var ul = '<ul class=' + option.paginationClass + '>';
        for (var i = 0; i < total; i++) {
          ul += '<li><a href="javascript:;">' + (i) + '</a></li>';
        }
        ul += '</ul>';
        $(ul).appendTo($container).css(ulCss);
        $elem.find('.' + option.paginationClass + ' li:eq(' + start + ')').addClass(option.currentClass);
        //绑定手动播放事件-->TODO:提供参数表示触发类型
        switch ( "click" || /*屏蔽了hover状态*/ option.paginationType ) {
          case "click":
            $elem.find("ul." + option.paginationClass + ">li>a").click(function () {
              //强制中止动画
              if ( option.play ) {
                _pause();
              }
              clicked = parseInt($(this).text(), 10);
              if (current != clicked) {
                _animate('pagination', effect, clicked);
              }
              return false;
            });
            break;
//          case "hover": //控制上再滑动是不连贯-暂时屏蔽掉
//            break;
          default:
            break;
        }
      }
      //开始图片播放
      if (option.play) {
        playInterval = setInterval(function () {
          _animate('next', effect);
        }, option.play);
        $elem.data("interval", playInterval);
      }
      function _animate(direction, effect, clicked) {
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
            if (effect == "h") {
              position = width * 2;
              direction = -position;
            } else if (effect == "v") {
              position = height * 2;
              direction = -position;
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
              if (effect == "h") {
                position = width * 2;
                direction = -position;
              } else if (effect == "v") {
                position = height * 2;
                direction = -position;
              }
            } else {
              position = direction = 0;
            }
            current = next;
            break;
          //其他
        }
        //动画效果
        switch( effect ) {
          case "h":
            $control.children(":eq(" + next + ")").css({
              "left":position + "px",
              "display":"block"
            });
            $control.animate({
              "left":direction + "px"
            }, duration, function () {
              //重置动画控制对象参数
              $control.css({
                "left":-width + "px"
              });
              $control.children(':eq(' + next + ')').css({
                "left":width + "px",
                zIndex:5
              });
              $control.children(':eq(' + prev + ')').css({
                "left":width + "px",
                display:'none',
                zIndex:0
              });
              //结束动画
              option.animationComplete(next + 1);
              active = false;
            });
            break;
          case "v":
            $control.children(":eq(" + next + ")").css({
              "top":position + "px",
              "display":"block"
            });
            $control.animate({
              "top":direction + "px"
            }, duration, function () {
              //重置动画控制对象参数
              $control.css({
                "top":-height + "px"
              });
              $control.children(':eq(' + next + ')').css({
                "top":height + "px",
                "z-index": 5
              });
              $control.children(':eq(' + prev + ')').css({
                "top":height + "px",
                "display":"none",
                "z-index": 0
              });
              //结束动画
              option.animationComplete(next + 1);
              active = false;
            });
            break;
          case "fade":
            $control.children(":eq(" + next + ")").css({
              "z-index": 5//6?5?7?
            }).fadeIn( duration, function(){
                $control.children(":eq(" + prev + ")").css({
                  "z-index": 0,
                  "display": "none"
                });
                //重置z-index
                $control.children(":eq(" + next + ")").css({
                  "z-index": 0
                });
                //结束动画
                option.animationComplete(next + 1);
                active = false;
              });
            break;
          default:
            break;
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
              _animate('next', effect);
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
})(jQuery);
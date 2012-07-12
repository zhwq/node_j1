/**
 * simple slider
 *
 * @Author:Fly Mirage
 * @Base:jQuery 1.2.3+
 * @Date:2010-01-26
 * @Version:1.5
 *
 * @History:
 * ----------------------------------------------
 * v1.4        2010-11-18
 * # Fixed,word "silder" to "slider"
 * # Add,Prev/Next Button,effect "line/vline"
 * # Change variant "direction" to "effect",method "c.effect" to "c.effecting"
 * # Change variant "t" to "obj"
 * ----------------------------------------------
 * v1.4        2010-06-29
 * # Add,diy the control's html
 * ----------------------------------------------
 * v1.3        2010-04-29
 * # Fix,parse error when control's link is null,ignore it
 * ----------------------------------------------
 * v1.2        2010-04-26
 * # Fix,stack overflow when children less than 2
 * ----------------------------------------------
 * v1.1        2010-01-21
 * # Fix,clear timeout's object before the function of "startRoll"
 * ----------------------------------------------
 * v1.0        2009-12-21
 * # "fade" style
 */

(function ($) {
    $.fn.extend({simpleslider:function (effect, duration, overStop, control) {
        //ul
        var t = $(this);
        var obj = t[0];
        if (!obj) {
            throw('this slider is empty!');
            return t;
        }
        //lis
        var ces = this.children();
        var interval = null;
        if (ces.length < 2) {
            return this;
        }
        var ctrl = {
            show:false,
            h:null, /*index control*/
            h_html:'%I', /*index's html*/
            h_method:'hover', /*index's method*/
            link:null, /*title control*/
            link_html:'<a href="%L" target="_blank">%T</a>', /*title's html*/
            sub:null, /*subtitle control*/
            sub_html:'%S', /*subtitle's html*/
            btn_prev:null,
            btn_next:null
        };
        ctrl = $.extend(ctrl, control);
        function isU(o) {
            return typeof o == 'undefined' || o == null;
        }

        ctrl.h_html = isU(ctrl.h_html) || ctrl.h_html == '' ? '%I' : ctrl.h_html;
        ctrl.link_html = isU(ctrl.link_html) || ctrl.link_html == '' ? '<a href="%L" target="_blank">%T</a>' : ctrl.link_html;
        ctrl.sub_html = isU(ctrl.sub_html) || ctrl.sub_html == '' ? '%S' : ctrl.sub_html;
        var c = {'sliderIndex':0, 'sliderCount':ces.length, 'overCtrl':false};
        //控制切换的频率
        duration = isNaN(duration) ? 2000 : parseInt(duration);
        duration = duration < 2000 ? 2000 : duration;
        obj.slider = true;
        switch (effect) {
            case "fade":
                //隐藏除第一张外的图片
                ces.eq(0).siblings().hide(); //hide other
                break;
            case "line":
                if ( $.browser.msie ) {
                    ces.css({'float':'left', 'clear':'right'});
                } else {
                    t.css({'white-space':'nowrap'});
                    ces.css({'display':'inline-block', 'white-space':'nowrap'});
                }
                //t;ul
                t.scrollLeft(0);
                break;
            case "vline":
                t.scrollTop(0);
                break;
            default:
                break;
        }


        function stopEffect() {
            clearInterval(interval);
        }

        function startEffect() {
            stopEffect();
            interval = setInterval(c.effecting, duration)
        }

        function getInformation(li) {
            var link = $('a:eq(0)', li).attr('href');
            var title = $('img:eq(0)', li).attr('alt');
            var sub = $('img:eq(0)', li).attr('sub');
            var img = $('img:eq(0)', li).attr('src');
            return {'link':(isU(link) ? '' : link), 'title':(isU(title) ? '' : title), 'sub':(isU(sub) ? '' : sub), 'img':(isU(img) ? '' : img)};
        }

        function parseInfo(info, str) {
            str = str.replace(/%T/g, info.title.toString());
            str = str.replace(/%S/g, info.sub.toString());
            str = str.replace(/%L/g, info.link.toString());
            str = str.replace(/%P/g, info.img.toString());
            return str;
        }

        c.nextIndex = -1;
        c.effecting = function () {
            if (!obj.slider) {

                return;
            }
            var isCtrl = false;
            if (c.sliderIndex >= c.sliderCount) c.sliderIndex = c.sliderCount - 1;
            var next = c.sliderIndex + 1;
            if (c.nextIndex >= 0 && c.nextIndex < c.sliderCount) {
                next = c.nextIndex;
                c.nextIndex = -1;
                isCtrl = true;
            }
            if (next >= c.sliderCount) next = 0;

            var o = [ces.eq(c.sliderIndex), ces.eq(next)];
            if (ctrl.show && ctrl.h != null) {
                $('li:eq(' + next + ')', ctrl.h).addClass('selected').siblings().removeClass('selected');
                var info = getInformation(o[1]);


                if (!!ctrl.link) {
                    var link = parseInfo(info, ctrl.link_html);
                    ctrl.link.html(link);
                }
                if (!!ctrl.sub) {
                    var sub = parseInfo(info, ctrl.sub_html);
                    ctrl.sub.html(sub);
                }
            }
            switch (effect) {
                case "fade":
                    if (!isCtrl)
                        o[0].stop(true, true).fadeOut('normal', function () {
                            o[1].stop(true, true).fadeIn('normal');
                        });
                    else {
                        o[0].stop(true, true).hide();
                        o[1].stop(true, true).show();
                    }
                    break;
                case "line": //子项从左向右排 TODO:在ie上的宽度值获取bug
//                    console.log( "IE: " + t[0].scrollWidth );
                    var pos = o[1].position();
                    var sl = pos.left + t.scrollLeft();
                    if (sl < 0) sl = 0;
//                    console.log( "horizontal: " + sl );
                    if (!isCtrl) {
                        t.stop(true, true).animate({scrollLeft:sl});
                    } else
                        t.stop(true, true).scrollLeft(sl);
                    break;
                case "vline": //子项从上往下排;display: inline-block;
                    var pos = o[1].position();
                    var st = pos.top + t.scrollTop();
                    if (st < 0) st = 0;
                    if (!isCtrl) {
                        t.stop(true, true).animate({scrollTop:st});
                    } else
                        t.stop(true, true).scrollTop(st);
                    break;
                default:


                    break;
            }
            c.sliderIndex = next;
        }
        if (overStop) {
            this.hover(function () {
                stopEffect();
            }, function () {
                if (!c.overCtrl)
                    startEffect();
            });
        }

        if (ctrl.show) {
            if (ctrl.h == null) {
                throw('slider\'s controlbar is not exist!');
                return this;
            }
            if (!ctrl.h.is('ul')) {
                throw('slider\'s controlbar is not UL!');
                return this;
            }
            for (var i = 0; i < c.sliderCount; ++i) {
                var info = getInformation(ces.eq(i));
                var str = ctrl.h_html.replace(/%I/g, (i + 1).toString());
                str = parseInfo(info, str);
                var o = $('<li index="' + i + '">' + str + '</li>').appendTo(ctrl.h);
                if (ctrl.h_method == 'hover') {
                    o.hover(function () {
                        stopEffect();
                        c.nextIndex = parseInt($(this).attr('index'));
                        c.effecting();
                    }, function () {
                        startEffect();
                    });
                } else {
                    o.bind(ctrl.h_method, function () {
                        c.nextIndex = parseInt($(this).attr('index'));
                        c.effecting();
                    });
                }
            }
            ctrl.h.hover(function () {
                c.overCtrl = true;
            }, function () {
                c.overCtrl = false;
            });
        }

        $(ctrl.btn_next).click(function () {
            if (c.sliderIndex + 1 >= c.sliderCount) c.nextIndex = 0; else c.nextIndex = c.sliderIndex + 1;
            c.effecting();

        });
        $(ctrl.btn_prev).click(function () {
            if (c.sliderIndex - 1 < 0) c.nextIndex = c.sliderCount - 1; else c.nextIndex = c.sliderIndex - 1;
            c.effecting();
        });

        //start
        c.nextIndex = 0;
        c.effecting();
        startEffect();
        return t;
    }
    });
    $.fn.extend({stopsimpleslider:function () {
        var t = $(this);
        if (!t[0]) {
            throw('this slider is empty!');
            return this;
        }
        t[0].slider = false;
        return t;
    }
    });

})(jQuery);
/*  |xGv00|cabbc4554c5794611f7d707afd680442 */
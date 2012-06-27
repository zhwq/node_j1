/*
 * jCal calendar multi-day and multi-month datepicker plugin for jQuery
 *	version 0.3.6
 * Author: Jim Palmer
 * Released under MIT license.
 */
(function ($) {
    $.fn.jCal = function (opt) {
        $.jCal(this, opt);
    };
    $.jCal = function (target, opt) {
        opt = $.extend({
            day:new Date(), // date to drive first cal
            days:1, // default number of days user can select
            showMonths:1, // 同时显示的月份挂历的数目
            monthSelect:false, // show selectable month and year ranges via animated comboboxen
            dCheck:function (day) { //检测是否合法<未>   handler for checking if single date is valid or not
                return true;
            },
            callback:function (day, days) {  //点击日期的回调<未>
                return true;
            },
            selectedBG:'rgb(0, 143, 214)', // 单元格选中时背景色
            defaultBG:'rgb(255, 255, 255)', // 单元格未选中时背景色
            dayOffset:0, // 配合dow显示第一列为星期几
            dow:['日', '一', '二', '三', '四', '五', '六'], // 配合dow显示第一列为星期几
            forceWeek:false, // <未>true=force selection at start of week, false=select days out from selected day
            ml:['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
            _target:target  // target DOM element - no need to set extend this variable//在何处赋值<?
        }, opt);
        //年月日 生成Date对象
        opt.day = new Date(opt.day.getFullYear(), opt.day.getMonth(), 1);
        //opt._target 被初始化为挂历挂载的容器节点,实例中为$("#calOne")
        //console.log( target instanceof $); true
        //$(opt._target).data('days') 有什么用
        if (!$(opt._target).data('days')) $(opt._target).data('days', opt.days);

        $(target).stop().empty();//未

        for (var sm = 0; sm < opt.showMonths; sm++) {   //循环都放 {}包括 迭代附加挂历
            $(target).append('<div class="jCalMo"></div>');
        }
        opt.cID = 'c' + $('.jCalMo').length;
        //上下文查找方式 获取到各个挂历 开始
        $('.jCalMo', target).each(//上下文查找方式 获取到各个挂历
            function (ind) { //each 回调
                //1.
                drawCalControl(
                    $(this),
                    $.extend(
                        {},
                        opt,
                        {
                            'ind':ind,
                            'day':new Date(new Date(opt.day.getTime()).setMonth(new Date(opt.day.getTime()).getMonth() + ind))
                        }
                    ));
                //2.
                drawCal(
                    $(this),
                    $.extend(
                        {},
                        opt,
                        {
                            'ind':ind,
                            'day':new Date(new Date(opt.day.getTime()).setMonth(new Date(opt.day.getTime()).getMonth() + ind))
                        }
                    )
                );

            });
        //上下文查找方式 获取到各个挂历 结束
        //TODO:作用 未 明
        if ($(opt._target).data('day') && $(opt._target).data('days')) { // {}包括
            reSelectDates(target, $(opt._target).data('day'), $(opt._target).data('days'), opt);
        }
    };
    /**
     *
     * @param target $(div.jCalMo)
     * @param opt 参数
     */
    function drawCalControl(target, opt) {
        //头部共选择的年，月的结构生成 开始==>
        $(target).append(
            '<div class="jCal">'
                +
                ( (opt.ind == 0) ? '<div class="left" />' : '' )
                +
                '<div class="month">'
                  +'<span class="monthYear">' + opt.day.getFullYear() + '</span>'
                  +'<span class="monthName">' + opt.ml[opt.day.getMonth()]
                    +'<input type = "hidden"  id ="monthName" value = "' + opt.day.getMonth() + '"/>'
                  +'</span>&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;'
                +'</div>'
                +
                ( (opt.ind == ( opt.showMonths - 1 )) ? '<div class="right" />' : '' ) +
            '</div>');
        //头部共选择的年，月的结构生成 结束<===
        // 是否可选择月份,实例中已开启
        if (opt.monthSelect) {
            $(target).find('.jCal .monthName, .jCal .monthYear')
                .bind('mouseover', $.extend({}, opt),
                function (e) {
                    $(this).removeClass('monthYearHover').removeClass('monthNameHover');
                    if ($('.jCalMask', e.data._target).length == 0) $(this).addClass($(this).attr('class') + 'Hover');
                })
                .bind('mouseout', function () {
                    $(this).removeClass('monthYearHover').removeClass('monthNameHover');
                })
                .bind('click', $.extend({}, opt), //第二个参数 扩展jq事件对象的数据
                function (e) {
                    //console.log( e.data );
                    console.log("点击控制栏-选择年、月");
                    $('.jCalMo .monthSelector, .jCalMo .monthSelectorShadow').remove();
                    var $this = $(this);
                    var _offset = $this.offset();
                    var monthName = $this.hasClass('monthName');//判别是选择月份还是年份  命名改成isXX
                    var pad = Math.max(parseInt($this.css('padding-left')), parseInt($this.css('padding-left'))) || 2;     //？重复??
                    //取值有待确定,是初始化的值,还是当前选中的值
                    console.log( e.data.day.getMonth() );
                    if ( monthName ) {
                        console.log( parseInt( $this.find('#monthName').val() ) + 1 );//隐藏存储的当前月份的值(按照Date的方式存储 比实际的小1)
                    }
                    var calcTop = ( ( $this.offset() ).top - ( ( monthName ? e.data.day.getMonth() : 2 ) * ( $this.height() + 0 ) ) );
                    calcTop = calcTop > 0 ? calcTop : 0;
                    var topDiff = ($this.offset()).top - calcTop;
                    //挂历背景遮罩
                    $('<div class="monthSelectorShadow" style="' +
                        'top:' + $(e.data._target).offset().top + 'px; ' +
                        'left:' + $(e.data._target).offset().left + 'px; ' +
                        'width:' + ( $(e.data._target).width() + ( parseInt($(e.data._target).css('paddingLeft')) || 0 ) + ( parseInt($(e.data._target).css('paddingRight')) || 0 ) ) + 'px; ' +
                        'height:' + ( $(e.data._target).height() + ( parseInt($(e.data._target).css('paddingTop')) || 0 ) + ( parseInt($(e.data._target).css('paddingBottom')) || 0 ) ) + 'px;">' +
                        '</div>')
                        .css('opacity', 0.01).appendTo($(this).parent());
                    //挂历选择年、月弹出容器控制 后面有用到 可以存储个本地缓存
                    $('<div class="monthSelector" style="border:1px solid #E6E6E6; ' +    //#E6E6E6
                        'top:' + calcTop + 'px; ' +
                        'left:' + ( ($this.offset()).left ) + 'px; ' +
                        'width:' + ( $this.width() + ( pad * 2 ) - 1) + 'px;">' +
                        '</div>')
                        .css('opacity', 0.88).appendTo($this.parent());
                    //挂历浮动弹出内容控制 开始
                    //是否考虑存储在data中?或者opt中
                    /*日历选择错误3.1bug#435 开始
                     *如果是今年之前,月份可选12个
                     *如果是去年,月份大于当前月,选择年份时,选择范围为去年向前
                     *@zhng,2012-6-4,3.1bug#435<修改1>
                     */
                    var curMonth = 0; //当前选中月份  在这里没有用到
                    var curYear = 0;  //当前选中年份
                    if ( monthName ) { //parseInt vs *1;
                        curMonth = parseInt($this.find('#monthName').val(),10) + 1;
                        curYear =  parseInt($this.siblings("span.monthYear").text(),10);
                    } else {
                        curYear = parseInt($this.text(),10);
                        curMonth = parseInt($this.siblings("span.monthName").find('#monthName').val(),10) + 1;
                    }
                    var _date = new Date;
                    var tyear = _date.getFullYear();
                    var _tmonth = _date.getMonth() + 1;
                    var tmonth = tyear > curYear ? 12 : _tmonth;
                    if ( _tmonth < curMonth ) {
                        tyear -= 1;
                    }
                    //日历选择错误3.1bug#435 结束
                    /**
                     * modify huanghui@2012-5-4 JC6v3.1新需求：月份只显示当月之前的月份，年份显示今年以及今年之前的5年
                     * 月份：for循环中0-12改为0-tmonth
                     * 年份：将e.data.day.getFullYear()改为tyear（今年时间）（id和html都要替换）
                     * */
                    //var tmonth = (new Date()).getMonth()+1 ;
                    //var tyear = (new Date()).getFullYear();
                    var di = monthName ? 0 : -4; //初始值5年
                    var dd = monthName ? tmonth : 1;
                    for (; di < dd; di++) { //TODO:禁用的部分是否异常
                        //借用月份的span构建浮动共选择的每个选项 这里很傻的,==>改成拼接好后插入
                        $this.clone().removeClass('monthYearHover').removeClass('monthNameHover').addClass('monthSelect')
                            .attr('id', monthName ? (di + 1) + '_1_' + e.data.day.getFullYear() : (e.data.day.getMonth() + 1) + '_1_' + (tyear + di))
                            //.html( monthName ? e.data.ml[di] : ( e.data.day.getFullYear() + di ) )
                            .html(monthName ? e.data.ml[di] : (tyear + di ))
                            .css('top', ( $this.height() * di )).appendTo($(this).parent().find('.monthSelector'));
                    }
                    ////TODO:如果月份是今年当前月之前呢
                    //var moSel = $this.parent().find('.monthSelector').get(0);
                    var $moSel = $this.parent().find('.monthSelector').eq(0);//浮动选择容器
                    var diffOff = $moSel.height() - ( $moSel.height() - topDiff );
                    /*
                    $(moSel)
                        //modify huanghui 动画效果报错，将其去掉
                        //.css('clip','rect(' + diffOff + 'px ' + ( $(this).width() + ( pad * 2 ) ) + 'px '+ diffOff + 'px 0px)')
                        .animate({'opacity':.92//,
                            // 	'clip':'rect(0px ' + ( $(this).width() + ( pad * 2 ) ) + 'px ' + $(moSel).height() + 'px 0px)'
                        }, 'fast', function () {
                            $(this).parent().find('.monthSelectorShadow').bind('mouseover click', function () {
                                $(this).parent().find('.monthSelector').remove();
                                $(this).remove();
                            });
                        })
                        .parent().find('.monthSelectorShadow').animate({'opacity':.1}, 'fast');
                    */
                    //modify huanghui 动画效果报错，将其去掉
                    //.css('clip','rect(' + diffOff + 'px ' + ( $(this).width() + ( pad * 2 ) ) + 'px '+ diffOff + 'px 0px)')
                    $moSel.animate({'opacity':.92//,
                        // 	'clip':'rect(0px ' + ( $(this).width() + ( pad * 2 ) ) + 'px ' + $(moSel).height() + 'px 0px)'
                    }, 'fast', function () {
                        $(this).parent().find('.monthSelectorShadow').bind('mouseover click', function () {
                            $(this).parent().find('.monthSelector').remove();
                            $(this).remove();
                        });
                    }).parent().find('.monthSelectorShadow').animate({'opacity':.1}, 'fast');

                    //选择动作回调实现
                    //给年月选择栏绑定的点击事件中传入事件对象的数据,opt,也就是插件初始化时的数据
                    //opt--> e.data
                    $('.jCalMo .monthSelect', e.data._target).bind('mouseover mouseout click', $.extend({}, e.data),
                        function (e) {
                            if (e.type == 'click') {
                                //数据经过了自定义的格式化,重新赋值day变量时反编译
                                //TODO:id是否赋值错误?是否有其他的作用?
                                console.log( '//数据经过了自定义的格式化,重新赋值day变量时反编译' );
                                console.log( $(this).attr("id") );
                                //重新初始化了挂历 开始
                                $(e.data._target).jCal(
                                    $.extend(
                                        e.data,
                                        {
                                            day:new Date( $(this).attr('id').replace(/_/g, '/'))  //new Date("4/6/2012");  月/日/年
                                        }
                                    )
                                );
                                //重新初始化了挂历 结束
                                /*---------------点击选择月份或者年份-------------------*/
                                var $con = $("div#calOne");
                                var $jCal = $con.find("div.jCalMo");
                                $con.css("height", $jCal.height());
                                if (new Date().getMonth() != e.data.day.getMonth()) { //不是当月
                                    $(".invday").addClass("day");
                                    $(".invday").removeClass("invday");
                                }
                                //outerInterface()
                                /*
                                 * @2012-4-5 如果不是当前年份，去掉invday当天的样式。
                                 * @2012-4-5 去掉原来所有的选中样式
                                 * added by huanghui@2012-4-1 当点击月份或者年份的时候，日历的样式进行相应的交互变化。
                                 * ***/
                                if (new Date().getFullYear() != e.data.day.getFullYear()) {
                                    $(".invday").addClass("day");
                                    $(".invday").removeClass("invday");
                                }
                                $(".day").removeClass("selectedDay").removeClass('selectedScheduleDay');
                                $(".invday").removeClass('selectedCurDay').removeClass("selectedScheduleDay");
                                var year = parseInt($('span.monthYear').eq(0).text(),10);
                                var mouth = parseInt($("#monthName").val(),10) +1;
                                outerInterface(year, mouth);
                                //added end
                                /*----------------------------------*/
                            } else {//鼠标移入移出事 改变选项的背景色
                                $(this).toggleClass('monthSelectHover');
                            }

                        });
                });
        }
        //左右滑动切换挂历月份<左>
        $(target).find('.jCal .left').bind('click', $.extend({}, opt),
            function (e) {
                if ($('.jCalMask', e.data._target).length > 0) return false;
                var mD = { w:0, h:0 };
                $('.jCalMo', e.data._target).each(function () {
                    mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right'));
                    var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
                    mD.h = ((cH > mD.h) ? cH : mD.h);
                });
                $(e.data._target).prepend('<div class="jCalMo"></div>');
                e.data.day = new Date($('div[id*=' + e.data.cID + 'd_]:first', e.data._target).attr('id').replace(e.data.cID + 'd_', '').replace(/_/g, '/'));
                e.data.day.setDate(1);
                e.data.day.setMonth(e.data.day.getMonth() - 1);
                drawCalControl($('.jCalMo:first', e.data._target), e.data);
                drawCal($('.jCalMo:first', e.data._target), e.data);
                if (e.data.showMonths > 1) {
                    $('.right', e.data._target).clone(true).appendTo($('.jCalMo:eq(1) .jCal', e.data._target));
                    $('.left:last, .right:last', e.data._target).remove();
                }
                $(e.data._target).append('<div class="jCalSpace" style="width:' + mD.w + 'px; height:' + mD.h + 'px;"></div>');
                $('.jCalMo', e.data._target).wrapAll(
                    '<div class="jCalMask" style="clip:rect(0px ' + mD.w + 'px ' + mD.h + 'px 0px); width:' + ( mD.w + ( mD.w / e.data.showMonths ) ) + 'px; height:' + mD.h + 'px;">' +
                        '<div class="jCalMove"></div>' +
                        '</div>');
                $('.jCalMove', e.data._target).css('margin-left', ( ( mD.w / e.data.showMonths ) * -1 ) + 'px').css('opacity', 0.5).animate({ marginLeft:'0px' }, 'fast',
                    function () {
                        $(this).children('.jCalMo:not(:last)').appendTo($(e.data._target));
                        $('.jCalSpace, .jCalMask', e.data._target).empty().remove();
                        if ($(e.data._target).data('day'))
                            reSelectDates(e.data._target, $(e.data._target).data('day'), $(e.data._target).data('days'), e.data);
                        /*---------------点击向左翻月-------------------*/
                        var $con = $("div#calOne");
                        var $jCal = $con.find("div.jCalMo");
                        $con.css("height", $jCal.height());
                        if (new Date().getMonth() != e.data.day.getMonth()) {
                            $(".invday").addClass("day");
                            $(".invday").removeClass("invday");
                        }
                        //added by huanghui@2012-4-5 去掉原来的选中样式
                        $(".day").removeClass("selectedDay").removeClass('selectedScheduleDay');
                        $(".invday").removeClass('selectedCurDay').removeClass("selectedScheduleDay");
                        //added by huanghui@2012-4-1 	点击向左翻月，样式修改
                        //outerInterface();
                        var year = $($('span.monthYear')[0]).text();
                        var mouth = $("#monthName").val();
                        mouth = parseInt(mouth.toString()) + 1;
                        outerInterface(year, mouth);
                        //end

                        /*----------------------------------*/
                    });
            });
        //左右滑动切换挂历月份<右>
        $(target).find('.jCal .right').bind('click', $.extend({}, opt),
            function (e) {
                //@zhng,2012-6-4,3.1bug#435<修改2>
                //如果当前挂历日期为今年本月 则不响应往后翻月的事件 开始
                var $monthCon = $(this).prev("div.month");
                var _selectYear = parseInt( $monthCon.find(">span.monthYear").text(), 10);//选中年
                var _selectMonth = parseInt($monthCon.find("#monthName").val(),10);//选中月
                var _date = new Date;
                var _curMonth = _date.getMonth();//+ 1;_selectMonth; 存储的时date中的方式,比及时的小1
                var _curYear = _date.getFullYear();
                if ( _curMonth === _selectMonth && _curYear === _selectYear ) {
                    //console.log("k.o");
                    return;
                } else {
                    //console.log( "continue" );
                }
                //如果当前挂历日期为今年本月 则不响应往后翻月的事件 结束
                if ($('.jCalMask', e.data._target).length > 0) return false;
                var mD = { w:0, h:0 };
                $('.jCalMo', e.data._target).each(function () {
                    mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right'));
                    var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
                    mD.h = ((cH > mD.h) ? cH : mD.h);
                });
                $(e.data._target).append('<div class="jCalMo"></div>');
                e.data.day = new Date($('div[id^=' + e.data.cID + 'd_]:last', e.data._target).attr('id').replace(e.data.cID + 'd_', '').replace(/_/g, '/'));
                e.data.day.setDate(1);
                e.data.day.setMonth(e.data.day.getMonth() + 1);
                console.log("------------------");
                console.dir( e.data.day );
                console.log("==================");
                drawCalControl($('.jCalMo:last', e.data._target), e.data);
                drawCal($('.jCalMo:last', e.data._target), e.data);
                if (e.data.showMonths > 1) {
                    $('.left', e.data._target).clone(true).prependTo($('.jCalMo:eq(1) .jCal', e.data._target));
                    $('.left:first, .right:first', e.data._target).remove();
                }
                $(e.data._target).append('<div class="jCalSpace" style="width:' + mD.w + 'px; height:' + mD.h + 'px;"></div>');
                $('.jCalMo', e.data._target).wrapAll(
                    '<div class="jCalMask" style="clip:rect(0px ' + mD.w + 'px ' + mD.h + 'px 0px); width:' + ( mD.w + ( mD.w / e.data.showMonths ) ) + 'px; height:' + mD.h + 'px;">' +
                        '<div class="jCalMove"></div>' +
                        '</div>');
                $('.jCalMove', e.data._target).css('opacity', 0.5).animate({ marginLeft:( ( mD.w / e.data.showMonths ) * -1 ) + 'px' }, 'fast',
                    function () {
                        $(this).children('.jCalMo:not(:first)').appendTo($(e.data._target));
                        $('.jCalSpace, .jCalMask', e.data._target).empty().remove();
                        if ($(e.data._target).data('day'))
                            reSelectDates(e.data._target, $(e.data._target).data('day'), $(e.data._target).data('days'), e.data);
                        $(this).children('.jCalMo:not(:first)').removeClass('');

                        /*-----------------点击向右翻月-----------------*/
                        var $con = $("div#calOne");
                        var $jCal = $con.find("div.jCalMo");
                        $con.css("height", $jCal.height());
                        if (new Date().getMonth() != e.data.day.getMonth()) {
                            $(".invday").addClass("day");
                            $(".invday").removeClass("invday");
                        }
                        //added by huanghui@2012-4-5 去掉原来的选中样式
                        $(".day").removeClass("selectedDay").removeClass('selectedScheduleDay');
                        $(".invday").removeClass('selectedCurDay').removeClass("selectedScheduleDay");
                        //added by huanghui@2012-4-1 点击向右翻月，样式修改
                        //outerInterface();
                        var year = $($('span.monthYear')[0]).text();
                        var mouth = $("#monthName").val();
                        mouth = parseInt(mouth.toString()) + 1;
                        outerInterface(year, mouth);
                        //end
                        /*----------------------------------*/
                    });
            });
        //设定头部月份容器宽度
        $('.jCal', target).each(
            function () {
                var width = $(this).parent().width() - ( $('.left', this).width() || 0 ) - ( $('.right', this).width() || 0 );
                $('.month', this).css({'width':width}).find('.monthName, .monthYear').css('width', ((width / 2) - 20 ));
            });
        //TODO:未进行....
        $(window).load(
            function () {
                $('.jCal', target).each(
                    function () {
                        var width = $(this).parent().width() - ( $('.left', this).width() || 0 ) - ( $('.right', this).width() || 0 );
                        $('.month', this).css({'width':width}).find('.monthName, .monthYear').css('width', ((width / 2) - 20));
                        /*----------------页面加载------------------*/
                        //added by huanghui@2012-4-1 页面加载，样式加载
                        //outerInterface()
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = (date.getMonth() + 1);
                        outerInterface(year, month);
                        //added end
                        /*----------------------------------*/
                    });
            });
    }

    ;

    function reSelectDates(target, day, days, opt) {
        var fDay = new Date(day.getTime());
        var sDay = new Date(day.getTime());
        for (var fC = false, di = 0, dC = days; di < dC; di++) {
            var dF = $(target).find('div[id*=d_' + (sDay.getMonth() + 1) + '_' + sDay.getDate() + '_' + sDay.getFullYear() + ']');
            if (dF.length > 0) {
                dF.stop().addClass('selectedDay');
                fC = true;
            }
            sDay.setDate(sDay.getDate() + 1);
        }
        if (fC && typeof opt.callback == 'function') opt.callback(day, days);
    }

    ;
    /**
     *
     * @param target $(div.jCalMo)
     * @param opt 参数
     */
    function drawCal(target, opt) {
        //opt.day yy年mm月1日
        //生成挂历星期头
        var $target = $(target);
        var _dows = '', ds = 0, length = opt.dow.length ;
        for (; ds < length; ds++) {
            _dows +='<div class="dow">' + opt.dow[ds] + '</div>';
        }
        $(target).append(_dows);

        var fd = new Date(new Date(opt.day.getTime()).setDate(1));//当月初
        var ldlm = new Date(new Date(fd.getTime()).setDate(0));//前月末
        var ld = new Date(new Date(new Date(fd.getTime()).setMonth(fd.getMonth() + 1)).setDate(0)); //当月末

        var copt = {
            fd:fd.getDay(),//当月开始日<第一天>星期几
            lld:ldlm.getDate(),//前月天数
            ld:ld.getDate(),//当月天数
            fld: ld.getDay()//当月末星期几
        };
        var offsetDayStart = ( ( copt.fd < opt.dayOffset ) ? ( opt.dayOffset - 7 ) : 1 );//月初
        var offsetDayEnd = ( ( copt.fld < opt.dayOffset ) ? ( 7 - copt.fld ) : copt.fld );//月末日星期数
//        console.log( "aaa" );
//        console.log( "//当月开始日<第一天>星期几: " + copt.fd );
//        console.log( "//当月天数: " + copt.ld );
//        console.log( offsetDayStart );
//        console.log( offsetDayEnd );
//        console.log( "bbb" );
        var _days = "";
        for (var d = offsetDayStart, dE = ( copt.fd + copt.ld + ( 7 - offsetDayEnd ) ); d < dE; d++) {
            //1.检查是否当前
            //2.检查是否有效
//            console.log("//无效日期(当前月、下月)");
//            console.log( d );
//            console.log( "当月开始日星期:" + copt.fd );
//            console.log("当月天数:" + copt.ld );
//            console.log( "opt.dayOffset: " + opt.dayOffset );
//            console.log( d > ( ( copt.fd - opt.dayOffset ) + copt.ld ) );
//            console.log("1:" + ( copt.lld - ( ( copt.fd - opt.dayOffset ) - d ) ) );
//            console.log("2:" + ( d - ( ( copt.fd - opt.dayOffset ) + copt.ld ) ));
//            console.log( "3：" + ( d - ( copt.fd - opt.dayOffset ) ) );
            _days +=
                (
                  ( d <= ( copt.fd - opt.dayOffset ) ) ?
                    '<div id="' + opt.cID + 'd' + d + '" class="pday">' + ( copt.lld - ( ( copt.fd - opt.dayOffset ) - d ) ) + '</div>'//上月日期
                    : (
                        ( d > ( ( copt.fd - opt.dayOffset ) + copt.ld ) ) ?
                            //无效日期(当前月、下月)
                            '<div id="' + opt.cID + 'd' + d + '" class="aday">' + ( d - ( ( copt.fd - opt.dayOffset ) + copt.ld ) ) + '</div>'
                            //有效日期 当前日(invday)
                          : '<div id="' + opt.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - ( copt.fd - opt.dayOffset ) ) + '_' + fd.getFullYear() + '" class="' +
                    ( ( opt.dCheck(new Date((new Date(fd.getTime())).setDate(d - ( copt.fd - opt.dayOffset )))) ) ? 'day' : 'invday' ) +
                    '">' + ( d - ( copt.fd - opt.dayOffset ) ) + '</div>'
                    )
                    )
            ;
        }
//        console.log("*********************");
//        console.log( _days );
//        console.log("1111111111111111111111111");
        $target.append( _days );
        //拼接结构结束
        $target.find('div[id^=' + opt.cID + 'd]:first, div[id^=' + opt.cID + 'd]:nth-child(7n+2)')
            .before('<br style="clear:both; font-size:0.1em;" class="jcalBr" />');
        //构建凭借换行<br/>

        //事件绑定开始
        //给非当天绑定事件
        $target.find('div[id^=' + opt.cID + 'd_]:not(.invday)').bind("mouseover mouseout click", $.extend({}, opt),
            function (e) {
                if ($('.jCalMask', e.data._target).length > 0) {//存在遮罩时不响应
                    return false;
                }
                //格式化当前选中单元格为日期对象
                var osDate = new Date($(this).attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3'));

                if (e.data.forceWeek) { //初始为假 作用未知
                    osDate.setDate(osDate.getDate() + (e.data.dayOffset - osDate.getDay()));
                }
                //?生成当前选择单元日期对象
                var sDate = new Date(osDate.getTime());

                if (e.type == 'click') {
//                    console.log( $(this).attr( "id" ) );
//                    console.log( "osDate: " + osDate );
//                    console.log( "abba" );
//                    console.log( e.data.forceWeek );
                    //上下文查找
                    $('div[id*=d_]', e.data._target).stop()
                        .removeClass('selectedDay')
                        .removeClass('overDay')
                        .css('backgroundColor', '');
                }
                for (var di = 0, ds = $(e.data._target).data('days'); di < ds; di++) {
                    var currDay = $(e.data._target).find('#' + e.data.cID + 'd_' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear());
                    if (currDay.length == 0 || $(currDay).hasClass('invday')) break;
                    //modyfy huanghui $(currDay)为选中状态'selectedDay'或者'hasDiaryDay'时不是'overDay'状态 modify huanghui@2012-5-4 加入‘aday’（新需求，今天之后的日期不可选，也没有鼠标移入移出效果）
                    var classNames = $(currDay).attr('className');
                    if (
                            ( classNames.indexOf('hasDiaryDay') ) == -1
                         && ( classNames.indexOf('selectedDay') ) == -1
                         && ( classNames.indexOf('schedule') ) == -1
                         && ( classNames.indexOf('unwriteDay') ) == -1
                         && ( classNames.indexOf('aday') ) == -1 ) {
                        if (e.type == 'mouseover') {
                            $(currDay).addClass('overDay');
                        } else if (e.type == 'mouseout') {
                            $(currDay).stop().removeClass('overDay').css('backgroundColor', '');
                        }
                    }
                    if (e.type == 'click') {
                        $(currDay).stop().addClass('selectedDay');
                    }
                    sDate.setDate(sDate.getDate() + 1);
                }

                if (e.type == 'click') {
                    e.data.day = osDate;
                    e.data.callback(osDate, di);
                    $(e.data._target).data('day', e.data.day).data('days', di);  //?di
                }
            });
    }

    ;
})(jQuery);
/*获取当前时间*/
function nowdatetime(){
    var _d = new Date();
    var Y = _d.getFullYear();
    var M = _d.getMonth() + 1;
    var D = _d.getDate();
    M = (M<10)?("0"+M):M;
    D = (D<10)?("0"+D):D;
    return Y+"-"+M+"-"+D;
}
/*
 在每个日期前面加一个标志位，标志位的具体含义如下：
 0：无日程   1: 有日程   2：无日记   3：有日记  4：需要补记提醒
 */
//@param：schedule日程时间数组
function schedule(sche){
    /*var schedule=new Array("12011-08-07 10:01:32","02011-07-06 11:20:28","12011-10-06 11:20:28","02011-09-06 11:20:28","12011-11-06 11:20:28");	*/
    var cymd = nowdatetime();/*获取当前时间:2011-09-23*/
    for(var x in sche){
        var eNow = (sche[x]+"").substring(1,11);
        var flag = checkFlag(sche[x]);
        if(flag==1){
            var $target = $("#"+checkFormat(sche[x]));
            var cNames = $target.get(0).className;
            if(eNow==cymd){
                $target.removeClass("schedule");
                $target.addClass("invdaySchedule");
            }else{
                $target.removeClass('selectedDay')
                $target.addClass("schedule");
                if(cNames.indexOf('hasDiaryDay')!=-1 &&cNames.indexOf('selectedDay')!=-1 ){
                    $target.addClass('selectedScheduleDay');
                }
            }
        }
    }
}

//@param：diary日记时间数组
function diary(myDiary){
    /*var diary=new Array("32011-08-07 10:01:32","32011-07-06 11:20:28","22011-10-06 11:20:28","32011-09-06 11:20:28","32011-11-06 11:20:28");*/
    for(var x in myDiary){
        var flag = checkFlag(myDiary[x]);
        if(flag==3){
            $("#"+checkFormat(myDiary[x])).removeClass("nomarl");
            $("#"+checkFormat(myDiary[x])).addClass("hasDiaryDay");
        }
    }
}
//需要补记日记提醒样式的添加
function unwrite(unwriteDiary){
    for(var x in unwriteDiary){
        var flag = checkFlag(unwriteDiary[x]);
        if(flag==4){
            $("#"+checkFormat(unwriteDiary[x])).removeClass("nomarl");
            $("#"+checkFormat(unwriteDiary[x])).addClass("unwriteDay");
        }
    }
}

function todayDiary(){
//    console.log($('#calOne').html());
//    console.log("aaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
    //added by huanghui@2012-3-31 我的日记进入时今天应为选中状态
    var $invaday = $('.invday');
    if($invaday.size()!=0){
        var _today = $invaday[0];
        $(_today).addClass('selectedCurDay');
        /*
         * added by huanghui@2012-5-4 JC6v3.1新需求
         * 今天之后的日期都灰置不可选，将‘day’改为‘aday’
         * 今天之后的右翻页鼠标为一般状态，并且删除click事件。
         * */
         //$("div.invday:first").nextAll('div').removeClass('day').addClass("aday");
        /**
         *如果为本年、本月 则这么处理
         *如果年份或者月份在今年本月前,需要额外处理,暂时只开启本月
         */
        $invaday.eq(0).nextAll('div').removeClass('day').addClass("aday");

        var $right = $("div.jCal>div.right");
        if($right.size()!=0){
            //@zhng,2012-6-4,3.1bug#435<修改3>
            $right.css('cursor','default');
            //$right.css('cursor','not-allowed');
            //在向后选择挂历时,进行了判断,是否可点击,解绑后,在切换后向后的时候,会出现没有事件回到的问题//$right.unbind('click');
        }
    }
    /**
     * added by  huanghui@2012-5-4 JC6v3.1新需求
     * 周末日历与工作日不相同，设置灰色，但可选
     * */
    var $br = $("br.jcalBr");
    $($br).each(function(){
        var $this = $(this);
        var $next = $this.next('div.day');
        if($next.size()!=0){
            $next.css('color','#ccc');
            $this.prev('div.day').css('color','#ccc');
        }
    });
    var $last = $('div.jCalMo>div:last-child');
    if($last.size()!=0){
        if($last.hasClass('day')){
            $last.css('color','#ccc');
        }
    }
    //added end
}

//获取标志位
function checkFlag(strDay){
    strDay = strDay+"";
    if(strDay != null && strDay != "" &&strDay !=undefined){
        return strDay.substring(0,1);
    }else{
        return null;
    }
}
//将时间拼成'c1d_8_12_2011'这种形式,去匹配每个日期的div
function checkFormat(strDay){
    strDay = strDay+"";
    if(strDay != null && strDay != "" &&strDay !=undefined){
        var year =strDay.substring(1,5);
        var month =strDay.substring(6,8);
        if(month.substring(0,1)==0){
            month = month.substring(1,2);
        }
        var day =strDay.substring(9,11);
        if(day.substring(0,1)==0){
            day = day.substring(1,2);
        }
        return "c1d_" +month+"_"+day+"_"+year;
    }else{
        return null;
    }
}

/**
 * 点击“前一天”或者“后一天”时，左边日历控件进行相应的样式变化。
 * 1、getPreOrNextDate(diaryDate,dayFlag):通过时间“2012-04-08”以及dayFlay前一天后者后一天，来得到前一天后有一天的时间。
 * 2、changeToDate(diaryDate)：根据上一步时间“2012-04-09” 转化为'c1d_4_9_2012'这种形式,去匹配每个日期的div的id。
 * 3、 changeToSelected(day)：找到左边iframe里面的id=“c1d_4_9_2012”的div，进行样式控制。
 * 1和2有多个页面需要用到，放到ui-custom.js里面，3必须写在各自的页面。
 * added by huanghui@2012-4-24
 **/
//得到前一天 或有一天 2012-04-09  2012-04-08
function getPreOrNextDate(diaryDate,dayFlag){
    //var diaryDate = "2011-01-01";
    var arrDate = diaryDate.split('-');
    var ayear = arrDate[0];
    var amonth = arrDate[1];
    var aday = arrDate[2];
    if(amonth.indexOf('0')===0){
        amonth = amonth.substring(1,2);
    }
    amonth = parseInt(amonth) -1 ;//月份是0-11
    if(aday.indexOf('0')===0){
        aday = aday.substring(1,2);
    }
    var uom = new Date(ayear,amonth,aday);
    if(dayFlag === 'pre'){
        uom.setDate(uom.getDate()-1);//取得系统时间的前一天,重点在这里,负数是前几天,正数是后几天
    }else if(dayFlag === 'next'){
        uom.setDate(uom.getDate()+1);//取得系统时间的后一天,重点在这里,负数是前几天,正数是后几天
    }
    var prem=uom.getMonth();
    prem++;
    var lastm=prem>= 10?prem:("0"+prem)
    var lastd=uom.getDate();
    var lastd=lastd >= 10?lastd:("0"+lastd)
    uom = uom.getFullYear() + "-" + lastm + "-" + lastd;//得到最终结果
    return uom;
}

//将'2012-04-09'时间改成拼成'c1d_4_9_2012'这种形式,去匹配每个日期的div的id
function changeToDate(strDay){
    strDay = strDay + "";
    if(strDay != null && strDay != "" &&strDay !=undefined){
        var arrDay = strDay.split('-');
        var year = arrDay[0];
        var month = arrDay[1];
        var day = arrDay[2];
        if(month.indexOf("0")==0){
            month = month.substring(1,2);
        }
        if(day.indexOf("0")==0){
            day = day.substring(1,2);
        }
        var divId = "c1d_"+month+"_"+day+"_"+year;
        return divId;
    }else{
        return null;
    }
}
/**added by huanghui@2012-4-24  end**/
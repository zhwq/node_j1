// animate slides
/**
 * 滑动动画
 * @param direction 方向
 * @param effect    效果，可选值:
 * @param clicked
 * animate('next', effect);
 * effect 配置 effect: 'slide', // 字符串 上下翻页或者指定显示帧时的动画效果 e.g. 'slide, fade' or simply 'fade' for both
 */
function animate(direction, effect, clicked) {
    if (!active && loaded) { //未激活、资源已就绪
        active = true;//变更激活状体
        // start of animation  动画开始
        option.animationStart(current + 1);
        //根据动画方向 更新配置参数
        switch(direction) {
            case 'next': //下一个
                // change current slide to previous
                prev = current;
                // get next from current + 1
                next = current + 1;
                // if last slide, set next to first slide
                next = total === next ? 0 : next;
                // set position of next slide to right of previous
                position = width*2;
                // distance to slide based on width of slides
                direction = -width*2;
                // store new current slide
                current = next;
                break;
            case 'prev': //上一个
                // change current slide to previous
                prev = current;
                // get next from current - 1
                next = current - 1;
                // if first slide, set next to last slide
                next = next === -1 ? total-1 : next;
                // set position of next slide to left of previous
                position = 0;
                // distance to slide based on width of slides
                direction = 0;
                // store new current slide
                current = next;
                break;
            case 'pagination': //选定某个
                // get next from pagination item clicked, convert to number
                next = parseInt(clicked,10);
                // get previous from pagination item with class of current
                prev = $('.' + option.paginationClass + ' li.'+ option.currentClass +' a', elem).attr('href').match('[^#/]+$');
                // if next is greater then previous set position of next slide to right of previous
                if (next > prev) {
                    position = width*2;
                    direction = -width*2;
                } else {
                    // if next is less then previous set position of next slide to left of previous
                    position = 0;
                    direction = 0;
                }
                // store new current slide
                current = next;
                break;
        }
        console.log(">>___effect");
        // fade animation  淡出效果
        if (effect === 'fade') {//淡出效果#1
            // fade animation with crossfade
            if (option.crossfade) {
                // put hidden next above current
                control.children(':eq('+ next +')', elem).css({
                    zIndex: 10
                    // fade in next
                }).fadeIn(option.fadeSpeed, option.fadeEasing, function(){
                        if (option.autoHeight) {
                            // animate container to height of next
                            control.animate({
                                height: control.children(':eq('+ next +')', elem).outerHeight()
                            }, option.autoHeightSpeed, function(){
                                // hide previous
                                control.children(':eq('+ prev +')', elem).css({
                                    display: 'none',
                                    zIndex: 0
                                });
                                // reset z index
                                control.children(':eq('+ next +')', elem).css({
                                    zIndex: 0
                                });
                                // end of animation
                                option.animationComplete(next + 1);
                                active = false;
                            });
                        } else {
                            // hide previous
                            control.children(':eq('+ prev +')', elem).css({
                                display: 'none',
                                zIndex: 0
                            });
                            // reset zindex
                            control.children(':eq('+ next +')', elem).css({
                                zIndex: 0
                            });
                            // end of animation
                            option.animationComplete(next + 1);
                            active = false;
                        }
                    });
            } else {
                // fade animation with no crossfade
                control.children(':eq('+ prev +')', elem).fadeOut(option.fadeSpeed,  option.fadeEasing, function(){
                    // animate to new height
                    if (option.autoHeight) {
                        control.animate({
                                // animate container to height of next
                                height: control.children(':eq('+ next +')', elem).outerHeight()
                            }, option.autoHeightSpeed,
                            // fade in next slide
                            function(){
                                control.children(':eq('+ next +')', elem).fadeIn(option.fadeSpeed, option.fadeEasing);
                            });
                    } else {
                        // if fixed height
                        control.children(':eq('+ next +')', elem).fadeIn(option.fadeSpeed, option.fadeEasing, function(){
                            // fix font rendering in ie, lame
                            if($.browser.msie) {
                                $(this).get(0).style.removeAttribute('filter');
                            }
                        });
                    }
                    // end of animation
                    option.animationComplete(next + 1);
                    active = false;
                });
            }
            // slide animation
        } else { //滑动幻灯动画#2
            // move next slide to right of previous
            console.log( ">>滑动幻灯动画#2" );
            control.children(':eq('+ next +')').css({
                left: position,
                display: 'block'
            });
            // animate to new height
            if (option.autoHeight) {
                control.animate({
                    left: direction,
                    height: control.children(':eq('+ next +')').outerHeight()
                },option.slideSpeed, option.slideEasing, function(){
                    control.css({
                        left: -width
                    });
                    control.children(':eq('+ next +')').css({
                        left: width,
                        zIndex: 5
                    });
                    // reset previous slide
                    control.children(':eq('+ prev +')').css({
                        left: width,
                        display: 'none',
                        zIndex: 0
                    });
                    // end of animation
                    option.animationComplete(next + 1);
                    active = false;
                });
                // if fixed height
            } else {
                // animate control
                control.animate({
                    left: direction
                },option.slideSpeed, option.slideEasing, function(){
                    // after animation reset control position
                    control.css({
                        left: -width
                    });
                    // reset and show next
                    control.children(':eq('+ next +')').css({
                        left: width,
                        zIndex: 5
                    });
                    // reset previous slide
                    control.children(':eq('+ prev +')').css({
                        left: width,
                        display: 'none',
                        zIndex: 0
                    });
                    // end of animation
                    option.animationComplete(next + 1);
                    active = false;
                });
            }
        }
        // set current state for pagination
        if (option.pagination) {
            // remove current class from all
            $('.'+ option.paginationClass +' li.' + option.currentClass, elem).removeClass(option.currentClass);
            // add current class to next
            $('.' + option.paginationClass + ' li:eq('+ next +')', elem).addClass(option.currentClass);
        }
    }
} // end animate function

var option = {};
//效果：默认slide,可选 slide fade;slide, fade;fade;
option.effect = "slide";
effect = option.effect.indexOf(',') < 0 ? option.effect : option.effect.replace(' ', '').split(',')[0];
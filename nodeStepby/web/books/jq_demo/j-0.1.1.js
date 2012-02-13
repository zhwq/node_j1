( function( window, undefined ) {
//j是一个匿名函数的返回值
var j = ( function() {
    //匿名函数中的j函数的返回值赋予的变量同名,此时内部覆盖外部的(初始值为undefined)
    var j = ( function( selector, context ) {
        return new j.fn.init( selector, context, rootj );
    })();
    var rootj;
    //primitive object
    j.fn = j.prototype = {
      constructor: j,
      init: function( selector, context, rootj) {

      }
    };
    j.fn.init.prototype = j.fn;
    return "j";
})();
//将闭包中的变量j赋值为全局对象window
window.j = window.$ = j;
})( window );
/*!
* analyse the structure of jquery-1.5.2.js
* version: 0.1
* */
( function( window, undefined ) {
//j是一个匿名函数的返回值
var j = ( function() {
    //匿名函数中的j函数的返回值赋予的变量同名,此时内部覆盖外部的(初始值为undefined)
    var j = ( function( selector, context ) {//js 运行时,解析后最终的结果;//printArray([]);//??
        return new j.fn.init( selector, context, rootj );
    })();
    var rootj;
    //primitive object
    j.fn = j.prototype = {
      constructor: j,
      init: function( selector, context, rootj) {
          return "zhangwq";
        //return this;
      }
    };
    j.fn.init.prototype = j.fn;
    return j;
})();
//将闭包中的变量j赋值为全局对象window
window.j = window.$ = j;
})( window );

function printArray( arr ) {
    for ( var i=0; i<arr.length; i++) {
        console.log(arr[i]);
    }
};
printArray( [ 1, 2, 4 ]);
//jQuery是一个匿名方法的返回值
var j = ( function() {
    var j = function() {
        return new j.fn.init("zhangwq-pseudo jquery fragment");
    };
    j.fn= j.prototype = {
        constructor: j,
        init: function( selector, context ) {
            //handle null;"";undefined
            if ( !selector ) {
                return this;
            }
            //handle DOMElement
            if ( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }
            //body
            if ( selector === "body" && !context && document.body ) {
                this.context = document;
                this[0] = document.body;
                this.selector = "body";
                this.length = 1;
                return this;
            }
            //string
            if ( typeof selector === "string" ) {
                //只处理#id

            }
            return this;
        }
    };
    j.fn.init.prototype = j.prototype;
    return j;
} )();
//j是函数的返回值
var j = (function(){
    return "zhangwq";
})();
alert(j);

//添加参数rootj


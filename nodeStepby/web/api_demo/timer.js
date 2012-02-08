//延时、周期函数
//回调方法的参数arguments是一个伪数据对象
var timeId;
//立即执行
console.log("exec immediately");
setTimeout(callback1,2000,"param1",["param21","param22"]);
setTimeout(callback2,3000,"param1");
function callback1(){
//    console.log(arguments); {"0":"param1","1":["param21","param22"]}
    var param1 = arguments["0"];
    var param2 = arguments["1"];
    console.log("param1:"+param1);
    console.log("begin to iterate the second param");
    for(var i=0;i<param2.length;i++){
        console.log(param2[i]);
    }
};
function callback2(){
    console.log(arguments[0]);
}
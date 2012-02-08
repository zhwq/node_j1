//使用自定义的服务器模块
var server = require("./server");
//注入路由模块
var router = require("./router");

var requestHandlers = require("./requestHandlers");
var handle = {};//handle vs handler
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
//扩展添加参数handle
server.exprotFn(router.route,handle);
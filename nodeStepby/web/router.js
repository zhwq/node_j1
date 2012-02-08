//路由模块
function route(handle,pathname) {
	console.log("About to route a request for "+ pathname);
	if( typeof handle[pathname] === "function"){
		return handle[pathname]();	
	}else{
		console.log("No handler found for request " + pathname);	
		//console.log("No request handler found for " + pathname);
		return "404, NOT FOUND";
	}
};
exports.route = route;
//使用依赖注入的方式较松散地添加路由模块
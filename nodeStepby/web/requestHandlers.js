function start() {
	console.log("request handlers map-start");	
	//实现1
	sleep(10000);
	return "hello,start";
};
function upload() {
	console.log("request handlers map-upload");		
	return "hello,upload";
};
//hack1 暂停一段时间;//长时间的操作
function sleep(millisecond) {
	var startTime = new Date().getTime();
	while(new Date().getTime() < startTime + millisecond);	
}
exports.start = start; 
exports.upload = upload;
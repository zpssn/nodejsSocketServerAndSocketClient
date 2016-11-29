var express = require('express');
var router = express.Router();
var Server = require('socket.io');
var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;
var socketClientLists = {};//socket连接列表
var bodyParser = require('body-parser');
router.use(bodyParser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
router.use(bodyParser.urlencoded({  extended: true}))
// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        var rdt = data;
        var srdt = rdt.toString();
        var ordt = JSON.parse(srdt);

        socketLogin(ordt.SN,sock);//记录列表

        if(socketClientLists[ordt.SN]){
					sock.write('{"type":1,"sta":1}');
				}else
					sock.write("replay");
        console.log('DATA ' + sock.remoteAddress + ': '+srdt);

    });
    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT);

console.log('Server listening on ' + HOST +':'+ PORT);
/* GET home page. */
var message = {
  "type":"123",
  "SN":"12345",
  "heart_beat":"heart_beat"
}

//socket登陆处理
function socketLogin(id,connection){
	//  {"type":"login","id":"100"}
	//console.log(replay);
	var accObj = socketClientLists[id];
	if ( accObj ){
	//	accObj['id']=id;
		accObj['connection'] = connection;

	}else{
		socketClientLists[id] = {};
		socketClientLists[id]['id'] = id;
		socketClientLists[id]['connection'] = connection;
		socketClientLists[id]['client'] = new Array();//todo 采用数据库保存读取绑定客户端列表
	}

}

router.get('/', function(req, res, next) {

      if(socketClientLists['12345']){//判断12345是否在列表中
        if(socketClientLists['12345']['connection'].writable){//是否在线
          socketClientLists['12345']['connection'].write(JSON.stringify(message));
          res.send(200); //发送正常
          return;
        }else{
          res.send('{"rc":8}');//设备不在线（曾连接后断开）
          return;
        }
      }
});
process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack)；
});

module.exports = router;

var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据
    client.write(JSON.stringify(message));

});

// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {
  var rdt = data;
  var srdt = rdt.toString();
  var ordt = JSON.parse(srdt);
  console.log('MY_DATA: ' + ordt.SN);
  if(ordt.SN == "12345")
  {
    console.log('MY_DATA: ' + ordt);
  }else{
    console.log('NOT_MY_DATA: ' + ordt);
  }
    // 完全关闭连接
  //  client.destroy();

});
var message = {
  "type":"123",
  "SN":"12345",
  "heart_beat":"heart_beat"
};
// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');
});

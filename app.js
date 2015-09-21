var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var mProcessor = require('message-processor');

var PORT = 514;
var HOST = 'localhost';
var window = new mProcessor.Window();
var requestList = [];
var express = require('express'),
  config = require('./config/config');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./config/express')(app, config);

// app.listen(config.port, function () {
//   console.log('Express server listening on port ' + config.port);
// });



app.get('/', function(req, res){
  res.sendfile('index.html');
});


io.on('connection',function(socket){
	console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

server.on('listening',function(){
	console.log('Listening for logs');
});

server.on('message',function(message,remote){
	var m = mProcessor.process(message.toString());
	window.put(m);
});
server.bind(PORT,HOST);


setInterval(function(){
	//console.log('Message count: '+window.count());
	var requests = window.process();
	for(var index = 0; index <  requests.length; index++){
		requestList.push(requests[index]);
	}
	//console.log('sending ');
	//console.log(requests);
	io.emit('chat message',JSON.stringify(requests));
	//console.log('Total requests: '+requestList.length);
},1000);
//var m = '<15>[2015-09-19 17:52:32,788] DEBUG -  << "[\r][\n]" {org.apache.synapse.transport.http.wire}';




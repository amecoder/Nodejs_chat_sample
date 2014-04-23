/*
var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, fs = require('fs');


app.listen(8080);

// routing
function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
        	res.writeHead(500);
        	return res.end('Error loading index.html');
       	}
  
       	res.writeHead(200);
       	res.end(data);
    });
}
*/
var app = require('express')()
, http = require('http').createServer(app)
, io = require('socket.io').listen(http);

http.listen(8080);

app.get('/', function(req, res){
//	res.writeHead(200, {'Content-Type': 'text/html'});
	res.sendfile(__dirname + '/index.html');	
});

app.get('/css/bootstrap.min.css', function(req, res){
//	res.writeHead(200, {'Content-Type': 'text/css'});
	res.sendfile(__dirname + '/public/css/bootstrap.min.css');
});

app.get('/css/bootstrap-responsive.min.css', function(req, res){
//	res.writeHead(200, {'Content-Type': 'text/css'});
	res.sendfile(__dirname + '/public/css/bootstrap-responsive.min.css');
});

app.get('/js/bootstrap.min.js', function(req, res){
//	res.writeHead(200, {'Content-Type': 'text/javascript'});
	res.sendfile(__dirname + '/public/js/bootstrap.min.js');
});

app.get('/img/glyphicons-halflings-white.png', function(req, res){
//	res.writeHead(200, {'Content-Type': 'text/javascript'});
	res.sendfile(__dirname + '/public/img/glyphicons-halflings-white.png');
});

app.get('/img/glyphicons-halflings.png', function(req, res){
//	res.writeHead(200, {'Content-Type': 'text/javascript'});
	res.sendfile(__dirname + '/public/img/glyphicons-halflings.png');
});


// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
		console.log(socket.username);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});
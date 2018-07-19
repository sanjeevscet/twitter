module.exports = function(io) {
	io.on('connection', function(socket) {
		console.log("Socket io connected");
		var user = socket.request.user;
		console.log(user.name);

		socket.on('tweet', (data) => {
			io.emit('incomingTweets', {data, user});
			console.log(data);
		})
	})
}
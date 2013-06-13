function game(type, nrPlayers)
{
	this.gameType = type;
	this.nrPlayers = nrPlayers;
	this.playersConnected = 0;
	this.players = new Array();
	this.gameID = null;

	this.toJSON = function()
	{
		var gameJSON = '{ "type" : "' + this.gameType +
			'", "nrPlayers" : "' + this.nrPlayers +
			'", "playersConnected" : "' + this.playersConnected +
			'", "players" : [';
		for (var i = 0; i < this.players.length; i++) 
		{
			// TODO SA: create the player class
		} 
		gameJSON += ']';
		gameJSON += '}';
		return gameJSON;
	}
}

function initConnection(game)
{
	var myGame = game;

	socket = io.connect();

	socket.on('connect', function () {
		var gameJSON = myGame.toJSON();
		socket.emit("handshake-game", gameJSON);
	});

	socket.on('game-id', function (gameid) {
		myGame.gameID = gameid;
		console.log(gameid);

		socket.emit('match-player', myGame.gameID, "player");
	});

	socket.on('player-connected', function(player)
	{
		myGame.playersConnected++;
		myGame.players[myGame.playersConnected] = player;
		console.log("Player connected: " + player);
	});
}
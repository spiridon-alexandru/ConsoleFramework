var express = require('express')
 , app = express.createServer()
 , io = require('socket.io').listen(app);

app.use(express.bodyParser());
app.use('/consoleFramework', express.static( __dirname + '/consoleFramework'));
app.listen(8888);

app.get('/', function (req, res) {
  console.log("Get request recieved");
  res.sendfile(__dirname + '/index.html');
});

// a dictionary - matches gameGUIDs with game sockets
var gameSockets = new Array();
// a dictionary - matches gameGUIDs with game objects
var games = new Array();

// a dictionary - matches playerGUIDs with player sockets
var playerSockets = new Array();
// a dictionary - matches playerGUIDs with player objets
var players = new Array();

io.sockets.on('connection', function (socket) {
    socket.on("handshake-game", function (data)
    {
        console.log(data);
        // setup the game object
        var game = eval ("(" + data + ")");
        console.log("handshake with: " + game.type);
        var gameGUID = generateID();
        game.gameID = gameGUID;

        // remember the game object and its associated socket
        gameSockets[gameGUID] = socket;
        games[gameGUID] = game;

        // send the generated game ID to the client game
        socket.emit('game-id', gameGUID);
    });

    socket.on("handshake-player", function (data)
    {
        // setup the game object
        var player = eval ("(" + data + ")");
        console.log("handshake with: " + player.type);
        var playerGUID = generateID();
        player.playerID = playerGUID;

        // remember the player object and its associated socket
        playerSockets[playerGUID] = socket;
        player[playerGUID] = player;

        // send the generated game ID to the client game
        socket.emit('player-id', playerGUID);
    });

    socket.on("match-player", function(gameID, player)
    {
        console.log("Matching game " + gameID + " with player " + player);
        if(typeof gameSockets[gameID] == 'undefined') 
        {
            // does not exist
            var errorMessage = "The game with the game ID " + gameID + " doesn't exist or it's not yet connected.";
            socket.emit("error", errorMessage);
            console.log(errorMessage);
        }
        else 
        {
            var gameSocket = gameSockets[gameID];
            var game = games[gameID];
            console.log(game.playersConnected);
            console.log(game.nrPlayers);
            if (game.playersConnected == game.nrPlayers)
            {
                var errorMessage = "The game with the game ID " + gameID + " is full.";
                socket.emit("error", errorMessage);
                console.log(errorMessage);
            }
            else
            {
                game.playersConnected++;
                game.players[game.playersConnected] = player;
                console.log(games[gameID]);
                gameSocket.emit("player-connected", player);
            }
        }
    });

    socket.on("player-command", function(command, player)
    {
        var player = eval ("(" + player + ")");
        var gameSocket = player.gameGUID;

        if(typeof gameSocket == 'undefined') 
        {
            // the game doesn't exist
        }
        else
        {
            gameSocket.emit("player-command", command);
        }
    });
});

function generateID()
{
    var uuid = guid();
	return uuid;
}

/**
 * GUID generation.
 */
function s4()
{
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function guid()
{
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}
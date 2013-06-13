ConsoleFramework
================

A framework that would ease up a game setting creation:
  - game - web client;
  - server - node.js
  - player - anyone conforming to the protocols.

In order to use this component, you need to include 'console.js' in your web page right after you've included
'socket.io.js'. The initializing is done in the following way:

var game = new game("test", 2); // game type and number of players
initConnection(game); // start talking to the server

These two lines do the following:
  - create a connection with the server
  - handshake with the server
  - the server generates a unique GUID and sends it to the game client

Whenever a player connects, it should provide the game GUID in order to do a matching between the game client
and the players (if there's room for another player). After the matching is done, the player can start sending
commands.

The player and command structure are not yet defined but it will not matter who the player (it could be written
in python for example) because all communication will be done throug JSON structures. So, the player, server and
client should conform to a JSON protocol, to avoid confusions (while creating a player or a command).

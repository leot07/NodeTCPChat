//cargar libreria de colores
var colors = require('colors');

// Load the TCP Library
net = require('net');
 
// Keep track of the chat clients
var clients = [];
 
// Start a TCP Server
net.createServer(function (socket) {
 
  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort; 
 
  // Put this new client in the list
  clients.push(socket);
 
  // Send a nice welcome message and announce
  socket.write("Welcome " + socket.name + "\n");
  broadcast(socket.name + " joined the chat\n", socket);
 
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    //mi modificacion
    dataS = String(data); //paso data a string
    var firstS = dataS.charAt(0); 
    if (firstS == "!") {
      privetesFunc(dataS);
      return;
    }//Fin mi mod
    broadcast(socket.name + "> " + data, socket);
  });
 
  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " left the chat.\n");
  });
  
  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }
  function privetesFunc(command){
    var hash_comandovacio = "9cd30a2b93a0078bf980a313e7acde2b";
    if (command.indexOf(" ") == -1) command = command + " " + hash_comandovacio; //agrega al menos 1 parametro para q no de error split.
    var indiceComando = 0;                 // indice de comando
    var baseCommand = command.split(" "); // divido el comando con los parametros
    //vinculo comando con el indice de comando
    if (baseCommand[0].toString('utf-8').trim() == "!nick") indiceComando = 1;
    if (baseCommand[0].toString('utf-8').trim() == "!nickColor") indiceComando = 2;
    if (baseCommand[0].toString('utf-8').trim() == "!olist") indiceComando = 3;

    switch(indiceComando){
      case 0:
          socket.write("Invalid Command. Type !help \n".red);
          break;
      case 1: // cambiar nick
          var newNick = baseCommand[1];
          if (newNick == hash_comandovacio) socket.write("Invalid argument.Type !help \n".red);
          else{
              socket.write("Nick changed to: ".green + newNick.blue + "\n");
              socket.name = newNick.trim();
           }
          break;
      case 2: // cambiar color d nick. BUG: SOLO CAMBIA UNA VEZ SOLA DE COLOR.
          var colorNick = baseCommand[1];
          if (colorNick == hash_comandovacio) socket.write("Invalid argument.Type !help \n".red); // valida mal uso del comando

          if (colorNick.trim() == "red"){
            socket.name = socket.name.red;
            socket.write("Nick's color changed to red.\n".green);
          }
          if (colorNick.trim() == "blue"){
            socket.name = socket.name.blue;
            socket.write("Nick's color changed to blue.\n".green);
          }
          if (colorNick.trim() == "green"){
            socket.name = socket.name.green;
            socket.write("Nick's color changed to green.\n".green);
          }
           if (colorNick.trim() == "yellow"){
            socket.name = socket.name.yellow;
            socket.write("Nick's color changed to yellow.\n".green);
          }
          break;
      case 3: // listar clientes conectados
          var clienteActual = socket;
          clienteActual.write("----------------------\n")
          clienteActual.write("|CLIENTES CONECTADOS |\n")
          clients.forEach(function (client) {
          clienteActual.write("|--------------------|\n") 
          if (client === clienteActual) return;
          clienteActual.write("|\t" + client.name + "\t\t|\n");
          });
          
          break;

    }                  
  }
}).listen(5000);
 
// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");
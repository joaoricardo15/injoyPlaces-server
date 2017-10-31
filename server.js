// var http = require('http');
// http.createServer(function (req, res) {
//     console.log('Got request for ' + req.url);
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end('<h1>Hello Code and Azure Web Apps!</h1>');
// }).listen(process.env.PORT);

var express = require('express')
  , app = express()
  , server = require('http').Server(app)



//

/////////////////////////////////////////
// Http Server
/////////////////////////////////////////
server.listen(80, function (err) {
  if (err) console.log(err);
  else console.log("Express server is listen to port 80!");
});
app.use(express.static('www'));

//daozinho danado demais

//daozinho danado demais
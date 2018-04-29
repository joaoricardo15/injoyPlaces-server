var express = require('express')
  , app = express()
  , port = 3000;

app.post('/', function(req, res) {
    
        console.log('req: '+req);
    
        res.send('hello world');
    });

app.listen(port, function (error) {
    if(!error)
        console.log('Find server is listen to port: '+port);
    else
        console.log('error on find server inicialization: '+error);
});
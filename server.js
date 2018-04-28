var express = require('express')
  , app = express()
  , port = 80;

app.use(express.static('www'));



app.listen(port, error => {
  if(!error)
    console.log("Express listen to "+port);
  else
    console.log("express error: "+error); 
});

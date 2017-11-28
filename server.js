var express = require('express')
  , app = express();

app.use(express.static('www'));

app.listen(process.env.PORT);

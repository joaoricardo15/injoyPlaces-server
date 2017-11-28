var express = require('express')
  , app = express()
  , env = { Local: 0, Azure: 1 };

app.use(express.static('www'));

var envMode = env.Azure;
process.argv.forEach((val, index, array) => {
  if (val === 'local') {
    envMode = env.Local;
  }
});

if (envMode === env.Local) {
  app.listen(80);
}
else {
  app.listen(process.env.PORT);
}
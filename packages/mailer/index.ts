import express from 'express';

const app = express();

app.all('/api/*', function (req, res) {
  apiProxy.web(req, res, { target: backend });
});

const server = require('http').createServer(app);

server.listen(8081);

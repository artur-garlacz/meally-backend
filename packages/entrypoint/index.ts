import express from 'express';
import httpProxy from 'http-proxy';

const app = express();
const apiProxy = httpProxy.createProxyServer();
const backend = 'http://localhost:8082';

app.all('/api/*', function (req, res) {
  apiProxy.web(req, res, { target: backend });
});

const server = require('http').createServer(app);

server.listen(8081);

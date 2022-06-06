import express from 'express';
import httpProxy from 'http-proxy';

const app = express();
const apiProxy = httpProxy.createProxyServer();
const backend = 'http://localhost:8082';

app.all('/api/*', function (req, res) {
  apiProxy.web(req, res, { target: backend });
});

// app.all('/*', function (req, res) {
//   apiProxy.web(req, res, { target: frontend });
// });

const server = require('http').createServer(app);
// server.on('upgrade', function (req, socket, head) {
//   apiProxy.ws(req, socket, head, { target: frontend });
// });

server.listen(8081);

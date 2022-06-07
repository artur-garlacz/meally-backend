import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
// app.use(cors(corsOptions));

const server: http.Server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws, req) => {});

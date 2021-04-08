const http = require('http');
const app = require('./app');

require('dotenv').config({path: '../.env'});

const port = process.env.PORT || 3000;

const server = http.createServer(app);

console.log("Servidor rodando na porta:", port)

server.listen(port);


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Lidando com erros CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const rotasOrigem = require('./rotas/rotasOrigem')
const rotasStatus = require('./rotas/rotasStatus')
const rotasPedidos = require('./rotas/rotasPedidos')

require('dotenv').config({path: '../.env'});
const bd = process.env.BD;

mongoose.connect(bd, {useNewUrlParser: true, useUnifiedTopology: true});

app.use('/origem', rotasOrigem);
app.use('/status', rotasStatus);
app.use('/pedidos', rotasPedidos);

module.exports = app;

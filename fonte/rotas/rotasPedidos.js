const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pedido = require('../esquemas/esquemaPedidos');
const Status = require('../esquemas/esquemaStatus');

// Funções auxiliares

// uma data em string tem o formato "2021-08-02 15:22:45.123"

function Data1MaiorQueData2(data1, data2){

    if (data1 > data2)
        return true;
    else
        return false;
}

function ConverteStringParaData(dataString){ 

    let ano = dataString.substring(0, 4);

    let mes = dataString.substring(5, 7);

    let dia = dataString.substring(8, 10);

    let horas = dataString.substring(11, 13);

    let minutos = dataString.substring(14, 16);

    let segundos = dataString.substring(17, 19);

    let milisegundos = dataString.substring(20, 23);

    let data = new Date(ano, mes, dia, horas, minutos, segundos, milisegundos);

    console.log(data);

    return data;
}

function ConverteDataParaString(data){

    let ano = data.getFullYear().toString();

    let mes = data.getMonth() + 1;
    mes = mes.toString();

    if (mes.length == 1){
        mes = "0" + mes;
    }

    let dia = data.getDate().toString();
    
    if (dia.length == 1){
        dia = "0" + dia;
    }

    let horas = data.getHours().toString();

    if (horas.length == 1){
        horas = "0" + horas;
    }

    let minutos = data.getMinutes().toString();

    if (minutos.length == 1){
        minutos = "0" + minutos;
    }

    let segundos = data.getSeconds().toString();

    if (segundos.length == 1){
        segundos = "0" + segundos;
    }

    let milisegundos = data.getMilliseconds().toString();

    if (milisegundos.length == 1){
        milisegundos = "00" + milisegundos;
    }

    if(milisegundos.length == 2){
        milisegundos = "0" + milisegundos;
    }

    let dataString = ano + "-" + mes + "-" + dia + " " + horas + ":" + minutos + ":" + segundos + "." + milisegundos;

    console.log("DataString:", dataString);

    return dataString;
}

// Rotas da API

// get para /pedidos
router.get('/', (req, res) => {
    res.status(300).json({
        message: "It works!"
    });
});

// GET pedido por idProprietario e id
router.get('/carregar/:idProprietario/:id', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id;
    Pedido.findOne({idProprietario: idProprietario, _id: id})
        .exec()
        .then(doc => {
            console.log("Do banco de dados:", doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// LISTAR pedido por idProprietario
router.get('/listar/:idProprietario', (req, res) => {
    const idProprietario = req.params.idProprietario;
    Pedido.find({idProprietario: idProprietario})
        .exec()
        .then(doc => {
            console.log("Do banco de dados:", doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// LISTAR pedido por idProprietario e filtro por data
router.get('/listarPedidosNovos/:idProprietario', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const data = req.body.data;
    Pedido.find({idProprietario: idProprietario, status: {$size : {$eq : 1}} })
        .exec()
        .then(doc => {

            let pedidos = doc;
            let pedidosNovos = [];
            let dataReferencia = new Date();
            let dataPedido = new Date();

            dataReferencia = ConverteStringParaData(data);
            
            if (pedidos != null){

                for(i = 0; i < pedidos.length; i++){
                    
                    dataPedido = ConverteStringParaData(pedidos[i].status[0].dataHoraAcao);

                    if( Data1MaiorQueData2(dataPedido, dataReferencia) )
                        pedidosNovos.push(pedidos[i]);
                    
                }
            }

            console.log("Do banco de dados:", pedidosNovos);
            res.status(200).json(pedidosNovos);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// LISTAR pedido por idProprietario e idPessoa
router.get('/listarPessoa/:idProprietario/:idPessoa', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const idPessoa = req.params.idPessoa;
    Pedido.find({idProprietario: idProprietario, idPessoa: idPessoa})
        .exec()
        .then(doc => {
            console.log("Do banco de dados:", doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// Verificar status?
router.get('/verificarStatus/:idProprietario/:id', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id;
    Pedido.findOne({idProprietario: idProprietario, _id: id})
        .exec()
        .then(doc => {

            let status;

            status = doc.status;

            console.log("Do banco de dados:", status);
            res.status(200).json(status);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});


// POST para /pedidos/adicionar
router.post('/adicionar', (req, res) => {

    let data = new Date();

    let dataString = ConverteDataParaString(data);

    const status = new Status({
        id: "60743c45dc0ad11758ceb086",
        dataHoraAcao: req.body.status[0].dataHoraAcao,
        dataHoraRegistro: dataString
    });

   const pedido = new Pedido({
        _id: mongoose.Types.ObjectId(),
        idProprietario: req.body.idProprietario,
        idPessoa: req.body.idPessoa,
        valor: req.body.valor,
        observacoes: req.body.observacoes,
        origem: req.body.origem,
        status: status,
        produtos: req.body.produtos,
    });
    pedido
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// Alterar status
router.patch('/alterarStatus', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id; 
    const alteracoes = {};

    for(const [chave, valor] of Object.entries(req.body)){
        alteracoes[chave] = valor;
    }

    Pedido.update({idProprietario: idProprietario, _id: id}, { $set: alteracoes})
    .exec()
        .then(doc => {
            console.log("Do banco de dados:", doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})

// UPDATE por id_proprietario e id
router.patch('/alterar/:idProprietario/:id', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id; 
    const alteracoes = {};

    for(const [chave, valor] of Object.entries(req.body)){
        alteracoes[chave] = valor;
    }

    Pedido.update({idProprietario: idProprietario, _id: id}, { $set: alteracoes})
    .exec()
        .then(doc => {
            console.log("Do banco de dados:", doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})

module.exports = router;
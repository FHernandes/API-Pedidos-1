const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pedido = require('../esquemas/esquemaPedidos');

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

// LISTAR pedido por idProprietario e idPessoa
router.get('/listar/:idProprietario/:idPessoa', (req, res) => {
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

// POST para /pedidos/adicionar
router.post('/adicionar', (req, res) => {
   const pedido = new Pedido({
        _id: mongoose.Types.ObjectId(),
        idProprietario: req.body.idProprietario,
        idPessoa: req.body.idPessoa,
        valor: req.body.valor,
        observacoes: req.body.observacoes,
        origem: req.body.origem,
        status: req.body.status,
        produtos: req.body.produtos,
    });
    pedido
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

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
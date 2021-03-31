const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Origem = require('../esquemas/esquemaOrigem');

// get para /origem
router.get('/', (req, res) => {
    res.status(300).json({
        message: "It works!"
    });
});

// GET origem por id
router.get('/carregar/:id', (req, res) => {
    const id = req.params.id;
    Origem.findOne({_id: id})
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

// POST para /origem/adicionar
router.post('/adicionar', (req, res) => {
   const origem = new Origem({
        _id: mongoose.Types.ObjectId(),
        nome: req.body.nome
    });
    origem
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

module.exports = router;
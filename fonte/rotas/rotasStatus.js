const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Status = require('../esquemas/esquemaStatus');

// get para /origem
router.get('/', (req, res) => {
    res.status(300).json({
        message: "It works!"
    });
});

// GET status por id
router.get('/carregar/:id', (req, res) => {
    const id = req.params.id;
    Status.findOne({_id: id})
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

// LISTAR status por id
router.get('/listar/:id', (req, res) => {
    const id = req.params.id;
    Status.find({_id: id})
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

// POST para /status/adicionar
router.post('/adicionar', (req, res) => {
   const status = new Status({
        _id: mongoose.Types.ObjectId(),
        nome: req.body.nome
    });
    status
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

module.exports = router;
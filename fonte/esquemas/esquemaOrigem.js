mongoose = require('mongoose')

const EsquemaOrigem = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    nome: String
});

module.exports = mongoose.model('Origem', EsquemaOrigem);

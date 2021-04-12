mongoose = require('mongoose')

const EsquemaStatus = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    nome: String
});

module.exports = mongoose.model('Status', EsquemaStatus);

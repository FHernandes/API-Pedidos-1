mongoose = require('mongoose')

const EsquemaPedido = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    idProprietario: String,
    idPessoa: String,
    valor: Number,
    observacoes: String,
    origem: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Origem'
        }
    ],
    status: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Status',
            dataHoraAcao: String,
            dataHoraRegistro: String
        },
    ],
    produtos: [
        {
            id: String,
            nome: String,
            descricao: String,
            valorAplicado: Number,
            valorOriginal: Number,
            modificacoes: [
                {
                    id: String,
                    nome: String,
                    valor: Number
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Pedido', EsquemaPedido);

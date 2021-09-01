mongoose = require('mongoose')

const EsquemaPedido = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    idProprietario: String,
    idPessoa: String,
    idEndereco: String,
    idTelefone: String,
    idDocumento: String,
    valor: Number,
    taxaEntrega: Number,
    observacoes: String,
    detalhes: String,
    origem: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Origem'
        }
    ],
    status: [
        {
            id: String,
            dataHoraAcao: String,
            dataHoraRegistro: String
        },
    ],
    produtos: [
        {
            id: String,
            idExterno: String,
            nome: String,
            descricao: String,
            valorAplicado: Number,
            valorOriginal: Number,
            modificacoes: [
                {
                    id: String,
                    idExterno: String,
                    nome: String,
                    valor: Number
                }
            ]
        }
    ],
    pagamentos: [
        {
            idExterno: String,
            nome: String,
            codigo: String,
            bandeira: String,
            prepago: Boolean,
            valor: Number,
            troco: Number
        }
    ]
});

module.exports = mongoose.model('Pedido', EsquemaPedido);

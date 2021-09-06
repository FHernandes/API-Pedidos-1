mongoose = require('mongoose')

const EsquemaPedido = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    idProprietario: String,
    valor: Number,
    taxaEntrega: Number,
    observacoes: String,
    detalhes: String,
    dadosCliente: {
        idPessoa: String,
        nome: String, 
        email: String,
        endereco: {
            rua: String,
            numero: String,
            descricao: String,
            complemento: String,
            referencia: String,
            bairro: String,
            cidade: String,
            estado: String,
            cep: String
        },
        telefone: {
            tipo: String,
            ddd: String,
            numero: String
        }
    },
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

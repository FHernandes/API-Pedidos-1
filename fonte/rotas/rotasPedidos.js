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
router.get('/listarPedidos/:idProprietario', (req, res) => {
    const idProprietario = req.params.idProprietario;
    Pedido.find({idProprietario: idProprietario, status: {$size : 1} })
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
router.get('/listarPedidosNovos/:idProprietario/:data', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const data = req.params.data;
    Pedido.find({idProprietario: idProprietario, status: {$size : 1} })
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

    let pedidoStatus = [];

    let status = {
        id: "60743c45dc0ad11758ceb086",
        dataHoraAcao: req.body.dataPedido,
        dataHoraRegistro: dataString
    }

    /*
    const status = new Status({
        id: "60743c45dc0ad11758ceb086",
        dataHoraAcao: req.body.dataPedido,
        dataHoraRegistro: dataString
    });
    */

    pedidoStatus.push(status);

   const pedido = new Pedido({
        _id: mongoose.Types.ObjectId(),
        idProprietario: req.body.idProprietario,
        dadosCliente: req.body.dadosCliente,
        valor: req.body.valor,
        taxaEntrega: req.body.taxaEntrega,
        observacoes: req.body.observacoes,
        detalhes: req.body.detalhes,
        origem: req.body.origem,
        status: pedidoStatus,
        produtos: req.body.produtos,
        pagamentos: req.body.pagamentos
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

// Confirmar Pedido
router.post('/confirmar/:idProprietario/:id/:dataHoraAcao', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id; 
    const dataHoraAcao = req.params.dataHoraAcao;

    Pedido.findOne({idProprietario: idProprietario, _id: id})
    .exec()
        .then(doc => {

            const dataReg = new Date();

            const statusConfirmado = {
                id: "6136427de3949444bb0ccc84",
                dataHoraAcao: dataHoraAcao,
                dataHoraRegistro: ConverteDataParaString(dataReg) 
            }

            doc.status.push(statusConfirmado);

            doc
                .save()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json({error: err});
                });                        
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})

// Enviar Pedido
router.post('/enviar/:idProprietario/:id/:dataHoraAcao', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id; 
    const dataHoraAcao = req.params.dataHoraAcao;

    Pedido.findOne({idProprietario: idProprietario, _id: id})
    .exec()
        .then(doc => {

            const dataReg = new Date();

            const statusEnviado = {
                id: "61364273e3949444bb0ccc83",
                dataHoraAcao: dataHoraAcao,
                dataHoraRegistro: ConverteDataParaString(dataReg) 
            }

            doc.status.push(statusEnviado);

            doc
                .save()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json({error: err});
                });                                   
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})

// Finalizar Pedido
router.post('/finalizar/:idProprietario/:id/:dataHoraAcao', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id; 
    const dataHoraAcao = req.params.dataHoraAcao;

    Pedido.findOne({idProprietario: idProprietario, _id: id})
    .exec()
        .then(doc => {

            const dataReg = new Date();

            const statusFinalizado = {
                id: "6136428ee3949444bb0ccc85",
                dataHoraAcao: dataHoraAcao,
                dataHoraRegistro: ConverteDataParaString(dataReg) 
            }

            doc.status.push(statusFinalizado);

            doc
                .save()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json({error: err});
                });    
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})

// Cancelar Pedido
router.post('/cancelar/:idProprietario/:id/:dataHoraAcao', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id; 
    const dataHoraAcao = req.params.dataHoraAcao;
    const detalhesCancelamento = req.body.detalhes;

    Pedido.findOne({idProprietario: idProprietario, _id: id})
    .exec()
        .then(doc => {

            // const indiceUltimoStatus = doc.status.length - 1;
            // const idUltimoStatus = doc.status[indiceUltimoStatus].id;

            // // se pedido foi enviado ou finalizado, não é possível cancelar
            // if (idUltimoStatus == "6136428ee3949444bb0ccc85")
            //     res.status(500).json({erro: "Não é possível cancelar um pedido finalizado."})

            // if (idUltimoStatus == "61364273e3949444bb0ccc83")
            //     res.status(500).json({erro: "Não é possível cancelar um pedido em rota de entrega."})

            const dataReg = new Date();

            const statusCancelado = {
                id: "613642a9e3949444bb0ccc86",
                dataHoraAcao: dataHoraAcao,
                dataHoraRegistro: ConverteDataParaString(dataReg) 
            }

            doc.detalhes = detalhesCancelamento;
            doc.status.push(statusCancelado);

            doc
                .save()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json({error: err});
                });    
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})

// Cancelar Pedido
router.post('/clienteCancelar/:idProprietario/:id/:dataHoraAcao', (req, res) => {
    const idProprietario = req.params.idProprietario;
    const id = req.params.id; 
    const dataHoraAcao = req.params.dataHoraAcao;
    //const detalhesCancelamento = req.body.detalhes;

    Pedido.findOne({idProprietario: idProprietario, _id: id})
    .exec()
        .then(doc => {

            const indiceUltimoStatus = doc.status.length - 1;
            const idUltimoStatus = doc.status[indiceUltimoStatus].id;

            // se pedido foi enviado ou finalizado, não é possível cancelar
            if (idUltimoStatus == "6136428ee3949444bb0ccc85")
                res.status(500).json({erro: "Não é possível cancelar um pedido finalizado."})

            if (idUltimoStatus == "61364273e3949444bb0ccc83")
                res.status(500).json({erro: "Não é possível cancelar um pedido em rota de entrega."})

            const dataReg = new Date();

            const statusCancelado = {
                id: "6136cbae8dc5c505c6bd333f",
                dataHoraAcao: dataHoraAcao,
                dataHoraRegistro: ConverteDataParaString(dataReg) 
            }

            //doc.detalhes = detalhesCancelamento;
            doc.status.push(statusCancelado);

            doc
                .save()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json({error: err});
                });    
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
})


module.exports = router;
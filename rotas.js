const express = require('express')
const alteracoes = require('./controladores/alteracoes')
const consultas = require('./controladores/consultas')
const transacoes = require('./controladores/transacoes')

const rotas = express()

rotas.post('/contas', alteracoes.criarConta)
rotas.get('/contas', consultas.consultarContas)
rotas.put('/contas/:numeroConta/usuario', alteracoes.atualizarUsuarioConta)
rotas.delete('/contas/:numeroConta', alteracoes.excluirConta)
rotas.post('/transacoes/depositar', transacoes.depositar)
rotas.post('/transacoes/sacar', transacoes.sacar)
rotas.post('/transacoes/transferir', transacoes.transferir)
rotas.get('/contas/saldo', consultas.saldo)
rotas.get('/contas/extrato', consultas.extrato)

module.exports = rotas

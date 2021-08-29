const bancoDeDados = require('../bancodedados')
const { getConta } = require('./transacoes')
const { validaSenha } = require('./transacoes')

function consultarContas(req, res) {
  erro = false
  // validarDados(req.body)

  if (!req.query.senha_banco || req.query.senha_banco != '123') {
    res.status(400)
    res.json({ erro: 'Senha Incorreta' })
    return
  }

  if (erro) {
    res.status(400)
    res.json({ erro })
    return
  }

  res.status(201).json(bancoDeDados.contas)
}

function saldo(req, res) {
  const conta = getConta(req.query.numero_conta)
  if (!conta) {
    res.status(404)
    res.json({ erro: `A conta ${req.query.numero_conta} não existe` })
    return
  }

  const erroSenha = validaSenha(req.query, conta)
  if (erroSenha) {
    res.status(404)
    res.json({ erro: erroSenha })
    return
  }

  res.status(200).json({
    saldo: conta.saldo,
  })
}

function extrato(req, res) {
  const conta = getConta(req.query.numero_conta)
  if (!conta) {
    res.status(404)
    res.json({ erro: `A conta ${req.query.numero_conta} não existe` })
    return
  }

  const erroSenha = validaSenha(req.query, conta)
  if (erroSenha) {
    res.status(404)
    res.json({ erro: erroSenha })
    return
  }

  res.status(200).json({
    depositos: bancoDeDados.depositos.filter(
      (x) => x.numero_conta == req.query.numero_conta,
    ),
    saques: bancoDeDados.saques.filter(
      (x) => x.numero_conta == req.query.numero_conta,
    ),
    transferenciasEnviadas: bancoDeDados.transferencias.filter(
      (x) => x.numero_conta_origem == req.query.numero_conta,
    ),
    transferenciasRecebidas: bancoDeDados.transferencias.filter(
      (x) => x.numero_conta_destino == req.query.numero_conta,
    ),
  })
}

module.exports = { consultarContas, saldo, extrato }

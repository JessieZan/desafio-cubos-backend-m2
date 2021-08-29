const bancoDeDados = require('../bancodedados')

function getConta(numero) {
  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero),
  )
  return conta
}

function validaCampos(body) {
  if (!body.numero_conta) {
    return `Informe o número da conta!`
  }

  if (!body.valor) {
    return `Informe o valor da transação!`
  }

  if (body.valor <= 0) {
    return `O valor da transação deve ser maior do que zero!`
  }
}

function validaSenha(body, conta) {
  if (!body.senha) {
    return `Informe a senha da conta ${body.numero_conta}!`
  }

  if (body.senha != conta.usuario.senha) {
    return `Senha incorreta!`
  }
}

function depositar(req, res) {
  const conta = getConta(req.body.numero_conta)
  if (!conta) {
    res.status(404)
    res.json({ erro: `A conta ${req.body.numero_conta} não existe` })
    return
  }

  const erro = validaCampos(req.body)

  if (erro) {
    res.status(404)
    res.json({ erro: erro })
    return
  }

  conta.saldo += req.body.valor
  bancoDeDados.depositos.push({
    data: new Date(),
    numero_conta: req.body.numero_conta,
    valor: req.body.valor,
  })

  res.status(200)
  res.json(`Depósito realizado com sucesso!`)
}

function sacar(req, res) {
  const conta = getConta(req.body.numero_conta)
  if (!conta) {
    res.status(404)
    res.json({ erro: `A conta ${req.body.numero_conta} não existe` })
    return
  }

  const erro = validaCampos(req.body)

  if (erro) {
    res.status(404)
    res.json({ erro: erro })
    return
  }

  const erroSenha = validaSenha(req.body, conta)
  if (erroSenha) {
    res.status(404)
    res.json({ erro: erroSenha })
    return
  }

  if (conta.saldo < req.body.valor) {
    res.status(404)
    res.json({
      erro: `Você não possui saldo suficiente para completar essa transação ;~`,
    })
    return
  }

  conta.saldo -= req.body.valor
  bancoDeDados.saques.push({
    data: new Date(),
    numero_conta: req.body.numero_conta,
    valor: req.body.valor,
  })

  res.status(200)
  res.json(`Saque realizado com sucesso!`)
}

function transferir(req, res) {
  const conta = getConta(req.body.numero_conta)
  if (!conta) {
    res.status(404)
    res.json({ erro: `A conta ${req.body.numero_conta} não existe` })
    return
  }

  const erro = validaCampos(req.body)

  if (erro) {
    res.status(404)
    res.json({ erro: erro })
    return
  }

  const erroSenha = validaSenha(req.body, conta)
  if (erroSenha) {
    res.status(404)
    res.json({ erro: erroSenha })
    return
  }

  if (!req.body.numero_conta_destino) {
    res.status(404)
    res.json({ erro: `Informe o número da conta de destino!` })
    return
  }

  const conta_destino = getConta(req.body.numero_conta_destino)
  if (!conta_destino) {
    res.status(404)
    res.json({
      erro: `A conta de destino, ${req.body.numero_conta_destino} não existe`,
    })
    return
  }

  if (conta.saldo < req.body.valor) {
    res.status(404)
    res.json({
      erro: `Você não possui saldo suficiente para completar essa transação ;~`,
    })
    return
  }

  conta.saldo -= req.body.valor
  conta_destino.saldo += req.body.valor
  bancoDeDados.transferencias.push({
    data: new Date(),
    numero_conta_origem: req.body.numero_conta,
    numero_conta_destino: req.body.numero_conta_destino,
    valor: req.body.valor,
  })

  res.status(200)
  res.json(`Transferência realizada com sucesso!`)
}

module.exports = { depositar, sacar, transferir, getConta, validaSenha }

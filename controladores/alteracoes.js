const bancoDeDados = require('../bancodedados')

function validarPreenchimento(conta) {
  if (
    !conta.nome ||
    !conta.cpf ||
    !conta.data_nascimento ||
    !conta.telefone ||
    !conta.email ||
    !conta.senha
  ) {
    return `Preencha todos os campos.`
  }
}

function validarDados(conta) {
  if (conta.cpf) {
    const cpfExistente = bancoDeDados.contas.find(
      (c) => c.usuario.cpf === conta.cpf,
    )

    if (cpfExistente) {
      return `o CPF informado já está vinculado a outra conta`
    }
  }

  if (conta.email) {
    const emailExistente = bancoDeDados.contas.find(
      (c) => c.usuario.email === conta.email,
    )
    if (emailExistente) {
      return `o E-mail informado já está vinculado a outra conta`
    }
  }
}

let proximaConta = 1

function criarConta(req, res) {
  erro = validarPreenchimento(req.body)

  if (erro) {
    res.status(400)
    res.json({ erro })
    return
  }

  erro = validarDados(req.body)
  if (erro) {
    res.status(400)
    res.json({ erro })
    return
  }

  const novaConta = {
    numero: proximaConta,
    saldo: 0,
    usuario: {
      nome: req.body.nome,
      cpf: req.body.cpf,
      data_nascimento: req.body.data_nascimento,
      telefone: req.body.telefone,
      email: req.body.email,
      senha: req.body.senha,
    },
  }

  bancoDeDados.contas.push(novaConta)

  proximaConta++

  res.status(201).json(novaConta)
}

function atualizarUsuarioConta(req, res) {
  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(req.params.numeroConta),
  )
  if (!conta) {
    res.status(404)
    res.json({ erro: `A conta ${req.params.numeroConta} não existe` })
    return
  }

  if (
    !req.body.nome &&
    !req.body.cpf &&
    !req.body.data_nascimento &&
    !req.body.telefone &&
    !req.body.email &&
    !req.body.senha
  ) {
    res.status(400)
    res.json({ erro: `Informe ao menos um campo para ser editado` })
    return
  }

  erro = validarDados(req.body)

  if (erro) {
    res.status(404)
    res.json({ erro })
    return
  }

  conta.usuario.nome = req.body.nome ? req.body.nome : conta.usuario.nome
  conta.usuario.cpf = req.body.cpf ? req.body.cpf : conta.usuario.cpf
  conta.usuario.data_nascimento = req.body.data_nascimento
    ? req.body.data_nascimento
    : conta.usuario.data_nascimento
  conta.usuario.telefone = req.body.telefone
    ? req.body.telefone
    : conta.usuario.telefone
  conta.usuario.email = req.body.email ? req.body.email : conta.usuario.email
  conta.usuario.senha = req.body.senha ? req.body.senha : conta.usuario.senha

  res.status(201).json({
    mensagem: 'Conta atualizada com sucesso!',
  })
}

function excluirConta(req, res) {
  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(req.params.numeroConta),
  )
  if (!conta) {
    res.status(404)
    res.json({ erro: `A conta ${req.params.numeroConta} não existe` })
    return
  }

  if (conta.saldo > 0) {
    res.status(400)
    res.json({
      erro: `Não autorizado! Para excluir uma conta seu saldo deve ser igual à 0`,
    })
    return
  }

  const indice = bancoDeDados.contas.indexOf(conta)

  bancoDeDados.contas.splice(indice, 1)

  res.json(`Conta excluida com sucesso!`)
}

module.exports = { criarConta, atualizarUsuarioConta, excluirConta }

const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente'); // Importa o modelo de Cliente

// POST /clients – Cadastro de cliente com verificação de CPF
router.post('/', async (req, res) => {
  try {
    const { nomecliente, cpfcliente, telefonecliente } = req.body;

    if (!cpfcliente) {
      return res.status(400).json({ erro: 'Campo "cpf" é obrigatório.' });
    }

    const clienteExistente = await Cliente.findOne({ cpfcliente: cpfcliente });

    if (clienteExistente) {
      console.log(`Cliente já existente:
      idcliente: ${clienteExistente._id}
      nomecliente: ${clienteExistente.nomecliente}
      cpfcliente: ${clienteExistente.cpfcliente}
      telefonecliente: ${clienteExistente.telefonecliente}
      `);

      return res.status(200).json({
        mensagem: 'Cliente com este CPF já está cadastrado.',
        cliente: clienteExistente
      });
    }

    const novoCliente = new Cliente({
      nomecliente: nomecliente,
      cpfcliente: cpfcliente,
      telefonecliente: telefonecliente,
    });

    const cliente = await novoCliente.save();

    console.log(`Novo cliente cadastrado:
    idcliente: ${cliente._id}
    nomecliente: ${cliente.nomecliente}
    cpfcliente: ${cliente.cpfcliente}
    telefonecliente: ${cliente.telefonecliente}
    `);

    res.status(201).json(cliente);
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar cliente', detalhes: err.message });
  }
});

// GET /clients – Retorna todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
});

module.exports = router;
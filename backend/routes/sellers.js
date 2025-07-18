const express = require('express');
const router = express.Router();
const Vendedor = require('../models/Vendedor');

// POST /sellers – Cadastro de vendedor com verificação de CPF
router.post('/', async (req, res) => {
  try {
    const { nomevendedor, cpfvendedor, telefonevendedor } = req.body;

    if (!cpfvendedor) {
      return res.status(400).json({ erro: 'Campo "cpf" é obrigatório.' });
    }

    const vendedorExistente = await Vendedor.findOne({ cpfvendedor: cpfvendedor });

    if (vendedorExistente) {
      console.log(`Vendedor já existente:
      idvendedor: ${vendedorExistente._id}
      nomevendedor: ${vendedorExistente.nomevendedor}
      cpfvendedor: ${vendedorExistente.cpfvendedor}
      telefonevendedor: ${vendedorExistente.telefonevendedor}
      `);

      return res.status(200).json({
        mensagem: 'Vendedor com este CPF já está cadastrado.',
        vendedor: vendedorExistente
      });
    }

    const novoVendedor = new Vendedor({
      nomevendedor: nomevendedor,
      cpfvendedor: cpfvendedor,
      telefonevendedor: telefonevendedor,
    });

    const vendedor = await novoVendedor.save();

    console.log(`Novo vendedor cadastrado:
    idvendedor: ${vendedor._id}
    nomevendedor: ${vendedor.nomevendedor}
    cpfvendedor: ${vendedor.cpfvendedor}
    telefonevendedor: ${vendedor.telefonevendedor}
    `);

    res.status(201).json(vendedor);
  } catch (err) {
    console.error('Erro ao cadastrar vendedor:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar vendedor', detalhes: err.message });
  }
});

// GET /sellers – Retorna todos os vendedores
router.get('/', async (req, res) => {
  try {
    const vendedores = await Vendedor.find();
    res.json(vendedores);
  } catch (err) {
    console.error('Erro ao buscar vendedores:', err);
    res.status(500).json({ erro: 'Erro ao buscar vendedores' });
  }
});

module.exports = router;
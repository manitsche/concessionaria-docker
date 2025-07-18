const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Carro = require('../models/Carro');
const Cliente = require('../models/Cliente');
const Vendedor = require('../models/Vendedor');
const Venda = require('../models/Venda');

// POST /sales – Registrar nova venda
router.post('/', async (req, res) => {
  try {
    const { idcarro, idcliente, idvendedor } = req.body;

    if (!idcarro || !idcliente || !idvendedor) {
      return res.status(400).json({ erro: 'carro, cliente e vendedor são obrigatórios.' });
    }

    // Verifica se o carro existe e está disponível
    const carro = await Carro.findById(idcarro);
    if (!carro) return res.status(404).json({ erro: 'Carro não encontrado.' });
    if (carro.status === 'vendido') return res.status(400).json({ erro: 'Carro já vendido.' });

    // Cria nova venda
    const novaVenda = new Venda({
      idcarro,
      idcliente,
      idvendedor
    });

    await novaVenda.save();

    // Atualiza status do carro
    carro.status = 'vendido';
    await carro.save();

    console.log(`Venda realizada com sucesso:
    idvenda: ${novaVenda._id}
    idcarro: ${idcarro}
    idcliente: ${idcliente}
    idvendedor: ${idvendedor}`);

    res.status(201).json(novaVenda);
  } catch (err) {
    console.error('Erro ao registrar venda:', err);
    res.status(500).json({ erro: 'Erro ao registrar venda', detalhes: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Carro = require('../models/Carro'); // Importando o modelo do carro

// Rota POST com verificação de duplicidade de placa
router.post('/', async (req, res) => {
  try {
    const { placa } = req.body;

    if (!placa) {
      return res.status(400).json({ erro: 'Campo "placa" é obrigatório.' });
    }

    const carroExistente = await Carro.findOne({ placa });

    if (carroExistente) {
      console.log(`Carro já cadastrado:
      idcarro: ${carroExistente._id}
      marca: ${carroExistente.marca}
      modelo: ${carroExistente.modelo}
      ano: ${carroExistente.ano}
      cor: ${carroExistente.cor}
      placa: ${carroExistente.placa}
      preço: ${carroExistente.preco}
      status: ${carroExistente.status}
      `);

      return res.status(200).json({
        mensagem: 'Já existe um carro cadastrado com esta placa',
        carro: carroExistente
      });
    }

    const novoCarro = new Carro(req.body);
    const carro = await novoCarro.save();

    console.log(`Novo carro adicionado:
    idcarro: ${carro._id}
    marca: ${carro.marca}
    modelo: ${carro.modelo}
    ano: ${carro.ano}
    cor: ${carro.cor}
    placa: ${carro.placa}
    preço: ${carro.preco}
    status: ${carro.status}
    `);

    res.status(201).json(carro);
  } catch (err) {
    console.error('Erro ao adicionar carro:', err);
    res.status(500).json({ erro: 'Erro ao adicionar carro', detalhes: err.message });
  }
});

// Rota GET com filtro de carros disponíveis
router.get('/', async (req, res) => {
  try {
    const { vendido } = req.query;
    const filtro = vendido === 'false' ? { status: 'disponivel' } : {};
    const carros = await Carro.find(filtro);
    res.json(carros);
  } catch (err) {
    console.error('Erro ao buscar carros:', err);
    res.status(500).json({ erro: 'Erro ao buscar carros' });
  }
});

module.exports = router;
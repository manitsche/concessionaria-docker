const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Carro = require("../models/Carro");
const Venda = require("../models/Venda");
const Cliente = require("../models/Cliente");
const Vendedor = require("../models/Vendedor");

// Listar carros vendidos com informações de cliente e vendedor
router.get("/vendidos", async (req, res) => {
  try {
    const vendas = await Venda.find()
      .populate({
        path: "idcarro",
        match: { status: "vendido" } // só carros vendidos
      })
      .populate("idcliente", "nomecliente")
      .populate("idvendedor", "nomevendedor");

    const resultado = vendas
      .filter(v => v.idcarro)
      .map(v => ({
        marca: v.idcarro.marca,
        modelo: v.idcarro.modelo,
        ano: v.idcarro.ano,
        cor: v.idcarro.cor,
        placa: v.idcarro.placa,
        preco: v.idcarro.preco,
        nomecliente: v.idcliente?.nomecliente || "Desconhecido",
        nomevendedor: v.idvendedor?.nomevendedor || "Desconhecido"
      }));

    res.json(resultado);
  } catch (err) {
    console.error("Erro ao buscar carros vendidos:", err);
    res.status(500).json({ erro: "Erro ao buscar carros vendidos" });
  }
});

// Listar carros disponíveis
router.get("/naoVendidos", async (req, res) => {
  try {
    const disponiveis = await Carro.find({ status: "disponivel" });
    res.json(disponiveis);
  } catch (err) {
    console.error("Erro ao buscar carros disponíveis:", err);
    res.status(500).json({ erro: "Erro ao buscar carros disponíveis" });
  }
});

// Buscar nome do cliente e vendedor com base no ID da venda
router.get("/detalhesVenda/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: "ID de venda inválido." });
    }

    const venda = await Venda.findById(id)
      .populate("idcliente", "nomecliente")
      .populate("idvendedor", "nomevendedor");

    if (!venda) {
      return res.status(404).json({ erro: "Venda não encontrada." });
    }

    res.json({
      cliente: venda.idcliente?.nomecliente || "Nome não encontrado",
      vendedor: venda.idvendedor?.nomevendedor || "Nome não encontrado",
    });
  } catch (err) {
    console.error("Erro ao buscar detalhes da venda:", err);
    res.status(500).json({ erro: "Erro ao buscar detalhes da venda" });
  }
});

module.exports = router;
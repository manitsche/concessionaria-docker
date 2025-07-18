const mongoose = require('mongoose');

const CarroSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  ano: { type: Number, required: true },
  cor: { type: String, required: true },
  placa: { type: String, required: true, unique: true },
  preco: { type: Number, required: true },
  status: { type: String, default: 'disponivel' }
});

const Carro = mongoose.models.Carro || mongoose.model('Carro', CarroSchema);

module.exports = Carro;
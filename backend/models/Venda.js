const mongoose = require('mongoose');

const VendaSchema = new mongoose.Schema({
  idcarro: { type: mongoose.Schema.Types.ObjectId, ref: 'Carro', required: true },
  idcliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  idvendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor', required: true },
});

const Venda = mongoose.models.Venda || mongoose.model('Venda', VendaSchema);

module.exports = Venda;
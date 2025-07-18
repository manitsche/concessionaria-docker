const mongoose = require('mongoose');

const VendedorSchema = new mongoose.Schema({
  nomevendedor: { type: String, required: true },
  cpfvendedor: { type: String, required: true, unique: true },
  telefonevendedor: { type: String, required: true },
});

const Vendedor = mongoose.models.Vendedor || mongoose.model('Vendedor', VendedorSchema);

module.exports = Vendedor;
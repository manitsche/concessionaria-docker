const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nomecliente: { type: String, required: true },
  cpfcliente: { type: String, required: true, unique: true },
  telefonecliente: { type: String, required: true }
});

const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;
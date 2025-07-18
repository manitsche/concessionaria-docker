require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGODB_URI;

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

app.use('/cars', require('./routes/cars'));
app.use('/clients', require('./routes/clients'));
app.use('/sellers', require('./routes/sellers'));
app.use('/sales', require('./routes/sales'));
app.use('/reports', require('./routes/reports'));

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
const { MongoClient } = require('mongodb');

const uri = 'mongodb://mongodb:27017/concessionaria'; 
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

async function connect() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('concessionaria');
      console.log('✅ Conectado ao MongoDB com sucesso');
    } catch (error) {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }
  return db;
}

module.exports = (async () => await connect())();
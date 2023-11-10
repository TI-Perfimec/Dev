// dbConfig.js
const config = {
  user: 'bi',
  password: 'Yv"cEW3|:B',
  server: 'protheus.perfimec.com.br', // ou o endereço do servidor SQL
  database: 'DBP12',
  options: {
    encrypt: true, // Caso você esteja usando criptografia SSL
    trustServerCertificate: true, // Ignorar verificação de certificado
  },
};

module.exports = config;

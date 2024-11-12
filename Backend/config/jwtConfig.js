const jwt = require('jsonwebtoken');
require('dotenv').config();


// Chave secreta para assinar os tokens
//const SECRET_KEY = 'My_secret';

// Função para gerar um token
const generateToken = (userId) => {
    const payload = { id: userId }; // Adiciona o id do usuário ao payload
    return jwt.sign(payload , process.env.SECRET_JWT, { expiresIn: '1h' });
};

// Função para verificar um token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_JWT);
};

module.exports = { generateToken, verifyToken };

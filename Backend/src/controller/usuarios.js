const prisma = require('../../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwtConfig = require('../../config/jwtConfig'); // Importar o arquivo jwtConfig
const jwt = require('jsonwebtoken');


// Rota para criar um novo usuário
const CriarUsuario = async (req, res) => {
    const { nome, email, senha, data_nascimento } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    try {
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaCriptografada, // Armazenar a senha criptografada
                data_nascimento: new Date(data_nascimento)
            }
        });
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar usuário.' });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
  
      // Gerando o token JWT
      const token = jwtConfig.generateToken(usuario.id);
  
      // Dados do usuário para armazenar no cookie
      const userData = JSON.stringify({
        id: usuario.id,
        name: usuario.nome,
      });
  
      // Definindo o cookie do token JWT
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      // Definindo o cookie com ID e nome do usuário
      res.cookie('userData', userData, {
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({
        message: 'Login realizado com sucesso!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao realizar login.' });
    }
  };
  
  



const AtualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, data_nascimento } = req.body;
    try {
        const usuarioAtualizado = await prisma.usuario.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nome,
                email,
                senha,
                data_nascimento: new Date(data_nascimento)
            }
        });
        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar usuário.' });
    }
};

const autenticarToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('Token não encontrado');
        return res.sendStatus(401); // Não autorizado
    }

    try {
        const decoded = jwtConfig.verifyToken(token);
        req.userId = decoded.id; // Armazena o ID do usuário
        next();
    } catch (error) {
        console.log('Erro ao verificar token', error);
        return res.sendStatus(403); // Proibido
    }
};



const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(400).json({ error: "Erro ao buscar os usuários." });
    }
};

const deletarUsuario = async (req, res) => {
    const { id } = req.body;
    try {
        const usuario = await prisma.usuario.update({
            where: {
                id: Number(id),
            },
            data: {
                status: false,
            },
        });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ error: "Erro ao marcar usuário como inativo." });
    }
};

module.exports = { CriarUsuario, AtualizarUsuario, buscarUsuarios, deletarUsuario, login, autenticarToken }; 
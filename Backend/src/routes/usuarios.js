const express = require('express')
const router = express.Router()
//const { autenticarToken } = require('../../middlewares/authMiddleware');
const {login, CriarUsuario, AtualizarUsuario, buscarUsuarios, deletarUsuario, autenticarToken} = require('../controller/usuarios')
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Adiciona um novo usuário ao sistema com base nas informações fornecidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do novo usuário
 *               email:
 *                 type: string
 *                 description: E-mail do novo usuário
 *               senha:
 *                 type: string
 *                 description: Senha do novo usuário
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do novo usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Falha ao criar o usuário.
 */
router.post('/', CriarUsuario)

/**
 * @swagger
 * /usuarios/deletar:
 *   put:
 *     summary: Desativa um usuário existente
 *     description: Marca um usuário como inativo no sistema pelo ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do usuário a ser desativado
 *     responses:
 *       200:
 *         description: Usuário desativado com sucesso.
 *       400:
 *         description: Erro ao desativar o usuário.
 */
router.put('/deletar', deletarUsuario)

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     description: Faz login de um usuário existente com base nas credenciais fornecidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro ao realizar login.
 */
router.post('/login', login)

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     description: Atualiza as informações de um usuário específico pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do usuário
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Erro ao atualizar o usuário.
 */
router.put('/:id', autenticarToken, AtualizarUsuario)

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Busca todos os usuários
 *     description: Retorna uma lista com todos os usuários cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *       400:
 *         description: Erro ao buscar os usuários.
 */

//router.get('/', buscarUsuarios)

// Rota protegida com autenticação por token
router.get('/', autenticarToken, buscarUsuarios);


module.exports = router
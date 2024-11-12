const express = require('express');
const router = express.Router();

const { CriarPrescricao, AtualizarPrescricao, BuscarPrescricao, DeletarPrescricao, buscarPrescricaoPorUsuarioId } = require('../controller/prescricoes');
const { autenticarToken } = require('../controller/usuarios')

router.put('/deletar', DeletarPrescricao);
router.post('/',  CriarPrescricao);
router.put('/:id', AtualizarPrescricao);
router.post('/buscar',autenticarToken, buscarPrescricaoPorUsuarioId);

module.exports = router;

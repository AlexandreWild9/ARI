const express = require('express')
const router = express.Router()


const { CriarRemedio, AtualizarRemedio, BuscarRemedio, DeletarRemedio } = require('../controller/remedio')
const { autenticarToken } = require('../controller/usuarios')


router.put('/deletar', DeletarRemedio)
router.post('/', autenticarToken, CriarRemedio)
router.put('/:id', AtualizarRemedio)
router.get('/', BuscarRemedio)

module.exports = router
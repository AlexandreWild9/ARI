const prisma = require('../../prisma/prismaClient')


const CriarRemedio = async (req, res) => {
    const { nome, funcao, dosagem } = req.body;

    try {
        const novoRemedio = await prisma.remedio.create({
            data: {
                nome,
                funcao: Number(funcao),
                dosagem: Number(dosagem),
            },
        });

        res.status(201).json(novoRemedio);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar o remedio." });
    }
}

const AtualizarRemedio = async (req, res) => {
    const { id, nome, funcao, dosagem } = req.body;

    try {
        const remedio = await prisma.remedio.update({
            where: {
                id: Number(id),
            },
            data: {
                nome,
                funcao: Number(funcao),
                dosagem: Number(dosagem),
            },
        });

        res.status(200).json(remedio);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar o remedio." });
    }
}

const BuscarRemedio = async (req, res) => {
    try {
        const remedios = await prisma.remedio.findMany();
        res.status(200).json(remedios);
    } catch (error) {
        res.status(400).json({ error: "Erro ao buscar os remedios." });
    }
}

const DeletarRemedio = async (req, res) => {
    const { id } = req.body;

    try {
        const remedio = await prisma.remedio.update({
            where: {
                id: Number(id),
            },
            data: {
                status: false,
            },
        });

        res.status(200).json(remedio);
    } catch (error) {
        res.status(400).json({ error: "Erro ao deletar o remedio." });
    }
}

module.exports = { CriarRemedio, AtualizarRemedio, BuscarRemedio, DeletarRemedio }
const prisma = require('../../prisma/prismaClient')

const CriarPrescricao = async (req, res) => {
    const { id_usuario, observacao, id_remedio, frequencia, horario_notificacao, dt_inicio } = req.body;
    console.log("Dados recebidos:", req.body); // Verifica o que está sendo recebido
    try {
        // Converte o horário de notificação para um Date usando a data atual
        const [hours, minutes] = horario_notificacao.split(":");
        const dataAtual = new Date();
        dataAtual.setHours(Number(hours), Number(minutes), 0, 0); // Define a hora e o minuto

        // Define a data de início, usando a data atual se não fornecida
        const dataInicio = dt_inicio ? new Date(dt_inicio) : new Date();

        // Criação da prescrição no banco de dados
        const novaPrescricao = await prisma.prescricao.create({
            data: {
                id_usuario: Number(id_usuario),
                observacao,
                id_remedio: Number(id_remedio),
                frequencia,
                horario_notificacao: dataAtual, // Salva o Date criado com hora ajustada
                dt_inicio: dataInicio,
            },
        });

        res.status(201).json(novaPrescricao);
    } catch (error) {
        console.error("Erro ao criar a prescrição:", error);
        res.status(400).json({ error: "Erro ao criar a prescrição." });
    }
};

const AtualizarPrescricao = async (req, res) => {
    const { id, observacao, id_remedio, frequencia, horario_notificacao, dt_inicio } = req.body;

    try {
        const prescricaoAtualizada = await prisma.prescricao.update({
            where: {
                id: Number(id),
            },
            data: {
                observacao,
                id_remedio: Number(id_remedio),
                frequencia,
                horario_notificacao: new Date(horario_notificacao),
                dt_inicio: new Date(dt_inicio),
            },
        });

        res.status(200).json(prescricaoAtualizada);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar a prescrição." });
    }
}

const buscarPrescricaoPorUsuarioId = async (req, res) => {
    const { id_usuario } = req.body;
    try {
        const prescricoes = await prisma.prescricao.findMany({
            where: {
                id_usuario: Number(id_usuario),
            },
        });

        if (prescricoes.length === 0) {
            return res.status(404).json({ error: 'Nenhuma prescrição encontrada' });
        }
        res.json(prescricoes);
    } catch (error) {
        console.error("Erro ao buscar as prescrições:", error);
        res.status(500).json({ error: 'Erro ao buscar as prescrições' });
    }
};


const BuscarPrescricao = async (req, res) => {
    try {
        const prescricoes = await prisma.prescricao.findMany();
        res.status(200).json(prescricoes);
    } catch (error) {
        res.status(400).json({ error: "Erro ao buscar as prescrições." });
    }
}

const DeletarPrescricao = async (req, res) => {
    const { id } = req.body;

    try {
        const prescricaoDeletada = await prisma.prescricao.update({
            where: {
                id: Number(id),
            },
            data: {
                status: false,
            },
        });

        res.status(200).json(prescricaoDeletada);
    } catch (error) {
        res.status(400).json({ error: "Erro ao deletar a prescrição." });
    }
}

module.exports = { CriarPrescricao, AtualizarPrescricao, BuscarPrescricao, buscarPrescricaoPorUsuarioId, DeletarPrescricao }

"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

// obter valor do cookie
const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
};

export default function AdicionarMedicacao() {
    const [remedies, setRemedies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRemedies, setFilteredRemedies] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [frequency, setFrequency] = useState('');
    const [observations, setObservations] = useState('');
    const [notificationTime, setNotificationTime] = useState('');
    const [selectedRemedyId, setSelectedRemedyId] = useState<number | null>(null);
    const router = useRouter();
    const frequencyOptions = [
        'Uma vez ao dia',
        'Duas vezes ao dia',
        'Três vezes ao dia',
        'Quando necessário (nenhum lembrete)',
    ];

    // Fetch de remédios
    useEffect(() => {
        const fetchRemedies = async () => {
            try {
                const response = await fetch('http://localhost:3001/remedios');
                const data = await response.json();
                setRemedies(data);
            } catch (error) {
                console.error('Erro ao buscar remédios:', error);
            }
        };
        fetchRemedies();
    }, []);

    // Filtragem de remédios
    useEffect(() => {
        if (searchTerm) {
            const filtered = remedies.filter((remedy) =>
                remedy?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRemedies(filtered);
        } else {
            setFilteredRemedies([]);
        }
    }, [searchTerm, remedies]);

    // Obter ID do usuário do cookie
    const getUserIdFromCookie = (): number | null => {
        const userData = getCookie('userData');
        if (userData) {
            try {
                const decodedData = decodeURIComponent(userData);
                const parsedData = JSON.parse(decodedData);
                return parsedData.id;
            } catch (error) {
                console.error('Erro ao obter ID do usuário:', error);
            }
        }
        return null;
    };

    // Criar prescrição
    const handleCreatePrescription = async () => {
        const id_usuario = getUserIdFromCookie();
        if (!id_usuario) {
            console.error("ID do usuário não encontrado.");
            return;
        }

        const requestBody = {
            id_usuario,
            observacao: observations,
            id_remedio: selectedRemedyId,
            frequencia: frequency,
            horario_notificacao: notificationTime,
        };

        try {
            const response = await fetch('http://localhost:3001/prescricao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                console.log('Prescrição criada com sucesso');
                setSearchTerm('');
                setFrequency('');
                setObservations('');
                setNotificationTime('');
                setCurrentStep(0);
                router.push("../prescricoes");

            } else {
                console.error('Erro ao criar a prescrição');
            }
        } catch (error) {
            console.error('Erro ao enviar prescrição:', error);
        }
    };

    // Renderizar campos de input
    const renderInputFields = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="flex flex-col w-[600px] gap-4 bg-slate-400 p-10">
                        <input
                            type="text"
                            placeholder="Digite o nome do medicamento"
                            value={searchTerm || ''}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4"
                        />
                        {filteredRemedies.length > 0 && (
                            <ul className="bg-white border w-[600px]">
                                {filteredRemedies.map((remedy) => (
                                    <li
                                        key={remedy.id}
                                        onClick={() => {
                                            setSearchTerm(remedy.nome);
                                            setSelectedRemedyId(remedy.id);
                                            setCurrentStep(1);
                                        }}
                                    >
                                        {remedy.nome}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            case 1:
                return (
                    <div className="flex flex-col w-[600px] gap-4 bg-slate-400 p-10">
                        {frequencyOptions.map((option) => (
                            <label key={option}>
                                <input
                                    type="radio"
                                    value={option}
                                    checked={frequency === option}
                                    onChange={() => setFrequency(option)}
                                />
                                {option}
                            </label>
                        ))}
                        <button onClick={() => setCurrentStep(2)}>Próximo</button>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col w-[600px] gap-4 bg-slate-400 p-10">
                        <input
                            type="time"
                            value={notificationTime}
                            onChange={(e) => setNotificationTime(e.target.value)}
                        />
                        <button onClick={() => setCurrentStep(3)}>Próximo</button>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col w-[600px] gap-4 bg-slate-400 p-10">
                        <input
                            type="text"
                            placeholder="Observações"
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                        />
                        <button onClick={handleCreatePrescription}
                        
                        >Adicionar Prescrição</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return <div>{renderInputFields()}</div>;
}

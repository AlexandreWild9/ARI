"use client";
import { useEffect, useState } from "react";

// Função para obter valor do cookie
const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
};

// Função para obter os dados do usuário do cookie
const getUserDataFromCookie = () => {
    const userDataString = getCookie('userData');
    if (!userDataString) return null;

    try {
        const decodedValue = decodeURIComponent(userDataString);
        return JSON.parse(decodedValue);
    } catch (error) {
        console.error('Erro ao parsear o cookie:', error);
        return null;
    }
};

export default function Page() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const userData = getUserDataFromCookie();
        if (userData) {
            setUserId(userData.id);
            setUserName(userData.name);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchPrescriptions = async (id_usuario) => {
                try {
                    const response = await fetch('http://localhost:3001/prescricao/buscar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id_usuario }),
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao buscar prescrições');
                    }
                    const data = await response.json();
                    setPrescriptions(data);
                } catch (error) {
                    console.error('Erro ao buscar prescrições:', error);
                }
            };

            fetchPrescriptions(userId);
        }
    }, [userId]);

    return (
        <div>
            <h1>Prescrições de {userName}</h1>
            <ul>
                {prescriptions.map((prescription) => (
                    <li key={prescription.id}>
                        <h2>{prescription.nome}</h2>
                        <p>Observação: {prescription.observacao}</p>
                        <p>Horário de tomar medicamento: {prescription.horario_notificacao}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

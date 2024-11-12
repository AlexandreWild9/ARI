"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userData = getCookie("userData");
    if (userData) {
      try {
        // Decodifica o valor do cookie
        const decodedData = decodeURIComponent(userData);

        // Parseando o JSON
        const { id, name } = JSON.parse(decodedData);
        setUserId(id);
        setUserName(name);
      } catch (e) {
        console.error("Erro ao parsear userData:", e);
      }
    }
  }, []);

  const handleClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-semibold mb-10 text-blue-800">Área do Usuário</h1>
      <p className="text-lg mb-12 text-gray-700">
        Seja bem-vindo, {userName || "usuário"}!
      </p>

      <div className="flex gap-12">
        {/* Cartão para adicionar medicação */}
        <div
          className="w-[350px] h-[500px] bg-white shadow-xl rounded-lg flex flex-col items-center p-4 cursor-pointer hover:bg-blue-100 transition-all"
          onClick={() => handleClick("../adicionarMedicacao")}
        >
          <div className="h-72 flex items-center justify-center mb-6">
            <Image
              src="/images/cartela.png"
              alt="Adicionar Medicamento"
              width={256}
              height={256}
              className="rounded-md"
            />
          </div>
          <h2 className="text-2xl font-semibold text-blue-800">Adicionar Medicamento</h2>
          <p className="text-gray-600 text-center text-lg mt-4">
            Clique aqui para adicionar um novo medicamento
          </p>
        </div>

        {/* Cartão para ver as prescrições */}
        <div
          className="w-[350px] h-[500px] bg-white shadow-xl rounded-lg flex flex-col items-center p-4 cursor-pointer hover:bg-blue-100 transition-all"
          onClick={() => handleClick("../prescricoes")}
        >
          <div className="h-72 flex items-center justify-center mb-6">
            <Image
              src="/images/agenda.png"
              alt="Minhas Prescrições"
              width={256}
              height={256}
              className="rounded-md"
            />
          </div>
          <h2 className="text-2xl font-semibold text-blue-800">Minhas Prescrições</h2>
          <p className="text-gray-600 text-center text-lg mt-4">
            Veja e gerencie suas prescrições aqui
          </p>
        </div>
      </div>
    </div>
  );
}

// Função utilitária para obter o valor de um cookie
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

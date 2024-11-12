"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useUser } from "../contexts/UserContext";

interface LoginFormData {
  email: string;
  senha: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const router = useRouter();
  const { setUser } = useUser(); // Obtendo o setter do contexto

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await fetch("http://localhost:3001/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Inclui cookies na requisição
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Usuário logado:", result);

        // Salvando os dados do usuário no contexto
        setUser({ id: result.id, name: result.name });

        // Redirecionando para a área do usuário
        router.push("../area-usuario");
      } else {
        const error = await response.json();
        console.error("Falha ao logar usuário:", error);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col w-[600px] gap-4 bg-slate-400 p-10">
          <h1>Login</h1>
          <input
            className="w-full h-12 font-roboto border text-black text-xl p-4 rounded-full focus:outline-none focus:border-violet-600"
            type="email"
            placeholder="Digite seu email"
            {...register("email")}
          />
          <input
            className="w-full h-12 font-roboto border text-black text-xl p-4 rounded-full focus:outline-none focus:border-violet-600"
            type="password"
            placeholder="Digite sua senha"
            {...register("senha")}
          />
          <button
            type="submit"
            className="w-full h-12 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

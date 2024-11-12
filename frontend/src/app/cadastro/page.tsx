"use client";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

const cadastroValidationSchema = zod
  .object({
    nome: zod.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: zod.string().email("E-mail inválido"),
    data_nascimento: zod.string().refine((value) => {
      return !isNaN(Date.parse(value));
    }, "Data de nascimento inválida"),
    senha: zod.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmSenha: zod
      .string()
      .min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: "As senhas não conferem",
    path: ["confirmSenha"],
  });

type CadastroFormData = zod.infer<typeof cadastroValidationSchema>;

export default function Cadastro() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroValidationSchema),
  });

  const onSubmit = async (data: CadastroFormData) => {
    try {
      const response = await fetch("http://localhost:3001/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Usuário criado:", result);
        router.push("../login"); // Redirecionando o usuário para a tela de login
      } else {
        const error = await response.json();
        console.error("Falha ao criar usuário:", error);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col text-center w-[650px]">
          <Image
            src="/images/vovo.jpg"
            alt="Vovô"
            width={256}
            height={256}
            className="rounded-md self-center"
          />
          <h1 className="text-2xl">ARI é o seu Assistente de Remédios Inteligente é um sistema que envia lembretes para ajudar os usuários a tomar medicamentos no horário certo.</h1>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="flex flex-col gap-4">
          <h2 className="text-center text-2xl font-bold text-blue-800">Cadastro de Usuário</h2>

          <input
            className="w-full h-12 text-lg text-gray-700 border border-gray-400 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            id="nome"
            type="text"
            placeholder="Nome Completo"
            {...register("nome")}
          />
          {errors.nome && <span className="text-red-600 text-sm">{errors.nome.message}</span>}

          <input
            className="w-full h-12 text-lg text-gray-700 border border-gray-400 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            id="email"
            type="email"
            placeholder="E-mail (exemplo@dominio.com)"
            {...register("email")}
          />
          {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
          <label htmlFor="">Data de Nascimento</label>
          <input
            className="w-full h-12 text-lg text-gray-700 border border-gray-400 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            id="data_nascimento"
            type="date"
            {...register("data_nascimento")}
          />
          {errors.data_nascimento && <span className="text-red-600 text-sm">{errors.data_nascimento.message}</span>}

          <input
            className="w-full h-12 text-lg text-gray-700 border border-gray-400 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            id="senha"
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            {...register("senha")}
          />
          {errors.senha && <span className="text-red-600 text-sm">{errors.senha.message}</span>}

          <input
            className="w-full h-12 text-lg text-gray-700 border border-gray-400 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            id="confirmSenha"
            type="password"
            placeholder="Confirme sua senha"
            {...register("confirmSenha")}
          />
          {errors.confirmSenha && <span className="text-red-600 text-sm">{errors.confirmSenha.message}</span>}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg py-3 rounded-lg transition-colors duration-200"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
    </div >
  );
}

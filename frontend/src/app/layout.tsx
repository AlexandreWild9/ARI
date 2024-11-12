import "./globals.css";
import { UserProvider } from "./contexts/UserContext"; // Importação do UserProvider

export const metadata = {
  title: "Minha Aplicação",
  description: "Descrição da aplicação",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <UserProvider>
          {children} {/* Todas as páginas e componentes estarão dentro do UserProvider */}
        </UserProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import SiteHeader from "./components/SiteHeader";

export const metadata = {
  title: "Classilagos",
  description: "O seu guia de compras e serviços na Região dos Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-slate-900">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}


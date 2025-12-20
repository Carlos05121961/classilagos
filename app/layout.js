import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata = {
  title: "Classilagos",
  description: "O seu guia de compras e serviços na Região dos Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
  <body className="bg-slate-950 text-slate-50 overflow-x-hidden">

        <SiteHeader />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}


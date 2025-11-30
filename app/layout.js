import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import AuthProvider from "./AuthProvider";
import MobileAnunciarBar from "./components/MobileAnunciarBar";

export const metadata = {
  title: "Classilagos",
  description: "O seu guia de compras e serviços na Região dos Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* pb-12 garante espaço p/ barra fixa no mobile */}
      <body className="bg-white text-slate-900 pb-14 md:pb-0">
        <AuthProvider>
          <SiteHeader />
          {children}
          {/* Barra fixa no mobile */}
          <MobileAnunciarBar />
        </AuthProvider>
      </body>
    </html>
  );
}

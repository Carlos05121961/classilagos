import "./globals.css";

export const metadata = {
  title: "Classilagos",
  description: "O seu guia de compras e serviços na Região dos Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}

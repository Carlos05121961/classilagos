export const metadata = {
  title: "Quiosque da Ritinha | Pé na areia em Maricá",
  description:
    "Pastel de camarão, frutos do mar e o sabor que conquista quem passa pela praia.",

  openGraph: {
    title: "Quiosque da Ritinha | Pé na areia em Maricá",
    description:
      "Pastel de camarão, frutos do mar e o sabor que conquista quem passa pela praia.",
    url: "https://classilagos.shop/digital/ritinha",
    siteName: "Classilagos",
    images: [
      {
        url: "https://classilagos.shop/digital/ritinha/opengraph-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RitinhaLayout({ children }) {
  return (
    <div style={{ background: "#ffffff" }}>
      {children}

      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#999",
          marginTop: "40px",
          padding: "20px 0",
        }}
      >
        Produzido por Classilagos Digital
      </div>
    </div>
  );
}

export const metadata = {
  title: "Pousada Tamarindos Maricá",
  description:
    "Hospede-se de frente para a Lagoa de Araçatiba. Conforto, café da manhã incluso e localização privilegiada em Maricá/RJ.",
  openGraph: {
    title: "Pousada Tamarindos Maricá",
    description:
      "Hospede-se de frente para a Lagoa de Araçatiba. Conforto, café da manhã incluso e localização privilegiada em Maricá/RJ.",
    url: "https://classilagos.shop/digital/tamarindos",
    siteName: "Classilagos",
    images: [
      {
        url: "https://classilagos.shop/digital/tamarindos/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pousada Tamarindos Maricá - Lagoa de Araçatiba",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pousada Tamarindos Maricá",
    description:
      "Hospede-se de frente para a Lagoa de Araçatiba. Conforto, café da manhã incluso e localização privilegiada em Maricá/RJ.",
    images: ["https://classilagos.shop/digital/tamarindos/opengraph-image.jpg"],
  },
};

export default function TamarindosLayout({ children }) {
  return children;
}

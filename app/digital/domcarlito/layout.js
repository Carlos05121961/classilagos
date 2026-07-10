import MetaPixel from "./MetaPixel";

export const metadata = {
  title: "Dom Carlito Smoke | Hambúrgueres Artesanais",
  description:
    "Hambúrgueres artesanais preparados na hora, com delivery e retirada no Deck de Jacaroá.",
};

export default function DomCarlitoLayout({ children }) {
  return (
    <>
      <MetaPixel />
      {children}
    </>
  );
}

import AnuncioDetalheClient from "./AnuncioDetalheClient";

export default function Page({ params }) {
  return <AnuncioDetalheClient id={params.id} />;
}

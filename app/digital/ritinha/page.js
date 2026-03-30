export const dynamic = "force-dynamic";

export default function RitinhaPage() {
  const whatsapp = "5521968698306";

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f9fafb" }}>
      
      {/* HERO */}
      <section style={{
        padding: "40px 20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
        color: "#fff"
      }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Quiosque da Ritinha
        </h1>
        <p style={{ fontSize: "18px" }}>
          Sabor, tradição e pé na areia em Maricá
        </p>

        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          style={{
            display: "inline-block",
            marginTop: "20px",
            background: "#22c55e",
            padding: "14px 24px",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: "bold",
            textDecoration: "none"
          }}
        >
          Falar no WhatsApp
        </a>
      </section>

      {/* GALERIA */}
      <section style={{ padding: "30px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Nossos Sabores
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "10px"
        }}>
          {[
            "/ritinha/1.jpg",
            "/ritinha/2.jpg",
            "/ritinha/3.jpg",
            "/ritinha/4.jpg",
            "/ritinha/5.jpg",
            "/ritinha/6.jpg",
          ].map((img, i) => (
            <img
              key={i}
              src={img}
              alt="Prato Ritinha"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section style={{ padding: "20px" }}>
        <h2>Sobre</h2>
        <p>
          Um dos quiosques mais tradicionais da Barra de Maricá,
          conhecido pelo sabor, atendimento e ambiente à beira-mar.
        </p>
      </section>

      {/* INFO */}
      <section style={{ padding: "20px" }}>
        <h2>Informações</h2>
        <p>📍 Rua 10 – Barra de Maricá</p>
        <p>🕘 09h às 18h</p>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: "30px",
        textAlign: "center"
      }}>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          style={{
            background: "#16a34a",
            padding: "16px 28px",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: "bold",
            textDecoration: "none"
          }}
        >
          Peça agora pelo WhatsApp
        </a>

        <p style={{ marginTop: "15px", fontStyle: "italic" }}>
          Quem vem uma vez, sempre volta
        </p>
      </section>

    </main>
  );
}

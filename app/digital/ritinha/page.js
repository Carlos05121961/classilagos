"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function RitinhaPage() {
  const whatsapp = "5521968698306";

  const heroImages = [
    "/ritinha/hero-ritinha-2.jpg",
    "/ritinha/hero-ritinha-1.jpg",
  ];

  const galeria = [
    "/ritinha/1.jpg.webp",
    "/ritinha/2.jpg.webp",
    "/ritinha/3.jpg.webp",
    "/ritinha/4.jpg.webp",
    "/ritinha/5.jpg.webp",
    "/ritinha/6.jpg.webp",
  ];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const sectionTitle = {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontSize: "clamp(2rem, 3vw, 3rem)",
    lineHeight: 1.15,
    color: "#0f172a",
    marginBottom: "14px",
  };

  const sectionText = {
    fontSize: "1.05rem",
    lineHeight: 1.8,
    color: "#475569",
  };

  return (
    <main
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        background: "#fffdf8",
        color: "#0f172a",
      }}
    >
      {/* HERO */}
      <section
        style={{
          background: "#fff",
        }}
      >
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            background: "#e5e7eb",
          }}
        >
          <img
            src="/ritinha/hero-ritinha-1.jpg"
            alt="Quiosque da Ritinha na Barra de Maricá"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            padding: "34px 20px 38px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#c2410c",
              fontWeight: "bold",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.9rem",
              marginBottom: "12px",
            }}
          >
            Barra de Maricá • Pé na areia
          </p>

          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(2.3rem, 4.8vw, 4.4rem)",
              lineHeight: 1.08,
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            Quiosque da Ritinha
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 1.9vw, 1.28rem)",
              color: "#475569",
              maxWidth: "760px",
              margin: "0 auto 24px",
              lineHeight: 1.7,
            }}
          >
            Sabor, tradição e aquele clima especial da praia em um dos cantinhos
            mais queridos da Barra de Maricá.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#22c55e",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "14px 24px",
                borderRadius: "999px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                fontSize: "1rem",
              }}
            >
              Falar no WhatsApp
            </a>

            <a
              href="https://www.instagram.com/quiosquedaritinha/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#ffffff",
                color: "#0f172a",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "14px 24px",
                borderRadius: "999px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
              }}
            >
              Ver Instagram
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ padding: "70px 20px 30px" }}>
        <div
          style={{
            maxWidth: "1050px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#ea580c",
              fontWeight: "bold",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Um lugar especial na Barra
          </p>

          <h2 style={sectionTitle}>
            Tradição, sabor e uma vista que faz todo mundo querer voltar
          </h2>

          <p
            style={{
              ...sectionText,
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            O Quiosque da Ritinha reúne tudo o que faz a experiência na praia ser
            inesquecível: comida saborosa, ambiente acolhedor, atendimento com
            carinho e aquele clima pé na areia que já conquistou moradores e
            visitantes em Maricá.
          </p>
        </div>
      </section>

      {/* GALERIA */}
      <section style={{ padding: "28px 20px 34px" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {galeria.map((img, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#f1f5f9",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                }}
              >
                <img
                  src={img}
                  alt="Quiosque da Ritinha"
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RITINHA */}
      <section style={{ padding: "44px 20px" }}>
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "26px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff7ed",
              borderRadius: "24px",
              padding: "14px",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
            }}
          >
            <img
              src="/ritinha/ritinha-ilustracao.png"
              alt="Ritinha"
              style={{
                width: "100%",
                borderRadius: "18px",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>

          <div>
            <p
              style={{
                color: "#ea580c",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              A alma do quiosque
            </p>

            <h2 style={sectionTitle}>Por trás do sabor, está a Ritinha</h2>

            <p style={{ ...sectionText, marginBottom: "16px" }}>
              Mais do que um ponto de praia, o Quiosque da Ritinha representa
              carinho no atendimento, tradição e comida feita com capricho.
              É esse jeito acolhedor que transformou o espaço em referência para
              quem procura boa comida e um clima especial na Barra de Maricá.
            </p>

            <p style={sectionText}>
              Cada prato, cada pastel e cada detalhe carregam essa identidade
              forte: simplicidade, sabor e uma história construída com dedicação
              ao longo do tempo.
            </p>
          </div>
        </div>
      </section>

      {/* CARDAPIO */}
      <section
        style={{
          padding: "56px 20px",
          background:
            "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <p
              style={{
                color: "#ea580c",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              Cardápio
            </p>

            <h2 style={sectionTitle}>Sabores que conquistam na beira da praia</h2>

            <p
              style={{
                ...sectionText,
                maxWidth: "760px",
                margin: "0 auto",
              }}
            >
              Uma prévia especial do que o público encontra no Quiosque da Ritinha.
              Aqui, o sabor do mar e o famoso pastel ganham destaque.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            {[
              {
                titulo: "🥟 Pastéis",
                itens: [
                  "Pastel de camarão",
                  "Pastel de queijo",
                  "Pastel misto",
                  "Pastel especial da casa",
                ],
              },
              {
                titulo: "🍤 Frutos do mar",
                itens: [
                  "Camarão ao alho e óleo",
                  "Porção de frutos do mar",
                  "Bobó de camarão",
                  "Peixes e acompanhamentos",
                ],
              },
              {
                titulo: "🍽️ Pratos servidos",
                itens: [
                  "Peixe frito com camarão",
                  "Pratos para compartilhar",
                  "Arroz, feijão e acompanhamentos",
                  "Sabores caseiros à beira-mar",
                ],
              },
              {
                titulo: "🥤 Bebidas",
                itens: [
                  "Cerveja gelada",
                  "Refrigerantes",
                  "Água mineral",
                  "Água de coco",
                ],
              },
            ].map((grupo, index) => (
              <div
                key={index}
                style={{
                  background: "#ffffff",
                  borderRadius: "22px",
                  padding: "22px",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "14px",
                    color: "#0f172a",
                  }}
                >
                  {grupo.titulo}
                </h3>

                <ul
                  style={{
                    paddingLeft: "18px",
                    margin: 0,
                    color: "#475569",
                    lineHeight: 1.9,
                  }}
                >
                  {grupo.itens.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "26px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#475569",
                marginBottom: "18px",
                fontSize: "1rem",
              }}
            >
              Cardápio ilustrativo para apresentação. O cardápio completo pode ser
              organizado em uma versão oficial da página.
            </p>

            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#22c55e",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "14px 24px",
                borderRadius: "999px",
              }}
            >
              Pedir pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* INFOS */}
      <section style={{ padding: "56px 20px 20px" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
            }}
          >
            {[
              {
                titulo: "📍 Localização",
                texto: "Rua 10, Barra de Maricá",
              },
              {
                titulo: "🕘 Horário",
                texto: "Das 9h às 18h",
              },
              {
                titulo: "📲 Instagram",
                texto: "@quiosquedaritinha",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.07)",
                }}
              >
                <h3
                  style={{
                    marginBottom: "10px",
                    fontSize: "1.18rem",
                    color: "#0f172a",
                  }}
                >
                  {item.titulo}
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.7 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "46px 20px 96px" }}>
        <div
          style={{
            maxWidth: "920px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            color: "#ffffff",
            borderRadius: "28px",
            padding: "36px 24px",
            textAlign: "center",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(1.9rem, 3vw, 2.8rem)",
              marginBottom: "14px",
              lineHeight: 1.2,
            }}
          >
            Fale direto com o Quiosque da Ritinha
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto 24px",
              color: "#cbd5e1",
              lineHeight: 1.8,
              fontSize: "1.02rem",
            }}
          >
            Descubra sabores especiais, acompanhe as novidades e entre em contato
            para conhecer melhor esse cantinho querido da Barra de Maricá.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#22c55e",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "14px 24px",
                borderRadius: "999px",
              }}
            >
              Chamar no WhatsApp
            </a>

            <a
              href="https://www.instagram.com/quiosquedaritinha/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#ffffff",
                color: "#0f172a",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "14px 24px",
                borderRadius: "999px",
              }}
            >
              Abrir Instagram
            </a>
          </div>
        </div>
      </section>

      {/* BOTAO FLUTUANTE */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          right: "18px",
          bottom: "18px",
          background: "#22c55e",
          color: "#ffffff",
          textDecoration: "none",
          fontWeight: "bold",
          padding: "14px 20px",
          borderRadius: "999px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          zIndex: 50,
        }}
      >
        WhatsApp
      </a>
    </main>
  );
}

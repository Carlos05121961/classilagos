"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function RitinhaPage() {
  const whatsapp = "5521968698306";

  const heroImages = [
    "/ritinha/hero-ritinha-1.jpg",
    "/ritinha/hero-ritinha-2.jpg",
  ];

  const galeria = [
    "/ritinha/hero-ritinha-1.jpg",
    "/ritinha/1.jpg.webp",
    "/ritinha/2.jpg.webp",
    "/ritinha/3.jpg.webp",
    "/ritinha/4.jpg.webp",
    "/ritinha/5.jpg.webp",
    "/ritinha/6.jpg.webp",
    "/ritinha/hero-ritinha-2.jpg",
  ];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f8fafc", color: "#0f172a" }}>
      <section
        style={{
          position: "relative",
          minHeight: "72vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {heroImages.map((image, index) => (
          <div
            key={image}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: currentHero === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              transform: "scale(1.02)",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "24px",
            maxWidth: "900px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
              color: "#ffffff",
              marginBottom: "14px",
              lineHeight: 1.05,
            }}
          >
            Quiosque da Ritinha
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              color: "#f8fafc",
              maxWidth: "760px",
              margin: "0 auto 24px",
              lineHeight: 1.5,
            }}
          >
            Sabor, tradição e pé na areia na Barra de Maricá.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
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
                background: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "14px 24px",
                borderRadius: "999px",
                fontSize: "1rem",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              Ver Instagram
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 20px 28px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: "#0ea5e9",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "10px",
            }}
          >
            Um lugar especial na Barra
          </p>

          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              marginBottom: "16px",
            }}
          >
            Tradição, praia e sabores que marcam
          </h2>

          <p
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              fontSize: "1.05rem",
              color: "#334155",
              lineHeight: 1.7,
            }}
          >
            O Quiosque da Ritinha é daqueles lugares que o público guarda na memória.
            Um ponto conhecido da Barra de Maricá, com clima pé na areia, pratos
            saborosos, frutos do mar e o famoso pastel que tanta gente já conhece.
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 20px 30px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {galeria.map((img, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: "#e2e8f0",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                }}
              >
                <img
                  src={img}
                  alt="Quiosque da Ritinha"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "30px 20px 10px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
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
              texto: "Todos os dias, das 9h às 18h",
            },
            {
              titulo: "🍤 Destaques",
              texto: "Pastel de camarão, frutos do mar e pratos servidos à beira-mar",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                padding: "22px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            >
              <h3 style={{ marginBottom: "10px", fontSize: "1.15rem" }}>{item.titulo}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6 }}>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "46px 20px 90px" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            color: "#ffffff",
            borderRadius: "24px",
            padding: "34px 24px",
            textAlign: "center",
            boxShadow: "0 14px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", marginBottom: "12px" }}>
            Fale direto com o Quiosque da Ritinha
          </h2>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto 22px",
              color: "#cbd5e1",
              lineHeight: 1.7,
            }}
          >
            Veja novidades, entre em contato e descubra por que tanta gente já conhece
            esse cantinho especial da Barra de Maricá.
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
          padding: "14px 18px",
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

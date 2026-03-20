"use client";

import { useState } from "react";

export default function MapaCidades() {
  const [cidade, setCidade] = useState("");

  const handleClick = (nome) => {
    console.log("Cidade:", nome);
    // depois vamos filtrar notícias aqui
  };

  return (
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
      
      {/* Nome da cidade */}
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        {cidade || "Passe o mouse nas cidades"}
      </p>

      <svg viewBox="0 0 1000 400" style={{ width: "100%" }}>

        {/* EXEMPLO (VOCÊ VAI COLAR SEU SVG AQUI) */}

        <path
          id="marica"
          d="..." 
          fill="#f4a261"
          onMouseEnter={() => setCidade("Maricá")}
          onMouseLeave={() => setCidade("")}
          onClick={() => handleClick("marica")}
          style={{ cursor: "pointer" }}
        />

      </svg>
    </div>
  );
}

export default function RitinhaLayout({ children }) {
  return (
    <div style={{ background: "#ffffff" }}>
      {children}

      {/* Assinatura discreta */}
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

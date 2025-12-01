export default function PoliticaPrivacidadePage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
            Legal
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Política de privacidade
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
            Entenda como o Classilagos coleta, utiliza e protege as suas
            informações.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(0,0,0,0.7)] text-sm md:text-base text-slate-200 space-y-4">
          <p>
            O <strong>Classilagos</strong> respeita a sua privacidade e está
            comprometido em proteger os dados pessoais de seus usuários,
            anunciantes e visitantes.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            1. Coleta de informações
          </h2>
          <p>
            Coletamos informações que você fornece ao criar um cadastro ou
            publicar um anúncio, como nome, e-mail, telefone, cidade e dados
            relacionados ao anúncio (ex.: título, descrição, preço, fotos).
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            2. Uso das informações
          </h2>
          <p>Utilizamos esses dados para:</p>
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            <li>Exibir e organizar anúncios no portal;</li>
            <li>Facilitar o contato entre interessados e anunciantes;</li>
            <li>Melhorar a navegação e a experiência do usuário;</li>
            <li>Comunicar avisos importantes relacionados à conta ou ao site.</li>
          </ul>

          <p>
            Não vendemos ou alugamos dados pessoais para terceiros. Eventuais
            integrações com serviços externos (como hospedagem, banco de dados
            e ferramentas de e-mail) seguem as políticas de privacidade desses
            fornecedores.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            3. Cookies e navegação
          </h2>
          <p>
            Podemos utilizar cookies e recursos similares para lembrar
            preferências e entender melhor como o site é utilizado, sempre com
            o objetivo de aprimorar a experiência do usuário.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            4. Segurança
          </h2>
          <p>
            Os dados são armazenados em ambiente seguro, utilizando
            infraestrutura de parceiros como o Supabase e serviços de
            hospedagem modernos, com camadas de proteção e controle de acesso.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            5. Seus direitos
          </h2>
          <p>
            Você pode solicitar a alteração ou remoção de seus dados pessoais e
            anúncios a qualquer momento, entrando em contato pelos nossos
            canais oficiais.
          </p>

          <p className="text-xs text-slate-400 mt-4">
            Em caso de dúvidas sobre esta Política de Privacidade, utilize a
            página <strong>Fale Conosco</strong>.
          </p>
        </div>
      </section>
    </main>
  );
}

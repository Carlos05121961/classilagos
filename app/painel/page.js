"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function PainelPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Não logado → mandar pro login
        router.push("/login");
        return;
      }

      setUsuario(user);

      // Buscar perfil na tabela profiles
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setPerfil(profileData || null);
      setCarregando(false);
    }

    carregarUsuario();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (carregando) {
    return (
      <main className="max-w-xl mx-auto px-4 py-10">
        <p>Carregando seu painel...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Bem-vindo,{" "}
            {perfil?.name || usuario?.email?.split("@")[0] || "Anunciante"}!
          </h1>
          {perfil?.city && (
            <p className="text-sm text-gray-600">
              Cidade: {perfil.city}
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-100"
        >
          Sair
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="font-semibold mb-2">Criar novo anúncio</h2>
          <p className="text-xs text-gray-600 mb-3">
            Imóveis, veículos, serviços, turismo, empregos etc.
          </p>
          <Link
            href="/anunciar"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            Começar agora →
          </Link>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="font-semibold mb-2">Meus anúncios</h2>
          <p className="text-xs text-gray-600 mb-3">
            Em breve você verá aqui a lista dos seus anúncios publicados
            no Classilagos.
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="font-semibold mb-2">Dados da conta</h2>
          <p className="text-xs text-gray-600 mb-3">
            E-mail: {usuario?.email}
          </p>
          {perfil?.phone && (
            <p className="text-xs text-gray-600 mb-1">
              Telefone: {perfil.phone}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

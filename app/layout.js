import "./globals.css";
import Script from "next/script";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata = {
  title: "Classilagos",
  description: "O seu guia de compras e serviços na Região dos Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google tag (gtag.js) - Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17865509628"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
         {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17865509628');
          `}
        </Script>
          <Script
  id="gtm"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-N9MPL3QF');
    `,
  }}
/>
      </head>

      <body className="bg-slate-950 text-slate-50 overflow-x-hidden">
  <noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-N9MPL3QF"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  />
</noscript>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

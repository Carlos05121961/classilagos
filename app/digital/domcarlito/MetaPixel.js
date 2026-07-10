"use client";

import Script from "next/script";

const META_PIXEL_ID = "1973548500013587";

export default function MetaPixel() {
  function iniciarPixelDomCarlito() {
    if (
      typeof window === "undefined" ||
      typeof window.fbq !== "function"
    ) {
      return;
    }

    // Inicializa exclusivamente o Pixel do Dom Carlito.
    window.fbq("init", META_PIXEL_ID);

    // Registra a visita somente no Pixel do Dom Carlito.
    window.fbq(
      "trackSingle",
      META_PIXEL_ID,
      "PageView"
    );

    // Avisa ao page.js que o Pixel já está pronto.
    window.dispatchEvent(
      new Event("domcarlito-pixel-ready")
    );
  }

  return (
    <>
      <Script
        id="domcarlito-meta-pixel"
        strategy="afterInteractive"
        onReady={iniciarPixelDomCarlito}
      >
        {`
          !function(f,b,e,v,n,t,s)
          {
            if(f.fbq)return;

            n=f.fbq=function(){
              n.callMethod
                ? n.callMethod.apply(n,arguments)
                : n.queue.push(arguments);
            };

            if(!f._fbq)f._fbq=n;

            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];

            t=b.createElement(e);
            t.async=!0;
            t.src=v;

            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
          }(
            window,
            document,
            'script',
            'https://connect.facebook.net/en_US/fbevents.js'
          );
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

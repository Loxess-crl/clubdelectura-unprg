import ogImageSrc from "@assets/images/banner.png";

export const SITE = {
  title: "Club de Lectura - UNPRG",
  tagline: "Club de Lectura UNPRG",
  description:
    "Club de Lectura UNPRG es una comunidad de lectores que busca fomentar la lectura en la comunidad universitaria. Únete a nosotros para compartir tus opiniones, descubrir nuevos libros y conectar con otros lectores apasionados.",
  description_short:
    "Club de Lectura UNPRG es una comunidad de lectores que busca fomentar la lectura en la comunidad universitaria.",
  url: "https://clubdelectura-unprg.vercel.app",
  author: "Loxess",
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "es-PE",
    "@id": SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      "@type": "WebSite",
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: "es-PE",
  type: "website",
  url: SITE.url,
  title: `${SITE.title}`,
  description:
    "Club de Lectura UNPRG es una comunidad de lectores que busca fomentar la lectura en la comunidad universitaria. Únete a nosotros para compartir tus opiniones, descubrir nuevos libros y conectar con otros lectores apasionados.",
  image: ogImageSrc,
};

export const links = {
  whatsapp: "https://chat.whatsapp.com/DmsyPbaNT375TlnccC6M2T",
};

export enum LocalStorageKeys {
  user = "user",
  role = "userRole",
}

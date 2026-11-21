# Ceto Studio — sitio web

Home y páginas internas de Ceto Studio. Astro (sitio estático) para Cloudflare Workers, con GSAP, Lenis y WebGL propio.

## Cómo correrlo
```bash
npm install
```
```bash
npm run dev
```
```bash
npm run build
```

## Publicar en Cloudflare
Hace falta iniciar sesión en Cloudflare (`npx wrangler login`) o tener el plugin de Cloudflare autorizado.
```bash
npm run deploy
```

## Dónde está cada cosa
- `src/pages/index.astro`: la home. Textos en `src/data/home.ts`.
- `src/pages/{portfolio,servicios,ia,nosotros}.astro`: páginas internas provisorias.
- `src/styles/global.css`: colores, tipografías y estilos.
- `src/scripts/`:
  - `water.ts`: simulación de agua (cursor, ballena, refracción del título, plancton e intro).
  - `intro.ts`: la gota y el nombre que se revela. Para verla cuadro por cuadro: `/?intro=pausa`.
  - `type.ts`: texto letra por letra.
  - `whale.ts`: la ballena dibujada y su recorrido.
  - `waterline.ts`, `depth.ts`, `work.ts`, `bathy.ts`, `transition.ts`, `cursor.ts`, `nav.ts`.
- `public/media/`: material real de dominio público. Créditos en `docs/diseno/creditos-media.md`.
- `docs/`: brief, análisis de referencias, textos, dirección visual y marca.

## Pendiente (segunda vuelta)
- Versión en inglés, sonido, formulario conectado a GHL y botón de WhatsApp con el número real.
- Portfolio real (hoy son casos de ejemplo) y diseño de las páginas internas.
- Nombres y precios de los pases.

## Publicación actual
- Dirección de prueba: https://ceto-studio.cetostudio.workers.dev/
- Worker `ceto-studio` en la cuenta de Cloudflare (subdominio `cetostudio.workers.dev`), solo assets estáticos.
- Si no hay sesión de Wrangler, se puede publicar por la API: `tools/cf-manifest.py` genera el manifiesto, se abre una sesión de carga, `tools/cf-upload.py` sube los archivos y se actualiza el Worker con el token de cierre.

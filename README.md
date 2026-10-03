# Cockpit AC-LLAR

Gestión de flota de AC-LLAR, publicada con GitHub Pages y con los datos en Supabase (proyecto *AC LLAR COCKPIT*).

- `index.html` — página (carga React, XLSX, supabase-js, `nube.js` y `motor.js`).
- `nube.js` — login, sincronización con la nube en tiempo real, fotos de daños y buzón de HQ.
- `motor.js` — toda la lógica del cockpit.

Los Excel diarios de HQ llegan por correo al buzón en la nube (función `hq-inbound`) y el primer cockpit abierto los importa.

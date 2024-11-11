// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths'
// import basicSsl from '@vitejs/plugin-basic-ssl'
// import fs from 'fs';

// // https://vitejs.dev/config/
// export default defineConfig({
// plugins: [react(), tsconfigPaths(),
// ],
// server: {
//   https: {
//     key: fs.readFileSync('C:\\Program Files\\mkcert\\localhost-key.pem'),
//     cert: fs.readFileSync('C:\\Program Files\\mkcert\\localhost.pem')
//   }
// }
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths'
import basicSsl from '@vitejs/plugin-basic-ssl'
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Set up __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    basicSsl({
      name: 'habito',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Habito',
        short_name: 'Habito',
        start_url: '/',
        display: 'standalone',
        description: 'Track your habits with ease',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/habito-small.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/habito-large.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["/", "*/.{mjs,js,ts,css,html,png,svg,ico,jpeg,jpg,json}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'asset-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
    })
  ],
  server: {
    https: true, // Enable HTTPS
  },
});

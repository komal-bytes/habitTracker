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
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    basicSsl({
      // Optional: Customize your SSL configuration
      name: 'habito', // Name of the certificate
      // domains: ['*.custom.com'], // Custom trust domains (optional)
      // certDir: '/path/to/cert/directory', // Custom certification directory (optional)
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
      injectRegister: false,
      // HERE! For custom service worker
      srcDir: path.resolve(__dirname, 'src/utils/'),
      filename: 'service-worker.js',
      strategies: 'injectManifest',
      workbox: {
        cleanupOutdatedCaches: true,
        globDirectory: path.resolve(__dirname, 'public'),
        globPatterns: ["/", "*/.{mjs,js,css,html,png,svg,ico,jpeg,json}"],
      },
    })
  ],
  server: {
    https: true, // Enable HTTPS
  },
});

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

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    basicSsl({
      // Optional: Customize your SSL configuration
      name: 'habito', // Name of the certificate
      domains: ['*.custom.com'], // Custom trust domains (optional)
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
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["/", "*/.{mjs,js,css,html,png,svg,ico,jpeg,json}"],
      },
    
      // workbox: {
      //   runtimeCaching: [
      //     {
      //       urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
      //       handler: 'CacheFirst',
      //       options: {
      //         cacheName: 'google-fonts-stylesheets',
      //         expiration: {
      //           maxEntries: 20,
      //           maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
      //         }
      //       }
      //     }
      //   ]
      // }
    })
  ],
server: {
  https: true, // Enable HTTPS
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync('C:\\Program Files\\mkcert\\localhost-key.pem'),
  //     cert: fs.readFileSync('C:\\Program Files\\mkcert\\localhost.pem')
  //   }
  // }
});

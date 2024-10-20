import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(),
  ],
  server: {
    https: {
      key: fs.readFileSync('C:\\Program Files\\mkcert\\localhost-key.pem'),
      cert: fs.readFileSync('C:\\Program Files\\mkcert\\localhost.pem')
    }
  }
})

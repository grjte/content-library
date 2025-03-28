import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  base: "/",

  build: {
    target: "esnext",
  },

  plugins: [wasm(), react(), tailwindcss()],

  // TODO: remove; this is for local development, allowing ngrok to be used for atproto oauth
  server: {
    allowedHosts: ['*']
  },

  worker: {
    format: "es",
    plugins: () => [wasm()],
  },
})
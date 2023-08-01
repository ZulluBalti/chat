import { defineConfig } from "vite";
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './main.js'),
      name: "@zullu_balti/chat",
      fileName: format => `chat.${format}.js`
    },
    rollupOptions: {
      external: []
    }
  }
})

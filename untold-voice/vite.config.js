import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  base: './', // ✅ This is the key fix!
  plugins: [react()],
  define: {
    'process.env': process.env
  }
})

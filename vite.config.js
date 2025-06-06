https://workspace.google.com/marketplace/app/highlight_tool_for_google_docs/446226911068?flow_type=2import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/JJ-Pomodoro/',
})

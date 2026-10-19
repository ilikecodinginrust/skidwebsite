import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// On GitHub Actions the site is served from https://<user>.github.io/<repo>/,
// so the asset base must be the repository name. Locally (and for any
// root-served host) it stays at '/'.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})

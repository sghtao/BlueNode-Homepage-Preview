import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

const isGitHubPreview = process.env.GITHUB_REPOSITORY === 'sghtao/BlueNode-Homepage-Preview'

export default defineConfig({
  site: isGitHubPreview ? 'https://sghtao.github.io' : 'https://www.web3bluenode.xyz',
  base: isGitHubPreview ? '/BlueNode-Homepage-Preview' : '/',
  integrations: [sitemap()],
  build: {
    assets: 'assets',
  },
  vite: {
    plugins: [tailwindcss()],
  },
})

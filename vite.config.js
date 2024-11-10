import { defineConfig } from 'vite';
import ghPages from 'vite-plugin-gh-pages';

export default defineConfig({
  plugins: [ghPages()],
  base: '/3D-Cyberpunk-X-Harsh/', 
  // replace 'my-project' with your repository name
});
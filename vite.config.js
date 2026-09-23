import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Re-Dungeon-Game-Banco-De-Dados/' : '/'
}));

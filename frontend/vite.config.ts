import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

/**
 * Vite config for the React SPA. `root` is this folder so `index.html` and `src/` stay together.
 * Env files are loaded from the repository root (parent of `frontend/`) so one `.env` serves both apps.
 */
export default defineConfig(({ mode }) => {
  const repoRoot = path.resolve(__dirname, '..');
  const env = loadEnv(mode, repoRoot, '');
  return {
    root: path.resolve(__dirname),
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'overpass-proxy',
        configureServer(server) {
          const endpoints = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter',
            'https://overpass.nchc.org.tw/api/interpreter',
          ];

          const readBody = async (req: any): Promise<string> => {
            req.setEncoding?.('utf8');
            let data = '';
            try {
              for await (const chunk of req) data += chunk;
              return data;
            } catch (e) {
              throw e;
            }
          };

          const fetchOverpass = async (query: string) => {
            let lastErr: unknown = null;
            for (const url of endpoints) {
              try {
                const resp = await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                  body: query,
                  signal: AbortSignal.timeout(12000),
                });
                if (!resp.ok) {
                  const text = await resp.text().catch(() => '');
                  throw new Error(`Overpass ${resp.status} ${text.slice(0, 160)}`);
                }
                return await resp.json();
              } catch (e) {
                lastErr = e;
              }
            }
            throw lastErr ?? new Error('Overpass failed');
          };

          server.middlewares.use(async (req, res, next) => {
            try {
              if (req.method !== 'POST' || req.url !== '/api/overpass') return next();
              const query = await readBody(req);
              if (!query) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ error: 'Missing query body' }));
                return;
              }

              if (query.trim() === '__ping__') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ ok: true }));
                return;
              }

              const data = await fetchOverpass(query);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify(data));
            } catch (e: any) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: e?.message || 'Proxy error' }));
            }
          });
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/backend/data/**'],
      },
    },
  };
});

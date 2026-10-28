import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import translateHandler from './api/translate.js';

function localDevApiPlugin(apiKey) {
  return {
    name: 'local-dev-api',
    configureServer(server) {
      if (apiKey) {
        process.env.GEMINI_API_KEY = apiKey;
      }
      server.middlewares.use('/api/translate', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            const adaptedReq = {
              method: req.method,
              body: parsedBody
            };
            const adaptedRes = {
              statusCode: 200,
              setHeader(key, value) {
                res.setHeader(key, value);
              },
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(data) {
                res.statusCode = this.statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end() {
                res.end();
              }
            };
            await translateHandler(adaptedReq, adaptedRes);
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Server error' }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  return {
    plugins: [react(), localDevApiPlugin(apiKey)],
  };
});

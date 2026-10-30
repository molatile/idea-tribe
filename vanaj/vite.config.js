import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import translateHandler from './api/translate.js';
import voiceNavigateHandler from './api/voice-navigate.js';
import ttsHandler from './api/tts.js';

function createApiMiddleware(apiHandler, envVars) {
  return (req, res) => {
    if (envVars) {
      for (const [k, v] of Object.entries(envVars)) {
        if (v && !process.env[k]) {
          process.env[k] = v;
        }
      }
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      return;
    }

    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
    });
    req.on('end', async () => {
      try {
        let parsedBody = {};
        if (raw) {
          try {
            parsedBody = JSON.parse(raw);
          } catch {}
        }
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
          send(data) {
            res.statusCode = this.statusCode;
            res.end(data);
          },
          end() {
            res.end();
          }
        };
        await apiHandler(adaptedReq, adaptedRes);
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message || 'Server error' }));
      }
    });
  };
}

function localDevApiPlugin(envVars) {
  return {
    name: 'local-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/translate', createApiMiddleware(translateHandler, envVars));
      server.middlewares.use('/api/voice-navigate', createApiMiddleware(voiceNavigateHandler, envVars));
      server.middlewares.use('/api/tts', createApiMiddleware(ttsHandler, envVars));
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/translate', createApiMiddleware(translateHandler, envVars));
      server.middlewares.use('/api/voice-navigate', createApiMiddleware(voiceNavigateHandler, envVars));
      server.middlewares.use('/api/tts', createApiMiddleware(ttsHandler, envVars));
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const elevenlabsKey = env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;

  if (geminiKey) {
    process.env.GEMINI_API_KEY = geminiKey;
  }
  if (elevenlabsKey) {
    process.env.ELEVENLABS_API_KEY = elevenlabsKey;
  }

  const envVars = {
    GEMINI_API_KEY: geminiKey,
    ELEVENLABS_API_KEY: elevenlabsKey
  };

  return {
    plugins: [react(), localDevApiPlugin(envVars)],
  };
});

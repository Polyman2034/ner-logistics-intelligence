/**
 * PANDAVAS NER Logistics Intelligence Platform
 * Full-Stack Express Server & Vite Dev Middleware
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS headers for local/testing flexibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-role, x-user-id');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Top-level Health Check endpoint (as required by Section 50)
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'pandavas-ner-platform',
      version: '1.0.0',
      region: 'North Eastern Region (NER), India',
      timestamp: new Date().toISOString()
    });
  });

  // Mount REST API
  app.use('/api', apiRouter);

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PANDAVAS] Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();

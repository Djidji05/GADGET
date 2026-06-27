import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des configurations et routes
import { initDatabase } from './src/backend/config/database.js';
import apiRoutes from './src/backend/routes/index.js';
import { advancedLogger, asyncErrorLogger, logError, healthCheck } from './src/backend/middleware/logging.js';
import { generalLimiter } from './src/backend/middleware/rateLimiter.js';
import { swaggerSpec, swaggerUi } from './src/backend/config/swagger.js';
import { initSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from './src/backend/config/sentry.js';

// Background Workers
import './src/backend/workers/emailWorker.js';
import './src/backend/workers/notificationWorker.js';
import './src/backend/workers/paymentReconciliationWorker.js';
import startAbandonedCartCron from './src/backend/scripts/abandoned_cart_cron.js';
import startMonCashExpirationCron from './src/backend/scripts/moncash_expiration_cron.js';
import { startPaymentTimeoutCron } from './src/backend/workers/paymentTimeoutCron.js';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Basic environment configuration
dotenv.config();
dotenv.config({ path: '.env.backend' });

// Global Error Handlers for process stability
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION:', reason);
  // Optional: Capture in Sentry or a log file
});

process.on('uncaughtException', (error) => {
  console.error('💥 UNCAUGHT EXCEPTION:', error);
  // Give some time for logs to flush before exiting
  setTimeout(() => process.exit(1), 1000);
});

const app = express();

// --- CONFIGURATION CORS (DOIT ÊTRE EN PREMIER) ---
app.use(cors({
  origin: function (origin, callback) {
    // Autorise Netlify, localhost et ngrok
    if (!origin || 
        origin.includes('netlify.app') || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') ||
        origin.includes('10.') ||
        origin.includes('192.168.') ||
        origin.includes('ngrok-free.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning']
}));

// Middleware pour bypass l'avertissement ngrok
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});
// ------------------------------------------------

// Passport Config
import passport from 'passport';
import configurePassport from './src/backend/config/passport.js';
configurePassport();
app.use(passport.initialize());

// Initialize Sentry
initSentry(app);
app.use(sentryRequestHandler());
app.use(sentryTracingHandler());

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(cookieParser());
app.use(morgan('dev', {
  skip: (req) => req.method === 'GET' && req.url.includes('/api/notifications')
}));
app.use(advancedLogger);

const PORT = process.env.BACKEND_PORT || 3001;
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    if (req.originalUrl && req.originalUrl.includes('/webhooks/stripe')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api', generalLimiter);

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'HTFasil API Documentation'
}));

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Routes API
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);
app.use('/', apiRoutes); // Alias pour les appels qui oublient le /api

// Middleware de gestion des erreurs
app.use(asyncErrorLogger);

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler());

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  logError(err, req, { type: 'Global Error Handler' });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Erreur serveur interne'
    : err.message;

  res.status(statusCode).json({
    error: 'Erreur serveur',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Route de santé
app.get('/health', async (req, res) => {
  try {
    const { healthCheck } = await import('./src/backend/middleware/logging.js');
    const health = await healthCheck();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      ...health
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: 'Health check failed'
    });
  }
});

// Catch-all handler pour SPA
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.json({ message: 'Backend API is running' });
  }
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Initialiser la base de données
    const dbInitialized = await initDatabase();
    if (!dbInitialized) {
      throw new Error('Database initialization failed');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📊 API available at: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      
      // Lancer les CRON
      startAbandonedCartCron();
      startMonCashExpirationCron();
      startPaymentTimeoutCron();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Force nodemon restart to load Stripe keys
export default app;


import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import reportRoutes from './routes/reportRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middlewares de sécurité avec configuration pour Codespaces
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

// Configuration CORS ajustée pour Codespaces
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'https://*.github.dev', 'https://*.preview.app.github.dev'];

const corsOptions = {
  origin: (origin, callback) => {
    // Permettre les requêtes sans origine (comme les applications mobiles ou Postman)
    if (!origin) {
      return callback(null, true);
    }
    // Vérifier si l'origine est autorisée
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = new RegExp('^' + allowedOrigin.replace('*', '.*') + '$');
        return pattern.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS non autorisé'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache les résultats du preflight pendant 10 minutes
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/reports', authMiddleware, reportRoutes);

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

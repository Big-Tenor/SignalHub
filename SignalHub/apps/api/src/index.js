import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import reportRoutes from './routes/reportRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Configuration CORS flexible pour le développement
const allowedOrigins = [
  // Localhost
  'http://localhost:5173',
  'http://localhost:3000',
  // Codespaces (utilisation d'un pattern pour matcher les URLs de Codespaces)
  /^https:\/\/.*\.app\.github\.dev$/,
  // Vous pouvez ajouter d'autres origines autorisées ici
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (ex: Postman, applications mobiles)
    if (!origin) {
      return callback(null, true);
    }

    // Vérifier si l'origine est autorisée
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS non autorisé pour cette origine'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 heures
  optionsSuccessStatus: 204
};

// Appliquer CORS avant les autres middlewares
app.use(cors(corsOptions));

// Middlewares de sécurité avec configuration pour Codespaces
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
    
app.use(express.json());

app.use(express.json());

// Routes
app.use('/api/reports', authMiddleware, reportRoutes);

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

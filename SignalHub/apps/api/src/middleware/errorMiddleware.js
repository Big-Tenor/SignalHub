export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Gestion des erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.errors
    });
  }

  // Gestion des erreurs Supabase
  if (err.status || err.statusCode) {
    return res.status(err.status || err.statusCode).json({
      error: err.message,
      code: err.code
    });
  }

  // Gestion des erreurs d'authentification
  if (err.message.includes('authentication')) {
    return res.status(401).json({
      error: `Erreur d'authentification`,
      message: err.message
    });
  }

  // Erreur par défaut
  res.status(500).json({
    error: 'Erreur serveur interne',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
};

export default errorMiddleware;

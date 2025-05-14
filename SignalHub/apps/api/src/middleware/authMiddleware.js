import supabase from '../utils/supabase.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    // Ajouter l'utilisateur à l'objet request
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'authentification' });
  }
};

export default authMiddleware;

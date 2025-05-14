import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Vérification des variables d'environnement nécessaires
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error(
    'Les variables d\'environnement Supabase (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY) doivent être définies'
  )
}

if (!import.meta.env.VITE_MAPBOX_TOKEN) {
  console.error(
    'La variable d\'environnement VITE_MAPBOX_TOKEN doit être définie'
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

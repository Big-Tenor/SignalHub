import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Obtenir le token d'accès actuel
export const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// Initialisation du bucket de stockage
export const initStorage = async () => {
  try {
    // Vérifier si le bucket existe
    const { data: buckets } = await supabase.storage.listBuckets()
    const photosBucket = buckets?.find(b => b.name === 'photos')

    if (!photosBucket) {
      // Créer le bucket s'il n'existe pas
      const { data, error } = await supabase.storage.createBucket('photos', {
        public: true, // Permettre l'accès public aux photos
        fileSizeLimit: 5242880, // 5MB en bytes
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      })

      if (error) {
        throw error
      }

      console.log('Bucket "photos" créé avec succès')
    }

    return { error: null }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du stockage:', error)
    return { error }
  }
}

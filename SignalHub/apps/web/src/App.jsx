import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { supabase, initStorage } from './utils/supabase'
import useAuthStore from './context/authStore'
import './App.css'

function App() {
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    // Initialiser le stockage Supabase
    initStorage().catch(console.error)

    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  return <RouterProvider router={router} />
}

export default App

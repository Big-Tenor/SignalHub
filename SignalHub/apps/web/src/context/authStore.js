import { create } from 'zustand'
import { supabase } from '../utils/supabase'

 const  useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, session: data.session })
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },
  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })
  },
}))
export  default useAuthStore;
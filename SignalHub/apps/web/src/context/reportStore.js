import { create } from 'zustand'
import { supabase } from '../utils/supabase'

const useReportStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,
  
  // Récupérer tous les signalements
  fetchReports: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ reports: data })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // Créer un nouveau signalement
  createReport: async (reportData) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        reports: [data, ...state.reports],
      }))

      return { data, error: null }
    } catch (error) {
      set({ error: error.message })
      return { data: null, error }
    } finally {
      set({ loading: false })
    }
  },

  // Mettre à jour un signalement
  updateReport: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === id ? data : report
        ),
      }))

      return { data, error: null }
    } catch (error) {
      set({ error: error.message })
      return { data: null, error }
    } finally {
      set({ loading: false })
    }
  },

  // Supprimer un signalement
  deleteReport: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        reports: state.reports.filter((report) => report.id !== id),
      }))

      return { error: null }
    } catch (error) {
      set({ error: error.message })
      return { error }
    } finally {
      set({ loading: false })
    }
  },

  // S'abonner aux mises à jour en temps réel
  subscribeToReports: () => {
    const subscription = supabase
      .channel('reports')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports',
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              set((state) => ({
                reports: [payload.new, ...state.reports],
              }))
              break
            case 'UPDATE':
              set((state) => ({
                reports: state.reports.map((report) =>
                  report.id === payload.new.id ? payload.new : report
                ),
              }))
              break
            case 'DELETE':
              set((state) => ({
                reports: state.reports.filter(
                  (report) => report.id !== payload.old.id
                ),
              }))
              break
            default:
              break
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  },
}))

export default useReportStore

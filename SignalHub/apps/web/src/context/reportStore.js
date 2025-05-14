import { create } from 'zustand'
import { supabase, getAccessToken } from '../utils/supabase'
import { Report } from '@repo/shared'

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('La variable d\'environnement VITE_API_URL n\'est pas définie');
}

const useReportStore = create((set, get) => ({
  reports: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  
  // État pour les filtres
  filters: {
    location: null,
    type: null,
    status: null,
  },
  
  // Configurer les filtres
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1 // Réinitialiser la pagination lors du changement de filtres
    }))
  },

  // Réinitialiser les filtres
  resetFilters: () => {
    set({
      filters: {
        location: null,
        type: null,
        status: null,
      },
      page: 1
    })
  },

  // Mettre à jour la pagination
  setPage: (newPage) => set({ page: newPage }),
  setLimit: (newLimit) => set({ limit: newLimit, page: 1 }),

  // Récupérer tous les signalements avec pagination et filtres
  fetchReports: async () => {
    const { page, limit, filters } = get()
    set({ loading: true, error: null })

    try {
      let url = new URL(`${API_URL}/reports`)
      
      // Ajouter les paramètres de pagination
      url.searchParams.append('page', page)
      url.searchParams.append('limit', limit)
      
      // Ajouter les filtres
      if (filters.location) {
        url.searchParams.append('lat', filters.location.latitude)
        url.searchParams.append('lng', filters.location.longitude)
        url.searchParams.append('radius', filters.location.radius || 10)
      }
      if (filters.type) {
        url.searchParams.append('type', filters.type)
      }
      if (filters.status) {
        url.searchParams.append('status', filters.status)
      }

      const token = await getAccessToken()
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des signalements')
      }
      
      const data = await response.json()
      const total = parseInt(response.headers.get('X-Total-Count') || '0')
      
      set({
        reports: data.map(reportData => Report.fromJSON(reportData)),
        total,
        error: null
      })
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
      // Récupérer l'utilisateur actuel depuis Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Ajouter l'ID de l'utilisateur aux données du rapport
      const completeReportData = {
        ...reportData,
        user_id: session.user.id
      };

      // Validation avec le modèle Report
      const report = new Report(completeReportData);
      const validation = report.validate();
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(report.toJSON())
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du signalement');
      }

      const data = await response.json();
      set((state) => ({
        reports: [data, ...state.reports],
      }));

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
      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du signalement');
      }

      const data = await response.json();
      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === id ? data : report
        ),
      }));

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
      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du signalement');
      }

      set((state) => ({
        reports: state.reports.filter((report) => report.id !== id),
      }));

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

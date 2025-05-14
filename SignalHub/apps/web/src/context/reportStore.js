import { create } from 'zustand'
import { supabase, getAccessToken } from '../utils/supabase'
import { Report } from '@repo/shared'

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('La variable d\'environnement VITE_API_URL n\'est pas définie');
}

const useReportStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,
  
  // Récupérer tous les signalements
  fetchReports: async () => {
    set({ loading: true, error: null })
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/reports`, {
        credentials: 'same-origin',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des signalements');
      }
      
      const data = await response.json();
      // Conversion des données en instances de Report
      const reports = data.map(reportData => Report.fromJSON(reportData));
      set({ reports });
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

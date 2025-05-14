import supabase from '../utils/supabase.js';
import { Report } from '@repo/shared';

class ReportService {
  async getAllReports(options = {}) {
    try {
      const { page = 1, limit = 10, location = null } = options;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('reports')
        .select('*', { count: 'exact' });

      // Filtre par localisation si fourni
      if (location) {
        const { latitude, longitude, radius } = location;
        // Utiliser la formule Haversine pour calculer la distance
        query = query.rpc('reports_within_radius', {
          lat: latitude,
          lng: longitude,
          radius_km: radius
        });
      }

      // Ajouter la pagination
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Erreur lors de la récupération des signalements: ${error.message}`);
      }
      
      return {
        reports: data.map(report => Report.fromJSON(report)),
        total: count || 0
      };
    } catch (error) {
      console.error('getAllReports error:', error);
      throw error;
    }
  }

  async getReportById(id) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? Report.fromJSON(data) : null;
  }

  async createReport(reportData) {
    // reportData devrait déjà être validé par le modèle Report
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();

    if (error) throw error;
    return Report.fromJSON(data);
  }

  async getUserReports(options = {}) {
    try {
      const { page = 1, limit = 10, userId } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('reports')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Erreur lors de la récupération des signalements: ${error.message}`);
      }

      return {
        reports: data.map(report => Report.fromJSON(report)),
        total: count || 0
      };
    } catch (error) {
      console.error('getUserReports error:', error);
      throw error;
    }
  }

  async updateReport(id, userId, updates) {
    // Vérifier si l'utilisateur est le propriétaire du signalement ou admin
    const currentReport = await this.getReportById(id);
    if (!currentReport) {
      throw new Error('Signalement non trouvé');
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return Report.fromJSON(data);
  }

  async deleteReport(id, userId) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

export default new ReportService();

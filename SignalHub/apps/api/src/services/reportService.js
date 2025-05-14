import supabase from '../utils/supabase.js';
import { Report } from '@repo/shared';

class ReportService {
  async getAllReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(report => Report.fromJSON(report));
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

  async updateReport(id, userId, updates) {
    // Vérifier si l'utilisateur est le propriétaire du signalement
    const currentReport = await this.getReportById(id);
    if (!currentReport || currentReport.user_id !== userId) {
      throw new Error('Non autorisé à modifier ce signalement');
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReport(id, userId) {
    // Vérifier si l'utilisateur est le propriétaire du signalement
    const report = await this.getReportById(id);
    if (!report || report.user_id !== userId) {
      throw new Error('Non autorisé à supprimer ce signalement');
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

export default new ReportService();

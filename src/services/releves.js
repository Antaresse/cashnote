import { supabase } from './supabaseClient';

export const relevesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('releves')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(indexKwh, userId) {
    const { data, error } = await supabase
      .from('releves')
      .insert([{ index_kwh: parseFloat(indexKwh), user_id: userId }]);
    if (error) throw error;
    return data;
  }
};
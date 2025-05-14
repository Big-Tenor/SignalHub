import { User } from '@repo/shared';
import supabase from '../utils/supabase.js';

export const getCurrentUser = async (req, res, next) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.user.id);
    if (error) throw error;
    
    res.json(User.fromJSON(user));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: req.body
    });

    if (error) throw error;
    
    res.json(User.fromJSON(user));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(req.user.id);
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

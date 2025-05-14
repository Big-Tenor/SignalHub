export default class Report {
  constructor({
    id = null,
    type,
    description,
    latitude,
    longitude,
    photo_url = null,
    status = 'new',
    user_id,
    created_at = new Date().toISOString()
  }) {
    this.id = id;
    this.type = type;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
    this.photo_url = photo_url;
    this.status = status;
    this.user_id = user_id;
    this.created_at = created_at;
  }

  static validateType(type) {
    const validTypes = ['road', 'electricity', 'waste', 'water', 'other'];
    if (!validTypes.includes(type)) {
      throw new Error(`Type de signalement invalide. Valeurs acceptées: ${validTypes.join(', ')}`);
    }
    return true;
  }

  static validateStatus(status) {
    const validStatuses = ['new', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`);
    }
    return true;
  }

  static validateDescription(description) {
    if (!description || description.trim().length < 10) {
      throw new Error('La description doit contenir au moins 10 caractères');
    }
    if (description.trim().length > 500) {
      throw new Error('La description ne doit pas dépasser 500 caractères');
    }
    return true;
  }

  static validateCoordinates(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Les coordonnées doivent être des nombres');
    }
    
    if (latitude < -90 || latitude > 90) {
      throw new Error('La latitude doit être comprise entre -90 et 90');
    }
    
    if (longitude < -180 || longitude > 180) {
      throw new Error('La longitude doit être comprise entre -180 et 180');
    }
    
    return true;
  }

  validate() {
    const errors = [];

    try {
      Report.validateType(this.type);
    } catch (error) {
      errors.push(error.message);
    }

    try {
      Report.validateDescription(this.description);
    } catch (error) {
      errors.push(error.message);
    }

    try {
      Report.validateCoordinates(this.latitude, this.longitude);
    } catch (error) {
      errors.push(error.message);
    }

    if (this.photo_url) {
      try {
        const url = new URL(this.photo_url);
        if (!url.pathname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          errors.push('L\'URL de la photo doit pointer vers une image (jpg, jpeg, png, webp)');
        }
      } catch {
        errors.push('L\'URL de la photo est invalide');
      }
    }

    try {
      if (this.status) {
        Report.validateStatus(this.status);
      }
    } catch (error) {
      errors.push(error.message);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validatePhotoUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      description: this.description,
      latitude: this.latitude,
      longitude: this.longitude,
      photo_url: this.photo_url,
      status: this.status,
      user_id: this.user_id,
      created_at: this.created_at
    };
  }

  static fromJSON(json) {
    return new Report(json);
  }
}

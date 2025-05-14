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
    return validTypes.includes(type);
  }

  static validateStatus(status) {
    const validStatuses = ['new', 'in_progress', 'resolved'];
    return validStatuses.includes(status);
  }

  static validateCoordinates(latitude, longitude) {
    return (
      latitude >= -90 && 
      latitude <= 90 && 
      longitude >= -180 && 
      longitude <= 180
    );
  }

  validate() {
    const errors = [];

    if (!this.type || !Report.validateType(this.type)) {
      errors.push('Type de signalement invalide');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('Description trop courte (minimum 10 caractères)');
    }

    if (!Report.validateCoordinates(this.latitude, this.longitude)) {
      errors.push('Coordonnées géographiques invalides');
    }

    // Amélioration de la validation de l'ID utilisateur
    if (!this.user_id || typeof this.user_id !== 'string' || this.user_id.trim() === '') {
      errors.push('ID utilisateur invalide ou manquant');
    }

    if (this.photo_url && !this.validatePhotoUrl(this.photo_url)) {
      errors.push('URL de photo invalide');
    }

    if (!Report.validateStatus(this.status)) {
      errors.push('Statut invalide');
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

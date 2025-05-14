class User {
  constructor({
    id = null,
    email,
    role = 'citizen',
    created_at = new Date().toISOString()
  }) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.created_at = created_at;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateRole(role) {
    const validRoles = ['citizen', 'admin'];
    return validRoles.includes(role);
  }

  validate() {
    const errors = [];

    if (!this.email || !User.validateEmail(this.email)) {
      errors.push('Email invalide');
    }

    if (!this.role || !User.validateRole(this.role)) {
      errors.push('Rôle invalide');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  hasRole(role) {
    return this.role === role;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      created_at: this.created_at
    };
  }

  static fromJSON(json) {
    return new User(json);
  }
}

export default User;

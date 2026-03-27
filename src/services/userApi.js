const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const userApi = {
  async register(data) {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al registrarse');
    return json;
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      if (json.needsVerification) {
        const err = new Error(json.error || 'Email no verificado');
        err.needsVerification = true;
        err.email = json.email;
        throw err;
      }
      throw new Error(json.error || 'Error al iniciar sesión');
    }
    return json;
  },

  async googleAuth(credential) {
    const res = await fetch(`${API_URL}/api/users/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error con Google');
    return json;
  },

  async getProfile(token) {
    const res = await fetch(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al obtener perfil');
    return res.json();
  },

  async updateProfile(token, data) {
    const res = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al actualizar perfil');
    return json;
  },

  async getMyPurchases(token) {
    const res = await fetch(`${API_URL}/api/users/my-purchases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al obtener compras');
    return res.json();
  },

  // Admin endpoints
  async getUsers(adminToken) {
    const res = await fetch(`${API_URL}/api/users/admin/list`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.ok) throw new Error('Error al listar usuarios');
    return res.json();
  },

  async deleteUser(adminToken, userId) {
    const res = await fetch(`${API_URL}/api/users/admin/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
    return res.json();
  },

  async verifyEmail(token) {
    const res = await fetch(`${API_URL}/api/users/verify-email?token=${encodeURIComponent(token)}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al verificar email');
    return json;
  },

  async resendVerification(email) {
    const res = await fetch(`${API_URL}/api/users/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al reenviar verificación');
    return json;
  },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const productsApi = {
  // Público: obtener productos activos agrupados por colección
  async getCollections() {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error('Error al cargar productos');
    const data = await res.json();
    return data.collections;
  },

  // Público: obtener un producto por ID
  async getProduct(id) {
    const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
  },
};

export const adminApi = {
  // Login
  async login(password) {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error de autenticación');
    }
    return res.json();
  },

  // Listar todos los productos (incluye inactivos)
  async getProducts(token) {
    const res = await fetch(`${API_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al cargar productos');
    return res.json();
  },

  // Crear producto
  async createProduct(token, productData) {
    const res = await fetch(`${API_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error al crear producto');
    }
    return res.json();
  },

  // Actualizar producto
  async updateProduct(token, id, productData) {
    const res = await fetch(`${API_URL}/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error al actualizar producto');
    }
    return res.json();
  },

  // Eliminar producto (soft delete)
  async deleteProduct(token, id) {
    const res = await fetch(`${API_URL}/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return res.json();
  },

  // Restaurar producto
  async restoreProduct(token, id) {
    const res = await fetch(`${API_URL}/api/admin/products/${encodeURIComponent(id)}/restore`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al restaurar producto');
    return res.json();
  },

  // Eliminar producto permanentemente
  async permanentDeleteProduct(token, id) {
    const res = await fetch(`${API_URL}/api/admin/products/${encodeURIComponent(id)}/permanent`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return res.json();
  },

  // --- Ventas ---

  async getSales(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/admin/sales?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al cargar ventas');
    return res.json();
  },

  async getSalesStats(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/admin/sales/stats?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al cargar estadísticas');
    return res.json();
  },

  async updateSaleNotes(token, id, notes) {
    const res = await fetch(`${API_URL}/api/admin/sales/${encodeURIComponent(id)}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Error al actualizar notas');
    return res.json();
  },

  async updateSaleStatus(token, id, status) {
    const res = await fetch(`${API_URL}/api/admin/sales/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return res.json();
  },

  async sendTracking(token, id, trackingUrl) {
    const res = await fetch(`${API_URL}/api/admin/sales/${encodeURIComponent(id)}/tracking`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ trackingUrl }),
    });
    if (!res.ok) throw new Error('Error al enviar seguimiento');
    return res.json();
  },

  async deleteSale(token, id) {
    const res = await fetch(`${API_URL}/api/admin/sales/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar venta');
    return res.json();
  },

  // Subir imagen con progreso
  async uploadImage(token, file, oldUrl, onProgress) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);
      if (oldUrl) formData.append('oldUrl', oldUrl);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/api/admin/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            reject(new Error(data.error || 'Error al subir imagen'));
          } catch {
            reject(new Error('Error al subir imagen'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Error de red al subir imagen'));
      xhr.send(formData);
    });
  },

  // Borrar imagen de Cloudinary
  async deleteImage(token, imageUrl) {
    const res = await fetch(`${API_URL}/api/admin/delete-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageUrl }),
    });
    if (!res.ok) throw new Error('Error al borrar imagen');
    return res.json();
  },

  // Email
  async getEmailRecipients(token) {
    const res = await fetch(`${API_URL}/api/admin/email/recipients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al obtener destinatarios');
    return res.json();
  },

  async sendEmail(token, { to, subject, body, html, attachments, type }) {
    const res = await fetch(`${API_URL}/api/admin/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ to, subject, body, html, attachments, type }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al enviar email');
    return data;
  },

  async getSentEmails(token) {
    const res = await fetch(`${API_URL}/api/admin/email/sent`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al obtener historial');
    return res.json();
  },

  async deleteSentEmail(token, id) {
    const res = await fetch(`${API_URL}/api/admin/email/sent/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar email');
    return res.json();
  },
};

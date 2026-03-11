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
};

const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'API Error');
    err.response = data;
    throw err;
  }
  return data;
}

export default {
  getProducts: async (params = {}) => {
    // build query
    const q = new URLSearchParams();
    const searchTerm = params.search || params.q || params.keyword;
    if (searchTerm) q.set('search', searchTerm);
    if (params.category && params.category !== 'all') q.set('category', params.category);
    if (params.subCategory && params.subCategory !== 'all') q.set('subCategory', params.subCategory);
    if (params.type) q.set('type', params.type);
    if (typeof params.offer !== 'undefined') q.set('offer', String(params.offer));
    if (params.limit) q.set('limit', params.limit);
    if (typeof params.startIndex !== 'undefined') q.set('skip', params.startIndex);
    if (params.sort) q.set('sort', params.sort);
    if (params.order) q.set('order', params.order);

    // include any agriculture filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([k, v]) => {
        if (v !== null && typeof v !== 'undefined') q.set(k, v);
      });
    }

    return request(`/api/products?${q.toString()}`);
  },
  getProduct: async (id) => request(`/api/products/${id}`),
  uploadImages: async (formData, token) => {
    const res = await fetch(`${API_BASE}/api/products/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};

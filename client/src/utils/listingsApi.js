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
  getListings: async (params = {}) => {
    // build query
    const q = new URLSearchParams();
  // Accept multiple common keys for the search term: `search`, `q`, or `keyword`
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
    if (params.furnished) q.set('furnished', String(params.furnished));
    // include any filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([k, v]) => {
        if (v !== null && typeof v !== 'undefined') q.set(k, v);
      });
    }

    // Backend exposes listings at GET /api/listing with query params
    return request(`/api/listing?${q.toString()}`);
  },
  getListing: async (id) => request(`/api/listing/${id}`),
  uploadImages: async (formData, token) => {
    const res = await fetch(`${API_BASE}/api/listing/upload`, {
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

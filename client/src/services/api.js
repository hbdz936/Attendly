const API_URL = 'https://attendly-w8bh.onrender.com/api';

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  signup: async (email, password) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  getMe: async () => {
    return apiCall('/auth/me');
  }
};

// Semester API
export const semesterAPI = {
  getAll: async () => {
    return apiCall('/semesters');
  },
  
  getOne: async (id) => {
    return apiCall(`/semesters/${id}`);
  },
  
  create: async (data) => {
    return apiCall('/semesters', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/semesters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return apiCall(`/semesters/${id}`, {
      method: 'DELETE'
    });
  }
};

// Subject API
export const subjectAPI = {
  getAll: async (semesterId) => {
    return apiCall(`/subjects?semesterId=${semesterId}`);
  },
  
  getOne: async (id) => {
    return apiCall(`/subjects/${id}`);
  },
  
  create: async (data) => {
    return apiCall('/subjects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  updateAttendance: async (id, attended) => {
    return apiCall(`/subjects/${id}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ attended })
    });
  },
  
  delete: async (id) => {
    return apiCall(`/subjects/${id}`, {
      method: 'DELETE'
    });
  }
};

export default { authAPI, semesterAPI, subjectAPI };
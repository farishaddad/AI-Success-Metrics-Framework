// API Service for communicating with backend

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Validate API URL is configured
if (!API_BASE_URL) {
  throw new Error('VITE_API_URL environment variable is required. Please check your .env file.');
}

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Get headers with authentication
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new APIError(error.error || 'Request failed', response.status);
  }
  return response.json();
}

// ==================== FEEDBACK API ====================

export const feedbackAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getByPage(pageName) {
    const response = await fetch(`${API_BASE_URL}/feedback/page/${encodeURIComponent(pageName)}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async search(term) {
    const response = await fetch(`${API_BASE_URL}/feedback/search/${encodeURIComponent(term)}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(feedback) {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedback)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== USE CASE API ====================

export const useCaseAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/usecases`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/usecases/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(data) {
    const response = await fetch(`${API_BASE_URL}/usecases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const response = await fetch(`${API_BASE_URL}/usecases/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/usecases/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== KPI API ====================

export const kpiAPI = {
  async getByUseCaseId(useCaseId) {
    const response = await fetch(`${API_BASE_URL}/usecases/${useCaseId}/kpis`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(kpi) {
    const response = await fetch(`${API_BASE_URL}/kpis`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(kpi)
    });
    return handleResponse(response);
  }
};

// ==================== DATA REQUIREMENTS API ====================

export const dataRequirementAPI = {
  async getByUseCaseId(useCaseId) {
    const response = await fetch(`${API_BASE_URL}/usecases/${useCaseId}/data-requirements`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(dataReq) {
    const response = await fetch(`${API_BASE_URL}/data-requirements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dataReq)
    });
    return handleResponse(response);
  }
};

// ==================== RISK API ====================

export const riskAPI = {
  async getByUseCaseId(useCaseId) {
    const response = await fetch(`${API_BASE_URL}/usecases/${useCaseId}/risks`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(risk) {
    const response = await fetch(`${API_BASE_URL}/risks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(risk)
    });
    return handleResponse(response);
  }
};

// ==================== STAKEHOLDER API ====================

export const stakeholderAPI = {
  async getByUseCaseId(useCaseId) {
    const response = await fetch(`${API_BASE_URL}/usecases/${useCaseId}/stakeholders`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(stakeholder) {
    const response = await fetch(`${API_BASE_URL}/stakeholders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(stakeholder)
    });
    return handleResponse(response);
  }
};

// ==================== MILESTONE API ====================

export const milestoneAPI = {
  async getByUseCaseId(useCaseId) {
    const response = await fetch(`${API_BASE_URL}/usecases/${useCaseId}/milestones`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(milestone) {
    const response = await fetch(`${API_BASE_URL}/milestones`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(milestone)
    });
    return handleResponse(response);
  }
};

// ==================== BULK OPERATIONS ====================

export const bulkAPI = {
  async exportAll() {
    const response = await fetch(`${API_BASE_URL}/export`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== AGENT METRICS API ====================

export const agentMetricsAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/agent-metrics`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getBySessionId(sessionId) {
    const response = await fetch(`${API_BASE_URL}/agent-metrics/session/${sessionId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getSummary(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${API_BASE_URL}/agent-metrics/summary?${params}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(metrics) {
    const response = await fetch(`${API_BASE_URL}/agent-metrics`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(metrics)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/agent-metrics/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== HEALTH CHECK ====================

export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  } catch (error) {
    throw new APIError('Server is not responding', 0);
  }
}

export { APIError };

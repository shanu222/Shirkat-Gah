import { getApiBaseUrl, getApiV1Url } from './api-config';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(getApiV1Url(endpoint), {
    ...rest,
    headers,
    credentials: 'same-origin',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, error.message || 'Request failed');
  }

  return res.json();
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      apiFetch<{ accessToken: string; refreshToken: string; user: unknown }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
      apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: (token: string) => apiFetch('/auth/me', { token }),
    forgotPassword: (email: string) =>
      apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  },
  dashboard: {
    leadership: (token?: string) => apiFetch('/dashboard/leadership', { token }),
    public: () => apiFetch('/dashboard/public'),
  },
  projects: {
    list: (token?: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch(`/projects${qs}`, { token });
    },
    dashboard: (token?: string) => apiFetch('/projects/dashboard', { token }),
    get: (id: string, token?: string) => apiFetch(`/projects/${id}`, { token }),
  },
  finance: {
    overview: (token?: string) => apiFetch('/finance/overview', { token }),
    expenses: (token?: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch(`/finance/expenses${qs}`, { token });
    },
  },
  lms: {
    courses: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch(`/lms/courses${qs}`);
    },
    course: (slug: string) => apiFetch(`/lms/courses/${slug}`),
    myLearning: (token: string) => apiFetch('/lms/my-learning', { token }),
    enroll: (courseId: string, token: string) =>
      apiFetch(`/lms/courses/${courseId}/enroll`, { method: 'POST', token }),
  },
  data: {
    overview: (token?: string) => apiFetch('/data/overview', { token }),
    entries: (token?: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch(`/data/entries${qs}`, { token });
    },
  },
  reports: {
    overview: (token?: string) => apiFetch('/reports/overview', { token }),
  },
  cms: {
    homepage: () => apiFetch('/cms/homepage'),
  },
  search: {
    query: (q: string, token?: string) => apiFetch(`/search?q=${encodeURIComponent(q)}`, { token }),
  },
  notifications: {
    list: (token: string) => apiFetch('/notifications', { token }),
    unreadCount: (token: string) => apiFetch('/notifications/unread-count', { token }),
  },
  admin: {
    overview: (token: string) => apiFetch('/admin/overview', { token }),
    users: (token: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch(`/admin/users${qs}`, { token });
    },
  },
};

/** @deprecated Use getApiBaseUrl from api-config */
export const API_BASE_URL = getApiBaseUrl();

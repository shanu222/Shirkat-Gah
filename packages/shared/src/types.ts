export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  FINANCE_OFFICER: 'finance_officer',
  DATA_ENTRY: 'data_entry',
  MONITORING_OFFICER: 'monitoring_officer',
  TRAINER: 'trainer',
  LEARNER: 'learner',
  PUBLIC_USER: 'public_user',
  DONOR_VIEWER: 'donor_viewer',
} as const;

export type RoleSlug = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',
  DASHBOARD_VIEW: 'dashboard.view',
  PROJECTS_MANAGE: 'projects.manage',
  PROJECTS_VIEW: 'projects.view',
  FINANCE_MANAGE: 'finance.manage',
  FINANCE_VIEW: 'finance.view',
  FINANCE_APPROVE: 'finance.approve',
  DATA_MANAGE: 'data.manage',
  DATA_SUBMIT: 'data.submit',
  DATA_APPROVE: 'data.approve',
  LMS_MANAGE: 'lms.manage',
  LMS_ENROLL: 'lms.enroll',
  REPORTS_GENERATE: 'reports.generate',
  CMS_MANAGE: 'cms.manage',
  FILES_UPLOAD: 'files.upload',
  PUBLIC_VIEW: 'public.view',
} as const;

export type PermissionSlug = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
}

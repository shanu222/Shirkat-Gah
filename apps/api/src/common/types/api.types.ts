/** Pagination metadata returned by list endpoints */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Dashboard types */
export interface MonthlyTrendPoint {
  month: string;
  beneficiaries: number;
  programs: number;
  budget: number;
}

export interface ProgramDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface ProvinceDataItem {
  province: string;
  projects: number;
  districts: number;
}

export interface ProjectHealthItem {
  name: string;
  value: number;
  percentage: number;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  entity: string;
  user: string;
  time: Date;
}

export interface LeadershipKpis {
  totalBeneficiaries: number;
  activeProjects: number;
  totalProjects: number;
  budgetUtilization: number;
  totalBudget: number;
  geographicReach: number;
}

export interface LeadershipStatsResponse {
  kpis: LeadershipKpis;
  monthlyTrend: MonthlyTrendPoint[];
  programDistribution: ProgramDistributionItem[];
  provinceData: ProvinceDataItem[];
  projectHealth: ProjectHealthItem[];
  recentActivity: RecentActivityItem[];
}

export interface PublicStatsSummary {
  activeProjects: number;
  publications: number;
  courses: number;
  districtsCovered: number;
  beneficiaries: number;
  womenEmpowered: number;
}

export interface SdgIndicatorItem {
  id: string;
  code: string;
  title: string;
  goal: number;
  description: string | null;
  target2030: string | null;
}

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  coverUrl: string | null;
  projectId: string | null;
  location: string | null;
  impact: unknown;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapDataItem {
  id: string;
  title: string;
  code: string;
  latitude: number | null;
  longitude: number | null;
  progressPct: number;
  province: { name: string } | null;
}

export interface PublicStatsResponse {
  stats: PublicStatsSummary;
  sdgIndicators: SdgIndicatorItem[];
  caseStudies: CaseStudyItem[];
  mapData: MapDataItem[];
}

/** Finance types */
export interface FinanceSummary {
  totalAllocated: number;
  totalSpent: number;
  remaining: number;
  utilization: number;
  pendingExpenses: number;
}

export interface CategorySpendItem {
  category: string;
  amount: number;
}

export interface DonorSummaryItem {
  id: string;
  name: string;
  code: string;
  grants: number;
  projects: number;
}

export interface ExpenseListItem {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  amount: unknown;
  currency: string;
  category: string;
  status: string;
  createdAt: Date;
  project: { title: string; code: string } | null;
  creator: { firstName: string; lastName: string };
  approver: { firstName: string; lastName: string } | null;
}

export interface FinanceOverviewResponse {
  summary: FinanceSummary;
  byCategory: CategorySpendItem[];
  recentExpenses: ExpenseListItem[];
  donors: DonorSummaryItem[];
  grants: GrantListItem[];
}

export interface GrantListItem {
  id: string;
  code: string;
  title: string;
  amount: unknown;
  currency: string;
  donor: { name: string; code: string };
  project: { title: string } | null;
}

/** Project types */
export interface ProjectListItem {
  id: string;
  code: string;
  title: string;
  status: string;
  progressPct: number;
  manager: { id: string; firstName: string; lastName: string } | null;
  province: { name: string } | null;
  district: { name: string } | null;
  _count: { indicators: number; activities: number; members: number };
}

export interface ProjectIndicatorProgress {
  code: string;
  title: string;
  current: number;
  target: number;
  progress: number;
}

export interface ProjectDashboardItem {
  id: string;
  code: string;
  title: string;
  progressPct: number;
  riskLevel: string | null;
  status: string;
  indicators: ProjectIndicatorProgress[];
  milestones: MilestoneItem[];
  budgetSummary: { allocated: number; spent: number };
  activityCount: number;
}

export interface MilestoneItem {
  id: string;
  title: string;
  dueDate: Date;
  status: string;
  order: number;
}

/** Reports types */
export interface ReportCategoryItem {
  name: string;
  count: number;
}

export interface ReportListItem {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: Date;
  creator: { firstName: string; lastName: string };
}

export interface ReportTemplateItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublic: boolean;
}

export interface ReportsOverviewResponse {
  recentReports: ReportListItem[];
  templates: ReportTemplateItem[];
  categories: ReportCategoryItem[];
}

/** Search types */
export interface SearchResultItem {
  type: string;
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  query?: string;
  total: number;
}

/** Admin types */
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
}

export interface RoleWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  userCount: number;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  createdAt: Date;
  user: { firstName: string; lastName: string; email: string } | null;
}

export interface PlatformSettingItem {
  id: string;
  key: string;
  value: unknown;
  category: string;
}

export interface AdminOverviewResponse {
  stats: AdminStats;
  roles: RoleWithCount[];
  recentAuditLogs: AuditLogItem[];
  settings: PlatformSettingItem[];
}

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  roles: Array<{ role: { name: string; slug: string } }>;
}

/** LMS types */
export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  level: string | null;
  duration: number | null;
  price: unknown;
  currency: string;
  isPublished: boolean;
  isFeatured: boolean;
  instructor: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  _count: { lessons: number; enrollments: number };
}

export interface LessonItem {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  type: string;
  content: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  duration: number | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseDetailResponse extends Omit<CourseListItem, '_count'> {
  lessons: LessonItem[];
  _count: { enrollments: number };
}

export interface EnrollmentItem {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progressPct: number;
  enrolledAt: Date;
  completedAt: Date | null;
  expiresAt: Date | null;
  course: CourseListItem;
}

export interface EnrollmentRecord {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progressPct: number;
  enrolledAt: Date;
  completedAt: Date | null;
  expiresAt: Date | null;
}

/** CMS types */
export interface CmsPageItem {
  id: string;
  slug: string;
  title: string;
  content: unknown;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  coverUrl: string | null;
  order: number;
  isActive: boolean;
}

export interface PublicationItem {
  id: string;
  slug: string;
  title: string;
  abstract: string | null;
  content: string | null;
  type: string;
  coverUrl: string | null;
  fileUrl: string | null;
  author: string | null;
  publishedAt: Date | null;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  photoUrl: string | null;
  email: string | null;
  linkedIn: string | null;
  order: number;
  isActive: boolean;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  coverUrl: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomepageResponse {
  page: CmsPageItem | null;
  programs: ProgramItem[];
  publications: PublicationItem[];
  team: TeamMemberItem[];
  events: EventItem[];
}

/** File types */
export interface FileRecordItem {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  key: string;
  folderId: string | null;
  projectId: string | null;
  dataEntryId: string | null;
  uploadedBy: string;
  status: string;
  version: number;
  movTags: string[];
  metadata: unknown;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileId: string;
  key: string;
}

export interface DownloadUrlResponse {
  url: string;
  file: FileRecordItem;
}

export interface FileListItem extends FileRecordItem {
  uploader: { firstName: string; lastName: string };
}

/** Notification types */
export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  readAt: Date | null;
  metadata: unknown;
  createdAt: Date;
}

/** Data management types */
export interface DataOverviewStats {
  totalEntries: number;
  totalIndicators: number;
  pendingApproval: number;
}

export interface DataCategoryItem {
  name: string;
  count: number;
}

export interface DataEntryListItem {
  id: string;
  type: string;
  projectId: string | null;
  indicatorId: string | null;
  title: string;
  value: unknown;
  narrative: string | null;
  period: string | null;
  status: string;
  version: number;
  submittedBy: string;
  approvedBy: string | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  project: { title: string; code: string } | null;
  indicator: { title: string; code: string } | null;
  submitter: { firstName: string; lastName: string };
}

export interface DataOverviewResponse {
  stats: DataOverviewStats;
  categories: DataCategoryItem[];
  recentEntries: DataEntryListItem[];
}

/** Project detail */
export interface ProjectMemberItem {
  projectId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  user: { id: string; firstName: string; lastName: string };
}

export interface ProjectDetailResponse {
  id: string;
  code: string;
  title: string;
  description: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  progressPct: number;
  riskLevel: string | null;
  totalBudget: unknown;
  currency: string;
  managerId: string | null;
  provinceId: string | null;
  districtId: string | null;
  createdAt: Date;
  updatedAt: Date;
  manager: { id: string; firstName: string; lastName: string; email: string } | null;
  province: { id: string; name: string; code: string } | null;
  district: { id: string; name: string; code: string; provinceId: string } | null;
  donors: Array<{ projectId: string; donorId: string; amount: unknown; donor: { id: string; name: string; code: string } }>;
  grants: Array<{ id: string; code: string; title: string; amount: unknown; currency: string }>;
  indicators: Array<{ id: string; code: string; title: string; current: number; target: number }>;
  activities: Array<{ id: string; code: string; title: string; status: string }>;
  milestones: Array<{ id: string; title: string; dueDate: Date; status: string; order: number }>;
  budgets: Array<{ id: string; category: string; allocated: unknown; spent: unknown }>;
  members: ProjectMemberItem[];
}

export interface LessonProgressItem extends LessonItem {
  progress: Array<{ id: string; completed: boolean; progressPct: number }>;
}

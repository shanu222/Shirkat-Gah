import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROLES = [
  { name: 'Super Admin', slug: 'super_admin', description: 'Full platform access' },
  { name: 'Admin', slug: 'admin', description: 'Organization administrator' },
  { name: 'Project Manager', slug: 'project_manager', description: 'Manage projects and teams' },
  { name: 'Finance Officer', slug: 'finance_officer', description: 'Financial management' },
  { name: 'Data Entry Operator', slug: 'data_entry', description: 'Data entry and submission' },
  { name: 'Monitoring Officer', slug: 'monitoring_officer', description: 'M&E and reporting' },
  { name: 'Trainer', slug: 'trainer', description: 'LMS course management' },
  { name: 'Learner', slug: 'learner', description: 'LMS participant' },
  { name: 'Public User', slug: 'public_user', description: 'Public dashboard access' },
  { name: 'Donor Viewer', slug: 'donor_viewer', description: 'Donor-specific read access' },
];

const PERMISSIONS = [
  { name: 'Manage Users', slug: 'users.manage', module: 'admin' },
  { name: 'Manage Roles', slug: 'roles.manage', module: 'admin' },
  { name: 'View Dashboard', slug: 'dashboard.view', module: 'dashboard' },
  { name: 'Manage Projects', slug: 'projects.manage', module: 'projects' },
  { name: 'View Projects', slug: 'projects.view', module: 'projects' },
  { name: 'Manage Finance', slug: 'finance.manage', module: 'finance' },
  { name: 'View Finance', slug: 'finance.view', module: 'finance' },
  { name: 'Approve Expenses', slug: 'finance.approve', module: 'finance' },
  { name: 'Manage Data', slug: 'data.manage', module: 'data' },
  { name: 'Submit Data', slug: 'data.submit', module: 'data' },
  { name: 'Approve Data', slug: 'data.approve', module: 'data' },
  { name: 'Manage LMS', slug: 'lms.manage', module: 'lms' },
  { name: 'Enroll Courses', slug: 'lms.enroll', module: 'lms' },
  { name: 'Generate Reports', slug: 'reports.generate', module: 'reports' },
  { name: 'Manage CMS', slug: 'cms.manage', module: 'cms' },
  { name: 'Upload Files', slug: 'files.upload', module: 'files' },
  { name: 'View Public Dashboard', slug: 'public.view', module: 'public' },
];

const PROVINCES = [
  { name: 'Punjab', code: 'PB', latitude: 31.1471, longitude: 75.3412 },
  { name: 'Sindh', code: 'SD', latitude: 25.8943, longitude: 68.5247 },
  { name: 'KPK', code: 'KP', latitude: 34.9526, longitude: 72.3311 },
  { name: 'Balochistan', code: 'BL', latitude: 28.4907, longitude: 65.0958 },
  { name: 'Islamabad', code: 'IS', latitude: 33.6844, longitude: 73.0479 },
];

async function main() {
  console.log('🌱 Seeding Shirkat Gah database...');

  // Roles
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: { ...role, isSystem: true },
    });
  }

  // Permissions
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    });
  }

  // Assign all permissions to super_admin
  const superAdminRole = await prisma.role.findUnique({ where: { slug: 'super_admin' } });
  const allPermissions = await prisma.permission.findMany();
  if (superAdminRole) {
    for (const perm of allPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: superAdminRole.id, permissionId: perm.id },
      });
    }
  }

  // Admin role permissions
  const adminRole = await prisma.role.findUnique({ where: { slug: 'admin' } });
  const adminPerms = allPermissions.filter((p) => !p.slug.startsWith('roles.'));
  if (adminRole) {
    for (const perm of adminPerms) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: perm.id },
      });
    }
  }

  // Provinces & Districts
  for (const prov of PROVINCES) {
    const province = await prisma.province.upsert({
      where: { code: prov.code },
      update: {},
      create: prov,
    });
    const districts = getDistrictsForProvince(prov.code);
    for (const dist of districts) {
      await prisma.district.upsert({
        where: { code: dist.code },
        update: {},
        create: { ...dist, provinceId: province.id },
      });
    }
  }

  // Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'shirkat-gah' },
    update: {},
    create: {
      name: 'Shirkat Gah - Women\'s Resource Centre',
      slug: 'shirkat-gah',
      description: 'Leading women\'s rights organization in Pakistan',
      type: 'NGO',
      seats: 100,
    },
  });

  // Admin user
  const passwordHash = await bcrypt.hash('Admin@123456', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shirkatgah.org' },
    update: {},
    create: {
      email: 'admin@shirkatgah.org',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      organizationId: org.id,
    },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: superAdminRole.id },
    });
  }

  // Demo users
  const demoUsers = [
    { email: 'pm@shirkatgah.org', firstName: 'Ayesha', lastName: 'Khan', role: 'project_manager' },
    { email: 'finance@shirkatgah.org', firstName: 'Fatima', lastName: 'Ahmed', role: 'finance_officer' },
    { email: 'learner@shirkatgah.org', firstName: 'Sara', lastName: 'Malik', role: 'learner' },
  ];

  for (const demo of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {},
      create: {
        email: demo.email,
        passwordHash: await bcrypt.hash('Demo@123456', 12),
        firstName: demo.firstName,
        lastName: demo.lastName,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
        organizationId: org.id,
      },
    });
    const role = await prisma.role.findUnique({ where: { slug: demo.role } });
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }
  }

  // Donors
  const donors = [
    { name: 'UN Women', code: 'UNW', type: 'UN Agency' },
    { name: 'European Union', code: 'EU', type: 'Bilateral' },
    { name: 'USAID', code: 'USAID', type: 'Bilateral' },
    { name: 'Global Fund for Women', code: 'GFW', type: 'Foundation' },
  ];

  for (const donor of donors) {
    await prisma.donor.upsert({
      where: { code: donor.code },
      update: {},
      create: donor,
    });
  }

  // Projects
  const punjab = await prisma.province.findUnique({ where: { code: 'PB' } });
  const lahore = await prisma.district.findFirst({ where: { code: 'PB-LHR' } });

  const projects = [
    {
      code: 'WLT-2024',
      title: 'Women Leadership Training - Lahore',
      description: 'Capacity building program for women leaders in Punjab',
      status: 'ACTIVE' as const,
      totalBudget: 15000000,
      progressPct: 72,
      sdgTargets: ['SDG 5', 'SDG 10'],
      riskLevel: 'low',
    },
    {
      code: 'SRHR-2024',
      title: 'SRHR Advocacy Campaign',
      description: 'Sexual and reproductive health rights advocacy across Pakistan',
      status: 'ACTIVE' as const,
      totalBudget: 25000000,
      progressPct: 65,
      sdgTargets: ['SDG 3', 'SDG 5'],
      riskLevel: 'medium',
    },
    {
      code: 'GOV-2024',
      title: 'Women in Governance Initiative',
      description: 'Increasing women participation in local governance',
      status: 'ACTIVE' as const,
      totalBudget: 18000000,
      progressPct: 58,
      sdgTargets: ['SDG 5', 'SDG 16'],
      riskLevel: 'low',
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { code: proj.code },
      update: {},
      create: {
        ...proj,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        managerId: adminUser.id,
        provinceId: punjab?.id,
        districtId: lahore?.id,
        latitude: 31.5204,
        longitude: 74.3587,
      },
    });
  }

  // Indicators for first project
  const project = await prisma.project.findUnique({ where: { code: 'WLT-2024' } });
  if (project) {
    const indicators = [
      { code: 'IND-001', title: 'Women Trained', unit: 'persons', baseline: 0, target: 5000, current: 3600 },
      { code: 'IND-002', title: 'Leadership Positions Secured', unit: 'positions', baseline: 0, target: 200, current: 145 },
      { code: 'IND-003', title: 'Community Sessions Conducted', unit: 'sessions', baseline: 0, target: 100, current: 78 },
    ];
    for (const ind of indicators) {
      await prisma.indicator.upsert({
        where: { projectId_code: { projectId: project.id, code: ind.code } },
        update: { current: ind.current },
        create: { ...ind, projectId: project.id, sdgIndicator: 'SDG 5.5' },
      });
    }

    // Budget
    await prisma.budget.createMany({
      data: [
        { projectId: project.id, category: 'Personnel', allocated: 6000000, spent: 4200000, fiscalYear: '2024-25' },
        { projectId: project.id, category: 'Training', allocated: 4500000, spent: 3100000, fiscalYear: '2024-25' },
        { projectId: project.id, category: 'Operations', allocated: 3000000, spent: 2100000, fiscalYear: '2024-25' },
        { projectId: project.id, category: 'M&E', allocated: 1500000, spent: 900000, fiscalYear: '2024-25' },
      ],
      skipDuplicates: true,
    });
  }

  // LMS Courses
  const courses = [
    {
      slug: 'gender-mainstreaming',
      title: 'Gender Mainstreaming in Development',
      description: 'Comprehensive course on integrating gender perspectives in development programs',
      category: 'Gender',
      level: 'Intermediate',
      duration: 480,
      isPublished: true,
      isFeatured: true,
      tags: ['gender', 'development', 'mainstreaming'],
    },
    {
      slug: 'project-management-me',
      title: 'Project Management & M&E',
      description: 'Learn project management fundamentals with monitoring and evaluation frameworks',
      category: 'Management',
      level: 'Advanced',
      duration: 600,
      isPublished: true,
      tags: ['project-management', 'me', 'monitoring'],
    },
    {
      slug: 'srhr-advocacy',
      title: 'SRHR Advocacy Skills',
      description: 'Build advocacy skills for sexual and reproductive health rights',
      category: 'Advocacy',
      level: 'Beginner',
      duration: 360,
      isPublished: true,
      tags: ['srhr', 'advocacy', 'health'],
    },
  ];

  for (const course of courses) {
    const created = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });

    await prisma.lesson.createMany({
      data: [
        { courseId: created.id, title: 'Introduction', type: 'VIDEO', order: 1, duration: 15, isPublished: true },
        { courseId: created.id, title: 'Core Concepts', type: 'TEXT', order: 2, duration: 30, isPublished: true },
        { courseId: created.id, title: 'Case Studies', type: 'PDF', order: 3, duration: 45, isPublished: true },
        { courseId: created.id, title: 'Assessment', type: 'QUIZ', order: 4, duration: 20, isPublished: true },
      ],
      skipDuplicates: true,
    });
  }

  // CMS Homepage
  await prisma.cmsPage.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Shirkat Gah Digital Platform',
      content: {
        hero: {
          title: 'Empowering Women, Transforming Communities',
          subtitle: 'Integrated digital platform for impact measurement, learning, and governance',
        },
        stats: [
          { label: 'Women Empowered', value: '150K+' },
          { label: 'Active Projects', value: '45+' },
          { label: 'Training Programs', value: '200+' },
          { label: 'Districts Covered', value: '80+' },
        ],
      },
      isPublished: true,
      publishedAt: new Date(),
      metaTitle: 'Shirkat Gah - Women\'s Resource Centre',
      metaDescription: 'Leading women\'s rights organization digital platform',
    },
  });

  // Publications
  await prisma.publication.createMany({
    data: [
      {
        slug: 'women-political-participation-2024',
        title: 'Women\'s Political Participation in Pakistan: 2024 Report',
        abstract: 'Comprehensive analysis of women\'s political engagement across provinces',
        type: 'research',
        author: 'Shirkat Gah Research Team',
        isPublished: true,
        publishedAt: new Date('2024-06-15'),
        tags: ['governance', 'research', 'politics'],
      },
      {
        slug: 'srhr-policy-brief',
        title: 'SRHR Policy Brief: Provincial Perspectives',
        abstract: 'Policy recommendations for SRHR legislation reform',
        type: 'policy-brief',
        author: 'Advocacy Team',
        isPublished: true,
        publishedAt: new Date('2024-09-01'),
        tags: ['srhr', 'policy', 'advocacy'],
      },
    ],
    skipDuplicates: true,
  });

  // SDG Indicators
  const sdgIndicators = [
    { code: '5.1', title: 'End discrimination against women', goal: 5 },
    { code: '5.5', title: 'Ensure full participation in leadership', goal: 5 },
    { code: '3.7', title: 'Universal access to SRHR', goal: 3 },
    { code: '10.2', title: 'Social, economic and political inclusion', goal: 10 },
    { code: '16.7', title: 'Responsive, inclusive decision-making', goal: 16 },
  ];

  for (const sdg of sdgIndicators) {
    await prisma.sdgIndicator.upsert({
      where: { code: sdg.code },
      update: {},
      create: sdg,
    });
  }

  // Platform settings
  const settings = [
    { key: 'site_name', value: 'Shirkat Gah Digital Platform', category: 'general' },
    { key: 'site_tagline', value: 'Empowering Women, Transforming Communities', category: 'general' },
    { key: 'default_currency', value: 'PKR', category: 'finance' },
    { key: 'fiscal_year_start', value: '07-01', category: 'finance' },
    { key: 'mfa_required_roles', value: ['super_admin', 'admin', 'finance_officer'], category: 'security' },
  ];

  for (const setting of settings) {
    await prisma.platformSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // Email templates
  const templates = [
    {
      slug: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Shirkat Gah Platform',
      body: '<h1>Welcome {{firstName}}!</h1><p>Your account has been created successfully.</p>',
      variables: ['firstName', 'email'],
    },
    {
      slug: 'password-reset',
      name: 'Password Reset',
      subject: 'Reset Your Password',
      body: '<p>Click <a href="{{resetUrl}}">here</a> to reset your password.</p>',
      variables: ['resetUrl', 'firstName'],
    },
  ];

  for (const tmpl of templates) {
    await prisma.emailTemplate.upsert({
      where: { slug: tmpl.slug },
      update: {},
      create: tmpl,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin: admin@shirkatgah.org / Admin@123456');
  console.log('📧 PM: pm@shirkatgah.org / Demo@123456');
}

function getDistrictsForProvince(code: string) {
  const map: Record<string, { name: string; code: string }[]> = {
    PB: [
      { name: 'Lahore', code: 'PB-LHR' },
      { name: 'Faisalabad', code: 'PB-FSD' },
      { name: 'Multan', code: 'PB-MUL' },
    ],
    SD: [
      { name: 'Karachi', code: 'SD-KHI' },
      { name: 'Hyderabad', code: 'SD-HYD' },
    ],
    KP: [
      { name: 'Peshawar', code: 'KP-PSH' },
      { name: 'Mardan', code: 'KP-MRD' },
    ],
    BL: [{ name: 'Quetta', code: 'BL-QTA' }],
    IS: [{ name: 'Islamabad', code: 'IS-ISB' }],
  };
  return map[code] ?? [];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

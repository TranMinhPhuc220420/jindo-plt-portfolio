/**
 * @typedef {'live' | 'beta' | 'internal'} ProductStatus
 * @typedef {'featured' | 'standard' | 'wide' | 'tall'} ProductLayout
 *
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} longDescription
 * @property {string} category
 * @property {ProductStatus} status
 * @property {string[]} tags
 * @property {string} gradient
 * @property {string} [previewImage]
 * @property {string} [liveUrl]
 * @property {string} [repoUrl]
 * @property {boolean} featured
 * @property {ProductLayout} layout
 * @property {string[]} highlights
 */

/** @type {Product[]} */
export const products = [
  {
    id: 'jindo-platform',
    title: 'Jindo Platform',
    description: 'Enterprise workflow orchestration for distributed teams.',
    longDescription:
      'A unified control plane for automating complex business workflows with real-time visibility, role-based access, and deep integrations across your stack.',
    category: 'Enterprise SaaS',
    status: 'live',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    gradient: 'from-violet-600/40 via-purple-900/30 to-black',
    featured: true,
    layout: 'featured',
    highlights: [
      'Drag-and-drop workflow builder with version control',
      'Real-time dashboards and SLA monitoring',
      'SSO, audit logs, and granular permissions',
      'Webhook & REST API for third-party integrations',
    ],
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'pulse-analytics',
    title: 'Pulse Analytics',
    description: 'Product intelligence dashboard with live cohort insights.',
    longDescription:
      'Turn raw product events into actionable growth metrics. Pulse surfaces retention, funnel drop-offs, and feature adoption in a single glass-dark interface.',
    category: 'Analytics',
    status: 'live',
    tags: ['Next.js', 'TypeScript', 'ClickHouse', 'Tailwind'],
    gradient: 'from-fuchsia-600/35 via-violet-900/25 to-black',
    featured: true,
    layout: 'featured',
    highlights: [
      'Sub-second queries on billions of events',
      'Cohort and funnel analysis out of the box',
      'Embeddable widgets for internal tools',
      'Alerting rules with Slack & email delivery',
    ],
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'vault-cms',
    title: 'Vault CMS',
    description: 'Headless content platform for multi-brand publishing.',
    category: 'Content',
    status: 'live',
    tags: ['React', 'GraphQL', 'Prisma'],
    gradient: 'from-indigo-600/35 via-slate-900/30 to-black',
    featured: false,
    layout: 'wide',
    highlights: [],
    liveUrl: '#',
  },
  {
    id: 'nexus-chat',
    title: 'Nexus Chat',
    description: 'AI-assisted customer support inbox with smart routing.',
    category: 'Support',
    status: 'beta',
    tags: ['Vue', 'Python', 'OpenAI'],
    gradient: 'from-purple-600/35 via-zinc-900/30 to-black',
    featured: false,
    layout: 'standard',
    highlights: [],
    liveUrl: '#',
  },
  {
    id: 'orbit-hr',
    title: 'Orbit HR',
    description: 'People ops portal for onboarding and time-off workflows.',
    category: 'HR Tech',
    status: 'live',
    tags: ['React', 'Supabase', 'Tailwind'],
    gradient: 'from-violet-500/30 via-neutral-900/30 to-black',
    featured: false,
    layout: 'tall',
    highlights: [],
    liveUrl: '#',
  },
  {
    id: 'forge-devtools',
    title: 'Forge DevTools',
    description: 'Internal developer portal with service catalog and runbooks.',
    category: 'Developer Tools',
    status: 'internal',
    tags: ['React', 'Go', 'Kubernetes'],
    gradient: 'from-purple-700/30 via-gray-900/30 to-black',
    featured: false,
    layout: 'standard',
    highlights: [],
    liveUrl: '#',
  },
]

export const featuredProducts = products.filter((p) => p.featured)
export const bentoProducts = products.filter((p) => !p.featured)

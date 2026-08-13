export const PRODUCT_NAME = "Task Planner";

export const SAMPLE_TASKS = [
  {
    id: "TASK-101",
    title: "Implement JWT Token Refresh & Session Storage",
    description: "Build secure authentication flow with PKCE and automatic token rotation.",
    assignee: {
      name: "Sarah Chen",
      initials: "SC",
      role: "Lead Engineer"
    },
    status: "In Progress",
    priority: "P1",
    dueDate: "Today",
    subtasks: [
      { id: "sub-1", title: "Setup refresh token endpoint", done: true },
      { id: "sub-2", title: "Configure local storage encryption", done: true },
      { id: "sub-3", title: "Write unit tests for session expiration", done: false }
    ],
    aiNote: "AI auto-decomposed 3 subtasks & assigned Sarah based on recent auth commits."
  },
  {
    id: "TASK-102",
    title: "Database Query Optimization & Connection Pool",
    description: "Audit database queries causing latency spikes above 100ms during peak loads.",
    assignee: {
      name: "Marcus Vance",
      initials: "MV",
      role: "Database Admin"
    },
    status: "In Progress",
    priority: "P1",
    dueDate: "Tomorrow",
    subtasks: [
      { id: "sub-4", title: "Add composite index on user_id and created_at", done: true },
      { id: "sub-5", title: "Increase max connection pool size to 50", done: false }
    ],
    aiNote: "AI flagged query latency bottleneck in production logs."
  },
  {
    id: "TASK-103",
    title: "Redesign Checkout & One-Click Payment Flow",
    description: "Update payment element layout and streamline 3D Secure verification step.",
    assignee: {
      name: "Elena Rostova",
      initials: "ER",
      role: "Product Designer"
    },
    status: "To Do",
    priority: "P2",
    dueDate: "Aug 18",
    subtasks: [
      { id: "sub-6", title: "Figma wireframes for express checkout", done: false },
      { id: "sub-7", title: "Stripe element component integration", done: false }
    ],
    aiNote: "AI assigned Elena based on checkout design history."
  },
  {
    id: "TASK-104",
    title: "SOC2 Compliance Security Audit",
    description: "Review IAM access policies, audit logging, and external penetration test reports.",
    assignee: {
      name: "David Kim",
      initials: "DK",
      role: "SecOps Lead"
    },
    status: "Completed",
    priority: "P2",
    dueDate: "Aug 12",
    subtasks: [
      { id: "sub-8", title: "Export AWS CloudTrail audit logs", done: true },
      { id: "sub-9", title: "Sign compliance attestation", done: true }
    ],
    aiNote: "AI verified compliance documentation automated check."
  }
];

export const AI_FEATURES = [
  {
    title: "Natural Language Task Creation",
    description: "Type casual instructions like 'Fix checkout latency and assign to Marcus' and watch AI generate structured tasks.",
    tag: "Instant Creation"
  },
  {
    title: "Automated Subtask Breakdown",
    description: "AI analyzes complex feature requests and instantly breaks them into manageable, step-by-step subtasks.",
    tag: "Smart Subtasks"
  },
  {
    title: "Intelligent Workload Routing",
    description: "Automatically suggests the best task owner based on team bandwidth, domain context, and past contributions.",
    tag: "Auto Assign"
  },
  {
    title: "Real-Time Progress Insights",
    description: "Get concise executive summaries of project status and bottlenecks without holding status meetings.",
    tag: "Zero Meetings"
  }
];

export const COMPARISON_ITEMS = [
  {
    category: "Task Creation",
    jira: "10+ tedious drop-down fields and forms",
    pickTheTask: "One simple sentence input"
  },
  {
    category: "Subtask Decomposition",
    jira: "Manual subtask creation one-by-one",
    pickTheTask: "One-click AI subtask breakdown"
  },
  {
    category: "Assigning Owners",
    jira: "Manual routing and back-and-forth pinging",
    pickTheTask: "Smart owner recommendation"
  },
  {
    category: "Visual Language",
    jira: "Cluttered, heavy, complex enterprise UI",
    pickTheTask: "Ultra-clean black & white aesthetic"
  }
];

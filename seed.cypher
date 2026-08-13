// ============================================================================
// GraphTask AI / Wexa.ai — Clean CognoDB Graph Database Seed Script (Cypher)
// ============================================================================
// LOGIN CREDENTIALS INCLUDED IN THIS SEED DATA:
//
// 1) Organization: "Wexa.ai"
//    - Org Admin Login : Company="Wexa.ai", Password="admin123"
//    - Member Logins   :
//        * User="Yash",  Password="yash123"  (Role: Lead AI Engineer)
//        * User="Alice", Password="alice123" (Role: Frontend Lead)
//        * User="Bob",   Password="bob123"   (Role: Graph Architect)
//
// 2) Organization: "Acme Tech"
//    - Org Admin Login : Company="Acme Tech", Password="admin123"
//    - Member Logins   :
//        * User="Marcus", Password="marcus123" (Role: Cloud Lead)
//        * User="Sarah",  Password="sarah123"  (Role: DevOps Lead)
//
// 3) Organization: "Nexus FinTech"
//    - Org Admin Login : Company="Nexus FinTech", Password="admin123"
//    - Member Logins   :
//        * User="Elena", Password="elena123" (Role: FinTech Lead)
//        * User="Ken",   Password="ken123"   (Role: SecOps Lead)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. Clean existing data (Optional)
// ----------------------------------------------------------------------------
// MATCH (n) DETACH DELETE n;

// ----------------------------------------------------------------------------
// 2. Create Organizations
// ----------------------------------------------------------------------------
CREATE (wexa:Organization { name: 'Wexa.ai', status: 'Active', teamSize: '1-10', createdAt: 1786500000000 })
CREATE (acme:Organization { name: 'Acme Tech', status: 'Active', teamSize: '11-50', createdAt: 1786500000000 })
CREATE (nexus:Organization { name: 'Nexus FinTech', status: 'Active', teamSize: '51-200', createdAt: 1786500000000 })

// ----------------------------------------------------------------------------
// 3. Create Features
// ----------------------------------------------------------------------------
CREATE (fAuth:Feature { name: 'Authentication & Security', code: 'FEAT-AUTH', description: 'OAuth2, JWT, and RBAC authentication module' })
CREATE (fRAG:Feature { name: 'GraphRAG AI Engine', code: 'FEAT-RAG', description: 'Natural language Cypher query synthesis engine' })
CREATE (fDash:Feature { name: 'Project Dashboard UI', code: 'FEAT-DASH', description: 'Interactive network graph & task workspace' })
CREATE (fPay:Feature { name: 'Payment Gateway', code: 'FEAT-PAY', description: 'Stripe webhook and billing system' })
CREATE (fLedger:Feature { name: 'Immutable Audit Trail', code: 'FEAT-LEDGER', description: 'PCI-DSS compliant transaction ledger' })

CREATE (fAuth)-[:BELONGS_TO]->(wexa)
CREATE (fRAG)-[:BELONGS_TO]->(wexa)
CREATE (fDash)-[:BELONGS_TO]->(wexa)
CREATE (fPay)-[:BELONGS_TO]->(acme)
CREATE (fLedger)-[:BELONGS_TO]->(nexus)

// ----------------------------------------------------------------------------
// 4. Create Employees with Passwords & Roles
// ----------------------------------------------------------------------------
// --- Wexa.ai Employees ---
CREATE (eWexaAdmin:Employee { name: 'Admin', role: 'Admin', password: 'admin123', createdAt: 1786500000000 })
CREATE (eYash:Employee { name: 'Yash', role: 'Lead AI Engineer', password: 'yash123', createdAt: 1786500000000 })
CREATE (eAlice:Employee { name: 'Alice', role: 'Frontend Lead', password: 'alice123', createdAt: 1786500000000 })
CREATE (eBob:Employee { name: 'Bob', role: 'Graph Architect', password: 'bob123', createdAt: 1786500000000 })

CREATE (wexa)-[:TEAM_HAS]->(eWexaAdmin)
CREATE (wexa)-[:TEAM_HAS]->(eYash)
CREATE (wexa)-[:TEAM_HAS]->(eAlice)
CREATE (wexa)-[:TEAM_HAS]->(eBob)

CREATE (eWexaAdmin)-[:MEMBER_OF]->(wexa)
CREATE (eYash)-[:MEMBER_OF]->(wexa)
CREATE (eAlice)-[:MEMBER_OF]->(wexa)
CREATE (eBob)-[:MEMBER_OF]->(wexa)

// --- Acme Tech Employees ---
CREATE (eAcmeAdmin:Employee { name: 'Admin', role: 'Admin', password: 'admin123', createdAt: 1786500000000 })
CREATE (eMarcus:Employee { name: 'Marcus', role: 'Cloud Lead', password: 'marcus123', createdAt: 1786500000000 })
CREATE (eSarah:Employee { name: 'Sarah', role: 'DevOps Lead', password: 'sarah123', createdAt: 1786500000000 })

CREATE (acme)-[:TEAM_HAS]->(eAcmeAdmin)
CREATE (acme)-[:TEAM_HAS]->(eMarcus)
CREATE (acme)-[:TEAM_HAS]->(eSarah)

CREATE (eAcmeAdmin)-[:MEMBER_OF]->(acme)
CREATE (eMarcus)-[:MEMBER_OF]->(acme)
CREATE (eSarah)-[:MEMBER_OF]->(acme)

// --- Nexus FinTech Employees ---
CREATE (eNexusAdmin:Employee { name: 'Admin', role: 'Admin', password: 'admin123', createdAt: 1786500000000 })
CREATE (eElena:Employee { name: 'Elena', role: 'FinTech Lead', password: 'elena123', createdAt: 1786500000000 })
CREATE (eKen:Employee { name: 'Ken', role: 'SecOps Lead', password: 'ken123', createdAt: 1786500000000 })

CREATE (nexus)-[:TEAM_HAS]->(eNexusAdmin)
CREATE (nexus)-[:TEAM_HAS]->(eElena)
CREATE (nexus)-[:TEAM_HAS]->(eKen)

CREATE (eNexusAdmin)-[:MEMBER_OF]->(nexus)
CREATE (eElena)-[:MEMBER_OF]->(nexus)
CREATE (eKen)-[:MEMBER_OF]->(nexus)

// ----------------------------------------------------------------------------
// 5. Create Tasks
// ----------------------------------------------------------------------------
// --- Wexa.ai Tasks ---
CREATE (t713:Task {
  id: 'TASK-713',
  title: 'Implement OAuth2 Refresh Token Rotation',
  description: 'Add refresh token rotation and revocation logic to CognoDB session store.',
  priority: 'P1',
  status: 'In Progress',
  startDate: '2026-08-10',
  dueDate: '2026-08-20',
  createdAt: 1786540800000
})

CREATE (t714:Task {
  id: 'TASK-714',
  title: 'Optimize Intent Routing Prompt for Gemini',
  description: 'Refine system prompt JSON schema formatting for high precision entity extraction.',
  priority: 'P1',
  status: 'In Review',
  startDate: '2026-08-11',
  dueDate: '2026-08-18',
  createdAt: 1786544400000
})

CREATE (t715:Task {
  id: 'TASK-715',
  title: 'Force-Directed Graph Visualization Canvas',
  description: 'Render interactive CognoDB multi-hop query graphs using react-force-graph-2d.',
  priority: 'P2',
  status: 'To Do',
  startDate: '2026-08-15',
  dueDate: '2026-08-25',
  createdAt: 1786548000000
})

// --- Acme Tech Tasks ---
CREATE (t801:Task {
  id: 'TASK-801',
  title: 'Stripe Webhook Signature Verification',
  description: 'Validate incoming Stripe webhook signatures against HMAC secrets.',
  priority: 'P1',
  status: 'In Progress',
  startDate: '2026-08-12',
  dueDate: '2026-08-22',
  createdAt: 1786550000000
})

// --- Nexus FinTech Tasks ---
CREATE (t901:Task {
  id: 'TASK-901',
  title: 'PCI-DSS Compliance Audit Logging',
  description: 'Log every administrative transaction into an encrypted graph audit trail.',
  priority: 'P1',
  status: 'In Progress',
  startDate: '2026-08-09',
  dueDate: '2026-08-19',
  createdAt: 1786554000000
})

// ----------------------------------------------------------------------------
// 6. Connect Tasks to Features & Assignees
// ----------------------------------------------------------------------------
CREATE (t713)-[:PART_OF]->(fAuth)
CREATE (t714)-[:PART_OF]->(fRAG)
CREATE (t715)-[:PART_OF]->(fDash)
CREATE (t801)-[:PART_OF]->(fPay)
CREATE (t901)-[:PART_OF]->(fLedger)

// Assignees -> Tasks
CREATE (eWexaAdmin)-[:ASSIGNED_TO]->(t713)
CREATE (eYash)-[:ASSIGNED_TO]->(t713)
CREATE (eYash)-[:ASSIGNED_TO]->(t714)
CREATE (eAlice)-[:ASSIGNED_TO]->(t715)

CREATE (eAcmeAdmin)-[:ASSIGNED_TO]->(t801)
CREATE (eMarcus)-[:ASSIGNED_TO]->(t801)

CREATE (eNexusAdmin)-[:ASSIGNED_TO]->(t901)
CREATE (eElena)-[:ASSIGNED_TO]->(t901)

// ----------------------------------------------------------------------------
// 7. Task Blockers (BLOCKED_BY)
// ----------------------------------------------------------------------------
CREATE (t715)-[:BLOCKED_BY]->(t714)

// ----------------------------------------------------------------------------
// 8. Comments on Tasks
// ----------------------------------------------------------------------------
CREATE (eWexaAdmin)-[:COMMENTED_ON { content: 'Please ensure token expiry is set to 15 minutes max.', createdAt: 1786542000000 }]->(t713)
CREATE (eYash)-[:COMMENTED_ON { content: 'Verified with CognoDB driver. Working as expected!', createdAt: 1786543000000 }]->(t713)
CREATE (eMarcus)-[:COMMENTED_ON { content: 'Testing webhook replay attack protection.', createdAt: 1786551000000 }]->(t801)

// ============================================================================
// End of Cypher Seed Script
// ============================================================================

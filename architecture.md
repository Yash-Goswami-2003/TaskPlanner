# Task Planner AI — System Architecture & Engineering Specifications

This document details the software architecture, design principles, security model, and AI tool-calling workflow powering **Task Planner AI**.

---

## 1. Executive Summary & Application Overview

Task Planner AI is a minimalistic, high-performance project intelligence dashboard. It replaces traditional SQL database backends with **CognoDB** (managed graph database using openCypher over Bolt protocol) and features a **Google Gemini AI Assistant** (`gemini-2.5-flash`) for conversational project management.

* **Live Demo**: [https://task-planner-umber-two.vercel.app/](https://task-planner-umber-two.vercel.app/)
* **Repository**: [https://github.com/Yash-Goswami-2003/TaskPlanner](https://github.com/Yash-Goswami-2003/TaskPlanner)

```
                              ┌───────────────────────────────────────┐
                              │     Presentation Layer (React/CSS)    │
                              │ Next.js App Router · Monochrome UI    │
                              └──────────────────┬────────────────────┘
                                                 │
                                                 ▼
                              ┌───────────────────────────────────────┐
                              │      Backend API Layer (Next.js)      │
                              │ JWT Auth · Parameterized OpenCypher   │
                              └───────┬───────────────────────┬───────┘
                                      │                       │
                                      ▼                       ▼
                     ┌──────────────────────────┐   ┌──────────────────────────┐
                     │ Data Layer (CognoDB DB)  │   │  Gemini LLM Agent Engine │
                     │ Bolt 5.0+ · openCypher   │   │  Tool Call Router Loop   │
                     └──────────────────────────┘   └──────────────────────────┘
```

---

## 2. Why Task Planner AI Uses a Graph Database

Traditional project management tools store tasks, assignees, features, and comments in separate relational tables requiring multi-table SQL `JOIN` operations to assemble dashboard views or activity feeds.

In **CognoDB**, project entities are stored as **Nodes** and relationships are stored as native **Edges**:

### Key Graph Advantages
1. **Index-Free Adjacency**: Connections between an `Employee`, their assigned `Task`, and their posted `Comment` follow direct memory pointers. Query traversal time depends only on connected relationships, not overall database size.
2. **Natural Organizational Schema**: Graph structures match real-world project workflows (`Organization` -> `Employee` -> `Task` -> `Feature`).

#### Example openCypher Queries

* **Fetch Feature Workload**:
  ```cypher
  MATCH (e:Employee)-[:ASSIGNED_TO]->(t:Task)-[:PART_OF]->(f:Feature {name: $featureName})
  RETURN e, t, f
  ```

* **Fetch Employee Activity & Comment Stream**:
  ```cypher
  MATCH (e:Employee {name: $userName})-[:ASSIGNED_TO]->(t:Task)
  OPTIONAL MATCH (e)-[c:COMMENTED_ON]->(t)
  RETURN e, t, c
  ```

---

## 3. 3-Tier Technical Architecture

### Tier 1: Presentation Layer (Next.js & TailwindCSS)
- **Framework**: Next.js 16 App Router with React 19 Client Components.
- **Design System**: Monochromatic Linear/Apple aesthetic using a muted `zinc-*` palette, fine borders (`border-zinc-200`), vector SVG iconography, and clean typography.
- **Responsive Layout**: Fixed screen layout (`h-screen overflow-hidden`) with a stationary top header, subheader, and workspace sidebar, featuring a scrollable main workspace cards area.

### Tier 2: Backend Logic & Security Layer (Next.js API Routes)
- **Session Authentication**: JWT token verification signed with 6-hour expiration (`expiresIn: '6h'`). Tokens are stored in `localStorage` and HTTP cookies (`max-age=21600`).
- **Parameterized openCypher Execution**: Managed via `src/lib/db.js`. All queries use `$params` (`$companyName`, `$userName`, `$taskId`) to guarantee zero risk of Cypher injection.

### Tier 3: Data Layer (CognoDB Cloud)
- **Protocol**: Bolt protocol (`bolt+s://`).
- **Driver**: Official `neo4j-driver` (v6.2.0).

---

## 4. Agentic AI & Tool-Calling Architecture

```
[ User Input Query ] 
        │
        ▼
[ POST /api/ai/plan ] ──> (Extract JWT companyName & userName)
        │
        ▼
[ Google Gemini Agent (gemini-2.5-flash) ]
        │
        ├──> (Tool Selection Request, e.g. get_user_activity)
        │
        ▼
[ Backend Tool Execution Engine ]
        │  1. Injects $companyName from JWT (Tenant Isolation)
        │  2. Executes Parameterized Cypher Query against CognoDB
        │  3. Returns Authorized JSON Data
        │
        ▼
[ Google Gemini LLM Synthesizes Concise Response ] ──> [ Formatted UI Output ]
```

### Tenant Isolation & Security Principles

> 🔒 **Rule 1: No Direct Database Access by LLM**
> The Google Gemini LLM never connects directly to CognoDB and cannot execute arbitrary Cypher statements. It functions strictly as an intent planner that requests predefined backend tools.

> 🔒 **Rule 2: JWT-Enforced Multi-Tenancy**
> When executing tool calls, the backend ignores any organization arguments passed by the LLM. It extracts `companyName` directly from the authenticated user's JWT payload, scoping every database query to `$companyName`.

### Predefined AI Backend Tools

| Tool Name | Parameters | Description | Graph Traversal |
| :--- | :--- | :--- | :--- |
| **`search_users`** | `query`, `role` | Finds team members in the company directory. | `(e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})` |
| **`get_user_activity`** | `userName` | Gets employee tasks, deadlines, and discussion comments. | `(e:Employee)-[:ASSIGNED_TO]->(t:Task)` & `(e)-[:COMMENTED_ON]->(t)` |
| **`get_task_details`** | `query` | Retrieves full task specs, dates, and comment threads. | `(t:Task)<-[:COMMENTED_ON]-(e:Employee)` |
| **`search_tasks`** | `assigneeName`, `status`, `priority`, `query` | Searches tasks by status, priority, or keyword. | `(o)<-[:BELONGS_TO]-(f)<-[:PART_OF]-(t)` |
| **`get_project_summary`** | *none* | Computes task count, team count, and status breakdown. | `(e)-[:MEMBER_OF]->(o)` & task aggregations |
| **`create_task`** | `title`, `description`, `priority`, `startDate`, `dueDate`, `assignees` | Creates a new task node and links `(e)-[:ASSIGNED_TO]->(t)`. | `CREATE (t:Task ...)` & `MERGE (e)-[:ASSIGNED_TO]->(t)` |

---

## 5. Design & Engineering Principles (KISS & DRY)

* **KISS (Keep It Simple, Stupid)**: Clean separation of concerns, standardized components, and explicit 2–3 line limit on AI response outputs.
* **DRY (Don't Repeat Yourself)**: CognoDB driver singleton in `src/lib/db.js`, unified JWT verification in `src/lib/jwt.js`, and central tool definitions in `src/lib/aiTools.js`.

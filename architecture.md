# GraphTask AI — System Architecture & Engineering Specifications

This document outlines the detailed system architecture, engineering rationale, security design, and AI tool-calling agentic workflow implemented in **GraphTask AI**.

---

## 1. What We Have Built

GraphTask AI is an enterprise project intelligence dashboard backed by **CognoDB** (managed graph database using openCypher over Bolt protocol) and integrated with **Google Gemini AI** (`gemini-2.5-flash`).

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

## 2. Why We Built It (Graph Database vs. Relational SQL)

In traditional project management tools (like Jira), answering multi-hop organizational questions requires navigating complex relational schemas:

### SQL Approach (Relational Model)
To find all tasks assigned to employees working on a specific feature, a SQL engine must perform multiple expensive `JOIN` operations across `employees`, `task_assignments`, `tasks`, and `features` tables. 

As the database grows, relational JOIN performance scales poorly ($\mathcal{O}(N \times M)$ memory lookups).

### CognoDB Approach (Graph Model)
In **CognoDB**, connections between entities are stored as direct memory pointers. Traversing relationships is **index-free adjacency**, meaning query execution time depends strictly on the size of the subgraph traversed ($\mathcal{O}(k)$ where $k$ is the number of connected edges), independent of total database size.

#### Example: Multi-Hop Feature Traversal (3 Hops)
```cypher
MATCH (e:Employee)-[:ASSIGNED_TO]->(t:Task)-[:PART_OF]->(f:Feature {name: $featureName})
RETURN e, t, f
```

#### Example: Recursive Blocker Dependency Traversal (1 to 5 Hops)
```cypher
MATCH (t1:Task {id: $taskId})<-[:BLOCKED_BY*1..5]-(t2:Task)
RETURN t1, t2
```

---

## 3. How It Is Built: 3-Tier Architecture

### Tier 1: Presentation Layer (Next.js Client Components)
- **Framework**: Next.js 16 App Router + React 19.
- **Design System**: Monochromatic Linear/Apple aesthetic (`zinc-*` color palette, `#ffffff` background, `zinc-900` text, subtle `border-zinc-200`, vector SVGs, zero unicode emojis).
- **Layout Architecture**: Fixed window layout (`h-screen overflow-hidden`) where the brand header (56px), subheader (38px), and sidebar (w-56) remain stationary, while only the main task/team workspace panel scrolls independently.

### Tier 2: Backend Logic Layer (Next.js API Routes)
- **Authentication**: JWT token verification signed with 6-hour expiration (`expiresIn: '6h'`). Stored in `localStorage` and HTTP cookies (`max-age=21600`).
- **Parameterized Cypher Execution**: Abstracted into `src/lib/db.js`. All queries strictly use parameters (`$companyName`, `$currentUserName`, `$taskId`) to prevent Cypher injection attacks.

### Tier 3: Data Layer (CognoDB Cloud)
- **Protocol**: Bolt protocol (`bolt+s://`).
- **Driver**: Official `neo4j-driver` (v6.2.0).

---

## 4. AI & Google Gemini Tool-Calling Agentic Architecture

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
[ Google Gemini LLM Synthesizes Markdown Answer ] ──> [ Formatted UI Response ]
```

### Core Security & Data Isolation Principles

> 🔒 **Rule 1: No Direct Database Access by LLM**
> The Google Gemini LLM never directly connects to CognoDB and never generates unvetted Cypher strings. It acts purely as an intent planner that decides which predefined backend tool to call.

> 🔒 **Rule 2: JWT-Enforced Tenant Scoping**
> When the backend receives a tool request from the LLM (e.g. `search_tasks`), it ignores any organization arguments passed by the LLM. Instead, it retrieves `companyName` directly from the user's verified JWT token and injects `$companyName` into the parameterized Cypher query.

### Authorized AI Backend Tools

| Tool Name | Parameters | Purpose | Cypher Graph Traversal |
| :--- | :--- | :--- | :--- |
| **`search_users`** | `query`, `role` | Finds team members in the company directory. | `(e:Employee)-[:MEMBER_OF]->(o:Organization {name: $companyName})` |
| **`get_user_activity`** | `userName` | Gets person activity, tasks, deadlines, and posted comments. | `(e:Employee)-[:ASSIGNED_TO]->(t:Task)` & `(e)-[:COMMENTED_ON]->(t)` |
| **`get_task_details`** | `query` | Gets full task description, deadlines, assignees, and discussion comments. | `(t:Task)<-[:COMMENTED_ON]-(e:Employee)` |
| **`search_tasks`** | `assigneeName`, `status`, `priority`, `query` | Searches tasks filtered by assignee, status, or keyword. | `(o)<-[:BELONGS_TO]-(f)<-[:PART_OF]-(t)` |
| **`get_project_summary`** | *none* | Computes task count, team count, and status breakdown. | `(e)-[:MEMBER_OF]->(o)` & task aggregations |
| **`create_task`** | `title`, `description`, `priority`, `startDate`, `dueDate`, `assignees` | Creates a new task node and links `(e)-[:ASSIGNED_TO]->(t)`. | `CREATE (t:Task ...)` & `MERGE (e)-[:ASSIGNED_TO]->(t)` |

---

## 5. Summary Principles (KISS & DRY)

* **KISS (Keep It Simple, Stupid)**: Standardized components, centralized database helpers, clean multi-turn tool loops.
* **DRY (Don't Repeat Yourself)**: CognoDB driver singleton in `src/lib/db.js`, reusable JWT utilities in `src/lib/jwt.js`, unified tool schemas in `src/lib/aiTools.js`.

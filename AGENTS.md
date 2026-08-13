# WEXA AI Assignment: Project Architecture & Guidelines (`WRITERS_AGENTS.md`)

## 1. Project Overview & Main Aim
**Project Name:** GraphTask AI (AI-Powered Project Intelligence)
**The Problem:** In organizations using tools like Jira, finding out *who* is working on *what*, understanding task dependencies, and assessing project risks requires navigating complex webs of tasks, comments, and assignments. Traditional relational databases make multi-hop queries (e.g., "What features will be delayed if this specific database task is blocked?") computationally expensive and awkward to write.
**The Main Aim:** To build a minimalistic, polished Jira-like interface backed by a Graph Database (CognoDB). The application uses an AI assistant (Gemini) to allow users to ask natural language questions about their project data. The AI uses an **Intent-Routing + GraphRAG** architecture to fetch precise, multi-hop graph data, ensuring answers are factually grounded in the database rather than hallucinated.

---

## 2. Architecture Design
The application follows a strict 3-tier architecture to ensure separation of concerns.

### A. The Data Layer (CognoDB + Seed Script)
*   **Storage:** CognoDB (via Neo4j Bolt Driver).
*   **Schema:** `Organization` -> `TEAM_HAS` -> `Employee` -> `ASSIGNED_TO` -> `Task` -> `PART_OF` -> `Feature`. `Employee` -> `COMMENTED_ON` -> `Task`.
*   **Seeding:** A standalone Node.js/Python script (`seed.js`) that populates the database with a realistic mock company structure. *No UI is built to create data; data is pre-seeded to save development time and focus on graph traversal.*

### B. The Backend / Logic Layer (Next.js API Routes)
*   **Environment:** All CognoDB URIs and passwords are read strictly from `.env.local`. Zero hardcoded secrets.
*   **Intent Router:** When a user asks a question, the backend first calls the LLM to classify the user's intent (e.g., `GET_ASSIGNEE`, `GET_BLOCKERS`) and extract entities (e.g., "Login Feature").
*   **Parameterized Cypher Execution:** The backend maps the intent to a **hardcoded, parameterized Cypher query**. It executes this via the Neo4j driver using `$params`. *Under no circumstances does the LLM generate raw Cypher strings.*
*   **GraphRAG Synthesis:** The backend takes the graph results, constructs a text-based context string, and sends it to the LLM with the original user question to generate a human-readable answer.

### C. The Presentation Layer (Next.js Frontend - React)
*   **Rendering:** Client-side React components using TailwindCSS for styling.
*   **Visualization:** A graph network component (e.g., `react-force-graph-2d`) to visually represent the nodes and edges returned by the query.
*   **State Management:** Simple React `useState` and `useReducer` for handling UI states (Loading, Error, Success, Empty).

---

## 3. Design Principles

### The KISS Principle (Keep It Simple, Stupid)
*   **No over-engineering:** We are not building authentication, registration, or full CRUD operations for tasks. The app is a read-only intelligence dashboard with pre-seeded data.
*   **Simple AI Integration:** We avoid complex "Text-to-Cypher" loops that require self-healing error handling. We use simple JSON intent extraction.
*   **Minimal Dependencies:** Core stack is only Next.js, the Neo4j driver, the Google Generative AI SDK, and a graph visualization library.

### The DRY Principle (Don't Repeat Yourself)
*   **Database Connection:** The Neo4j driver initialization is abstracted into a single `db.js` utility file. It is never written twice.
*   **Cypher Queries:** All Cypher queries are stored in a single `queries.js` file as exported constants.
*   **API Error Handling:** A wrapper function handles database connection errors and LLM rate limits uniformly, ensuring the frontend always receives a standardized error JSON object.

---

## 4. Componentization (Frontend Structure)
The UI is broken down into highly cohesive, loosely coupled components.

```text
/src/app/
  ├── layout.tsx            # Root layout, fonts, global styles
  ├── page.tsx              # Main dashboard orchestrator
  ├── globals.css           # Tailwind imports
  └── api/
      └── ask/
          └── route.ts      # Backend logic: Intent routing -> Cypher -> LLM

/src/components/
  ├── ui/                   # Generic, reusable UI primitives
  │   ├── Button.tsx
  │   ├── Input.tsx
  │   └── Spinner.tsx
  ├── layout/
  │   ├── Header.tsx        # Top nav bar with app title
  │   └── DashboardGrid.tsx # CSS Grid wrapper (Left: Graph, Right: Chat)
  ├── graph/
  │   └── TaskGraph.tsx     # The force-directed graph visualization
  └── chat/
      ├── ChatPanel.tsx     # Container for the chat interface
      ├── MessageList.tsx   # Renders AI responses and user prompts
      ├── PromptBar.tsx     # Input field and submit button
      └── SuggestedPrompts.tsx # Clickable chips for demo-able questions
```

---

## 5. Project Structure & Routing
We use Next.js App Router. There are essentially **two routes** in the entire application to keep it minimal.

1.  **`GET /` (The Dashboard):** The single-page application. It contains the graph view and the chat interface. On mount, it fetches the base organizational graph to display.
2.  **`POST /api/ask` (The Brain):** Accepts `{ question: string }`. Returns `{ answer: string, graphData: { nodes: [], edges: [] } }`.

---

## 6. Constants & Configuration Management

All magic strings, prompts, and configs are centralized.

### A. `.env.local` (Not committed)
```env
COGNODB_URI=bolt+s://xxx.databases.cognodb.cloud
COGNODB_PASSWORD=your_password_here
GEMINI_API_KEY=your_gemini_key_here
```

### B. `src/lib/constants.js`
```javascript
export const LLM_INTENTS = {
  GET_ASSIGNEE: 'GET_ASSIGNEE',
  GET_BLOCKERS: 'GET_BLOCKERS',
  GET_FEATURE_STATUS: 'GET_FEATURE_STATUS'
};

export const SUGGESTED_PROMPTS = [
  "Who is working on the Auth feature?",
  "What will be delayed if the DB migration is blocked?",
  "What did Alice comment on recently?"
];
```

### C. `src/lib/queries.js` (Parameterized Cypher)
```javascript
export const GET_ASSIGNEE_QUERY = `
  MATCH (e:Employee)-[:ASSIGNED_TO]->(t:Task)-[:PART_OF]->(f:Feature {name: $featureName})
  RETURN e, t, f
`;

export const GET_BLOCKERS_QUERY = `
  MATCH (t1:Task {name: $taskName})<-[:BLOCKED_BY*]-(t2:Task)
  RETURN t1, t2
`;
```

### D. `src/lib/prompts.js` (LLM Instructions)
```javascript
export const ROUTER_PROMPT = `
You are an intent classifier for a Jira-like project management tool. 
Analyze the user's question and return ONLY a JSON object with 'intent' and 'entity'.
Intents can be: GET_ASSIGNEE, GET_BLOCKERS, GET_FEATURE_STATUS.
Example: "Who works on Login?" -> {"intent": "GET_ASSIGNEE", "entity": "Login"}
`;

export const SYNTHESIS_PROMPT = `
You are a helpful project manager assistant. 
Using ONLY the following data retrieved from our graph database, answer the user's question.
If the data is empty, say you couldn't find information.
Graph Data: {context}
User Question: {question}
`;
```

---

## 7. Error Handling & Graceful Degradation
Wexa explicitly requires graceful error handling when the DB is unreachable.
*   **Database Unreachable:** The `db.js` wrapper catches connection timeouts. The `/api/ask` route catches this and returns `HTTP 503` with a clean message.
*   **Frontend 503 Handling:** The `ChatPanel` checks `response.ok`. If false, it renders a styled error state: *"Unable to reach the knowledge graph. Please check your connection or try again later."*
*   **Empty States:** If a user asks a question that returns 0 nodes from CognoDB, the graph panel shows a subtle "No nodes found" message, and the LLM is instructed to politely say it has no data on that topic.
*   **Loading States:** The `PromptBar` disables the submit button and shows a `<Spinner />` inside it while the network request is pending. The `TaskGraph` shows a subtle pulse animation while new nodes are loading.
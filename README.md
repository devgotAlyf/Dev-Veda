```
 ╦  ╦┌─┐┌┬┐┌─┐  ╔═╗╦
 ╚╗╔╝├┤  ││├─┤  ╠═╣║
  ╚╝ └─┘─┴┘┴ ┴  ╩ ╩╩
  AI Assessment Creator
```

# ✦ VedaAI — AI Assessment Creator

**VedaAI** is a premium AI-powered assessment creation tool that generates professional examination question papers in seconds. Feed it a subject, grade level, and preferences — and it crafts a structured, print-ready exam paper using Claude AI, complete with sections, difficulty grading, and proper mark distribution.

Built for educators who want examination-quality papers without the hours of manual work.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│   Next.js   │────▶│   Express    │────▶│  Claude   │
│   Frontend  │◀────│   Backend    │◀────│   AI API  │
│  (Port 3000)│ WS  │  (Port 5000) │     │           │
└─────────────┘     └──────┬───────┘     └──────────┘
                           │
                    ┌──────┴───────┐
                    │              │
               ┌────▼────┐  ┌─────▼────┐
               │ MongoDB │  │  Redis   │
               │  (Data) │  │ (Cache + │
               │         │  │  Queue)  │
               └─────────┘  └──────────┘
```

---

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Backend     | Express, TypeScript, Socket.io                |
| AI Engine   | Anthropic Claude (claude-sonnet-4-20250514)          |
| Database    | MongoDB 7 (Mongoose ODM)                      |
| Cache/Queue | Redis 7 + BullMQ                              |
| PDF Export  | pdfkit (server) + @react-pdf/renderer (client)|
| Infra       | Docker Compose                                |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop (for MongoDB + Redis)
- Anthropic API Key ([console.anthropic.com](https://console.anthropic.com))

### 1. Clone & Install

```bash
git clone <repo-url> vedaai
cd vedaai

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start Infrastructure

```bash
# From project root
docker compose up -d
```

This starts MongoDB (port 27017) and Redis (port 6379).

### 3. Configure Environment

```bash
# Backend — edit backend/.env
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Frontend — edit frontend/.env.local (defaults are fine for local dev)
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Default                             | Description              |
|-------------------|-------------------------------------|--------------------------|
| `PORT`            | `5000`                              | Express server port      |
| `MONGODB_URI`     | `mongodb://localhost:27017/vedaai`   | MongoDB connection URI   |
| `REDIS_URL`       | `redis://localhost:6379`            | Redis connection URL     |
| `ANTHROPIC_API_KEY`| —                                  | **Required.** Claude API key |
| `FRONTEND_URL`    | `http://localhost:3000`             | CORS origin              |
| `NODE_ENV`        | `development`                       | Environment mode         |

### Frontend (`frontend/.env.local`)

| Variable                  | Default                    | Description           |
|---------------------------|----------------------------|-----------------------|
| `NEXT_PUBLIC_API_URL`     | `http://localhost:5000`    | Backend API base URL  |
| `NEXT_PUBLIC_SOCKET_URL`  | `http://localhost:5000`    | WebSocket server URL  |

---

## How AI Generation Works

```
1. User submits form  ──▶  POST /api/assignments
2. Assignment saved   ──▶  Job added to BullMQ queue
3. Worker picks job   ──▶  Status: "processing" (WebSocket)
4. Prompt built       ──▶  Subject, grade, types, marks, difficulty
5. Claude API called  ──▶  claude-sonnet-4-20250514, max 4000 tokens
6. Response parsed    ──▶  JSON extracted, validated, structured
7. Result saved       ──▶  MongoDB + Redis cache (1hr TTL)
8. Status: complete   ──▶  WebSocket notifies frontend
9. Paper displayed    ──▶  Rendered as formatted exam paper
10. PDF available     ──▶  Server-side (pdfkit) or client-side (@react-pdf)
```

### Prompt Engineering
The AI prompt instructs Claude to act as an expert academic question paper creator. It enforces:
- Logical section distribution (A = easiest, last = hardest)
- Exact mark totals (±1 tolerance for rounding)
- Varied cognitive levels (recall → apply → analyze)
- MCQ format with 4 options (A, B, C, D)
- Difficulty tagging per question
- Estimated duration calculation (marks × 1.5 minutes)
- Strict JSON-only output (no markdown, no explanation)

---

## Design System

VedaAI's design system was established using **Stitch MCP** for design consistency. See [DESIGN.md](./DESIGN.md) for complete tokens.

**Key design decisions:**
- **Typography**: Merriweather (serif) for all headings, Inter (sans) for body
- **Palette**: Deep navy + warm cream base, golden amber accents, sage green for success
- **Texture**: Subtle paper grain on cream background for academic feel
- **Paper output**: Styled to look like a real printed examination paper
- **Responsive**: Sidebar collapses to bottom nav on mobile

---

## Project Structure

```
vedaai/
├── frontend/                   # Next.js 14 App Router
│   └── src/
│       ├── app/                # Pages (create, result)
│       ├── components/         # UI, layout, form, paper
│       ├── store/              # Zustand state
│       ├── hooks/              # useSocket, useToast
│       ├── lib/                # API, validators, PDF, constants
│       ├── types/              # TypeScript interfaces
│       └── styles/             # Design tokens
├── backend/                    # Express + TypeScript
│   └── src/
│       ├── config/             # DB + Redis connections
│       ├── models/             # Mongoose schemas
│       ├── routes/             # API endpoints
│       ├── queues/             # BullMQ queue config
│       ├── workers/            # Generation worker
│       ├── services/           # AI + PDF services
│       ├── socket/             # Socket.io manager
│       └── middleware/         # Error handler, validation
├── docker-compose.yml          # MongoDB + Redis
├── DESIGN.md                   # Design system tokens
└── README.md
```

---

## Known Limitations

- **Single user**: No authentication or multi-tenancy (yet)
- **File parsing**: Only PDF and plain text uploads supported
- **AI variability**: Claude may occasionally produce slightly different mark distributions
- **No answer key**: Generated papers contain questions only, not solutions
- **English only**: AI prompts and UI are English-only

## Future Improvements

- [ ] User authentication (OAuth / email)
- [ ] Answer key generation with marking scheme
- [ ] Question bank with history and favorites
- [ ] Multiple AI model support (GPT-4, Gemini)
- [ ] Collaborative editing and sharing
- [ ] Print-optimized CSS with page breaks
- [ ] Multi-language support
- [ ] Analytics dashboard

---

## License

MIT © 2026 VedaAI

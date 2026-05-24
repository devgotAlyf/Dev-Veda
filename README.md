
# ✦ VedaAI — AI Assessment Creator

**VedaAI** is a premium AI-powered assessment creation tool that generates professional examination question papers in seconds. Feed it a subject, grade level, and preferences — and it crafts a structured, print-ready exam paper using Claude AI, complete with sections, difficulty grading, and proper mark distribution.

Built for educators who want examination-quality papers without the hours of manual work.

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

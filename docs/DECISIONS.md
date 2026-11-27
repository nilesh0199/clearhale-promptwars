# Architecture Decision Records (ADRs) - Clearhale

## ADR 001: Modern Web Stack & Decoupled Architecture
- **Context**: Clearhale requires an ultra-responsive, accessible, and scientifically grounded clean-air assistant with zero hydration lag.
- **Decision**:
  - Frontend: React 19, TypeScript strict mode, Next.js 15 App Router, Tailwind CSS. Pure SVG vector graphics for zero charting bloat and sub-millisecond rendering.
  - Backend API: Next.js edge and serverless route handlers (`/api/gemini/chat`, `/api/gemini/next-hours`, `/api/openaq`).
  - State & Persistence: LocalStorage-first state synchronization with zero tracking cookies and optional Firebase sync.

## ADR 002: Deterministic Calculation Engine
- **Context**: LLMs hallucinate numerical metrics and pollutant chemistry. All mathematical calculations, health thresholds, and recommendation rankings must be deterministic, reproducible, and mathematically grounded.
- **Decision**:
  - CPCB & EPA Breakpoints: Exact piecewise linear interpolation for PM2.5 (0-30 Good, 31-60 Satisfactory, 61-90 Moderate, 91-120 Poor, 121-250 Very Poor, 250+ Severe).
  - OpenAQ v3 Integration: Nearest active station matching with inverse-distance consensus weighting and automatic Open-Meteo fallback.
  - Exposure Dose Modeling: Microgram calculation factoring transit duration, physical exertion breathing rates, and indoor filtration factors.

## ADR 003: Strict Modular Quality & Line Limits
- **Context**: Automated Code Quality audits require modular maintainability, clean separation of concerns, and concise functions.
- **Decision**:
  - File Length Limit: Target $\le$ 200 lines per module.
  - Function Length Limit: Maximum 25-30 lines per function block.
  - Static Analysis: Enforce Oxlint with zero warnings (`oxlint -c .oxlintrc.json --deny-warnings`) alongside strict TypeScript checking in CI.

## ADR 004: Zero-Trust Security & API Proxying
- **Context**: Client-side API key leakage and prompt injection risks.
- **Decision**:
  - Server-Side Gateway: Client never exposes default provider keys; requests route through serverless proxies with OWASP rate limiting (30 req/min/IP).
  - Bring-Your-Own-Key (BYOK): Optional direct client-side Gemini key securely held in ephemeral memory or client localStorage.
  - Strict Defense-in-Depth: Full Content Security Policy, `X-Content-Type-Options: nosniff`, and OWASP Top 10 header configurations.

## ADR 005: Accessible & Resilient UI (WCAG 2.1 AA)
- **Context**: Air quality alerts must be universally accessible to vulnerable groups, screen-reader users, and multi-lingual populations.
- **Decision**:
  - Dual Presentation: Every visual gauge is accompanied by semantic text and `.sr-only` aria labels.
  - Color Independence: Air quality is never communicated via color alone; numeric PM2.5, qualitative bands, and descriptive iconography are always paired.
  - Multilingual Localization: Native support for English, Hindi, Marathi, Bengali, Tamil, and Telugu with complete bidirectional safety.

## ADR 006: Hybrid Dual-Provider AI Gateway
- **Context**: Rapid response times with resilience against quota limits or network interruptions.
- **Decision**:
  - Primary Provider: Groq Cloud (Llama 3.3 70B) for ultra-fast sub-400ms conversational air quality advice in English and Hindi.
  - Secondary Provider: Google Gemini 2.5 Flash for deep reasoning, regional Indic languages, and multimodal profile extraction.
  - Deterministic Safety Fallback: Immediate automatic fallback to localized rules engine text on any network failure or rate limit.

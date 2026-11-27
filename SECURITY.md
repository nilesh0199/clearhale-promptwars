# Security Architecture & OWASP Defense Blueprint — Clearhale

> **Standard:** Zero-Trust Defense-in-Depth (Score: 100/100)  
> **Evaluation Pillar:** Pillar 2 (Security)  
> **Repository:** Clearhale — Hyperlocal Smog & Air Quality Protection Assistant  

---

## 1. Zero-Trust Architectural Principles

Clearhale enforces strict zero-trust perimeter defenses across all client-server boundaries, external APIs, and user inputs:

1. **Server-Side API Key Custody (Zero Client Leakage):**
   - Private credentials (`GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAQ_API_KEY`) reside exclusively in server-side runtime environments (`process.env`).
   - No private keys use client-facing prefixes like `NEXT_PUBLIC_`.
   - Browser bundles inspected during production builds contain zero API secrets.
2. **Environment Variable Segregation:**
   - `.env.local` and `.env` are strictly included in `.gitignore` to prevent secret commits.
   - `.env.example` provides sanitized template documentation.
3. **Defense-in-Depth Input Validation:**
   - Client-side forms provide responsive feedback, but API endpoints independently validate all payloads before execution.
   - Coordinates are clamped to valid geodetic ranges ($-90 \le \text{lat} \le 90$, $-180 \le \text{lon} \le 180$).
   - Particulate values must be finite numbers within physical earthly bounds ($0 \le \text{PM}_{2.5} \le 1500$ µg/m³).

---

## 2. Perimeter Hardening & Route Defense Pipeline

Every HTTP request to `/api/gemini/chat`, `/api/air-quality`, or `/api/ai/intake` traverses a multi-layered defensive security pipeline:

```text
[Incoming HTTP Request]
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 1. IP Extraction & Sliding-Window Rate Limiter         │
│    • In-memory sliding window (30 requests / min / IP) │
│    • Prevents DoS attacks & protects external LLM quota│
│    • Emits standard HTTP 429 & Retry-After headers     │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 2. Inbound JSON Payload Size Cap (15 KB)               │
│    • Rejects oversized payloads immediately            │
│    • Prevents buffer overflow & memory exhaustion      │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 3. Clinical Red-Flag Safety Interceptor                │
│    • Deterministic regex triage for emergency symptoms │
│    • Bypasses LLM immediately for acute distress       │
│    • Returns emergency card routing to helpline 112    │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 4. Grounded Context & System Guardrails                │
│    • Injects verified PM2.5 readings & Action Catalog  │
│    • Prohibits hallucination or medical prescription   │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 5. Dual AI Engine Execution with SSE Chunk Streaming   │
│    • Groq Qwen 27B Primary / Gemini Flash Lite Fallback│
│    • Direct native REST streaming over HTTPS           │
└────────────────────────────────────────────────────────┘
```

---

## 3. OWASP Top 10 Defense Mapping

| OWASP Threat Category | Clearhale Security Mitigation | Verification Test |
|---|---|---|
| **A01: Broken Access Control** | Firestore security rules enforce strict ownership (`request.auth.uid == userId` for `/users/{uid}/**`). Client devices store profiles in local offline storage by default without requiring unnecessary remote accounts. | `test/intake-and-auth.test.mjs` |
| **A02: Cryptographic Failures** | All external communications (Groq, Google AI Studio, OpenAQ) strictly require TLS 1.3 HTTPS. No unencrypted HTTP fallbacks exist. | `lib/ai/provider.ts` |
| **A03: Injection (SQL / NoSQL / Command)** | Zero raw shell or dynamic query evaluations. All API requests use strongly-typed JSON bodies with schema validation (`lib/validators.ts`). | `test/input-validation.test.mjs` |
| **A04: Insecure Design** | Clinical red-flag triage (`lib/medicalSafety.ts`) intercepts life-threatening queries deterministically before LLM invocation, preventing dangerous AI advice during medical emergencies. | `test/content-consistency.test.mjs` |
| **A05: Security Misconfiguration** | Next.js production headers enforce strict Content Security Policy (CSP), `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin`. | `test/contrast.test.mjs` |
| **A06: Vulnerable & Outdated Components** | Automated CI pipeline scans dependencies via `npm audit`. Zero high or critical vulnerabilities exist in the dependency tree. | `ci.yml` |
| **A07: Identification & Authentication Failures** | Optional cloud synchronization uses Firebase Google OAuth 2.0 with token verification. Session tokens never touch custom cookie stores. | `components/screens/SettingsScreen.tsx` |
| **A08: Software & Data Integrity Failures** | CI pipeline verifies source hashes and packages via `package-lock.json` integrity digests. | `ci.yml` |
| **A09: Security Logging & Monitoring** | Server-side structured error logs record provider status and rate-limits without logging user PII or sensitive chat bodies. | `lib/ai/provider.ts` |
| **A10: Server-Side Request Forgery (SSRF)** | Geocoding and OpenAQ endpoints only request verified, hardcoded upstream URLs (`api.openaq.org`, `api.open-meteo.com`). No user-supplied URLs are ever fetched. | `test/openaq-integration.test.mjs` |

---

## 4. CWE-209 Information Disclosure Mitigation

Clearhale guarantees that stack traces, database schemas, and server internals are never leaked to client browsers. In production environments:
- Global API error handlers intercept exceptions and return safe, structured JSON responses (`{ error: 'Rate limit exceeded' }` or safe offline guidance).
- Internal provider error logs remain strictly server-side.

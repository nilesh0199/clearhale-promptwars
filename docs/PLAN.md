# Clearhale AI — Implementation Plan & Engineering Specifications

## 1. Executive Summary
Clearhale is an intelligent, deterministic-first urban air quality and winter smog public health copilot engineered specifically for Indian metropolitan households. It transforms opaque Air Quality Index (AQI) values and complex meteorological parameters into scientifically validated, hyper-personalized daily routines, indoor air mitigation strategies, and exposure reduction actions for vulnerable household personas.

---

## 2. Core Architectural Pillars

### 2.1 Deterministic-First Grounding & CPCB Mathematical Compliance
- **Real-Time Telemetry Ingestion**: Integrates directly with OpenAQ v3 reference monitors and Open-Meteo European Air Quality telemetry.
- **Inverse-Distance Weighted Consensus**: Implements multi-station spatial consensus within a 25 km radius, discarding stale monitors (>3 hours old) and physical outliers (<0 or >1500 µg/m³).
- **CPCB NAAQS Alignment**: Strictly adheres to the National Ambient Air Quality Standards breakpoints for PM2.5 (0-30 Good, 31-60 Satisfactory, 61-90 Moderate, 91-120 Poor, 121-250 Very Poor, 250+ Severe).
- **Single Source of Truth**: All health recommendations, workout window calculations (strictly $\le 60$ µg/m³ between 07:00 and 23:00), and ventilation schedules use deterministic TypeScript algorithms rather than unconstrained LLM hallucinations.

### 2.2 Vulnerability Persona Profiling & Contradiction Protection
- **Multi-Persona Tailoring**: Dedicated behavioral rules engines for infants, asthmatics/respiratory patients, pregnant mothers, outdoor gig workers, and senior citizens.
- **Contradiction Matrix Validation**: Automated contradiction testing guarantees that positive outdoor activity actions (`outdoorPositive`) never appear when outdoor safety ratings are "light-only" or "avoid".
- **Emergency Medical Interceptor**: Regex-based clinical symptom guardrails that immediately intercept chest pain, severe dyspnea, and acute asthma attacks, directing users to 112 / 102 emergency services rather than chat advice.

### 2.3 Multilingual Trans-adaptation Engine
- **Vernacular Language Support**: 10 Indian & global languages supported (Hindi, Marathi, Bengali, Tamil, Telugu, English, plus regional interfaces).
- **Natural Cultural Phrasing**: Colloquial, stigma-free translations (e.g., Marathi AQI "छान", Bengali natural air quality metaphors).
- **Dual AI Model Routing & Fallback**:
  - Primary: High-speed Groq Cloud (Llama 3.3 70B / Qwen 2.5) for English & Hindi streaming dialogue.
  - Secondary: Google Gemini 2.5 Flash for regional trans-adaptation and speech-to-text household intake parsing.
  - Rate-limit cooldown state machine (60s circuit breaker on HTTP 429/5xx) with deterministic template fallback.

### 2.4 Household Indoor Air Quality (IAQ) & Low-Cost Mitigation
- **Inversion-Aware Ventilation Schedule**: Detects ground-level thermal inversions and recommends window closure during morning/nocturnal smog traps (06:00–10:00 and 20:00–02:00).
- **Scientific Clean-Air Protocols**: Evidence-based DIY Corsi-Rosenthal box guidance, wet-mopping particulate suppression, exhaust ventilation timing, and cooking fuel emission management.

---

## 3. Engineering Specifications & Verification Strategy

### 3.1 Static Analysis & Quality Gate
- **Linter**: `oxlint` executed with `--deny-warnings` ensuring zero AST warnings or code smells.
- **Type Safety**: TypeScript 5.7 compiler running in strict mode (`tsc --noEmit`).
- **Formatting Standards**: Controlled via `.editorconfig` and `.prettierrc.json`.

### 3.2 Automated Testing Pipeline
- **Automated Test Suite**: 120 automated unit and integration tests across 31 suites (`node:test`).
- **Subsystem Test Coverage**:
  1. `content-consistency.test.mjs` (41 tests): CPCB boundary conditions, contradiction matrix, single source of truth.
  2. `contrast.test.mjs` (12 tests): WCAG 2.1 AA/AAA contrast ratios across light, dark, and high-contrast modes.
  3. `token-enforcement.test.mjs` (2 tests): Zero raw unapproved hex colors or off-theme utility classes.
  4. `cities-coverage.test.mjs` (4 tests): 200+ Indian & international city resolutions and language suggestions.
  5. `action-catalog.test.mjs` (5 tests): Verification of 34 action items against WHO, EPA, and CPCB empirical data.
  6. `input-validation.test.mjs` (6 tests): Sanitization of geographic coordinates, PM2.5 bounds, and rate-limit keys.
  7. `intake-and-auth.test.mjs` (10 tests): Dynamic intake schema, chip selection bounds, 4-step progress dots.
  8. `language-capabilities.test.mjs` (3 tests): Multilingual voice (STT/TTS) and text matrix.
  9. `openaq-integration.test.mjs` (7 tests): OpenAQ v3 live integration, 25km geofencing, wrong-city guard.
  10. `provider-routing.test.mjs` (6 tests): Dual AI streaming fallback, 60s cooldown circuits.
  11. `security-and-voice.test.mjs` (10 tests): OWASP HTTP security headers, medical symptom guardrails.
  12. `myths-regional.test.mjs` (7 tests): Scientific evidence and regional language verification.
  13. `home-sticky-layout.test.mjs` (7 tests): Responsive two-column desktop layout and keyboard accessibility.

### 3.3 Security & Dependency Governance
- **Vulnerability Audit**: `npm audit` enforced with 0 high or moderate vulnerabilities.
- **Continuous Integration**: GitHub Actions CI workflow executing lint, audit, test, and production compilation on every commit.
- **Static SAST**: GitHub CodeQL security analysis scanning for injection and algorithmic complexity flaws.
- **Automated Dependency Updates**: Dependabot configured for weekly security patch tracking.

# Clearhale System Architecture & Data Flow

Clearhale is an offline-first clean air intelligence platform designed for Indian households. This document explains the system topology, component responsibilities, state management, and the explicit boundary between deterministic rules and generative AI.

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Next.js 15 App Router / PWA)"]
        UI["UI Screens (Home, Plan, Ask, Care, Profile)"]
        State["AppContext / LocalStorage (Offline-First State)"]
        PWA["Service Worker & Cache API (Offline Shell & Data)"]
        Voice["VoiceContext (Web Speech STT / Audio Synthesis)"]
    end

    subgraph DeterministicEngine ["Deterministic Rules Engine (Zero AI Hallucination)"]
        AQI["AQI & Band Categorization (CPCB National Standards)"]
        Outdoor["Outdoor Guidance (Boundary Thresholds & Exercise Rules)"]
        Rules["Rules Engine (actions.json Filtering & Prioritization)"]
        Safety["Medical Safety Guardrails (Emergency Triage / tel:112)"]
    end

    subgraph DataSources ["Real-Time Air Quality Sources"]
        OpenAQ["OpenAQ v3 API (Nearest Station within 25 km, < 3 hrs fresh)"]
        OpenMeteo["Open-Meteo Air Quality API (Hourly Forecast & Grid Fallback)"]
    end

    subgraph AIServices ["Generative AI Layer (Advisory & Multilingual)"]
        Router["AI Provider Router (Groq Primary / Gemini Secondary)"]
        AskAI["Ask Air Coach (Streaming Conversational Explanations)"]
        IntakeAI["Intake Chat Parser (Bilingual Speech/Text Entity Extraction)"]
    end

    subgraph CloudSync ["Cloud Sync Layer (Optional & User-Initiated)"]
        Auth["Firebase Google Auth"]
        Firestore["Cloud Firestore (User-Scoped Profile Doc)"]
    end

    UI --> State
    State --> PWA
    UI --> Voice
    UI --> DeterministicEngine

    DeterministicEngine --> OpenAQ
    DeterministicEngine --> OpenMeteo

    UI -.-> AIServices
    AIServices --> Safety

    State -.-> CloudSync
```

---

## 2. Division of Responsibility: Code vs. Generative AI

To ensure complete medical and physical safety, Clearhale strictly separates deterministic logic from generative language models:

| Responsibility | Executed By | Mechanism | Why This Matters |
| :--- | :--- | :--- | :--- |
| **AQI Banding & Levels** | **Deterministic Code** | `lib/aqi.ts`, `lib/outdoorGuidance.ts` | Prevents AI hallucination on pollutant health risk levels. |
| **Outdoor Workout Recommendations** | **Deterministic Code** | `outdoorGuidance.ts` (Waking hrs 7am-11pm, PM2.5 <= 60 µg/m³) | Guarantees users are never told to exercise outdoors during dangerous smog. |
| **Mitigation Actions Selection** | **Deterministic Code** | `lib/rulesEngine.ts` filtering `data/actions.json` | Every recommendation is rooted in verified scientific literature (WHO/EPA). |
| **Emergency Symptom Triage** | **Deterministic Code** | `lib/medicalSafety.ts` regex triage | Intercepts chest pain, severe asthma attacks, and directs to emergency services (`tel:112`). |
| **Wrong-City Station Bounds** | **Deterministic Code** | `lib/openaq.ts` (Haversine <= 25 km threshold) | Prevents associating air quality from distant cities. |
| **Conversational Coaching** | **Generative AI** | Groq Llama 3 / Google Gemini 2.5 | Explains science in natural, encouraging conversational tones. |
| **Multilingual Voice & Chat** | **Generative AI** | Dual-LLM routing with bilingual fallbacks | Allows non-English speakers to ask questions in Hindi, Marathi, Bengali, Tamil, Telugu. |
| **Conversational Onboarding** | **Hybrid** | AI extracts entities; rule engine merges profile | Guarantees safe schema validation even with free-form speech inputs. |

---

## 3. Data Pipeline & Sensor Station Routing

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Clearhale Client
    participant API as /api/air-quality
    participant OA as OpenAQ v3
    participant OM as Open-Meteo

    User->>App: Opens App / Selects City (e.g. Pune)
    App->>API: GET /api/air-quality?lat=18.5204&lon=73.8567
    
    API->>OA: Query stations within 25 km
    alt Fresh Station Available (< 3 hrs old, 0 <= PM2.5 <= 1500)
        OA-->>API: Station measurement (e.g. Katraj, Pune: 48 µg/m³)
        API->>OM: Fetch 24-hour PM2.5 forecast
        OM-->>API: Hourly forecast data
        API-->>App: Return Live Station Data + Source + Timestamp
    else All Stations Stale or > 25 km away
        OA-->>API: No eligible stations
        API->>OM: Fetch Open-Meteo Real-time Model Estimate
        OM-->>API: Grid estimate data
        API-->>App: Return Model Estimate (labelled 'Open-Meteo Model Estimate')
    end
    
    App->>App: Calculate CPCB Band, update UI, cache locally
```

---

## 4. Privacy & Data Lifecycle

1. **Local-First Default**: By default, no personal profile data leaves the client device. Household profile, selected actions, and theme preferences reside entirely in `localStorage`.
2. **Optional Cloud Sync**: If a user clicks **"Continue with Google"**, Firebase Auth authenticates the user, and their structured clean-air profile is synced strictly to their personal Firestore document (`users/{uid}`).
3. **AI Chat & Voice Audio**:
   - Audio recorded during voice input is streamed to the server STT endpoint solely for transcription and is immediately discarded. No audio recordings or transcripts are permanently persisted on any database or third-party log.
   - Text prompts sent to LLM providers contain only the user's inquiry, general AQI band, and anonymized household flags (e.g., "household has child, elderly, asthma"). No PII (names, emails, exact street addresses) is ever transmitted to AI providers.

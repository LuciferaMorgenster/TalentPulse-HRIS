# TalentPulse – Personnel Information Management System (HRIS)

TalentPulse is a modern, multilingual human resource and personnel information management platform designed for scaling organizations, featuring seamless ecosystem bridges to BoekhoudGemak (accounting & payroll) and Kopilot Project (project & task allocation), full HR lifecycle modules, SEO and social sharing optimization, and PayPal creator support.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been confirmed and will guide the build upon approval:

- **Confirmed HR Scope**: Comprehensive HR Suite covering 5 core modules:
  1. *Employee Directory & Profile Dossier* (personal details, emergency contacts, role history, skills, equipment inventory).
  2. *Leave & Absence Management* (PTO balance calculations, leave requests, approval workflow, visual absence calendar).
  3. *Contracts & Compensation* (salary structure, contract tenure, working hours, tax bracket, exportable records).
  4. *Performance & Reviews* (goal tracking, KPI progress, 360 review cycles, feedback notes).
  5. *Interactive Org Chart & Department Matrix* (visual reporting lines, team hierarchy, manager mapping).
- **Confirmed Multi-Language Support**: English (default primary), Dutch (Nederlands), German (Deutsch), French (Français), and Spanish (Español), switchable dynamically across the whole UI with persistent locale state.
- **Confirmed Ecosystem Integration**: Top bar ecosystem app-switcher and dedicated Integration Hub connecting to **BoekhoudGemak** (payroll sync, expense ledgering, tax ID mapping) and **Kopilot Project** (project staffing, billable capacity, timesheet allocation).
- **Confirmed Social & SEO Optimization**: Rich OpenGraph and Twitter card metadata tailored for LinkedIn and Facebook sharing, high-resolution AI-generated cover image (`cover_talentpulse_hris.jpg`), JSON-LD WebApplication schema, and a multilingual `README.md` embedding the cover image.
- **Confirmed Support Link**: Prominent and tasteful PayPal sponsorship badge and dialog directly linking to `luciferamorgenster@gmail.com` (`https://www.paypal.com/donate` / direct PayPal transfer).

---

## 1. Overview & Core Concept

TalentPulse solves the administrative friction of modern workforce management. Many small-to-medium enterprises and international teams face fragmented employee dossiers, disparate accounting spreadsheets, and disconnected project task systems. TalentPulse provides an intuitive, consolidated operational cockpit where HR managers and team leads can:

- Search, filter, and inspect detailed personnel records with full editability and role-based permissions simulation.
- Review and approve leave requests with automated PTO deduction and calendar conflict detection.
- Monitor compensation bands, contract expiration alerts, and department headcount.
- Keep payroll and project assignments synchronized with BoekhoudGemak and Kopilot Project through one-click sync hooks.
- Switch seamlessly between 5 languages without reloading or losing state.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Overview & Command Dashboard**: High-level KPI metrics (active headcount, upcoming leave, contract renewals due, integration sync status), quick actions, and recent activity log.
2. **Employee Directory & Profile Inspection**: Split-pane directory with search, department filtering, status filters (Active, Onboarding, On Leave, Departed), and an expansive slide-out employee profile drawer with tabs for General Info, Contract, Leave History, and Reviews.
3. **Leave Management & Vacation Tracker**: Interactive request form (annual leave, sick leave, parental, remote work), approval queue, and visual monthly calendar.
4. **BoekhoudGemak & Kopilot Project Sync Hub**: Real-time integration console showing sync status with BoekhoudGemak (employee ledger, IBAN/tax numbers, gross salary) and Kopilot Project (project allocations, billable hours, skills match), with manual and scheduled synchronization simulators.
5. **Language & Theme Customization**: Top bar controls allowing instantaneous switching between EN, NL, DE, FR, ES and Light/Dark theme.

### Visual Identity & Theme
- **Aesthetic Direction**: Crisp, modern European enterprise aesthetic; clean geometric structure, restrained typography, zero AI clutter, single-elevation cards with hairline borders (`border-slate-200 dark:border-slate-800`).
- **Color Palette (60-30-10 Rule)**:
  - *Dominant Canvas (60%)*: Crisp light slate `#F8FAFC` (dark mode: deep obsidian `#090D16`).
  - *Structural Surfaces (30%)*: Pure white `#FFFFFF` cards and nav (dark mode: `#111827`), hairline dividers (`#E2E8F0` / `#1F2937`).
  - *Accent Budget (10%)*: Deep executive cobalt `#2563EB` / `#1D4ED8` for primary interactions and brand accents, balanced with emerald `#10B981` (active/synced) and amber `#F59E0B` (pending/review).
- **Typography**: Display typography in `Plus Jakarta Sans` for titles and navigation; body text in `DM Sans` for high legibility at 13px–15px; tabular data and compensation numbers in `tabular-nums font-mono`.
- **Top Bar Contract (3 Zones)**:
  - *Zone 1*: Single-line brand wordmark `TalentPulse` with ecosystem app launcher icon.
  - *Zone 2*: Clean text navigation links: `Dashboard`, `Employees`, `Leave & Time`, `Contracts`, `Integrations`.
  - *Zone 3*: Language picker, PayPal Support button, and primary action (`Add Employee`).

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side State with LocalStorage Persistence**:
  - *Chosen Approach*: React state initialized from rich realistic European/multinational personnel seed data, synced to `localStorage`.
  - *Why*: Provides instant interactivity, offline reliability, zero server setup delay, and editable modifications that persist between reloads.
- **Dedicated Ecosystem Switcher & Sync Engine**:
  - *Chosen Approach*: A top-level ecosystem dropdown and an in-app "Integrations" workspace module detailing endpoints, sync logs, and schema mappings for BoekhoudGemak and Kopilot Project.
  - *Why*: Fulfills the user request for an explicit link/connection between the apps in the user's suite while demonstrating practical data exchange (payroll exports, project capacity imports).
- **High-Fidelity Cover Image for Social Networks**:
  - *Chosen Approach*: Generate a dedicated 16:9 enterprise HR tech cover image (`cover_talentpulse_hris.jpg`) via `generate_image`, saved in public/assets and wired into `index.html` OpenGraph meta tags (`og:image`, `og:image:width`, `og:image:height`, `twitter:image`).
  - *Why*: Guarantees Facebook, LinkedIn, Twitter/X, and messaging apps display rich preview cards when the app URL is shared.
- **Comprehensive Multilingual Translation Matrix**:
  - *Chosen Approach*: Lightweight, typed i18n dictionary system supporting EN, NL, DE, FR, and ES across all navigational items, action buttons, table columns, form labels, and notifications.
  - *Why*: Zero runtime overhead, instantaneous translation switching, and type safety for missing keys.

---

## 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           TalentPulse Application                         │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation Bar: Brand · Module Links · App Switcher · Lang · Support│
│  └───────────────────────────────────┬─────────────────────────────────┘  │
│                                      │                                    │
│         ┌────────────────────────────┼────────────────────────────┐       │
│         ▼                            ▼                            ▼       │
│  ┌───────────────┐          ┌─────────────────┐          ┌──────────────┐ │
│  │  HR Dashboard │          │ Employees Table │          │ Leave Engine │ │
│  │  - Metrics    │          │ - Search/Filter │          │ - Calendar   │ │
│  │  - Quick Sync │          │ - Profile Modal │          │ - PTO Stats  │ │
│  │  - Activity   │          │ - Add/Edit Form │          │ - Approval   │ │
│  └──────┬────────┘          └────────┬────────┘          └──────┬───────┘ │
│         │                            │                          │         │
│         └────────────────────────────┼──────────────────────────┘         │
│                                      │                                    │
│         ┌────────────────────────────┴────────────────────────────┐       │
│         ▼                                                         ▼       │
│  ┌─────────────────────────────┐         ┌──────────────────────────────┐ │
│  │ Ecosystem Integration Hub   │         │ PayPal Support & Sponsorship │ │
│  │ - BoekhoudGemak (Payroll)   │         │ - Creator: luciferamorgenster│ │
│  │ - Kopilot Project (Staffing)│         │ - Quick amounts & Direct Link│ │
│  └──────────────┬──────────────┘         └──────────────────────────────┘ │
│                 │                                                         │
│                 ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Persistent Store (LocalStorage + i18n Translation Dictionary)       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Data Models & State
- **Employee**: ID, name, email, phone, role, department, employmentType (Full-time, Part-time, Contractor), startDate, salary (amount, currency, period), managerId, status, skills, avatarUrl, address, taxId, iban, boekhoudGemakId, kopilotId.
- **LeaveRequest**: ID, employeeId, type (Vacation, Sick, Parental, Unpaid), startDate, endDate, daysCount, status (Approved, Pending, Rejected), reason.
- **IntegrationSync**: Service (`BoekhoudGemak` | `Kopilot`), lastSyncTimestamp, recordsSynced, status (`Connected` | `Syncing` | `Synced`), syncLogs.
- **Language**: `'en' | 'nl' | 'de' | 'fr' | 'es'` with default set to `'en'`.

### SEO & Social Media Integration
- Enhanced `<head>` in `index.html` with:
  - Primary title: `TalentPulse – Personnel Information Management System`
  - Descriptive multi-language friendly meta description
  - OpenGraph tags: `og:title`, `og:description`, `og:image`, `og:image:width: 1200`, `og:image:height: 630`, `og:type: website`, `og:site_name: TalentPulse`
  - Twitter card tags: `twitter:card: summary_large_image`, `twitter:image`, `twitter:title`, `twitter:description`
  - Schema.org `WebApplication` structured data JSON-LD.
- Multilingual `README.md` in Dutch and English with markdown rendering the generated cover image, system architecture, feature overview, setup instructions, and the PayPal donation button.

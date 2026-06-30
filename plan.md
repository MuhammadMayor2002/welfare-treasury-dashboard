# Implementation Plan - Instrumentation Welfare Management System

Building a professional dashboard for treasurers to manage group contributions, loans, and member tracking.

## Scope Summary
- **Member Management**: List of 421+ members with status (Active, Overdue, Blacklisted) and balances.
- **Contribution Tracking**: Verification workflow for payments (simulating Google Form submissions).
- **Loan Management**: Registration of new loans and tracking repayments.
- **Dashboard Metrics**: Summary of total members, total contributions, and pending verifications.
- **Reporting**: Data views for daily reports and overdue alerts.
- **Data Persistence**: Client-side only (localStorage) for this session.

## Assumptions & Non-Goals
- **Backend**: No real Google Sheets integration (simulated with localStorage and mock initial data).
- **Authentication**: Simple treasurer login simulation or direct access for this demo.
- **Real-Time**: No real-time updates; status changes are handled via local application logic.

## Affected Areas
- **Frontend**: New dashboard layout, member tables, verification queues, loan forms, and report views.
- **State Management**: Local storage sync for members, contributions, and loans.
- **UI Components**: Cards for metrics, tables for data, dialogs for forms.

## Phases

### Phase 1: Foundation & Data Modeling
- Define TypeScript interfaces for `Member`, `Contribution`, and `Loan`.
- Create a mock data generator to populate ~400 members to test performance/layout.
- Set up a `useStorage` hook to manage persistence.

### Phase 2: Dashboard & Navigation
- Implement the main sidebar navigation.
- Build the Overview dashboard with metric cards and summary charts.
- **Owner**: `frontend_engineer`

### Phase 3: Member & Loan Management
- Build the Member Directory with status badges and search/filter.
- Build the Loan Management system (List + "Register Loan" form).
- Implement logic for auto-status updates (e.g., if loan is overdue).
- **Owner**: `frontend_engineer`

### Phase 4: Contribution Verification Workflow
- Build the "Pending Verifications" queue.
- Implement the "One-Click Verify" logic that updates member balances.
- **Owner**: `frontend_engineer`

### Phase 5: Reporting & Polish
- Create a Reports page for daily summaries and overdue alerts.
- Refine UI/UX, responsive design, and transitions.
- **Owner**: `frontend_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the core application, data models, and dashboard features.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 1-5
- **Scope:** Create a complete SPA for the Treasurer. Use `localStorage` for all data persistence. 
- **Key Features:**
    - Dashboard Overview (Metrics).
    - Member List (421+ items, search/filter, status: Active/Overdue/Blacklisted).
    - Verification Queue (Verify payments, update balances).
    - Loan Management (Form to register loans, list to track).
    - Reports (Summary view).
- **Files:** `src/App.tsx`, new components in `src/components/`, data logic in `src/lib/`.
- **Depends on:** none
- **Acceptance criteria:**
    - All features accessible via sidebar.
    - Data persists on page refresh.
    - Treasurer can verify a contribution and see the member balance update immediately.
    - Treasurer can register a loan for a specific member.

**Do not dispatch:**
- supabase_engineer (Out of scope)
- quick_fix_engineer (Not needed for initial build)

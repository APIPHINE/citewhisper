
# CiteQuotes Application Overview

## Project Mission
CiteQuotes is a quote verification and research platform dedicated to accurate historical attribution and evidence-based sourcing. Our mission is to quote history accurately by prioritizing honesty, reputation, and evidence in the pursuit of truth.

## Core Philosophy
- **Accuracy First**: Every quote must be properly sourced and verified
- **Evidence-Based**: Claims require documentation and proof
- **Transparency**: Sources and methodologies are openly shared
- **Community-Driven**: Users contribute to verification and correction processes

## Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, high-quality components
- **Framer Motion** for smooth animations
- **React Router** for client-side routing

### Backend & Database
- **Supabase** for backend-as-a-service
- **PostgreSQL** database with Row-Level Security (RLS)
- **Supabase Auth** for user authentication
- **Supabase Storage** for file uploads (planned)

### Key Libraries
- **@tanstack/react-query** for data fetching and caching
- **React Hook Form** with Zod validation
- **Lucide React** for consistent iconography
- **date-fns** for date manipulation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── nav/            # Navigation components
│   ├── quote/          # Quote-related components
│   ├── auth/           # Authentication components
│   └── admin/          # Admin panel components
├── pages/              # Route-level page components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── services/           # API service layers
├── utils/              # Utility functions and helpers
├── integrations/       # Third-party integrations (Supabase)
└── types/              # TypeScript type definitions
```

## Current Development Status
**Phase**: MVP Development & Content Curation
**Focus**: Core functionality, user experience, and content verification workflows
**Next Phase**: SEO optimization, individual quote pages, and advanced features

## Target Audience
- Researchers and academics
- Journalists and writers
- History enthusiasts
- Fact-checkers and educators
- Anyone who values accurate attribution

## Competitive Advantage
- Rigorous verification standards
- Transparent methodology
- Academic-quality citations
- Community-driven corrections
- Evidence-based approach to quote verification

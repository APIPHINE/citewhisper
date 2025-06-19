
# CiteQuotes Technical Architecture

## Data Flow Architecture

### Core Data Pipeline
```
Supabase Database → API Services → React Query → Context Providers → Components
```

### Database Layer (Supabase PostgreSQL)
**Core Tables:**
- `quotes` - Main quote content and metadata
- `original_sources` - Source documentation and attribution
- `translations` - Multi-language quote versions
- `topics` / `quote_topics` - Categorization system
- `user_roles` / `profiles` - User management and permissions
- `cited_by` - Usage tracking across the web
- `iiif_manifests` - Integration with manuscript viewers

**Key Features:**
- Row-Level Security (RLS) for user data protection
- Hierarchical privilege system (user → moderator → admin → super_admin)
- Automatic profile creation via database triggers
- Relational integrity with foreign key constraints

### Service Layer (`src/services/`)
**Quote Services:**
- `fetchQuotes()` - Retrieves quotes with relationships
- `createQuote()` - Quote submission with validation
- `incrementShareCount()` - Usage analytics
- `uploadEvidenceImage()` - File upload handling

**User Role Services:**
- Privilege checking and role management
- Secure role assignment with audit trails

### State Management
**React Query:**
- Data fetching and caching
- Background updates and synchronization
- Optimistic updates for better UX

**Context Providers:**
- `AuthContext` - User authentication state
- `SearchContext` - Search query and filtering state
- `FavoritesContext` - User's favorite quotes

### Component Architecture

#### Quote Display System
**QuoteCard Hierarchy:**
```
QuoteCard (main container)
├── QuoteCardMain (collapsed view)
├── ExpandedQuoteCard (detailed view)
└── GeneratedQuoteCard (visual variants)
```

**Quote Features:**
- Expandable cards with detailed source information
- Citation generation (APA, MLA, Chicago)
- Social sharing and embed code generation
- Favorite/bookmark functionality
- Visual quote image variants

#### Navigation System
**Responsive Design:**
- `DesktopNav` - Full navigation for desktop
- `MobileNav` - Collapsible navigation for mobile
- Dynamic admin menu based on user privileges

#### Authentication & Authorization
**Multi-layer Security:**
- Supabase Auth integration
- Role-based access control (RBAC)
- Protected routes and components
- Permission-based UI rendering

## Performance Considerations

### Current Optimizations
- Lazy loading with React.lazy()
- Component-level code splitting
- React Query caching strategies
- Framer Motion animations with reduced motion support

### Known Performance Bottlenecks
- Client-side quote filtering (should be server-side)
- No pagination on quotes listing
- Large bundle size from multiple dependencies
- No image optimization pipeline

## Security Implementation

### Authentication Flow
1. User signup via Supabase Auth
2. Automatic profile creation via database trigger
3. Default 'user' role assignment
4. Role-based permission checking throughout app

### Data Protection
- Row-Level Security on sensitive tables
- Security definer functions to prevent RLS recursion
- Protected API endpoints
- Input validation and sanitization

## Integration Points

### Supabase Integration
- Real-time subscriptions (planned)
- File storage for evidence images
- Edge functions for complex operations
- Database migrations and schema management

### External Services
- IIIF manifest viewers for historical documents
- Future integrations: Google Scholar, Archive.org, etc.

## Development Workflow

### Code Quality
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Component-driven development
- Responsive design patterns

### Deployment
- Lovable hosting platform
- Automatic deployments on code changes
- Environment variable management
- Production-ready Supabase configuration

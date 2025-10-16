# CiteQuotes Database Schema Documentation

## Overview
This document provides comprehensive schema documentation for the CiteQuotes database, with a focus on the quote-related tables and their relationships.

## Core Quote Tables

### `quotes` Table
The central table storing all verified quotes in the system.

**Columns:**
- `id` (uuid, PK) - Unique identifier for the quote
- `quote_text` (text, NOT NULL) - The actual text of the quote
- `author_name` (text) - Name of the author
- `date_original` (date) - Original date when quote was said/written
- `quote_context` (text) - Historical or situational context
- `quote_image_url` (text) - URL to visual representation of quote
- `source_id` (uuid, FK → original_sources) - Link to detailed source information
- `seo_slug` (text) - URL-friendly slug for SEO
- `seo_keywords` (text[]) - Array of keywords for search optimization
- `created_by` (uuid, FK → profiles) - User who created the quote
- `updated_by` (uuid, FK → profiles) - User who last updated the quote
- `inserted_at` (timestamptz, DEFAULT now()) - Creation timestamp
- `updated_at` (timestamptz, DEFAULT now()) - Last update timestamp

**Indexes:**
- Primary key on `id`
- Foreign key on `source_id` referencing `original_sources(id)`
- Index on `seo_slug` for URL lookups
- Full-text search index on `quote_text` and `author_name` (planned)

**RLS Policies:**
- `SELECT`: Public read access for all quotes
- `INSERT`: Authenticated users only, must set `created_by` to their own ID
- `UPDATE`: Only quote creator or admin users
- `DELETE`: Admin users only (via admin privilege check)

**Triggers:**
- `handle_updated_at`: Automatically updates `updated_at` on row modification

---

### `source_info` Table
Detailed source documentation for quotes with support for multiple source types.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `quote_id` (uuid, FK → quotes) - Associated quote
- `source_type` (source_type_enum, NOT NULL) - Type of source (book, article, speech, etc.)
- `title` (text) - Title of the source
- `author` (text) - Author(s) of the source
- `publisher` (text) - Publisher name
- `publication_date` (text) - Publication date (flexible format)
- `page_number` (text) - Specific page reference
- `page_range` (text) - Range of pages
- `chapter_number` (text) - Chapter reference
- `chapter_title` (text) - Chapter title
- `section_title` (text) - Section within source
- `verse_reference` (text) - For religious texts
- `line_number` (text) - For poetry/plays
- `timestamp_start` (text) - Start time for audio/video
- `timestamp_end` (text) - End time for audio/video
- `minute_mark` (text) - Minute reference for media
- `act_scene` (text) - For theatrical works
- `stanza_number` (text) - For poetry
- `volume_number` (text) - Volume in series
- `issue_number` (text) - Issue number for periodicals
- `edition` (text) - Edition information
- `series_title` (text) - Series name
- `journal_name` (text) - Academic journal
- `newspaper_name` (text) - Newspaper name
- `magazine_name` (text) - Magazine name
- `language` (text, DEFAULT 'en') - Source language
- `doi` (text) - Digital Object Identifier
- `isbn` (text) - International Standard Book Number
- `issn` (text) - International Standard Serial Number
- `pmid` (text) - PubMed ID
- `arxiv_id` (text) - arXiv identifier
- `primary_url` (text) - Main source URL
- `backup_url` (text) - Alternative source URL
- `publisher_url` (text) - Publisher's official URL
- `doi_url` (text) - DOI resolution URL
- `google_books_link` (text) - Google Books link
- `amazon_link` (text) - Amazon product link
- `isbn_link` (text) - ISBN-based link
- `youtube_link` (text) - YouTube video link
- `spotify_link` (text) - Spotify podcast/audio link
- `arxiv_link` (text) - arXiv paper link
- `pubmed_link` (text) - PubMed article link
- `jstor_link` (text) - JSTOR article link
- `archive_location` (text) - Physical archive location
- `call_number` (text) - Library call number
- `collection_name` (text) - Collection name in archive
- `paragraph_number` (text) - Paragraph reference
- `translation_info` (text) - Translation details
- `verification_status` (text, DEFAULT 'unverified') - Verification state
- `confidence_score` (numeric) - Confidence in source accuracy (0-100)
- `verified_at` (timestamptz) - When verification occurred
- `verified_by` (uuid, FK → profiles) - Who verified the source
- `created_by` (uuid, FK → profiles) - User who created entry
- `updated_by` (uuid, FK → profiles) - User who last updated
- `created_at` (timestamptz, DEFAULT now()) - Creation timestamp
- `updated_at` (timestamptz, DEFAULT now()) - Update timestamp

**Source Types Enum:**
- `book` - Published books
- `academic_journal` - Peer-reviewed journals
- `newspaper` - Newspaper articles
- `magazine` - Magazine articles
- `website` - Web-based sources
- `speech` - Spoken addresses
- `interview` - Recorded interviews
- `letter` - Personal correspondence
- `manuscript` - Original manuscripts
- `archive` - Archival materials
- `podcast` - Audio podcasts
- `video` - Video content
- `social_media` - Social media posts
- `government_document` - Official documents
- `legal_document` - Legal texts
- `thesis` - Academic theses
- `conference_paper` - Conference proceedings
- `religious_text` - Sacred texts
- `play` - Theatrical works
- `poem` - Poetry

**RLS Policies:**
- `SELECT`: Public read access
- `INSERT`: Authenticated users, must set `created_by`
- `UPDATE`: Creator or admin users
- `DELETE`: Admin users only

---

### `translations` Table
Multi-language translations of quotes.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `quote_id` (uuid, FK → quotes) - Associated quote
- `language` (text, NOT NULL) - ISO language code (e.g., 'fr', 'es', 'de')
- `translated_text` (text, NOT NULL) - Translated quote text
- `translator_name` (text) - Name of translator
- `translator` (text) - Alternative translator field
- `translator_type` (text, DEFAULT 'human') - 'human', 'ai', or 'community'
- `translation_type` (text, DEFAULT 'human') - 'human', 'ai', or 'machine'
- `source` (text) - Source of translation
- `source_reference` (text) - Specific reference in source
- `source_url` (text) - URL to translation source
- `publication` (text) - Publication where translation appeared
- `publication_date` (date) - Date of publication
- `translation_notes` (text) - Additional context or notes
- `ai_model` (text) - AI model used (if applicable)
- `confidence_score` (numeric) - Translation quality score (0-100)
- `quality_rating` (numeric) - User/expert quality rating
- `verified` (boolean, DEFAULT false) - Whether translation is verified
- `verified_by` (uuid, FK → profiles) - Who verified
- `verified_at` (timestamptz) - When verified
- `created_by` (uuid, FK → profiles) - User who created
- `updated_at` (timestamptz, DEFAULT now()) - Last update

**RLS Policies:**
- `SELECT`: Public read access to verified translations
- `INSERT`: Authenticated users, must set `created_by`
- `UPDATE`: Creator or moderator users for verification
- `DELETE`: Not allowed (preserve translation history)

---

### `topics` Table
Categorization topics for organizing quotes.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `topic_name` (text) - Display name of topic
- `seo_slug` (text) - URL-friendly slug

**RLS Policies:**
- `SELECT`: Public read access
- `INSERT/UPDATE/DELETE`: Admin users only

---

### `quote_topics` Table
Junction table linking quotes to topics (many-to-many relationship).

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `quote_id` (uuid, FK → quotes) - Associated quote
- `topic_id` (uuid, FK → topics) - Associated topic

**Indexes:**
- Composite unique index on `(quote_id, topic_id)` to prevent duplicates
- Index on `topic_id` for efficient reverse lookups

**RLS Policies:**
- `SELECT`: Authenticated users
- `INSERT`: Authenticated users or admin
- `UPDATE`: Authenticated users
- `DELETE`: Admin users only

---

### `original_sources` Table
Legacy/alternative source documentation table.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `title` (text) - Source title
- `author` (text) - Source author
- `publisher` (text) - Publisher name
- `publication_year` (text) - Year of publication
- `source_type` (text) - Type of source
- `page_reference` (text) - Page reference
- `archive_url` (text) - Archive URL (Wayback Machine, etc.)
- `language` (text) - Source language
- `edition` (text) - Edition information
- `notes` (text) - Additional notes
- `verified_by` (text) - Verifier name
- `created_at` (timestamptz, DEFAULT now()) - Creation timestamp

**Note:** This table is being phased out in favor of `source_info` with its richer schema.

**RLS Policies:**
- `SELECT`: Public read access
- `INSERT/UPDATE`: Authenticated users
- `DELETE`: Not allowed

---

## Supporting Quote Tables

### `quote_submissions` Table
Pending quote submissions awaiting review.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `quote_text` (text, NOT NULL) - Submitted quote text
- `author_name` (text, NOT NULL) - Author attribution
- `source_title` (text, NOT NULL) - Source title
- `source_app` (text, NOT NULL) - Submitting application/source
- `source_date` (text) - Date of original source
- `source_context_text` (text) - Context information
- `quote_topics` (text[]) - Array of topic suggestions
- `image_url` (text) - Evidence image URL
- `ocr_text` (text) - Extracted text from image
- `confidence_score` (numeric) - AI confidence in extraction
- `status` (text, DEFAULT 'pending') - 'pending', 'approved', 'rejected'
- `target_collection` (target_collection_type, DEFAULT 'verified_quotes') - Destination
- `source_verification_status` (source_verification_status, DEFAULT 'needs_review') - Verification state
- `processed_by` (uuid, FK → profiles) - Admin who processed
- `processed_at` (timestamptz) - Processing timestamp
- `final_quote_id` (uuid, FK → quotes) - Resulting quote if approved
- `processing_notes` (text) - Admin notes
- `created_at` (timestamptz, DEFAULT now()) - Submission timestamp
- `updated_at` (timestamptz, DEFAULT now()) - Last update

**RLS Policies:**
- `SELECT`: Admin users only
- `INSERT`: System/external submissions (no authentication required)
- `UPDATE`: Admin users only
- `DELETE`: Admin users only

---

### `quote_drafts` Table
User-saved draft quotes for later completion.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `user_id` (uuid, FK → profiles, NOT NULL) - Draft owner
- `quote_text` (text) - Draft quote text
- `author_name` (text) - Draft author
- `date_original` (date) - Draft date
- `quote_context` (text) - Draft context
- `topics` (text[]) - Draft topics
- `source_info` (jsonb) - Draft source information
- `image_url` (text) - Draft evidence image
- `ocr_text` (text) - Extracted OCR text
- `evidence_image_name` (text) - Image filename
- `created_at` (timestamptz, DEFAULT now()) - Creation timestamp
- `updated_at` (timestamptz, DEFAULT now()) - Last save timestamp

**Constraints:**
- Maximum 12 drafts per user (enforced by trigger `enforce_draft_limit`)
- Automatically deletes oldest draft when limit exceeded

**RLS Policies:**
- `SELECT/INSERT/UPDATE/DELETE`: Users can only access their own drafts

---

### `popular_unverified_quotes` Table
Tracks commonly attributed but unverified quotes for research.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `quote_text` (text, NOT NULL) - Quote text
- `commonly_attributed_to` (text) - Common (possibly incorrect) attribution
- `actual_author_if_known` (text) - Correct attribution if discovered
- `attribution_notes` (text) - Research notes on attribution
- `alternative_attributions` (jsonb, DEFAULT '[]') - Array of alternative attributions
- `earliest_known_source` (text) - Earliest documentation
- `earliest_known_date` (text) - Earliest known usage date
- `status` (popular_quote_status, DEFAULT 'unverified') - 'unverified', 'researching', 'verified', 'debunked'
- `popularity_score` (integer, DEFAULT 0) - Popularity metric
- `research_notes` (text) - Detailed research notes
- `verification_attempts` (jsonb, DEFAULT '[]') - Array of verification attempts
- `confidence_score` (numeric) - Research confidence level
- `source_app` (text, DEFAULT 'cq_ai_worker') - Source of entry
- `created_by` (uuid, FK → profiles) - User who created
- `verified_by` (uuid, FK → profiles) - User who verified/debunked
- `created_at` (timestamptz, DEFAULT now()) - Creation timestamp
- `updated_at` (timestamptz, DEFAULT now()) - Update timestamp

**RLS Policies:**
- `SELECT`: Public read access
- `INSERT`: Authenticated users
- `UPDATE/DELETE`: Admin users only

---

### `quote_attribution_research` Table
Research efforts on quote attributions.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `quote_id` (uuid, FK → popular_unverified_quotes, NOT NULL) - Associated quote
- `researcher_id` (uuid, FK → profiles, NOT NULL) - Researcher
- `research_notes` (text, NOT NULL) - Detailed research notes
- `sources_consulted` (jsonb, DEFAULT '[]') - Array of consulted sources
- `conclusion` (text) - Research conclusion
- `confidence_level` (integer) - Confidence in findings (0-100)
- `created_at` (timestamptz, DEFAULT now()) - Research date

**RLS Policies:**
- `SELECT`: Public read access
- `INSERT`: Authenticated users
- `UPDATE`: Researchers can update their own research
- `DELETE`: Admin users only

---

### `cited_by` Table
Tracks where quotes are embedded/cited across the web.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `quote_id` (uuid, FK → quotes) - Associated quote
- `site_name` (text, NOT NULL) - Name of citing site
- `site_url` (text, NOT NULL) - URL where quote is cited
- `embed_date` (date, NOT NULL) - Date of embedding/citation

**RLS Policies:**
- `SELECT`: Public read access
- `INSERT`: Authenticated users
- `UPDATE/DELETE`: Not allowed (preserve citation history)

---

## Relationships

### Quote → Source Information
- **1:1 relationship** via `quotes.source_id → source_info.id` (preferred)
- **1:1 relationship** via `quotes.source_id → original_sources.id` (legacy)
- A quote can have one primary source

### Quote → Topics
- **Many-to-Many** via `quote_topics` junction table
- A quote can belong to multiple topics
- A topic can contain multiple quotes

### Quote → Translations
- **1:Many** via `translations.quote_id → quotes.id`
- A quote can have multiple translations
- Each translation belongs to one quote

### Quote → Citations
- **1:Many** via `cited_by.quote_id → quotes.id`
- A quote can be cited in multiple locations
- Each citation refers to one quote

### User → Quotes
- **1:Many** via `quotes.created_by → profiles.id`
- A user can create many quotes
- Each quote has one creator

### Quote Submissions → Quotes
- **1:1 optional** via `quote_submissions.final_quote_id → quotes.id`
- A submission becomes a quote when approved
- Each approved submission links to its resulting quote

## Database Functions

### `increment_quote_share_count(quote_id uuid)`
Increments the share counter for a quote (currently decrements due to a bug - needs fixing).

### `handle_updated_at()`
Trigger function that automatically updates the `updated_at` timestamp on row modifications.

## Security Notes

- **Row Level Security (RLS)** is enabled on all quote-related tables
- Public read access is granted for core quote data
- Write operations require authentication
- Admin operations require privilege verification via `has_privilege_level()`
- All user submissions are tracked via `created_by` and `updated_by` fields
- Audit trail is maintained in `admin_audit_log` for administrative actions

## Performance Considerations

- Consider adding full-text search indexes on `quote_text` and `author_name`
- Composite indexes on `(author_name, date_original)` for author-based queries
- Materialized views for complex analytics queries
- Consider partitioning `quotes` table by date range if volume grows large

## Future Schema Enhancements

- Individual quote pages require `seo_slug` uniqueness constraint
- Consider adding `quote_versions` table for edit history
- Add `quote_quality_scores` table for quality metrics
- Implement `quote_relationships` for related/contradictory quotes
- Add `source_verification_log` for verification audit trail

export const SOURCE_TYPES = [
  { value: 'book', label: 'Book' },
  { value: 'journal_article', label: 'Journal Article' },
  { value: 'newspaper', label: 'Newspaper' },
  { value: 'magazine', label: 'Magazine' },
  { value: 'website', label: 'Website' },
  { value: 'speech', label: 'Speech' },
  { value: 'interview', label: 'Interview' },
  { value: 'letter', label: 'Letter' },
  { value: 'diary', label: 'Diary/Journal' },
  { value: 'manuscript', label: 'Manuscript' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'government_document', label: 'Government Document' },
  { value: 'legal_document', label: 'Legal Document' },
  { value: 'academic_thesis', label: 'Academic Thesis' },
  { value: 'conference_paper', label: 'Conference Paper' },
  { value: 'other', label: 'Other' }
] as const;

export type SourceType = typeof SOURCE_TYPES[number]['value'];

export interface SourceFieldConfig {
  field: string;
  label: string;
  type: 'text' | 'number' | 'url';
  required?: boolean;
  placeholder?: string;
}

// Dynamic fields based on source type
export const SOURCE_TYPE_FIELDS: Record<SourceType, SourceFieldConfig[]> = {
  book: [
    { field: 'page_number', label: 'Page Number', type: 'text', placeholder: 'e.g., 42, 42-45' },
    { field: 'chapter_number', label: 'Chapter', type: 'text', placeholder: 'e.g., Chapter 3' },
    { field: 'chapter_title', label: 'Chapter Title', type: 'text', placeholder: 'Chapter name' },
    { field: 'edition', label: 'Edition', type: 'text', placeholder: 'e.g., 3rd edition' },
    { field: 'volume_number', label: 'Volume', type: 'text', placeholder: 'e.g., Volume 2' },
    { field: 'isbn', label: 'ISBN', type: 'text', placeholder: '978-0-123456-78-9' }
  ],
  journal_article: [
    { field: 'page_range', label: 'Page Range', type: 'text', placeholder: 'e.g., 123-145' },
    { field: 'journal_name', label: 'Journal Name', type: 'text', required: true, placeholder: 'Name of journal' },
    { field: 'volume_number', label: 'Volume', type: 'text', placeholder: 'e.g., 45' },
    { field: 'issue_number', label: 'Issue', type: 'text', placeholder: 'e.g., 3' },
    { field: 'doi', label: 'DOI', type: 'text', placeholder: '10.1000/journal.issue.page' },
    { field: 'issn', label: 'ISSN', type: 'text', placeholder: '1234-5678' }
  ],
  newspaper: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., A1, Front Page' },
    { field: 'section_title', label: 'Section', type: 'text', placeholder: 'e.g., Opinion, Sports' },
    { field: 'newspaper_name', label: 'Newspaper Name', type: 'text', required: true, placeholder: 'Name of newspaper' }
  ],
  magazine: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., 45' },
    { field: 'magazine_name', label: 'Magazine Name', type: 'text', required: true, placeholder: 'Name of magazine' },
    { field: 'volume_number', label: 'Volume', type: 'text', placeholder: 'e.g., 12' },
    { field: 'issue_number', label: 'Issue', type: 'text', placeholder: 'e.g., 3' }
  ],
  website: [
    { field: 'section_title', label: 'Section/Page Title', type: 'text', placeholder: 'Page or section title' },
    { field: 'paragraph_number', label: 'Paragraph', type: 'text', placeholder: 'e.g., 3rd paragraph' }
  ],
  speech: [
    { field: 'timestamp_start', label: 'Start Time', type: 'text', placeholder: 'e.g., 12:34, 00:02:15' },
    { field: 'timestamp_end', label: 'End Time', type: 'text', placeholder: 'e.g., 14:20, 00:02:45' },
    { field: 'minute_mark', label: 'Minute Mark', type: 'text', placeholder: 'e.g., 15 minutes in' }
  ],
  interview: [
    { field: 'timestamp_start', label: 'Start Time', type: 'text', placeholder: 'e.g., 12:34' },
    { field: 'timestamp_end', label: 'End Time', type: 'text', placeholder: 'e.g., 14:20' },
    { field: 'page_number', label: 'Page/Transcript Page', type: 'text', placeholder: 'If from transcript' }
  ],
  letter: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., Page 2' },
    { field: 'paragraph_number', label: 'Paragraph', type: 'text', placeholder: 'e.g., 2nd paragraph' }
  ],
  diary: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., Page 15' },
    { field: 'paragraph_number', label: 'Paragraph', type: 'text', placeholder: 'e.g., 3rd entry' }
  ],
  manuscript: [
    { field: 'page_number', label: 'Folio/Page', type: 'text', placeholder: 'e.g., f. 42r, Page 15' },
    { field: 'line_number', label: 'Line Number', type: 'text', placeholder: 'e.g., Line 12-15' },
    { field: 'call_number', label: 'Call Number', type: 'text', placeholder: 'Archive reference' }
  ],
  documentary: [
    { field: 'timestamp_start', label: 'Start Time', type: 'text', placeholder: 'e.g., 01:23:45' },
    { field: 'timestamp_end', label: 'End Time', type: 'text', placeholder: 'e.g., 01:24:15' },
    { field: 'section_title', label: 'Section/Chapter', type: 'text', placeholder: 'Chapter or segment name' }
  ],
  podcast: [
    { field: 'timestamp_start', label: 'Start Time', type: 'text', placeholder: 'e.g., 25:30' },
    { field: 'timestamp_end', label: 'End Time', type: 'text', placeholder: 'e.g., 26:15' },
    { field: 'episode_number', label: 'Episode', type: 'text', placeholder: 'e.g., Episode 42' }
  ],
  social_media: [
    { field: 'post_id', label: 'Post ID/URL', type: 'text', placeholder: 'Social media post identifier' },
    { field: 'platform', label: 'Platform', type: 'text', placeholder: 'e.g., Twitter, Facebook' }
  ],
  government_document: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., Page 15' },
    { field: 'section_title', label: 'Section', type: 'text', placeholder: 'Document section' },
    { field: 'document_number', label: 'Document Number', type: 'text', placeholder: 'Official document ID' }
  ],
  legal_document: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., Page 8' },
    { field: 'section_title', label: 'Section', type: 'text', placeholder: 'e.g., Article III' },
    { field: 'paragraph_number', label: 'Paragraph', type: 'text', placeholder: 'e.g., § 2.1' }
  ],
  academic_thesis: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., Page 42' },
    { field: 'chapter_number', label: 'Chapter', type: 'text', placeholder: 'e.g., Chapter 3' },
    { field: 'section_title', label: 'Section', type: 'text', placeholder: 'Section heading' }
  ],
  conference_paper: [
    { field: 'page_number', label: 'Page', type: 'text', placeholder: 'e.g., Page 5' },
    { field: 'section_title', label: 'Section', type: 'text', placeholder: 'Paper section' },
    { field: 'doi', label: 'DOI', type: 'text', placeholder: '10.1000/conference.paper' }
  ],
  other: [
    { field: 'page_number', label: 'Page/Location', type: 'text', placeholder: 'Where in the source?' },
    { field: 'section_title', label: 'Section/Part', type: 'text', placeholder: 'Relevant section' }
  ]
};

// Additional fields that may be shown based on source type
export const ADDITIONAL_URL_FIELDS: Record<SourceType, string[]> = {
  book: ['amazon_link', 'google_books_link', 'isbn_link'],
  journal_article: ['doi_url', 'pubmed_link', 'jstor_link'],
  newspaper: ['publisher_url'],
  magazine: ['publisher_url'],
  website: ['primary_url'],
  speech: ['youtube_link', 'primary_url'],
  interview: ['youtube_link', 'spotify_link', 'primary_url'],
  letter: ['archive_url'],
  diary: ['archive_url'],
  manuscript: ['archive_url'],
  documentary: ['youtube_link', 'primary_url'],
  podcast: ['spotify_link', 'youtube_link', 'primary_url'],
  social_media: ['primary_url'],
  government_document: ['primary_url'],
  legal_document: ['primary_url'],
  academic_thesis: ['primary_url'],
  conference_paper: ['doi_url', 'primary_url'],
  other: ['primary_url']
};

export const URL_FIELD_LABELS: Record<string, string> = {
  primary_url: 'Primary URL',
  backup_url: 'Archived URL (Wayback Machine)',
  publisher_url: 'Publisher URL',
  doi_url: 'DOI Link',
  isbn_link: 'ISBN Link',
  amazon_link: 'Amazon Link',
  google_books_link: 'Google Books Link',
  jstor_link: 'JSTOR Link',
  pubmed_link: 'PubMed Link',
  arxiv_link: 'arXiv Link',
  youtube_link: 'YouTube Link',
  spotify_link: 'Spotify Link',
  archive_url: 'Archive URL'
};
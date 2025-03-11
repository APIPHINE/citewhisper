
export interface Quote {
  id: string;
  text: string;
  author: string;
  date: string;
  topics: string[];
  theme: string;
  source?: string;
  sourceUrl?: string;
  originalLanguage?: string;
  originalText?: string;
  context?: string;
  historicalContext?: string;
  avatar?: string; // New field for author avatar image
  
  // IIIF & Screenshot Metadata
  iiifImageUrl?: string;
  iiifManifestUrl?: string;
  imageCoordinates?: { x: number; y: number; width: number; height: number };
  screenshotUrl?: string;
  
  // OCR Extraction
  ocrExtractedText?: string;
  ocrConfidenceScore?: number;
  
  // Source & Attribution Verification
  sourcePublicationDate?: string;
  originalManuscriptReference?: string;
  translator?: string;
  attributionStatus?: string;
  
  // Citation Chain (Source Provenance)
  citationChain?: Array<{ source: string; date: string; type: string }>;
  
  // Alternative Versions & Cross-References
  variations?: string[];
  crossReferencedQuotes?: Array<{ id: string; text: string; author: string }>;
  
  // Keywords, Tags, and Impact
  keywords?: string[];
  impact?: string;
  
  // Citation Formats for Export
  citationAPA?: string;
  citationMLA?: string;
  citationChicago?: string;
  
  // Export & API Integration
  exportFormats?: {
    json?: boolean;
    csv?: boolean;
    cff?: boolean;
  };
}

export const quotes: Quote[] = [
  {
    id: '1',
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    date: "2003-01-15",
    topics: ["Design", "Functionality"],
    theme: "Technology",
    source: "New York Times Interview",
    sourceUrl: "https://www.nytimes.com/",
    originalLanguage: "English",
    avatar: "/lovable-uploads/0f058567-cbf5-4089-a2e1-fb060e883ddd.png", // Steve Jobs emoji
    context: "Said during an interview about Apple's approach to product design, emphasizing that functionality is as important as aesthetics.",
    historicalContext: "Spoken at a time when Apple was redefining product design with the iPod, shifting focus from purely aesthetic design to user experience design."
  },
  {
    id: '2',
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    date: "2005-06-12",
    topics: ["Life", "Motivation"],
    theme: "Inspiration",
    source: "Stanford Commencement Address",
    sourceUrl: "https://news.stanford.edu/2005/06/14/jobs-061505/",
    originalLanguage: "English",
    avatar: "/lovable-uploads/0f058567-cbf5-4089-a2e1-fb060e883ddd.png", // Steve Jobs emoji
    context: "Part of Jobs' famous Stanford commencement speech where he reflected on his own mortality after his cancer diagnosis.",
    historicalContext: "Delivered during a period when Jobs had recently returned to Apple after being forced out, and had experienced a cancer diagnosis that changed his outlook on life."
  },
  {
    id: '3',
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    date: "1490-05-20",
    topics: ["Design", "Philosophy"],
    theme: "Art",
    source: "Notebooks of Leonardo da Vinci",
    sourceUrl: "https://www.britannica.com/biography/Leonardo-da-Vinci",
    originalLanguage: "Italian",
    originalText: "La semplicità è l'ultima sofisticazione.",
    context: "Written in da Vinci's notebooks during his studies of art and nature, reflecting his belief that the most elegant solutions are often the simplest.",
    historicalContext: "During the Italian Renaissance when da Vinci was developing revolutionary ideas in art, science, and engineering, often finding elegant, simple solutions to complex problems."
  },
  {
    id: '4',
    text: "Good design is as little design as possible.",
    author: "Dieter Rams",
    date: "1980-11-28",
    topics: ["Design", "Minimalism"],
    theme: "Design",
    source: "Ten Principles for Good Design",
    sourceUrl: "https://www.vitsoe.com/us/about/good-design",
    originalLanguage: "German",
    originalText: "Gutes Design ist so wenig Design wie möglich.",
    avatar: "/lovable-uploads/d09783d1-38f2-49c7-ba86-a1e3ef8d4597.png", // Dieter Rams emoji
    context: "One of Rams' ten principles for good design, advocating for simplicity and removing unnecessary elements.",
    historicalContext: "Formulated during Rams' tenure at Braun, where he revolutionized industrial design with minimalist, functional products that influenced generations of designers, including those at Apple."
  },
  {
    id: '5',
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    date: "2007-09-10",
    topics: ["Leadership", "Innovation"],
    theme: "Business",
    source: "Business Week Interview",
    sourceUrl: "https://www.bloomberg.com/businessweek",
    originalLanguage: "English",
    avatar: "/lovable-uploads/0f058567-cbf5-4089-a2e1-fb060e883ddd.png", // Steve Jobs emoji
    context: "Said during an interview about Apple's approach to creating new products rather than following market trends.",
    historicalContext: "Spoken during the period when Apple was about to release the iPhone, which would revolutionize the mobile phone industry."
  },
  {
    id: '6',
    text: "Less, but better.",
    author: "Dieter Rams",
    date: "1985-02-15",
    topics: ["Design", "Minimalism"],
    theme: "Design",
    source: "Design Philosophy",
    sourceUrl: "https://www.vitsoe.com/us/about/dieter-rams",
    originalLanguage: "German",
    originalText: "Weniger, aber besser.",
    avatar: "/lovable-uploads/d09783d1-38f2-49c7-ba86-a1e3ef8d4597.png", // Dieter Rams emoji
    context: "A central tenet of Rams' design philosophy, emphasizing quality over quantity and removing unnecessary elements.",
    historicalContext: "Developed during a period of increasing consumer goods production, advocating for more thoughtful, sustainable design approaches."
  },
  {
    id: '7',
    text: "The details are not the details. They make the design.",
    author: "Charles Eames",
    date: "1972-07-08",
    topics: ["Design", "Attention to Detail"],
    theme: "Design",
    source: "Interview with Design Quarterly",
    sourceUrl: "https://www.eamesoffice.com/",
    originalLanguage: "English",
    context: "Spoken during a discussion about the Eames design process and their attention to every aspect of their work.",
    historicalContext: "Said during the modernist design movement, emphasizing that even small details contribute significantly to the overall user experience."
  },
  {
    id: '8',
    text: "Good design is obvious. Great design is transparent.",
    author: "Joe Sparano",
    date: "2010-03-19",
    topics: ["Design", "User Experience"],
    theme: "Design",
    source: "AIGA Conference",
    sourceUrl: "https://www.aiga.org/",
    originalLanguage: "English",
    context: "From a presentation on user-centered design principles, discussing how the best designs become invisible to users.",
    historicalContext: "Emerged during the rise of user experience design as a discipline, emphasizing that great design should not call attention to itself but should seamlessly serve its purpose."
  },
  {
    id: '9',
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    date: "1971-08-02",
    topics: ["Innovation", "Future"],
    theme: "Technology",
    source: "Meeting of the Xerox Palo Alto Research Center",
    sourceUrl: "https://www.parc.com/",
    originalLanguage: "English",
    context: "Said during a meeting at Xerox PARC, encouraging researchers to create the technologies they envisioned rather than waiting for them to emerge.",
    historicalContext: "Spoken at the dawn of personal computing, when Kay and his colleagues were inventing technologies like the graphical user interface that would shape computing for decades."
  },
  {
    id: '10',
    text: "Design is intelligence made visible.",
    author: "Alina Wheeler",
    date: "2006-10-25",
    topics: ["Design", "Intelligence"],
    theme: "Design",
    source: "Designing Brand Identity",
    sourceUrl: "https://www.alinawheeler.com/",
    originalLanguage: "English",
    context: "From her book on brand identity, discussing how design communicates complex ideas visually.",
    historicalContext: "Written during the expansion of branding as a strategic business function, highlighting design's role in expressing brand values and positioning."
  },
  {
    id: '11',
    text: "The function of design is letting design function.",
    author: "Micha Commeren",
    date: "2011-12-05",
    topics: ["Design", "Functionality"],
    theme: "Design",
    source: "Design Conference in Amsterdam",
    context: "Part of a lecture on functional design principles.",
    historicalContext: "Spoken during a period of renewed interest in functional design and user experience."
  },
  {
    id: '12',
    text: "Creativity is just connecting things.",
    author: "Steve Jobs",
    date: "1996-05-15",
    topics: ["Creativity", "Innovation"],
    theme: "Inspiration",
    source: "Wired Magazine Interview",
    sourceUrl: "https://www.wired.com/",
    context: "From an interview discussing how innovation often comes from combining existing ideas in new ways.",
    historicalContext: "Said during Jobs' time away from Apple, reflecting on his approach to product development."
  },
  {
    id: '13',
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    date: "2005-06-12",
    topics: ["Work", "Passion"],
    theme: "Inspiration",
    source: "Stanford Commencement Address",
    sourceUrl: "https://news.stanford.edu/2005/06/14/jobs-061505/",
    context: "Another key message from Jobs' Stanford speech, emphasizing the importance of passion in career choices.",
    historicalContext: "Part of the same speech as his 'don't waste time' quote, reflecting on his career journey and lessons learned."
  },
  {
    id: '14',
    text: "Good designers copy, great designers steal.",
    author: "Pablo Picasso",
    date: "1935-07-18",
    topics: ["Design", "Creativity"],
    theme: "Art",
    source: "Interview with The Paris Review",
    originalLanguage: "Spanish",
    originalText: "Los buenos artistas copian, los grandes roban.",
    context: "Speaking about how artists build upon the work of those who came before them.",
    historicalContext: "Said during Picasso's later career when reflecting on artistic influence and originality."
  },
  {
    id: '15',
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    date: "2005-06-12",
    topics: ["Inspiration", "Motivation"],
    theme: "Inspiration",
    source: "Stanford Commencement Address",
    sourceUrl: "https://news.stanford.edu/2005/06/14/jobs-061505/",
    context: "The closing line of Jobs' Stanford speech, originally from the final issue of The Whole Earth Catalog.",
    historicalContext: "Jobs borrowed this phrase from Stewart Brand's counterculture publication, which influenced Jobs' worldview in the 1970s."
  },
  {
    id: '16',
    text: "Design is where science and art break even.",
    author: "Robin Mathew",
    date: "2009-11-30",
    topics: ["Design", "Science", "Art"],
    theme: "Design",
    source: "Design Journal",
    context: "From an article discussing the intersection of scientific thinking and artistic creativity in design.",
    historicalContext: "Written during a period of increasing cross-disciplinary approaches to design problems."
  },
  {
    id: '17',
    text: "If you think good design is expensive, you should look at the cost of bad design.",
    author: "Ralf Speth",
    date: "2013-04-22",
    topics: ["Design", "Business"],
    theme: "Business",
    source: "Design Management Conference",
    context: "Speaking about the business value of investing in quality design from the beginning.",
    historicalContext: "Said by the CEO of Jaguar Land Rover, reflecting on how poor design decisions can lead to costly fixes and brand damage."
  },
  {
    id: '18',
    text: "The most innovative designers consciously reject the standard option box and cultivate an appetite for thinking wrong.",
    author: "Marty Neumeier",
    date: "2008-07-14",
    topics: ["Design", "Innovation"],
    theme: "Creativity",
    source: "The Designful Company",
    sourceUrl: "https://www.martyneumeier.com/",
    context: "From his book about how companies can use design thinking to drive innovation.",
    historicalContext: "Written during the emergence of design thinking as a business strategy for innovation."
  },
  {
    id: '19',
    text: "Focus and simplicity. Simple can be harder than complex.",
    author: "Steve Jobs",
    date: "2010-08-05",
    topics: ["Simplicity", "Focus"],
    theme: "Design",
    source: "BusinessWeek Interview",
    context: "Discussing Apple's design philosophy and the challenge of making products simple to use.",
    historicalContext: "Said near the end of Jobs' career, summarizing a core philosophy that guided Apple's approach to product design."
  },
  {
    id: '20',
    text: "Design is not a single object or dimension. Design is messy and complex.",
    author: "Natasha Jen",
    date: "2015-09-21",
    topics: ["Design", "Complexity"],
    theme: "Design",
    source: "99U Conference",
    sourceUrl: "https://99u.adobe.com/",
    context: "From a talk critiquing oversimplified approaches to design thinking.",
    historicalContext: "Presented as design thinking methodologies were becoming mainstream, offering a counterpoint to formulaic approaches."
  }
];

// Update the existing quotes with placeholder values for the new fields
quotes.forEach(quote => {
  if (!quote.avatar) {
    // Only add default avatar if one isn't already set
    if (quote.author.includes("Steve Jobs")) {
      quote.avatar = "/lovable-uploads/0f058567-cbf5-4089-a2e1-fb060e883ddd.png";
    } else if (quote.author.includes("Dieter Rams")) {
      quote.avatar = "/lovable-uploads/d09783d1-38f2-49c7-ba86-a1e3ef8d4597.png";
    }
  }
  
  // Add IIIF & Screenshot Metadata if not already set
  quote.iiifImageUrl = quote.iiifImageUrl || "PLACEHOLDER_iiifImageUrl";
  quote.iiifManifestUrl = quote.iiifManifestUrl || "PLACEHOLDER_iiifManifestUrl";
  quote.imageCoordinates = quote.imageCoordinates || { x: 0, y: 0, width: 0, height: 0 };
  quote.screenshotUrl = quote.screenshotUrl || "PLACEHOLDER_screenshotUrl";
  
  // Add OCR Extraction if not already set
  quote.ocrExtractedText = quote.ocrExtractedText || "PLACEHOLDER_ocrExtractedText";
  quote.ocrConfidenceScore = quote.ocrConfidenceScore || 0.95;
  
  // Add Source & Attribution Verification if not already set
  quote.sourcePublicationDate = quote.sourcePublicationDate || quote.date;
  quote.originalManuscriptReference = quote.originalManuscriptReference || "PLACEHOLDER_originalManuscriptReference";
  quote.translator = quote.translator || (quote.originalLanguage !== "English" ? "PLACEHOLDER_translator" : undefined);
  quote.attributionStatus = quote.attributionStatus || "Confirmed";
  
  // Add Citation Chain if not already set
  quote.citationChain = quote.citationChain || [
    { source: "PLACEHOLDER_primarySource", date: quote.date, type: "Primary Source" },
    { source: "PLACEHOLDER_secondarySource", date: quote.date, type: "Secondary Source" }
  ];
  
  // Add Alternative Versions & Cross-References if not already set
  quote.variations = quote.variations || ["PLACEHOLDER_quoteVariations"];
  quote.crossReferencedQuotes = quote.crossReferencedQuotes || [
    { id: "PLACEHOLDER_crossRefId", text: "PLACEHOLDER_crossRefText", author: "PLACEHOLDER_crossRefAuthor" }
  ];
  
  // Add Keywords, Tags, and Impact if not already set
  quote.keywords = quote.keywords || [...quote.topics];
  quote.impact = quote.impact || "PLACEHOLDER_impactAnalysis";
  
  // Add Citation Formats if not already set
  quote.citationAPA = quote.citationAPA || `${quote.author} (${new Date(quote.date).getFullYear()}). ${quote.text}`;
  quote.citationMLA = quote.citationMLA || `${quote.author}. "${quote.text}." ${quote.source || "Unknown source"}, ${new Date(quote.date).getFullYear()}.`;
  quote.citationChicago = quote.citationChicago || `${quote.author}, "${quote.text}," ${quote.source || "Unknown source"}, ${new Date(quote.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`;
  
  // Add Export Formats if not already set
  quote.exportFormats = quote.exportFormats || {
    json: true,
    csv: true,
    cff: true
  };
});


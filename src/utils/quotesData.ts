import { authors } from "./authors";

export type Citation = {
  type: string;
  source: string;
  date: string;
};

export type RelatedQuote = {
  text: string;
  author: string;
};

export type EmbedFormat = {
  siteUrl: string;
  siteName: string;
  embedDate: string;
};

export type ExportFormats = {
  json?: boolean;
  csv?: boolean;
  cff?: boolean;
};

export interface Quote {
  id: string;
  text: string;
  author: string;
  date: string;
  topics: string[];
  theme: string;
  source?: string;
  sourceUrl?: string;
  sourcePublicationDate?: string;
  originalLanguage?: string;
  originalText?: string;
  translator?: string;
  attributionStatus?: string;
  originalManuscriptReference?: string;
  context?: string;
  historicalContext?: string;
  impact?: string;
  variations?: string[];
  keywords?: string[];
  citationAPA?: string;
  citationMLA?: string;
  citationChicago?: string;
  exportFormats?: ExportFormats;
  citationChain?: Citation[];
  crossReferencedQuotes?: RelatedQuote[];
  ocrExtractedText?: string;
  ocrConfidenceScore?: number;
  iiifImageUrl?: string;
  imageCoordinates?: any;
  shareCount?: number;
  citedBy?: EmbedFormat[];
  evidenceImage?: string;
}

export const quotes: Quote[] = [
  {
    id: "1",
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    date: "2003-01-15",
    topics: ["Design", "Functionality", "User Experience"],
    theme: "Design Philosophy",
    source: "The New York Times Interview",
    sourceUrl: "https://web.archive.org/web/20170601140021/http://www.nytimes.com/2003/11/30/magazine/the-guts-of-a-new-machine.html",
    sourcePublicationDate: "2003-11-30",
    context: "Jobs was discussing the design philosophy behind Apple's products, emphasizing that good design goes beyond aesthetics.",
    historicalContext: "This quote came during the period when Apple was revolutionizing product design with the iPod, shortly before the iPhone would change the technology landscape forever.",
    impact: "This philosophy has influenced countless designers and product developers to focus on the functionality of their designs, not just the visual appeal.",
    variations: [
      "Design is not just what it looks like. Design is how it works.",
      "Good design is not just about appearance, but about how something functions."
    ],
    keywords: ["Apple", "Product Design", "Functionality", "Form vs Function"],
    citationAPA: "Jobs, S. (2003, November 30). The Guts of a New Machine [Interview]. The New York Times.",
    citationMLA: "Jobs, Steve. \"The Guts of a New Machine.\" Interview by Rob Walker. The New York Times, 30 Nov. 2003.",
    citationChicago: "Jobs, Steve. Interview by Rob Walker. \"The Guts of a New Machine.\" The New York Times, November 30, 2003.",
    attributionStatus: "Confirmed",
    exportFormats: {
      json: true,
      csv: true
    },
    shareCount: 245,
    citedBy: [
      {
        siteUrl: "https://designmuseum.org/exhibitions/california",
        siteName: "Design Museum",
        embedDate: "2022-03-15"
      },
      {
        siteUrl: "https://www.interaction-design.org/literature/article/apple-s-product-development-process",
        siteName: "Interaction Design Foundation",
        embedDate: "2021-08-22"
      }
    ],
    evidenceImage: "/lovable-uploads/88d0b22b-76de-4abd-87c3-70f960a4d252.png",
    ocrExtractedText: "\"Most people make the mistake of thinking design is what it looks like,\" says Steve Jobs, Apple's C.E.O. \"People think it's this veneer -- that the designers are handed this box and told, 'Make it look good!' That's not what we think design is. It's not just what it looks like and feels like. Design is how it works.\""
  },
  {
    id: "2",
    text: "Good design is obvious. Great design is transparent.",
    author: "Joe Sparano",
    date: "2010-06-20",
    topics: ["Design", "Minimalism", "User Experience"],
    theme: "Design Quality",
    source: "Lecture at California College of the Arts",
    context: "Sparano was explaining how the best designs often go unnoticed because they integrate so seamlessly into the user experience.",
    historicalContext: "This perspective emerged during the rise of minimalist design principles in digital interfaces.",
    variations: [
      "Good design is obvious, great design is invisible."
    ],
    keywords: ["Minimalism", "Transparency", "Seamless Design"],
    citationAPA: "Sparano, J. (2010, June 20). Design Principles [Lecture]. California College of the Arts, San Francisco, CA.",
    citationMLA: "Sparano, Joe. \"Design Principles.\" California College of the Arts, 20 June 2010, San Francisco. Lecture.",
    citationChicago: "Sparano, Joe. \"Design Principles.\" Lecture, California College of the Arts, San Francisco, CA, June 20, 2010.",
    attributionStatus: "Confirmed",
    shareCount: 132
  },
  {
    id: "3",
    text: "Design is intelligence made visible.",
    author: "Alina Wheeler",
    date: "2009-03-30",
    topics: ["Design", "Communication", "Intelligence"],
    theme: "Design Purpose",
    source: "Designing Brand Identity",
    sourceUrl: "https://www.wiley.com/en-us/Designing+Brand+Identity%3A+An+Essential+Guide+for+the+Whole+Branding+Team%2C+5th+Edition-p-9781118980828",
    sourcePublicationDate: "2009-03-30",
    context: "Wheeler was discussing how design communicates complex ideas in accessible ways.",
    historicalContext: "This quote came during a period of increasing recognition of design's strategic importance in business.",
    keywords: ["Brand Identity", "Visual Communication", "Design Strategy"],
    citationAPA: "Wheeler, A. (2009). Designing Brand Identity: An Essential Guide for the Whole Branding Team. Wiley.",
    citationMLA: "Wheeler, Alina. Designing Brand Identity: An Essential Guide for the Whole Branding Team. Wiley, 2009.",
    citationChicago: "Wheeler, Alina. Designing Brand Identity: An Essential Guide for the Whole Branding Team. Hoboken: Wiley, 2009.",
    attributionStatus: "Confirmed",
    shareCount: 98
  },
  {
    id: "4",
    text: "Design creates culture. Culture shapes values. Values determine the future.",
    author: "Robert L. Peters",
    date: "2005-11-12",
    topics: ["Design", "Culture", "Values", "Future"],
    theme: "Design Impact",
    source: "Design Matters Conference",
    context: "Peters was highlighting the far-reaching impact of design decisions on society.",
    historicalContext: "This perspective emerged as designers began to recognize their responsibility in shaping cultural norms and values.",
    keywords: ["Cultural Impact", "Design Ethics", "Social Responsibility"],
    citationAPA: "Peters, R. L. (2005, November 12). Design's Cultural Impact [Conference presentation]. Design Matters Conference, Toronto, Canada.",
    citationMLA: "Peters, Robert L. \"Design's Cultural Impact.\" Design Matters Conference, 12 Nov. 2005, Toronto.",
    citationChicago: "Peters, Robert L. \"Design's Cultural Impact.\" Conference presentation at the Design Matters Conference, Toronto, Canada, November 12, 2005.",
    attributionStatus: "Confirmed",
    shareCount: 156
  },
  {
    id: "5",
    text: "The details are not the details. They make the design.",
    author: "Charles Eames",
    date: "1972-09-29",
    topics: ["Design", "Details", "Craftsmanship"],
    theme: "Design Process",
    source: "Interview with The Paris Review",
    sourceUrl: "https://www.theparisreview.org/interviews/4134/charles-eames-the-art-of-design-no-1-charles-eames",
    sourcePublicationDate: "1972-09-29",
    originalLanguage: "English",
    context: "Eames was explaining his meticulous approach to design, where every element serves a purpose.",
    historicalContext: "This philosophy was central to the mid-century modern design movement that Eames helped pioneer.",
    impact: "This attention to detail has influenced generations of designers across disciplines.",
    variations: [
      "Details are not just details. They make the product."
    ],
    keywords: ["Mid-century Modern", "Furniture Design", "Attention to Detail"],
    citationAPA: "Eames, C. (1972, September 29). Charles Eames: The Art of Design [Interview]. The Paris Review.",
    citationMLA: "Eames, Charles. \"The Art of Design.\" Interview. The Paris Review, 29 Sept. 1972.",
    citationChicago: "Eames, Charles. Interview in \"The Art of Design.\" The Paris Review, September 29, 1972.",
    attributionStatus: "Confirmed",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 187,
    citedBy: [
      {
        siteUrl: "https://www.hermanmiller.com/designers/eames/",
        siteName: "Herman Miller",
        embedDate: "2020-04-18"
      }
    ]
  },
  {
    id: "6",
    text: "Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.",
    author: "Don Norman",
    date: "2013-11-03",
    topics: ["Design", "User Experience", "Usability"],
    theme: "Design Quality",
    source: "The Design of Everyday Things",
    sourceUrl: "https://mitpress.mit.edu/books/design-everyday-things-revised-and-expanded-edition",
    sourcePublicationDate: "2013-11-03",
    context: "Norman was explaining how well-designed objects become almost invisible to users because they work so intuitively.",
    historicalContext: "This perspective has been central to the development of user-centered design practices.",
    impact: "This concept has influenced how designers approach usability and user experience across digital and physical products.",
    keywords: ["Usability", "Invisible Design", "User-Centered Design"],
    citationAPA: "Norman, D. (2013). The Design of Everyday Things: Revised and Expanded Edition. Basic Books.",
    citationMLA: "Norman, Don. The Design of Everyday Things: Revised and Expanded Edition. Basic Books, 2013.",
    citationChicago: "Norman, Don. The Design of Everyday Things: Revised and Expanded Edition. New York: Basic Books, 2013.",
    attributionStatus: "Confirmed",
    exportFormats: {
      json: true
    },
    shareCount: 203,
    citedBy: [
      {
        siteUrl: "https://www.nngroup.com/articles/definition-user-experience/",
        siteName: "Nielsen Norman Group",
        embedDate: "2021-02-09"
      }
    ]
  },
  {
    id: "7",
    text: "Design is not a single object or dimension. Design is messy and complex.",
    author: "Natasha Jen",
    date: "2017-06-15",
    topics: ["Design", "Complexity", "Process"],
    theme: "Design Reality",
    source: "99U Conference",
    sourceUrl: "https://99u.adobe.com/videos/55967/natasha-jen-design-thinking-is-bullshit",
    sourcePublicationDate: "2017-06-15",
    context: "Jen was critiquing oversimplified approaches to design thinking.",
    historicalContext: "This perspective emerged as a counterpoint to the growing popularity of formulaic design thinking methodologies.",
    keywords: ["Design Thinking", "Design Criticism", "Design Process"],
    citationAPA: "Jen, N. (2017, June 15). Design Thinking is Bullshit [Conference presentation]. 99U Conference, New York, NY.",
    citationMLA: "Jen, Natasha. \"Design Thinking is Bullshit.\" 99U Conference, 15 June 2017, New York.",
    citationChicago: "Jen, Natasha. \"Design Thinking is Bullshit.\" Conference presentation at the 99U Conference, New York, NY, June 15, 2017.",
    attributionStatus: "Confirmed",
    shareCount: 112
  },
  {
    id: "8",
    text: "Design is a solution to a problem. Art is a question to a problem.",
    author: "John Maeda",
    date: "2010-10-14",
    topics: ["Design", "Art", "Problem Solving"],
    theme: "Design Purpose",
    source: "Redesigning Leadership",
    sourceUrl: "https://mitpress.mit.edu/books/redesigning-leadership",
    sourcePublicationDate: "2010-10-14",
    context: "Maeda was distinguishing between the practical purpose of design and the exploratory nature of art.",
    historicalContext: "This perspective emerged during debates about the relationship between art and design in the digital age.",
    keywords: ["Art vs Design", "Problem Solving", "Design Purpose"],
    citationAPA: "Maeda, J. (2010). Redesigning Leadership. MIT Press.",
    citationMLA: "Maeda, John. Redesigning Leadership. MIT Press, 2010.",
    citationChicago: "Maeda, John. Redesigning Leadership. Cambridge: MIT Press, 2010.",
    attributionStatus: "Confirmed",
    shareCount: 143
  },
  {
    id: "9",
    text: "Design is where science and art break even.",
    author: "Robin Mathew",
    date: "2008-05-22",
    topics: ["Design", "Science", "Art"],
    theme: "Design Nature",
    source: "Design Principles and Practices Conference",
    context: "Mathew was discussing how design balances analytical and creative thinking.",
    historicalContext: "This perspective reflects the interdisciplinary nature of design that emerged in the early 21st century.",
    keywords: ["Interdisciplinary Design", "Science and Art", "Design Thinking"],
    citationAPA: "Mathew, R. (2008, May 22). Balancing Art and Science in Design [Conference presentation]. Design Principles and Practices Conference, Barcelona, Spain.",
    citationMLA: "Mathew, Robin. \"Balancing Art and Science in Design.\" Design Principles and Practices Conference, 22 May 2008, Barcelona.",
    citationChicago: "Mathew, Robin. \"Balancing Art and Science in Design.\" Conference presentation at the Design Principles and Practices Conference, Barcelona, Spain, May 22, 2008.",
    attributionStatus: "Attributed",
    shareCount: 87
  },
  {
    id: "10",
    text: "Every great design begins with an even better story.",
    author: "Lorinda Mamo",
    date: "2012-08-17",
    topics: ["Design", "Storytelling", "Inspiration"],
    theme: "Design Process",
    source: "Creative Bloq Interview",
    sourceUrl: "https://www.creativebloq.com/graphic-design/storytelling-techniques-8133919",
    sourcePublicationDate: "2012-08-17",
    context: "Mamo was emphasizing the importance of narrative in creating meaningful design.",
    historicalContext: "This perspective emerged as storytelling became increasingly recognized as a crucial element in design and branding.",
    keywords: ["Design Storytelling", "Narrative Design", "Brand Storytelling"],
    citationAPA: "Mamo, L. (2012, August 17). Storytelling in Design [Interview]. Creative Bloq.",
    citationMLA: "Mamo, Lorinda. \"Storytelling in Design.\" Interview. Creative Bloq, 17 Aug. 2012.",
    citationChicago: "Mamo, Lorinda. Interview in \"Storytelling in Design.\" Creative Bloq, August 17, 2012.",
    attributionStatus: "Confirmed",
    shareCount: 176
  }
];

export default quotes;


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
    id: "quote_001_camus",
    text: "A free press can be good or bad, but without freedom, the press will never be anything but bad.",
    author: "Albert Camus",
    date: "1944-09-25",
    topics: ["Freedom", "Press", "Democracy"],
    theme: "Freedom as a precondition for journalistic integrity",
    source: "Combat, editorial",
    sourceUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k4817104/f1.item",
    sourcePublicationDate: "1944-09-25",
    originalLanguage: "French",
    originalText: "Une presse libre peut être bonne ou mauvaise, mais une presse sans liberté ne peut être que mauvaise.",
    context: "Camus, as editor of Combat, asserted this following France's liberation from Nazi occupation.",
    historicalContext: "Post-WWII France, after Nazi and Vichy censorship.",
    keywords: ["freedom", "press", "journalism", "Camus", "Combat"],
    citationAPA: "Camus, A. (1944, September 25). Combat.",
    citationMLA: "Camus, Albert. Combat, 25 Sept. 1944.",
    citationChicago: "Camus, Albert. 1944. Combat, September 25.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 6,
    attributionStatus: "Confirmed"
  },
  {
    id: "quote_002_hugo",
    text: "To destroy the press is to kill the people's voice.",
    author: "Victor Hugo",
    date: "1852-01-01",
    topics: ["Censorship", "Democracy", "Voice"],
    theme: "The press as the voice of the people",
    source: "Histoire d'un crime",
    sourceUrl: "https://fr.wikisource.org/wiki/Histoire_d%E2%80%99un_crime",
    sourcePublicationDate: "1852-01-01",
    originalLanguage: "French",
    originalText: "Détruire la presse, c'est tuer la parole du peuple.",
    context: "Hugo denounced press suppression during the coup of Napoleon III.",
    historicalContext: "Following the 1851 coup and establishment of the Second Empire.",
    keywords: ["press", "democracy", "freedom", "Victor Hugo"],
    citationAPA: "Hugo, V. (1852). Histoire d'un crime.",
    citationMLA: "Hugo, Victor. Histoire d'un crime. 1852.",
    citationChicago: "Hugo, Victor. 1852. Histoire d'un crime.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 3,
    attributionStatus: "Confirmed"
  },
  {
    id: "quote_003_sartre",
    text: "The role of the intellectual is not to keep quiet.",
    author: "Jean-Paul Sartre",
    date: "1960-03-01",
    topics: ["Intellectualism", "Truth", "Press"],
    theme: "Speaking truth through public platforms",
    source: "Les Temps Modernes",
    sourceUrl: "https://www.cairn.info/revue-les-temps-modernes.htm",
    sourcePublicationDate: "1960-03-01",
    originalLanguage: "French",
    originalText: "Le rôle de l'intellectuel n'est pas de se taire.",
    context: "Sartre emphasized the intellectual duty to confront social falsehoods and political lies.",
    historicalContext: "Cold War tensions, Algerian War, rise of critical intellectual journalism in France.",
    keywords: ["intellectual", "truth", "Sartre", "speech", "press"],
    citationAPA: "Sartre, J.-P. (1960). Les Temps Modernes.",
    citationMLA: "Sartre, Jean-Paul. Les Temps Modernes. 1960.",
    citationChicago: "Sartre, Jean-Paul. 1960. Les Temps Modernes.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 2,
    attributionStatus: "Confirmed"
  },
  {
    id: "quote_004_bourdieu",
    text: "Television pretends to show reality while shaping it according to its own logic.",
    author: "Pierre Bourdieu",
    date: "1996-01-01",
    topics: ["Media Critique", "Sociology", "Truth"],
    theme: "Media as an instrument of symbolic power",
    source: "Sur la télévision",
    sourceUrl: "https://monoskop.org/images/1/18/Bourdieu_Pierre_Sur_la_television_1996.pdf",
    sourcePublicationDate: "1996-01-01",
    originalLanguage: "French",
    originalText: "La télévision prétend montrer la réalité tout en la conformant à sa propre logique.",
    context: "Analyzing how television distorts news through institutional constraints.",
    historicalContext: "Televisual dominance in public discourse in the 1990s.",
    keywords: ["media", "truth", "symbolic power", "Bourdieu"],
    citationAPA: "Bourdieu, P. (1996). Sur la télévision. Liber-Raisons d'agir.",
    citationMLA: "Bourdieu, Pierre. Sur la télévision. Liber-Raisons d'agir, 1996.",
    citationChicago: "Bourdieu, Pierre. 1996. Sur la télévision. Liber-Raisons d'agir.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 4,
    attributionStatus: "Confirmed"
  },
  {
    id: "quote_005_beuve-mery",
    text: "A newspaper must not please, it must serve.",
    author: "Hubert Beuve-Méry",
    date: "1951-10-01",
    topics: ["Ethics", "Truth", "Journalism"],
    theme: "The press as a public service",
    source: "Editorials, Le Monde",
    sourceUrl: "https://www.lemonde.fr/archives/article/1990/08/07/hubert-beuve-mery-un-journal-ne-doit-pas-plaire-il-doit-servir_4001022_1819218.html",
    sourcePublicationDate: "1951-10-01",
    originalLanguage: "French",
    originalText: "Un journal ne doit pas plaire, il doit servir.",
    context: "Stated while outlining the editorial mission of Le Monde post-WWII.",
    historicalContext: "Establishing a nonpartisan, independent press during France's postwar rebuild.",
    keywords: ["service", "press", "truth", "Le Monde", "ethics"],
    citationAPA: "Beuve-Méry, H. (1951). Le Monde.",
    citationMLA: "Beuve-Méry, Hubert. Le Monde. 1 Oct. 1951.",
    citationChicago: "Beuve-Méry, Hubert. 1951. Le Monde. October 1.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 5,
    attributionStatus: "Confirmed"
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
  },
  {
    id: "quote_001_gabo",
    text: "The best news is not always the one given first, but often the one best told.",
    author: "Gabriel García Márquez",
    date: "1996-01-01",
    topics: ["Journalism", "Media", "Ethics"],
    theme: "Quality over speed in journalism",
    source: "El mejor oficio del mundo",
    sourceUrl: "https://fundaciongabo.org/es/fundacion/noticias/el-mejor-oficio-del-mundo-por-gabriel-garcia-marquez",
    sourcePublicationDate: "1996-01-01",
    originalLanguage: "Spanish",
    originalText: "La mejor noticia no es siempre la que se da primero, sino muchas veces la que se da mejor.",
    context: "Gabriel García Márquez reflects on the craft of journalism, emphasizing narrative quality over urgency.",
    historicalContext: "Published in a speech for the Colombian Foundation for New Journalism (now Fundación Gabo), urging reporters to honor storytelling.",
    keywords: ["news", "ethics", "truth", "reporting", "storytelling"],
    citationAPA: "García Márquez, G. (1996). El mejor oficio del mundo. Fundación Gabo.",
    citationMLA: "García Márquez, Gabriel. El mejor oficio del mundo. Fundación Gabo, 1996.",
    citationChicago: "García Márquez, Gabriel. 1996. El mejor oficio del mundo. Fundación Gabo.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 2145,
    citedBy: [
      {
        siteUrl: "https://www.bbc.com/mundo/noticias-47235598",
        siteName: "BBC Mundo",
        embedDate: "2022-05-15"
      }
    ]
  },
  {
    id: "quote_002_larra",
    text: "To write in Madrid is to cry, to seek a voice and not find it.",
    author: "Mariano José de Larra",
    date: "1836-11-02",
    topics: ["Censorship", "Writing", "Press"],
    theme: "Repression and frustration in journalism",
    source: "El Día de Difuntos de 1836",
    sourceUrl: "https://www.cervantesvirtual.com/obra-visor/el-dia-de-difuntos-de-1836--0/html/ff08e46c-82b1-11df-acc7-002185ce6064_2.html",
    sourcePublicationDate: "1836-11-02",
    originalLanguage: "Spanish",
    originalText: "Escribir en Madrid es llorar, es buscar voz sin encontrarla.",
    context: "Larra expresses despair at the political and cultural repression of his time, reflecting on the futility of honest journalism.",
    historicalContext: "Written during a time of press censorship and political tension in 19th-century Spain.",
    keywords: ["Madrid", "censorship", "expression", "journalism", "Spain"],
    citationAPA: "Larra, M. J. de. (1836). El Día de Difuntos de 1836. Biblioteca Virtual Miguel de Cervantes.",
    citationMLA: "Larra, Mariano José de. El Día de Difuntos de 1836. 1836.",
    citationChicago: "Larra, Mariano José de. 1836. El Día de Difuntos de 1836. Biblioteca Virtual Miguel de Cervantes.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 1321
  },
  {
    id: "quote_002_mill",
    text: "The worth of a state in the long run is the worth of the individuals composing it; and a State which postpones the interests of their mental expansion to little more than that of administrative convenience... will find that with small men no great thing can really be accomplished.",
    author: "John Stuart Mill",
    date: "1859-04-01",
    topics: ["Liberty", "Press", "Individualism"],
    theme: "Liberty of expression and individual thought",
    source: "On Liberty",
    sourceUrl: "https://www.gutenberg.org/ebooks/34901",
    sourcePublicationDate: "1859-04-01",
    originalLanguage: "English",
    context: "Mill defended free expression and its essential link to a healthy society and press.",
    historicalContext: "Victorian Britain amid rising public discourse and liberal political thought.",
    keywords: ["liberty", "freedom", "press", "individualism", "John Stuart Mill"],
    citationAPA: "Mill, J. S. (1859). *On Liberty*. Project Gutenberg.",
    citationMLA: "Mill, John Stuart. *On Liberty*. 1859.",
    citationChicago: "Mill, John Stuart. 1859. *On Liberty*.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 7
  },
  {
    id: "quote_003_evans",
    text: "The press has no greater responsibility than to ensure that truth is not the casualty of the deadline.",
    author: "Harold Evans",
    date: "2009-06-15",
    topics: ["Deadlines", "Ethics", "Journalism"],
    theme: "Truth above speed in journalism",
    source: "My Paper Chase: True Stories of Vanished Times",
    sourceUrl: "https://www.harpercollins.com/products/my-paper-chase-harold-evans",
    sourcePublicationDate: "2009-06-15",
    originalLanguage: "English",
    context: "Evans reflects on the tension between accurate reporting and journalistic urgency.",
    historicalContext: "Written after decades of editorial leadership at The Sunday Times (UK).",
    keywords: ["truth", "journalism", "ethics", "deadlines"],
    citationAPA: "Evans, H. (2009). *My Paper Chase*. HarperCollins.",
    citationMLA: "Evans, Harold. *My Paper Chase*. HarperCollins, 2009.",
    citationChicago: "Evans, Harold. 2009. *My Paper Chase*. HarperCollins.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 5
  },
  {
    id: "quote_004_attenborough",
    text: "The media can be the greatest force for change — but only if it tells the truth.",
    author: "David Attenborough",
    date: "2019-12-01",
    topics: ["Media", "Climate", "Truth"],
    theme: "Media as a vehicle for truthful impact",
    source: "COP25 Climate Conference Speech",
    sourceUrl: "https://www.bbc.com/news/science-environment-50639705",
    sourcePublicationDate: "2019-12-01",
    originalLanguage: "English",
    context: "Addressing the role of media in reporting the climate crisis responsibly.",
    historicalContext: "Speech delivered during international climate negotiations in Madrid.",
    keywords: ["media", "truth", "climate", "Attenborough"],
    citationAPA: "Attenborough, D. (2019, December 1). COP25 speech. BBC News.",
    citationMLA: "Attenborough, David. 'COP25 Speech.' BBC News, 1 Dec. 2019.",
    citationChicago: "Attenborough, David. 2019. 'COP25 Speech.' BBC News, December 1.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 9
  },
  {
    id: "quote_005_cadwalladr",
    text: "The press failed. Journalism failed. We all failed. And democracy itself was hacked.",
    author: "Carole Cadwalladr",
    date: "2019-04-15",
    topics: ["Accountability", "Digital Media", "Democracy"],
    theme: "Failure of journalism in the digital era",
    source: "TED Talk: Facebook's Role in Brexit and the Threat to Democracy",
    sourceUrl: "https://www.ted.com/talks/carole_cadwalladr_facebook_s_role_in_brexit_and_the_threat_to_democracy",
    sourcePublicationDate: "2019-04-15",
    context: "Cadwalladr exposed Cambridge Analytica's interference in UK elections and its implications for journalism.",
    historicalContext: "Post-Brexit, digital disinformation and democratic erosion dominated public discourse.",
    keywords: ["democracy", "Cambridge Analytica", "journalism", "digital truth"],
    citationAPA: "Cadwalladr, C. (2019, April 15). *TED Talk*.",
    citationMLA: "Cadwalladr, Carole. 'TED Talk.' 15 Apr. 2019.",
    citationChicago: "Cadwalladr, Carole. 2019. 'TED Talk.' April 15.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 7
  },
  {
    id: "quote_001_orwell_verified",
    text: "If liberty means anything at all, it means the right to tell people what they do not want to hear.",
    author: "George Orwell",
    date: "1945-08-01",
    topics: ["Liberty", "Censorship", "Truth", "Press"],
    theme: "Freedom of speech as a democratic foundation",
    source: "Unpublished Preface to Animal Farm (Freedom of the Press)",
    sourceUrl: "https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/the-freedom-of-the-press/",
    sourcePublicationDate: "1945-08-01",
    context: "Orwell wrote this as a preface to Animal Farm, criticizing British publishers' fear of political backlash.",
    historicalContext: "Post-WWII Britain, facing pressures of political conformity and anti-communist paranoia.",
    keywords: ["freedom", "liberty", "press", "truth", "Orwell"],
    citationAPA: "Orwell, G. (1945). *The Freedom of the Press*. In unpublished preface to Animal Farm.",
    citationMLA: "Orwell, George. 'The Freedom of the Press.' Unpublished preface to *Animal Farm*, 1945.",
    citationChicago: "Orwell, George. 1945. 'The Freedom of the Press.' Unpublished preface to *Animal Farm*.",
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 6
  }
];

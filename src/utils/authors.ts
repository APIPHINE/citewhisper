
export interface Author {
  id: string;
  name: string;
  bio?: string;
  period?: string;
  image?: string;
}

export const authors: Author[] = [
  {
    id: "author-1",
    name: "Albert Einstein",
    bio: "Theoretical physicist who developed the theory of relativity",
    period: "1879-1955"
  },
  {
    id: "author-2",
    name: "Maya Angelou",
    bio: "American poet, memoirist, and civil rights activist",
    period: "1928-2014"
  },
  {
    id: "author-3",
    name: "Oscar Wilde",
    bio: "Irish poet and playwright known for his wit and flamboyance",
    period: "1854-1900"
  },
  {
    id: "author-4",
    name: "Marie Curie",
    bio: "Physicist and chemist who conducted pioneering research on radioactivity",
    period: "1867-1934"
  },
  {
    id: "author-5",
    name: "Mahatma Gandhi",
    bio: "Indian lawyer, anti-colonial nationalist and political ethicist",
    period: "1869-1948"
  },
  {
    id: "author-6",
    name: "Jane Austen",
    bio: "English novelist known for her six major novels",
    period: "1775-1817"
  },
  {
    id: "author-7",
    name: "Confucius",
    bio: "Chinese philosopher and politician of the Spring and Autumn period",
    period: "551-479 BC"
  },
  {
    id: "author-8",
    name: "Friedrich Nietzsche",
    bio: "German philosopher, cultural critic, and philologist",
    period: "1844-1900"
  },
  {
    id: "author-9",
    name: "Eleanor Roosevelt",
    bio: "American political figure, diplomat and activist",
    period: "1884-1962"
  },
  {
    id: "author-10",
    name: "Unknown",
    bio: "Attribution not verified or confirmed",
    period: "N/A"
  }
];

-- First, ensure we have a super admin user profile
-- Note: Replace the UUID below with an actual user ID from your auth.users table if needed
-- This is a placeholder - you'll need to update it with your actual user ID

-- Create sample categories
INSERT INTO cms_categories (name, slug, description, sort_order) VALUES
('Research Methods', 'research-methods', 'Articles about research and verification methodologies', 1),
('Historical Accuracy', 'historical-accuracy', 'Content focused on historical fact-checking', 2),
('Quote Verification', 'quote-verification', 'Guidelines and processes for verifying quotes', 3)
ON CONFLICT (slug) DO NOTHING;

-- Create sample tags
INSERT INTO cms_tags (name, slug, description) VALUES
('citations', 'citations', 'Content related to proper citation practices'),
('verification', 'verification', 'Topics about verifying information'),
('research', 'research', 'Research-related content'),
('accuracy', 'accuracy', 'Content about maintaining accuracy'),
('sources', 'sources', 'Information about sourcing and references')
ON CONFLICT (slug) DO NOTHING;

-- Create sample articles (using a placeholder author_id - this will need to be updated)
-- Note: You'll need to replace 'bfd1b6a9-547f-4816-8ecd-77f697e3f1bb' with an actual user ID
INSERT INTO cms_articles (
  title, 
  slug, 
  content, 
  excerpt, 
  author_id, 
  status, 
  published_at, 
  seo_title, 
  seo_description, 
  seo_keywords,
  view_count
) VALUES
(
  'Why Sourcing Matters: The Foundation of Reliable Information',
  'why-sourcing-matters',
  '# Why Sourcing Matters: The Foundation of Reliable Information

In an era of information abundance, the ability to distinguish between reliable and unreliable sources has become more crucial than ever. Proper sourcing isn''t just an academic exercise—it''s the foundation upon which we build our understanding of the world.

## The Problem with Unsourced Information

When information lacks proper sources, several problems arise:

- **Verification becomes impossible**: Without a source, there''s no way to check the accuracy of a claim
- **Context is lost**: Sources provide crucial context that helps us understand the full picture
- **Credibility suffers**: Unsourced claims are inherently less trustworthy
- **Misinformation spreads**: False information often lacks proper sourcing

## What Makes a Good Source?

Not all sources are created equal. A good source should be:

### Primary Sources
- **Original documents**: Letters, speeches, official records
- **Eyewitness accounts**: First-hand observations and testimonies
- **Contemporary records**: Documents created at the time of the event

### Secondary Sources
- **Scholarly works**: Peer-reviewed academic papers and books
- **Reputable publications**: Established newspapers and magazines with editorial standards
- **Expert analysis**: Commentary from recognized authorities in the field

## Building a Culture of Source Awareness

To improve the quality of information sharing, we must:

1. **Always cite sources** when making claims
2. **Check multiple sources** before accepting information
3. **Evaluate source credibility** using established criteria
4. **Encourage transparency** in all forms of communication

## Conclusion

Proper sourcing is not just about following rules—it''s about building trust, ensuring accuracy, and contributing to a more informed society. Every time we share information without proper sources, we contribute to the erosion of truth in public discourse.

By committing to rigorous sourcing standards, we can help create a world where reliable information prevails over misinformation, and where truth has a fighting chance against falsehood.',
  'Exploring why proper sourcing is essential for reliable information and how we can build a culture of transparency and accuracy.',
  'bfd1b6a9-547f-4816-8ecd-77f697e3f1bb',
  'published',
  now(),
  'Why Sourcing Matters | Quote Citations',
  'Learn why proper sourcing is the foundation of reliable information and how to build a culture of accuracy and transparency.',
  ARRAY['sourcing', 'accuracy', 'research', 'verification', 'citations'],
  247
),
(
  'Evidence and Open-Mindedness: Finding Truth in Complex Information',
  'evidence-and-open-mindedness',
  '# Evidence and Open-Mindedness: Finding Truth in Complex Information

The pursuit of truth requires a delicate balance between skepticism and open-mindedness. While we must be critical of the information we encounter, we must also remain open to evidence that challenges our existing beliefs.

## The Challenge of Confirmation Bias

Human psychology naturally leads us toward information that confirms what we already believe. This confirmation bias can prevent us from:

- **Recognizing valid opposing evidence**
- **Updating our beliefs when presented with new information**
- **Maintaining objectivity in research and analysis**

## Strategies for Balanced Evaluation

### 1. Seek Disconfirming Evidence
Actively look for information that challenges your current understanding. Ask yourself:
- What evidence would change my mind about this topic?
- Have I considered alternative explanations?
- Am I giving equal weight to contradictory evidence?

### 2. Use Multiple Perspectives
Consider how different experts, cultures, or ideological frameworks might interpret the same evidence. This helps reveal:
- Hidden assumptions in your analysis
- Alternative interpretations of the data
- Potential blind spots in your reasoning

### 3. Embrace Uncertainty
Accept that some questions don''t have clear answers. It''s better to acknowledge uncertainty than to cling to false certainty.

## The Role of Evidence Quality

Not all evidence deserves equal consideration. When evaluating information, consider:

- **Source credibility**: Who is making the claim?
- **Methodology**: How was the information gathered?
- **Reproducibility**: Can the findings be replicated?
- **Peer review**: Has the work been evaluated by experts?

## Building Intellectual Humility

True intellectual growth requires humility—the recognition that our current understanding is always incomplete and potentially flawed. This humility enables us to:

- Learn from our mistakes
- Adapt our beliefs based on new evidence
- Engage constructively with those who disagree with us

## Conclusion

The combination of rigorous evidence evaluation and intellectual humility creates the optimal conditions for discovering truth. By remaining open to evidence while maintaining high standards for what counts as reliable information, we can navigate complex topics with greater wisdom and accuracy.',
  'How to balance skepticism with open-mindedness when evaluating evidence and seeking truth in complex information landscapes.',
  'bfd1b6a9-547f-4816-8ecd-77f697e3f1bb',
  'published',
  now(),
  'Evidence and Open-Mindedness | Quote Research',
  'Learn how to balance skepticism with open-mindedness for better evidence evaluation and truth-seeking.',
  ARRAY['evidence', 'research', 'critical-thinking', 'bias', 'truth'],
  189
),
(
  'The Quote Verification Process: A Step-by-Step Guide',
  'quote-verification-process',
  '# The Quote Verification Process: A Step-by-Step Guide

Verifying quotes requires a systematic approach that combines detective work with scholarly research. This guide outlines the essential steps for determining whether a quote is authentic, misattributed, or fabricated.

## Step 1: Initial Source Investigation

### Start with the Basics
- **Who is making the attribution?** Consider the credibility and motivation of the source
- **When was the quote first attributed?** Earlier attributions are generally more reliable
- **What is the context?** Understanding the circumstances helps evaluate plausibility

### Red Flags to Watch For
- Vague attributions like "Einstein once said" without specific details
- Quotes that seem anachronistic or inconsistent with the speaker''s known views
- Suspiciously perfect phrasing for modern sensibilities

## Step 2: Primary Source Research

### Original Documents
Look for the quote in:
- **Published works** by the attributed author
- **Speeches and interviews** from the time period
- **Personal correspondence** and diaries
- **Contemporary newspaper reports**

### Digital Resources
Utilize searchable databases:
- Google Books for historical publications
- Newspaper archives and historical databases
- Academic journal repositories
- Government document collections

## Step 3: Secondary Source Analysis

### Scholarly Works
Check how academics and biographers handle the quote:
- Do reputable biographers include it?
- How do scholarly works cite it?
- Are there academic discussions about its authenticity?

### Quote Investigation Sites
Consult specialized resources:
- Quote Investigator
- Snopes fact-checking
- Academic quote databases
- Historical fact-checking organizations

## Step 4: Pattern Recognition

### Common Misattribution Patterns
Be aware of quotes that are:
- **Attributed to famous figures** without evidence
- **Shortened or paraphrased** from longer, more complex statements
- **Translated** from other languages without noting the original
- **Taken out of context** to support particular viewpoints

### Verification Hierarchies
Establish a hierarchy of evidence:
1. **Contemporary primary sources** (highest reliability)
2. **Near-contemporary secondary sources**
3. **Later scholarly works with citations**
4. **Popular books and articles with sources**
5. **Uncited claims** (lowest reliability)

## Step 5: Documentation and Citation

### Proper Attribution
When you find a verified quote:
- **Cite the original source** with full bibliographic information
- **Include relevant context** about when and where it was said
- **Note any translations** or editorial changes
- **Acknowledge uncertainty** if verification is incomplete

### Building Transparency
Help others by:
- Sharing your research process
- Documenting dead ends and false leads
- Contributing to quote verification databases
- Correcting misattributions when you encounter them

## Common Challenges and Solutions

### Challenge: Oral Traditions
Many historical quotes come from oral traditions rather than written records.
**Solution**: Look for multiple independent sources and consider the reliability of the transmission chain.

### Challenge: Translation Issues
Quotes from non-English speakers may be translated differently over time.
**Solution**: Try to find the original language version and note that it''s a translation.

### Challenge: Evolving Language
Old quotes may be modernized or paraphrased for contemporary audiences.
**Solution**: Seek the original wording and note any modifications.

## Conclusion

Quote verification is both an art and a science, requiring patience, thoroughness, and intellectual honesty. While perfect certainty isn''t always possible, following a systematic process significantly improves our ability to distinguish authentic quotes from misattributions and fabrications.

Remember: it''s better to acknowledge uncertainty than to perpetuate false information. When in doubt, say so.',
  'A comprehensive guide to verifying quotes, including research methods, red flags to watch for, and best practices for documentation.',
  'bfd1b6a9-547f-4816-8ecd-77f697e3f1bb',
  'published',
  now(),
  'Quote Verification Process | Research Guide',
  'Learn the step-by-step process for verifying quotes, from initial investigation to proper documentation.',
  ARRAY['quote-verification', 'research-methods', 'fact-checking', 'sources', 'attribution'],
  312
)
ON CONFLICT (slug) DO NOTHING;

-- Create article-category relationships
INSERT INTO cms_article_categories (article_id, category_id)
SELECT a.id, c.id
FROM cms_articles a, cms_categories c
WHERE (a.slug = 'why-sourcing-matters' AND c.slug = 'research-methods')
   OR (a.slug = 'evidence-and-open-mindedness' AND c.slug = 'research-methods')
   OR (a.slug = 'quote-verification-process' AND c.slug = 'quote-verification')
ON CONFLICT DO NOTHING;

-- Create article-tag relationships
INSERT INTO cms_article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM cms_articles a, cms_tags t
WHERE (a.slug = 'why-sourcing-matters' AND t.slug IN ('citations', 'verification', 'sources'))
   OR (a.slug = 'evidence-and-open-mindedness' AND t.slug IN ('verification', 'research'))
   OR (a.slug = 'quote-verification-process' AND t.slug IN ('verification', 'research', 'sources'))
ON CONFLICT DO NOTHING;
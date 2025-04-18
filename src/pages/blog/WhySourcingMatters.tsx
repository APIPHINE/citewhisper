
import BlogPost from '@/components/BlogPost';

const WhySourcingMatters = () => {
  return (
    <BlogPost
      title="Why Sourcing Matters"
      date="April 18, 2025"
      content={
        <>
          <p className="text-lg mb-6">
            In today's digital age, where information spreads at unprecedented speeds, 
            proper attribution has become more crucial than ever. When we cite sources, 
            we not only give credit where it's due but also build a foundation for 
            meaningful discourse and knowledge sharing.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Importance of Attribution</h2>
          <p className="mb-4">
            Proper attribution serves multiple essential purposes:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Builds credibility and trust in your work</li>
            <li>Allows readers to verify information</li>
            <li>Honors intellectual property rights</li>
            <li>Creates a chain of knowledge that others can follow</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Best Practices</h2>
          <p className="mb-4">
            When citing sources, always include:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Original author or speaker</li>
            <li>Date of publication or utterance</li>
            <li>Context of the quote</li>
            <li>Where the quote was sourced from</li>
          </ul>
        </>
      }
    />
  );
};

export default WhySourcingMatters;

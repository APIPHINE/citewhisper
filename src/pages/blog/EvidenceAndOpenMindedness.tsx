
import BlogPost from '@/components/BlogPost';

const EvidenceAndOpenMindedness = () => {
  return (
    <BlogPost
      title="Balancing Evidence and Open-mindedness"
      date="April 18, 2025"
      content={
        <>
          <p className="text-lg mb-6">
            Finding the right balance between evidence-based reasoning and maintaining an 
            open mind is crucial in our pursuit of knowledge and understanding. This 
            balance helps us make informed decisions while remaining receptive to new 
            information and perspectives.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Role of Evidence</h2>
          <p className="mb-6">
            Evidence forms the backbone of rational thinking and helps us:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Verify claims and statements</li>
            <li>Make informed decisions</li>
            <li>Build strong arguments</li>
            <li>Identify reliable sources</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Maintaining Open-mindedness</h2>
          <p className="mb-6">
            While evidence is crucial, maintaining an open mind allows us to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Consider alternative viewpoints</li>
            <li>Adapt to new information</li>
            <li>Recognize our own biases</li>
            <li>Engage in meaningful dialogue</li>
          </ul>
        </>
      }
    />
  );
};

export default EvidenceAndOpenMindedness;

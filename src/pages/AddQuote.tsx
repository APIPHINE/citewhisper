
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AddQuote = () => {
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [topics, setTopics] = useState('');
  const [theme, setTheme] = useState('');
  const [source, setSource] = useState('');

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!quoteText.trim() || !author.trim()) {
      toast({
        title: "Validation Error",
        description: "Quote text and author are required.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement quote submission logic
    // This would typically involve sending data to a backend or updating a context
    toast({
      title: "Quote Submitted",
      description: "Your quote has been submitted for review.",
      variant: "default"
    });

    // Reset form
    setQuoteText('');
    setAuthor('');
    setTopics('');
    setTheme('');
    setSource('');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="inline-flex items-center justify-center mb-4 bg-secondary/80 text-foreground px-4 py-2 rounded-full text-sm">
            <PlusCircle size={16} className="mr-2" /> Add New Quote
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contribute a Quote</h1>
          <p className="text-muted-foreground mb-8 max-w-xl">
            Help expand our collection of verified quotes. Please ensure the quote is accurate 
            and provide as much context as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div>
              <label htmlFor="quote-text" className="block mb-2 font-medium">Quote Text</label>
              <Textarea
                id="quote-text"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Enter the full quote text"
                className="min-h-[120px]"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block mb-2 font-medium">Author</label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Who said this quote?"
                required
              />
            </div>

            <div>
              <label htmlFor="topics" className="block mb-2 font-medium">Topics (comma-separated)</label>
              <Input
                id="topics"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="e.g. Technology, Innovation, Leadership"
              />
            </div>

            <div>
              <label htmlFor="theme" className="block mb-2 font-medium">Theme</label>
              <Input
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="What is the overarching theme?"
              />
            </div>

            <div>
              <label htmlFor="source" className="block mb-2 font-medium">Source (optional)</label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Where did you find this quote?"
              />
            </div>

            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2" /> Submit Quote
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddQuote;

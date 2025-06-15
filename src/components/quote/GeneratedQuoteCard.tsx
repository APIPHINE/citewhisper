
import { motion } from 'framer-motion';

interface GeneratedQuoteCardProps {
  imageUrl: string;
}

const GeneratedQuoteCard = ({ imageUrl }: GeneratedQuoteCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="mt-4"
    >
      <div className="rounded-2xl border-2 border-border/80 bg-white p-2 shadow-subtle overflow-hidden">
        <h3 className="text-sm font-semibold mb-2 px-2 text-muted-foreground">CiteQuote-Generated Content</h3>
        <img src={imageUrl} alt="CiteQuotes generated quote" className="rounded-lg w-full" />
      </div>
    </motion.div>
  );
};

export default GeneratedQuoteCard;

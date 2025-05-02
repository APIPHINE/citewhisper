
interface QuoteTextProps {
  text: string;
}

export function QuoteText({ text }: QuoteTextProps) {
  return (
    <div className="pr-4">
      <p className="text-lg leading-relaxed mb-4 font-serif italic">
        "{text}"
      </p>
    </div>
  );
}

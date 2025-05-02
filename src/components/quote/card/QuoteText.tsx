
interface QuoteTextProps {
  text: string;
}

export function QuoteText({ text }: QuoteTextProps) {
  return (
    <div className="pr-10">
      <p className="text-lg leading-relaxed mb-2 font-serif italic">
        "{text}"
      </p>
    </div>
  );
}


interface QuoteTextProps {
  text: string;
}

export function QuoteText({ text }: QuoteTextProps) {
  return (
    <div className="pr-20">
      <p className="text-lg leading-relaxed mb-2">
        "{text}"
      </p>
    </div>
  );
}

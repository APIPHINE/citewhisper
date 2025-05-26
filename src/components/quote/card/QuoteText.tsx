interface QuoteTextProps {
  text: string;
}
export function QuoteText({
  text
}: QuoteTextProps) {
  return <div className="pr-4">
      <p className="leading-relaxed mb-4 font-serif italic px-0 mx-[8px] text-lg text-inherit">
        "{text}"
      </p>
    </div>;
}

import { ReactNode } from 'react';

interface SectionBoxProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  id?: string;
}

export function SectionBox({ title, icon, children, id }: SectionBoxProps) {
  return (
    <div className="mb-6 border border-border rounded-lg overflow-hidden" id={id}>
      <div className="bg-secondary/30 px-4 py-3 flex items-center border-b border-border/80">
        <div className="mr-2 text-muted-foreground">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );
}


import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="page-padding py-6">
        <div className="page-max-width flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} CiteQuotes. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/blog/why-sourcing-matters" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <a 
              href="https://lovable.dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Built with Lovable
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

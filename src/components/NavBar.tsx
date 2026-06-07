import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">CiteQuotes</Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/quotes">Quotes</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/research">Research</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/tools">Tools</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/about">About</Link></Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

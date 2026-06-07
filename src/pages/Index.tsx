import SearchBar from '@/components/SearchBar';

const Index = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Quotes</h1>
        <SearchBar />
        <p className="text-center text-muted-foreground mt-12">
          The quote library is being rebuilt. Check back soon.
        </p>
      </div>
    </div>
  );
};

export default Index;

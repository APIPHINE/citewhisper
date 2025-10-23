import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import DateRangeFilter from "./filter/DateRangeFilter";

const QuoteSidebar = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  const [activeTab, setActiveTab] = useState<"categories" | "authors" | "languages">("categories");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Get the data based on active tab
  const getItems = () => {
    switch (activeTab) {
      case "categories":
        return availableFilters.topics;
      case "authors":
        return availableFilters.authors;
      case "languages":
        return ["English", "Spanish", "French"]; // This would need to be implemented in the SearchContext
      default:
        return [];
    }
  };

  const items = getItems();
  
  // Sort the items based on sort type and order
  const getSortedItems = () => {
    let sorted = [...items];
    sorted = sorted.sort((a, b) => a.localeCompare(b));
    return sortOrder === "desc" ? sorted.reverse() : sorted;
  };
  
  const sortedItems = getSortedItems();
  
  const handleItemClick = (item: string) => {
    if (activeTab === "categories") {
      const newTopics = filters.topic.includes(item)
        ? filters.topic.filter(t => t !== item)
        : [...filters.topic, item];
      updateFilter("topic", newTopics);
    } else if (activeTab === "authors") {
      const newAuthors = filters.author.includes(item)
        ? filters.author.filter(a => a !== item)
        : [...filters.author, item];
      updateFilter("author", newAuthors);
    }
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="h-full w-full border rounded-lg bg-background p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Browse Quotes</h2>
      
      {/* Timeline slider with two thumbs */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Timeline</h3>
        <DateRangeFilter />
      </div>
      
      {/* Navigation tabs */}
      <Tabs defaultValue="categories" value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="flex-1">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="mt-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Sort</h4>
            <Button 
              onClick={toggleSortOrder} 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
            >
              {sortOrder === "asc" ? <ArrowDownAZ size={16} /> : <ArrowUpZA size={16} />}
            </Button>
          </div>
          
          <div className="space-y-1">
            {sortedItems.map((item) => (
              <button
                key={item}
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-accent/50 transition-colors ${
                  activeTab === "categories" && filters.topic.includes(item)
                    ? "bg-accent/50 font-medium"
                    : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="authors" className="mt-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Sort</h4>
            <Button 
              onClick={toggleSortOrder} 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
            >
              {sortOrder === "asc" ? <ArrowDownAZ size={16} /> : <ArrowUpZA size={16} />}
            </Button>
          </div>
          
          <div className="space-y-1">
            {sortedItems.map((item) => (
              <button
                key={item}
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-accent/50 transition-colors ${
                  activeTab === "authors" && filters.author.includes(item)
                    ? "bg-accent/50 font-medium"
                    : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="languages" className="mt-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Sort</h4>
            <Button 
              onClick={toggleSortOrder} 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
            >
              {sortOrder === "asc" ? <ArrowDownAZ size={16} /> : <ArrowUpZA size={16} />}
            </Button>
          </div>
          
          <div className="space-y-1">
            {sortedItems.map((item) => (
              <button
                key={item}
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-accent/50 transition-colors ${
                  activeTab === "languages" && filters.language.includes(item)
                    ? "bg-accent/50 font-medium"
                    : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuoteSidebar;

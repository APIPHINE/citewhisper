
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { ArrowDownUp, ArrowDownAZ, ArrowUpZA, TrendingUp } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { Button } from "./ui/button";

type SortOrder = "asc" | "desc";
type SortType = "alphabetical" | "popularity" | "count";

const QuoteSidebar = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  const [activeTab, setActiveTab] = useState<"categories" | "authors" | "languages">("categories");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortType, setSortType] = useState<SortType>("alphabetical");
  
  // Get the data based on active tab
  const getItems = () => {
    switch (activeTab) {
      case "categories":
        return availableFilters.topics;
      case "authors":
        return availableFilters.authors;
      case "languages":
        // This would need to be implemented in the SearchContext
        return ["English", "Spanish", "French"]; 
      default:
        return [];
    }
  };

  const items = getItems();
  
  // Sort the items based on sort type and order
  const getSortedItems = () => {
    let sorted = [...items];
    
    if (sortType === "alphabetical") {
      sorted = sorted.sort((a, b) => a.localeCompare(b));
    }
    // Note: In a full implementation, popularity and count would use actual data
    
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
    // Language filter would be implemented similarly
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  return (
    <div className="h-full w-64 border-r border-border bg-background p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Browse Quotes</h2>
      
      {/* Timeline slider (placeholder) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Timeline</h3>
        <Slider defaultValue={[50]} max={100} step={1} className="mb-1" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>500 BCE</span>
          <span>2023</span>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <Tabs defaultValue="categories" value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="mb-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Sort controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Select defaultValue={sortType} onValueChange={(val) => setSortType(val as SortType)}>
            <SelectTrigger className="w-auto h-8 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="count">Quote Count</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={toggleSortOrder} 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          {sortOrder === "asc" ? 
            (sortType === "alphabetical" ? <ArrowDownAZ size={16} /> : <ArrowDownUp size={16} />) : 
            (sortType === "alphabetical" ? <ArrowUpZA size={16} /> : <TrendingUp size={16} />)
          }
        </Button>
      </div>
      
      {/* Items list */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {sortedItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-accent/50 transition-colors ${
                  (activeTab === "categories" && filters.topic.includes(item)) ||
                  (activeTab === "authors" && filters.author.includes(item))
                    ? "bg-accent/50 font-medium"
                    : ""
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuoteSidebar;

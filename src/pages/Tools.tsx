
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, FileSpreadsheet } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { SectionBox } from '@/components/quote/SectionBox';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const Tools = () => {
  const [mdContent, setMdContent] = useState<string>('');
  const [csvContent, setCsvContent] = useState<string>('');
  const [parsedCsvData, setParsedCsvData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.md')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Markdown (.md) file",
        variant: "destructive"
      });
      return;
    }
    
    setFileName(file.name.replace('.md', ''));
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMdContent(content);
      
      // Convert markdown to CSV
      try {
        const { csv, parsedData } = convertMarkdownToCSV(content);
        setCsvContent(csv);
        setParsedCsvData(parsedData);
        toast({
          title: "File converted successfully",
          description: "Your Markdown file has been converted to CSV",
        });
      } catch (error) {
        toast({
          title: "Conversion failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const convertMarkdownToCSV = (markdown: string): { csv: string; parsedData: string[][] } => {
    // Split the markdown content into lines
    const lines = markdown.split('\n').filter(line => line.trim() !== '');
    
    // Initialize headers and rows
    const headers: string[] = [];
    const rows: string[][] = [];
    
    // Try to identify the format (table, list, or paragraphs)
    if (lines.some(line => line.trim().startsWith('|'))) {
      // Markdown table format
      const tableLines = lines.filter(line => line.trim().startsWith('|'));
      
      // Extract headers from the first line
      const headerLine = tableLines[0];
      const headerCells = headerLine.split('|')
        .filter(cell => cell.trim() !== '')
        .map(h => h.trim());
      headers.push(...headerCells);
      
      // Skip the separator line (usually the second line of a markdown table)
      // Process data rows (from third line onwards in markdown tables)
      for (let i = 2; i < tableLines.length; i++) {
        const rowCells = tableLines[i].split('|')
          .filter(cell => cell.trim() !== '')
          .map(cell => cell.trim());
        
        // Only add rows that have content
        if (rowCells.length > 0 && rowCells.some(cell => cell.trim() !== '')) {
          rows.push(rowCells);
        }
      }
    } else if (lines.some(line => line.trim().startsWith('-') || line.trim().startsWith('*'))) {
      // List format (bullet points)
      headers.push('Content');
      
      lines.forEach(line => {
        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          const content = line.replace(/^[-*]\s*/, '').trim();
          if (content) {
            rows.push([content]);
          }
        }
      });
    } else if (lines.some(line => line.trim().startsWith('#'))) {
      // Headers and paragraphs
      headers.push('Heading', 'Content');
      
      let currentHeading = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#')) {
          // This is a heading
          currentHeading = line.replace(/^#+\s*/, '');
          
          // Look ahead for content
          let content = '';
          let j = i + 1;
          while (j < lines.length && !lines[j].trim().startsWith('#')) {
            if (content) content += ' ';
            content += lines[j].trim();
            j++;
          }
          
          if (content) {
            rows.push([currentHeading, content]);
          }
          
          // Skip the content we've already processed
          i = j - 1;
        } else if (line && !currentHeading) {
          // Content without a heading
          rows.push(['', line]);
        }
      }
    } else {
      // Simple paragraph format
      headers.push('Content');
      lines.forEach(line => {
        if (line.trim()) {
          rows.push([line.trim()]);
        }
      });
    }
    
    // Generate CSV
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      // Handle escaping: Wrap fields in quotes if they contain commas, quotes, or newlines
      const escapedRow = row.map(cell => {
        if (cell.includes('"') || cell.includes(',') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      });
      
      csv += escapedRow.join(',') + '\n';
    });
    
    // Return both the CSV string and the parsed data structure
    return { 
      csv, 
      parsedData: [headers, ...rows]
    };
  };
  
  const downloadCSV = () => {
    if (!csvContent) {
      toast({
        title: "No content to download",
        description: "Please upload and convert a Markdown file first",
        variant: "destructive"
      });
      return;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName || 'converted'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `${fileName || 'converted'}.csv is being downloaded`
    });
  };
  
  const showPreview = () => {
    if (!csvContent) {
      toast({
        title: "No content to preview",
        description: "Please upload and convert a Markdown file first",
        variant: "destructive"
      });
      return;
    }
    
    setIsDialogOpen(true);
  };
  
  return (
    <>
      <div className="min-h-screen pb-20 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Tools
            </h1>
            
            <Tabs defaultValue="md-to-csv" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="md-to-csv">Markdown to CSV</TabsTrigger>
              </TabsList>
              
              <TabsContent value="md-to-csv">
                <SectionBox 
                  title="Convert Markdown to CSV" 
                  icon={<FileSpreadsheet size={18} />}
                >
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <FileText className="h-10 w-10 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <p className="font-medium text-gray-700">Upload a Markdown file</p>
                          <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                        </div>
                        <input
                          type="file"
                          accept=".md"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="relative z-10 pointer-events-none">
                          <Upload className="mr-2" />
                          Select file
                        </Button>
                      </div>
                    </div>
                    
                    {csvContent && (
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={downloadCSV}>
                          <Download className="mr-2" />
                          Download CSV
                        </Button>
                        
                        {isMobile ? (
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="outline" onClick={() => {}}>Preview CSV</Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>CSV Preview</DrawerTitle>
                                <DrawerDescription>
                                  Preview of the converted CSV file
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className="p-4 overflow-x-auto">
                                {parsedCsvData.length > 0 ? (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        {parsedCsvData[0].map((header, i) => (
                                          <TableHead key={`header-${i}`}>{header}</TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {parsedCsvData.slice(1, 6).map((row, i) => (
                                        <TableRow key={`row-${i}`}>
                                          {row.map((cell, j) => (
                                            <TableCell key={`cell-${i}-${j}`}>{cell}</TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                                    {csvContent}
                                  </pre>
                                )}
                                {parsedCsvData.length > 6 && (
                                  <p className="text-center text-sm text-muted-foreground mt-4">
                                    Showing first 5 rows of {parsedCsvData.length - 1} rows
                                  </p>
                                )}
                              </div>
                              <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        ) : (
                          <>
                            <Button variant="outline" onClick={showPreview}>
                              Preview CSV
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <DialogContent className="max-w-3xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>CSV Preview</DialogTitle>
                                  <DialogDescription>
                                    Preview of the converted CSV file
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="overflow-auto max-h-[60vh]">
                                  {parsedCsvData.length > 0 ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          {parsedCsvData[0].map((header, i) => (
                                            <TableHead key={`header-${i}`}>{header}</TableHead>
                                          ))}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {parsedCsvData.slice(1, Math.min(21, parsedCsvData.length)).map((row, i) => (
                                          <TableRow key={`row-${i}`}>
                                            {row.map((cell, j) => (
                                              <TableCell key={`cell-${i}-${j}`}>{cell}</TableCell>
                                            ))}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                                      {csvContent}
                                    </pre>
                                  )}
                                  {parsedCsvData.length > 21 && (
                                    <p className="text-center text-sm text-muted-foreground mt-4">
                                      Showing first 20 rows of {parsedCsvData.length - 1} rows
                                    </p>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </SectionBox>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tools;

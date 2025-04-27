
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface CsvUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CsvUploadDialog = ({ isOpen, onClose }: CsvUploadDialogProps) => {
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        if (results.data && Array.isArray(results.data)) {
          setCsvData(results.data);
          toast.success('CSV file parsed successfully');
        }
      },
      header: true,
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast.error('Failed to parse CSV file');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Upload Property Listings CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Upload CSV
                </span>
              </Button>
            </label>
          </div>

          {csvData.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {csvData.length} rows found in CSV file
              </div>
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(csvData[0]).map((header) => (
                        <TableHead key={header} className="min-w-[150px] whitespace-nowrap">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <TableCell 
                            key={`${index}-${cellIndex}`}
                            className="min-w-[150px] whitespace-pre-wrap break-words"
                          >
                            {value?.toString() || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvUploadDialog;

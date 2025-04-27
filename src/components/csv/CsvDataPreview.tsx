
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CsvDataPreviewProps {
  data: any[];
  headers: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

const CsvDataPreview = ({ data, headers, onConfirm, onCancel }: CsvDataPreviewProps) => {
  if (!data.length) return null;

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Data Preview</h3>
      <div className="text-sm text-muted-foreground mb-4">
        {data.length} rows found in the CSV file
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap min-w-[150px]">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <TableCell 
                      key={`${rowIndex}-${colIndex}`} 
                      className="whitespace-pre-wrap break-words min-w-[150px]"
                    >
                      {formatValue(row[header])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm Upload ({data.length} {data.length === 1 ? 'row' : 'rows'})
        </Button>
      </div>
    </div>
  );
};

export default CsvDataPreview;


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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface CsvDataPreviewProps {
  data: any[];
  headers: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

const CsvDataPreview = ({ data, headers, onConfirm, onCancel }: CsvDataPreviewProps) => {
  if (!data.length) return null;

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Check if there are any rows with additional_data
  const hasAdditionalData = data.some(row => row.additional_data && Object.keys(row.additional_data).length > 0);

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Data Preview</h3>
      <div className="text-sm text-muted-foreground mb-4">
        {data.length} rows found in the CSV file
      </div>

      {hasAdditionalData && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Some property types were moved to additional data as they didn't match the required format (HDB, LANDED, CONDOMINIUM, SHOP).
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="overflow-x-auto min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap px-6 py-3 bg-muted/50">
                    {header}
                  </TableHead>
                ))}
                {hasAdditionalData && (
                  <TableHead className="whitespace-nowrap px-6 py-3 bg-muted/50">
                    Additional Data
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <TableCell 
                      key={`${rowIndex}-${colIndex}`} 
                      className="whitespace-pre-wrap break-words px-6 py-4"
                    >
                      {formatValue(row[header.toLowerCase()])}
                    </TableCell>
                  ))}
                  {hasAdditionalData && (
                    <TableCell className="whitespace-pre-wrap break-words px-6 py-4">
                      {row.additional_data && Object.keys(row.additional_data).length > 0
                        ? Object.entries(row.additional_data)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n')
                        : '-'
                      }
                    </TableCell>
                  )}
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

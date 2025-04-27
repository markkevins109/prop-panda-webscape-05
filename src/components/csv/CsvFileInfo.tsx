
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface CsvFileInfoProps {
  file: File;
  rowCount: number;
  columnNames: string[];
}

const CsvFileInfo = ({ file, rowCount, columnNames }: CsvFileInfoProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-5 w-5" />
          CSV File Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">File Name</p>
            <p className="text-sm">{file.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">File Size</p>
            <p className="text-sm">{formatFileSize(file.size)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Number of Rows</p>
            <p className="text-sm">{rowCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Number of Columns</p>
            <p className="text-sm">{columnNames.length}</p>
          </div>
          <div className="col-span-full">
            <p className="text-sm font-medium text-muted-foreground">Column Names</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {columnNames.map((column, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {column}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvFileInfo;

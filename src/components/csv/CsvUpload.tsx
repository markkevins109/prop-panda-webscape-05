
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CsvFileInfo from './CsvFileInfo';
import CsvDataPreview from './CsvDataPreview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface CsvUploadProps {
  onUploadSuccess: () => void;
}

const CsvUpload: React.FC<CsvUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      toast.error('Please upload a CSV file');
      return;
    }

    setCurrentFile(file);
    parseCsvFile(file);
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        // Remove empty lines
        const nonEmptyLines = lines.filter(line => line.trim());
        
        if (nonEmptyLines.length === 0) {
          throw new Error('CSV file is empty');
        }
        
        // Get headers
        const headers = nonEmptyLines[0].split(',').map(h => h.trim());
        setColumnNames(headers);
        
        // Process data rows
        const parsedData = nonEmptyLines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, i) => {
              obj[header] = values[i] || '';
            });
            return obj;
          });

        setRowCount(parsedData.length);
        setData(parsedData);
        toast.success('CSV file parsed successfully');
      } catch (error) {
        console.error('Parse error:', error);
        setError(`Failed to parse CSV file: ${error.message}`);
        toast.error(`Failed to parse CSV file: ${error.message}`);
        setCurrentFile(null);
        setData([]);
        setRowCount(0);
        setColumnNames([]);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = () => {
    setIsUploading(true);
    try {
      // Here you would typically send the data to your backend
      onUploadSuccess();
      setCurrentFile(null);
      setData([]);
      setError(null);
      toast.success('Data uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload data. Please try again.');
      setError('Failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setCurrentFile(null);
    setData([]);
    setRowCount(0);
    setColumnNames([]);
    setError(null);
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Error with CSV file</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
          disabled={isUploading}
        />
        <label htmlFor="csv-upload">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 cursor-pointer"
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload CSV'}
            </span>
          </Button>
        </label>
      </div>
      
      {currentFile && (
        <>
          <CsvFileInfo
            file={currentFile}
            rowCount={rowCount}
            columnNames={columnNames}
          />
          <CsvDataPreview 
            data={data}
            headers={columnNames}
            onConfirm={handleConfirmUpload}
            onCancel={handleCancelUpload}
          />
        </>
      )}
    </div>
  );
};

export default CsvUpload;

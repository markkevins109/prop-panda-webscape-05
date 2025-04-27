
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CsvFileInfo from './CsvFileInfo';
import CsvDataPreview from './CsvDataPreview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export interface PropertyData {
  property_address: string;
  rent_per_month: number;
  property_type: 'HDB' | 'LANDED' | 'CONDOMINIUM' | 'SHOP';
  available_date: string;
  preferred_nationality: string;
  preferred_profession: 'RETIRED' | 'STUDENT' | 'PROFESSIONAL' | 'ANY';
  preferred_race: 'INDIAN' | 'CHINESE' | 'MALAY' | 'ANY';
  pets_allowed: boolean;
}

interface CsvUploadProps {
  onUploadSuccess: () => void;
}

const validateCsvHeaders = (headers: string[]): string | null => {
  const requiredHeaders = [
    'property_address',
    'rent_per_month',
    'property_type',
    'available_date',
    'preferred_nationality',
    'preferred_profession',
    'preferred_race',
    'pets_allowed'
  ];

  // Convert headers to lowercase for case-insensitive comparison
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  // Find missing headers
  const missingHeaders = requiredHeaders.filter(
    header => !normalizedHeaders.includes(header)
  );

  if (missingHeaders.length > 0) {
    return `Missing required columns: ${missingHeaders.join(', ')}`;
  }

  return null;
};

const CsvUpload: React.FC<CsvUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<PropertyData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validatePropertyData = (data: any): data is PropertyData => {
    if (!data.property_address || typeof data.property_address !== 'string') {
      throw new Error('Invalid property address');
    }
    if (!data.rent_per_month || isNaN(Number(data.rent_per_month))) {
      throw new Error('Invalid rent amount');
    }
    if (!['HDB', 'LANDED', 'CONDOMINIUM', 'SHOP'].includes(data.property_type)) {
      throw new Error(`Invalid property type: ${data.property_type}`);
    }
    if (!data.available_date || isNaN(Date.parse(data.available_date))) {
      throw new Error('Invalid date format');
    }
    if (!data.preferred_nationality) {
      throw new Error('Missing preferred nationality');
    }
    if (!['RETIRED', 'STUDENT', 'PROFESSIONAL', 'ANY'].includes(data.preferred_profession)) {
      throw new Error(`Invalid profession type: ${data.preferred_profession}`);
    }
    if (!['INDIAN', 'CHINESE', 'MALAY', 'ANY'].includes(data.preferred_race)) {
      throw new Error(`Invalid race option: ${data.preferred_race}`);
    }
    if (typeof data.pets_allowed !== 'boolean' && !['true', 'false'].includes(data.pets_allowed.toLowerCase())) {
      throw new Error('Invalid pets allowed value');
    }
    return true;
  };

  const parseCsvFile = async (file: File): Promise<PropertyData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          
          // Remove any empty lines
          const nonEmptyLines = lines.filter(line => line.trim());
          
          if (nonEmptyLines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }
          
          // Get headers and normalize them
          const rawHeaders = nonEmptyLines[0].split(',').map(h => h.trim());
          const headers = rawHeaders.map(h => h.toLowerCase());
          
          // Validate headers
          const headerError = validateCsvHeaders(headers);
          if (headerError) {
            const errorMsg = `${headerError}\n\nExpected headers: property_address, rent_per_month, property_type, available_date, preferred_nationality, preferred_profession, preferred_race, pets_allowed`;
            reject(new Error(errorMsg));
            return;
          }
          
          // Store original header names for display
          setColumnNames(rawHeaders);
          
          const data = nonEmptyLines.slice(1)
            .filter(line => line.trim())
            .map((line, index) => {
              try {
                const values = line.split(',').map(v => v.trim());
                const obj: any = {};
                headers.forEach((header, i) => {
                  // Normalize header to lowercase for consistent mapping
                  const normalizedHeader = header.toLowerCase();
                  if (normalizedHeader === 'pets_allowed') {
                    obj[normalizedHeader] = values[i].toLowerCase() === 'true';
                  } else if (normalizedHeader === 'rent_per_month') {
                    obj[normalizedHeader] = Number(values[i]);
                  } else {
                    obj[normalizedHeader] = values[i].replace(/^"(.*)"$/, '$1');
                  }
                });
                return obj;
              } catch (error) {
                throw new Error(`Error parsing row ${index + 2}: ${error.message}`);
              }
            });

          setRowCount(data.length);
          
          // Validate each row
          data.forEach((row, index) => {
            try {
              validatePropertyData(row);
            } catch (error) {
              throw new Error(`Row ${index + 2}: ${error.message}`);
            }
          });

          resolve(data as PropertyData[]);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

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
    
    try {
      const propertyData = await parseCsvFile(file);
      setExtractedData(propertyData);
      toast.success('CSV file parsed successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
      toast.error(`Failed to parse CSV file: ${error.message}`);
      setCurrentFile(null);
      setExtractedData([]);
      setRowCount(0);
      setColumnNames([]);
    }
  };

  const handleConfirmUpload = async () => {
    setIsUploading(true);
    try {
      for (const property of extractedData) {
        const { error } = await supabase
          .from('property_listings')
          .insert({
            ...property,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
      }

      toast.success(`Successfully uploaded ${extractedData.length} properties`);
      onUploadSuccess();
      setCurrentFile(null);
      setExtractedData([]);
      setError(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload properties. Please try again.');
      setError('Failed to upload to database. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setCurrentFile(null);
    setExtractedData([]);
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
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
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
            data={extractedData}
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

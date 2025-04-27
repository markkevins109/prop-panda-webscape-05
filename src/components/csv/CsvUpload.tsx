import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CsvFileInfo from './CsvFileInfo';
import CsvDataPreview from './CsvDataPreview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PropertyData {
  property_address: string;
  rent_per_month: number;
  property_type: string;
  available_date: string;
  preferred_nationality: string;
  preferred_profession: string;
  preferred_race: string;
  pets_allowed: boolean;
  [key: string]: any;
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

  const optionalHeaders = ['propertyid'];
  
  // Convert headers to lowercase for case-insensitive comparison
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  // Find missing required headers
  const missingHeaders = requiredHeaders.filter(
    header => !normalizedHeaders.includes(header)
  );

  if (missingHeaders.length > 0) {
    return `Missing required columns: ${missingHeaders.join(', ')}\n\nExpected headers: ${requiredHeaders.join(', ')}`;
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

  const validatePropertyData = (data: any): boolean => {
    if (!data.property_address || typeof data.property_address !== 'string') {
      throw new Error('Invalid property address');
    }
    
    if (isNaN(Number(data.rent_per_month))) {
      throw new Error('Invalid rent amount');
    }
    
    const validPropertyTypes = ['HDB', 'LANDED', 'CONDOMINIUM', 'SHOP'];
    if (!validPropertyTypes.includes(data.property_type?.toUpperCase())) {
      throw new Error(`Invalid property type: ${data.property_type}. Must be one of: ${validPropertyTypes.join(', ')}`);
    }
    
    if (isNaN(Date.parse(data.available_date))) {
      throw new Error('Invalid date format');
    }
    
    if (!data.preferred_nationality) {
      throw new Error('Missing preferred nationality');
    }
    
    const validProfessions = ['RETIRED', 'STUDENT', 'PROFESSIONAL', 'ANY'];
    if (!validProfessions.includes(data.preferred_profession?.toUpperCase())) {
      throw new Error(`Invalid profession type: ${data.preferred_profession}. Must be one of: ${validProfessions.join(', ')}`);
    }
    
    const validRaces = ['INDIAN', 'CHINESE', 'MALAY', 'ANY'];
    if (!validRaces.includes(data.preferred_race?.toUpperCase())) {
      throw new Error(`Invalid race option: ${data.preferred_race}. Must be one of: ${validRaces.join(', ')}`);
    }
    
    if (typeof data.pets_allowed !== 'boolean' && 
        !['true', 'false', 'yes', 'no', '0', '1'].includes(String(data.pets_allowed).toLowerCase())) {
      throw new Error('Invalid pets allowed value. Use true/false, yes/no, or 0/1');
    }
    
    return true;
  };

  const parseCsvFile = async (file: File) => {
    return new Promise<PropertyData[]>((resolve, reject) => {
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
          
          // Get headers and keep original case for display
          const rawHeaders = nonEmptyLines[0].split(',').map(h => h.trim());
          // Create a lowercase version for lookups
          const normalizedHeaders = rawHeaders.map(h => h.toLowerCase());
          
          // Validate headers
          const headerError = validateCsvHeaders(normalizedHeaders);
          if (headerError) {
            reject(new Error(headerError));
            return;
          }
          
          // Store original header names for display
          setColumnNames(rawHeaders);
          
          const data = nonEmptyLines.slice(1)
            .filter(line => line.trim())
            .map((line, index) => {
              try {
                const values = line.split(',').map(v => v.trim());
                const obj: Record<string, any> = {};
                
                // Add all columns to the object, including optional ones
                rawHeaders.forEach((header, i) => {
                  const normalizedHeader = header.toLowerCase();
                  const value = values[i];
                  
                  // Process specific field types
                  if (normalizedHeader === 'pets_allowed') {
                    const lowerValue = String(value || '').toLowerCase();
                    obj[header] = ['true', 'yes', '1'].includes(lowerValue);
                  } else if (normalizedHeader === 'rent_per_month') {
                    obj[header] = Number(value);
                  } else if (normalizedHeader === 'property_type') {
                    obj[header] = value?.toUpperCase();
                  } else if (normalizedHeader === 'preferred_profession' || normalizedHeader === 'preferred_race') {
                    obj[header] = value?.toUpperCase();
                  } else {
                    // Keep original case for the property name but normalize the value
                    obj[header] = value?.replace(/^"(.*)"$/, '$1');
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
              // Create a lowercase version for validation
              const normalizedRow: Record<string, any> = {};
              Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase()] = row[key];
              });
              
              validatePropertyData(normalizedRow);
            } catch (error) {
              throw new Error(`Row ${index + 2}: ${error.message}`);
            }
          });

          console.log('Extracted data:', data);
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
    } catch (error: any) {
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
      // Get current user ID
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Insert each property listing
      for (const property of extractedData) {
        // Extract required fields for database, ensure correct naming
        const propertyListing = {
          property_address: property.property_address || property['Property Address'] || property['property_address'],
          rent_per_month: property.rent_per_month || property['Rent Per Month'] || property['rent_per_month'],
          property_type: property.property_type || property['Property Type'] || property['property_type'],
          available_date: property.available_date || property['Available Date'] || property['available_date'],
          preferred_nationality: property.preferred_nationality || property['Preferred Nationality'] || property['preferred_nationality'],
          preferred_profession: property.preferred_profession || property['Preferred Profession'] || property['preferred_profession'],
          preferred_race: property.preferred_race || property['Preferred Race'] || property['preferred_race'],
          pets_allowed: property.pets_allowed || property['Pets Allowed'] || property['pets_allowed'],
          user_id: userId
        };

        const { error } = await supabase
          .from('property_listings')
          .insert(propertyListing);

        if (error) throw error;
      }

      toast.success(`Successfully uploaded ${extractedData.length} properties`);
      onUploadSuccess();
      setCurrentFile(null);
      setExtractedData([]);
      setError(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload properties: ' + error.message);
      setError('Failed to upload to database: ' + error.message);
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

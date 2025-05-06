
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CsvFileInfo from './CsvFileInfo';
import CsvDataPreview from './CsvDataPreview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { PropertyTemplateType } from './PropertyTypeUploadForm';

interface PropertyListingCsv {
  property_id?: string;
  property_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  property_type?: 'HDB' | 'LANDED' | 'CONDOMINIUM' | 'SHOP' | null;
  room_type?: string;
  description?: string;
  [key: string]: any;
}

interface PropertyDetailsListing {
  property_address: string;
  rent_per_month: number;
  property_type: 'HDB' | 'LANDED' | 'CONDOMINIUM' | 'SHOP';
  available_date: string;
  preferred_nationality: string;
  preferred_profession: string;
  preferred_race: string;
  pets_allowed: boolean;
}

interface CsvUploadProps {
  onUploadSuccess: () => void;
  templateType?: PropertyTemplateType;
}

const CsvUpload: React.FC<CsvUploadProps> = ({ onUploadSuccess, templateType = 'co-living' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validatePropertyType = (type: string | null): string | null => {
    if (!type) return null;
    
    const validTypes = ['HDB', 'LANDED', 'CONDOMINIUM', 'SHOP'];
    const normalizedType = type.trim().toUpperCase();
    
    return validTypes.includes(normalizedType) ? normalizedType : null;
  };

  const validatePropertyTemplate = (headers: string[]): boolean => {
    if (templateType === 'property') {
      const requiredHeaders = [
        'property_address', 'rent_per_month', 'property_type', 'available_date',
        'preferred_nationality', 'preferred_profession', 'preferred_race', 'pets_allowed'
      ].map(h => h.toLowerCase());
      
      const normalizedHeaders = headers.map(h => h.toLowerCase());
      return requiredHeaders.every(header => normalizedHeaders.includes(header));
    }
    
    return true; // Co-living template is more flexible
  };

  const parseCsvFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          
          const nonEmptyLines = lines.filter(line => line.trim());
          
          if (nonEmptyLines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }
          
          // Get headers and normalize them
          const headers = nonEmptyLines[0].split(',').map(h => h.trim());
          setColumnNames(headers);
          
          // Validate template type
          if (!validatePropertyTemplate(headers)) {
            reject(new Error(`The uploaded file does not match the ${templateType === 'property' ? 'Property Details' : 'Co-Living Room'} template format.`));
            return;
          }
          
          if (templateType === 'property') {
            // Parse property details
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
            resolve(data);
          } else {
            // Parse co-living details (original logic)
            const data = nonEmptyLines.slice(1)
              .filter(line => line.trim())
              .map((line) => {
                const values = line.split(',').map(v => v.trim());
                const obj: Record<string, any> = {};
                const additionalData: Record<string, any> = {};
                
                headers.forEach((header, i) => {
                  const value = values[i]?.replace(/^"(.*)"$/, '$1')?.trim() || null;
                  
                  // Map known columns to their respective fields
                  switch(header.toLowerCase()) {
                    case 'propertyid':
                      obj.property_id = value;
                      break;
                    case 'propertyname':
                      obj.property_name = value;
                      break;
                    case 'add1':
                      obj.address_line1 = value;
                      break;
                    case 'add2':
                      obj.address_line2 = value;
                      break;
                    case 'city':
                      obj.city = value;
                      break;
                    case 'state':
                      obj.state = value;
                      break;
                    case 'country':
                      obj.country = value;
                      break;
                    case 'postcode':
                      obj.postcode = value;
                      break;
                    case 'propertytype':
                      const validatedType = validatePropertyType(value);
                      if (value && !validatedType) {
                        // If it's not a valid property type, store it in additional_data
                        additionalData['original_property_type'] = value;
                      }
                      obj.property_type = validatedType;
                      break;
                    case 'roomtype':
                      obj.room_type = value;
                      break;
                    case 'description':
                      obj.description = value;
                      break;
                    default:
                      // Store any other columns in additional_data
                      if (value !== null) {
                        additionalData[header] = value;
                      }
                  }
                });
                
                // Add additional_data to the object if there are any extra fields
                if (Object.keys(additionalData).length > 0) {
                  obj.additional_data = additionalData;
                }
                
                return obj;
              });

            setRowCount(data.length);
            resolve(data);
          }
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
      const data = await parseCsvFile(file);
      setExtractedData(data);
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
      
      if (templateType === 'property') {
        // Insert property details to property_listings table
        for (const property of extractedData) {
          const { error } = await supabase
            .from('property_listings')
            .insert({
              ...property,
              user_id: userId
            });

          if (error) throw error;
        }
      } else {
        // Insert co-living details to property_listings_csv table (original logic)
        for (const property of extractedData) {
          const { error } = await supabase
            .from('property_listings_csv')
            .insert({
              ...property,
              user_id: userId
            });

          if (error) throw error;
        }
      }

      toast.success(`Successfully uploaded ${extractedData.length} ${templateType === 'property' ? 'properties' : 'co-living rooms'}`);
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
    <div className="w-full space-y-4" id="csv-upload-form">
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
              {isUploading ? 'Uploading...' : 'Choose File'}
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

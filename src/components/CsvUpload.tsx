
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PropertyData {
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

const CsvUpload: React.FC<CsvUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);

  const validatePropertyData = (data: any): data is PropertyData => {
    if (!data.property_address || typeof data.property_address !== 'string') return false;
    if (!data.rent_per_month || isNaN(Number(data.rent_per_month))) return false;
    if (!['HDB', 'LANDED', 'CONDOMINIUM', 'SHOP'].includes(data.property_type)) return false;
    if (!data.available_date || isNaN(Date.parse(data.available_date))) return false;
    if (!data.preferred_nationality) return false;
    if (!['RETIRED', 'STUDENT', 'PROFESSIONAL', 'ANY'].includes(data.preferred_profession)) return false;
    if (!['INDIAN', 'CHINESE', 'MALAY', 'ANY'].includes(data.preferred_race)) return false;
    if (typeof data.pets_allowed !== 'boolean' && !['true', 'false'].includes(data.pets_allowed.toLowerCase())) return false;
    return true;
  };

  const parseCsvFile = async (file: File): Promise<PropertyData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          const data = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',').map(v => v.trim());
              const obj: any = {};
              headers.forEach((header, i) => {
                if (header === 'pets_allowed') {
                  obj[header] = values[i].toLowerCase() === 'true';
                } else if (header === 'rent_per_month') {
                  obj[header] = Number(values[i]);
                } else {
                  obj[header] = values[i].replace(/^"(.*)"$/, '$1');
                }
              });
              return obj;
            });

          const validData = data.filter(validatePropertyData);
          if (validData.length !== data.length) {
            throw new Error('Some rows contain invalid data');
          }
          resolve(validData as PropertyData[]);
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
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    try {
      const propertyData = await parseCsvFile(file);
      
      for (const property of propertyData) {
        const { error } = await supabase
          .from('property_listings')
          .insert({
            ...property,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
      }

      toast.success(`Successfully uploaded ${propertyData.length} properties`);
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload properties. Please check the file format and try again.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
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
  );
};

export default CsvUpload;

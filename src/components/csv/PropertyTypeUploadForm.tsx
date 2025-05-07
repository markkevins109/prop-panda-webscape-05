
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import CsvUpload from './CsvUpload';

interface PropertyTypeUploadFormProps {
  onUploadSuccess: () => void;
}

export type PropertyTemplateType = 'co-living' | 'property';

const PropertyTypeUploadForm: React.FC<PropertyTypeUploadFormProps> = ({ onUploadSuccess }) => {
  const [selectedType, setSelectedType] = useState<PropertyTemplateType | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleTypeChange = (value: string) => {
    setSelectedType(value as PropertyTemplateType);
    setShowUpload(true);
  };

  const downloadTemplate = (type: PropertyTemplateType) => {
    let headers: string[] = [];
    
    // Define headers based on template type
    if (type === 'co-living') {
      headers = [
        'propertyid', 'propertyname', 'email', 'phone', 'status', 'add1', 'add2', 'city', 'state', 
        'country', 'postcode', 'createdon', 'updatedon', 'hkcharge', 'spacno', 'billday', 'dueday', 
        'roomtype', 'ppname', 'ppaddress', 'propertytype', 'visitorspolicy', 'petspolicy', 'commontv', 
        'wifi', 'diningtable', 'sofa', 'fridge', 'washer', 'dryer', 'gym', 'swimming', 'tenniscourt', 
        'badminton', 'golfdrive', 'squashcourt', 'futasal', 'nearestmrt', 'nearestsupermarket', 
        'nearestfoodcourt', 'description', 'microwave', 'nearestbusstop', 'company', 'agent', 
        'owner', 'profileimg', 'propmanager', 'beneficiary', 'bankname', 'swiftcode', 'accountnumber', 
        'mrt', 'buildingname', 'level', 'levelna', 'unit', 'unitna', 'zone', 'district', 'coverage', 
        'accesscode', 'wifiname1', 'wifiname2', 'wifipassword', 'ian', 'gastype', 'gplate', 'eretailer', 
        'workplaces', 'metersubmitfrom', 'metersubmitto'
      ];
    } else {
      // Property details template - comprehensive list of fields
      headers = [
        'Property Type', 'Condo Name', 'Floor Level', 'Built Year', 'Floor Area (sqft)', 
        'Bedrooms', 'Bathrooms', 'Maid Room Available', 'Furnishing Status', 'Availability',
        'Agency Fee Applicable', 'Rental Price (SGD/month)', 'Minimum Lease Period', 'Security Deposit',
        'Street', 'Level', 'Unit No', 'Postal Code', 'City', 'Country', 'District',
        'Nearest MRT', 'Distance from MRT', 'MRT Line', 'Nearest Bus Stop', 
        'Nearest School', 'Nearest University', 'Nearest Convenience Store',
        'Aircon', 'Balcony', 'Renovated', 'Pet Friendly', 'Smoking Allowed', 'Cooking Allowed',
        'Facing', 'BBQ Pits', 'Clubhouse', 'Gym', 'Fitness Corner', 'Jacuzzi', 'Jogging Track',
        'Swimming Pool', 'Gender Preferred', 'Nationality Preference', 'Cooking Preference',
        'Visitors Allowed', 'Group Size', 'Preferred Profile', 'Owner Name', 'Owner Address',
        'Owner Contact', 'Ownership Proof Document', 'Marketing Agreement Document'
      ];
    }

    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}-template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${type === 'co-living' ? 'Co-Living Room' : 'Property'} template downloaded`);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-medium">Select Property Type to Upload</h3>
      
      <RadioGroup
        value={selectedType || ""}
        onValueChange={handleTypeChange}
        className="flex flex-col space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="co-living" id="co-living" />
            <Label htmlFor="co-living" className="font-medium">Co-Living Room Details</Label>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => downloadTemplate('co-living')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="property" id="property" />
            <Label htmlFor="property" className="font-medium">Property Details</Label>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => downloadTemplate('property')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </RadioGroup>
      
      {showUpload && (
        <div className="mt-6 space-y-4">
          <div className="border-t pt-4">
            <h4 className="text-md font-medium mb-2">
              Upload {selectedType === 'co-living' ? 'Co-Living Room' : 'Property'} Details
            </h4>
            
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Please upload the template that matches your selected type: {selectedType === 'co-living' ? 'Co-Living Room' : 'Property'} Details.
              </AlertDescription>
            </Alert>
            
            <CsvUpload 
              onUploadSuccess={onUploadSuccess} 
              templateType={selectedType} 
            />
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              className="px-8 py-2 text-base"
              size="lg"
              type="submit"
              form="csv-upload-form"
            >
              <Upload className="mr-2 h-5 w-5" />
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTypeUploadForm;

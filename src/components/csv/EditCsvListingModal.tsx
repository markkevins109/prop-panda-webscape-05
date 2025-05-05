import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from 'lucide-react';

interface CsvPropertyListing {
  id: string;
  property_id?: string;
  property_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  property_type?: string;
  room_type?: string;
  description?: string;
  additional_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface EditCsvListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: CsvPropertyListing | null;
  onSave: () => void;
}

const EditCsvListingModal: React.FC<EditCsvListingModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSave,
}) => {
  const [editedListing, setEditedListing] = useState<Record<string, any>>({});
  const [additionalFields, setAdditionalFields] = useState<Record<string, any>>({});
  const [allFields, setAllFields] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [standardFields] = useState([
    'property_id',
    'property_name',
    'address_line1',
    'address_line2',
    'city',
    'state',
    'country',
    'postcode',
    'property_type',
    'room_type',
    'description',
  ]);

  // Reserved fields that shouldn't be displayed in the form
  const reservedFields = ['id', 'created_at', 'updated_at', 'user_id', 'additional_data'];

  useEffect(() => {
    if (listing) {
      // Initialize the standard fields
      const standardValues: Record<string, any> = {};
      standardFields.forEach(field => {
        standardValues[field] = listing[field] || '';
      });
      
      setEditedListing(standardValues);
      
      // Initialize additional fields from additional_data
      if (listing.additional_data) {
        setAdditionalFields(listing.additional_data);
      } else {
        setAdditionalFields({});
      }

      // Create a list of all fields for display
      const allFieldKeys = new Set<string>();
      
      // Add standard fields
      standardFields.forEach(field => allFieldKeys.add(field));
      
      // Add all fields from the listing object except reserved ones
      Object.keys(listing).forEach(key => {
        if (!reservedFields.includes(key)) {
          allFieldKeys.add(key);
        }
      });
      
      // Add fields from additional_data
      if (listing.additional_data) {
        Object.keys(listing.additional_data).forEach(key => {
          allFieldKeys.add(key);
        });
      }
      
      setAllFields(Array.from(allFieldKeys));
    }
  }, [listing, standardFields]);

  const handleFieldChange = (field: string, value: string) => {
    // If field is a standard field, update editedListing
    if (standardFields.includes(field)) {
      setEditedListing(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      // Otherwise, update additionalFields
      setAdditionalFields(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderFieldInput = (field: string) => {
    // Determine the current value
    let currentValue = '';
    
    if (standardFields.includes(field)) {
      currentValue = editedListing[field] || '';
    } else {
      currentValue = additionalFields[field] || '';
    }

    // For description field, use Textarea
    if (field === 'description') {
      return (
        <Textarea
          id={field}
          value={currentValue}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="col-span-3"
          rows={4}
        />
      );
    }

    // For all other fields, use Input
    return (
      <Input
        id={field}
        value={currentValue}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        className="col-span-3"
      />
    );
  };

  const handleSave = async () => {
    if (!listing) return;
    
    setIsSaving(true);
    
    try {
      // Prepare the update data
      const updateData = {
        ...editedListing,
        additional_data: Object.keys(additionalFields).length > 0 ? additionalFields : null,
        updated_at: new Date().toISOString()
      };
      
      // Update the listing in Supabase
      const { error } = await supabase
        .from('property_listings_csv')
        .update(updateData)
        .eq('id', listing.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Listing updated successfully');
      onSave(); // Refresh the listings
      onClose(); // Close the modal
    } catch (error: any) {
      console.error('Error updating listing:', error);
      toast.error(`Failed to update listing: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property Listing</DialogTitle>
          <DialogDescription>
            Make changes to the property listing information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Property Information</h3>
            
            {allFields.sort().map((field) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right capitalize">
                  {field.replace(/_/g, ' ')}
                </Label>
                {renderFieldInput(field)}
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCsvListingModal;

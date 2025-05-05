
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
    }
  }, [listing, standardFields]);

  const handleStandardFieldChange = (field: string, value: string) => {
    setEditedListing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalFieldChange = (field: string, value: string) => {
    setAdditionalFields(prev => ({
      ...prev,
      [field]: value
    }));
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
            <h3 className="text-sm font-medium">Standard Fields</h3>
            {standardFields.map((field) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right capitalize">
                  {field.replace(/_/g, ' ')}
                </Label>
                <Input
                  id={field}
                  value={editedListing[field] || ''}
                  onChange={(e) => handleStandardFieldChange(field, e.target.value)}
                  className="col-span-3"
                />
              </div>
            ))}
          </div>

          {Object.keys(additionalFields).length > 0 && (
            <div className="space-y-4 mt-4">
              <h3 className="text-sm font-medium">Additional Fields</h3>
              {Object.keys(additionalFields).map((field) => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`additional-${field}`} className="text-right capitalize">
                    {field.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={`additional-${field}`}
                    value={additionalFields[field] || ''}
                    onChange={(e) => handleAdditionalFieldChange(field, e.target.value)}
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
          )}
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

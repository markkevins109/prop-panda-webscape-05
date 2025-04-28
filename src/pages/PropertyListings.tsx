
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Building, FileText, Plus, Upload, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from 'react-router-dom';
import CsvUpload from '@/components/csv/CsvUpload';

interface PropertyListing {
  id: string;
  property_address: string;
  rent_per_month: number;
  property_type: string;
  available_date: string;
  preferred_nationality: string;
  preferred_profession: string;
  preferred_race: string;
  pets_allowed: boolean;
}

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
}

const PropertyListings = () => {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [csvListings, setCsvListings] = useState<CsvPropertyListing[]>([]);
  const [showCsvUpload, setShowCsvUpload] = useState(false);

  const fetchListings = async () => {
    // Fetch regular property listings
    const { data: regularListings, error: regularError } = await supabase
      .from('property_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (regularError) {
      console.error('Error fetching regular listings:', regularError);
    }

    // Fetch CSV property listings
    const { data: csvData, error: csvError } = await supabase
      .from('property_listings_csv')
      .select('*')
      .order('created_at', { ascending: false });

    if (csvError) {
      console.error('Error fetching CSV listings:', csvError);
    }

    setListings(regularListings || []);
    setCsvListings(csvData || []);
  };

  const downloadTemplate = () => {
    const headers = [
      'propertyid', 'propertyname', 'email', 'add1', 'add2', 'city', 'state', 
      'country', 'postcode', 'createdon', 'updatedon', 'hkcharge', 'spacno', 
      'billday', 'dueday', 'roomtype', 'ppname', 'ppaddress', 'propertytype', 
      'visitorspolicy', 'petspolicy', 'commontv', 'wifi', 'diningtable', 'sofa', 
      'fridge', 'washer', 'dryer', 'gym', 'swimming', 'tenniscourt', 'badminton', 
      'golfdrive', 'squashcourt', 'futasal', 'nearestmrt', 'nearestsupermarket', 
      'nearestfoodcourt', 'description', 'microwave', 'nearestbusstop', 'company', 
      'agent', 'owner', 'profileimg', 'propmanager', 'beneficiary', 'bankname', 
      'swiftcode', 'accountnumber', 'mrt', 'buildingname', 'level', 'levelna', 
      'unit', 'unitna', 'zone', 'district', 'coverage', 'accesscode', 'wifiname1', 
      'wifiname2', 'wifipassword', 'ian', 'gastype', 'gplate', 'eretailer', 
      'workplaces', 'metersubmitfrom', 'metersubmitto'
    ];

    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'property_listing_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSuccess = () => {
    fetchListings();
    setShowCsvUpload(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const formatAddress = (listing: CsvPropertyListing) => {
    const parts = [
      listing.address_line1,
      listing.address_line2,
      listing.city,
      listing.state,
      listing.country,
      listing.postcode
    ].filter(Boolean);
    return parts.join(', ') || 'No address provided';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Property Listings
        </h1>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCsvUpload(!showCsvUpload)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </Button>
          <Link to="/property-listing">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Listing
            </Button>
          </Link>
        </div>
      </div>

      {showCsvUpload && (
        <div className="mb-8">
          <CsvUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      <div className="space-y-8">
        {/* Regular Listings */}
        {listings.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rent/Month</TableHead>
                  <TableHead>Available From</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead>Pets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.property_address}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        <Building className="w-4 h-4" />
                        {listing.property_type}
                      </div>
                    </TableCell>
                    <TableCell>${listing.rent_per_month.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(listing.available_date), 'PP')}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {listing.preferred_nationality}, {listing.preferred_profession}, {listing.preferred_race}
                      </span>
                    </TableCell>
                    <TableCell>{listing.pets_allowed ? 'Allowed' : 'Not Allowed'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* CSV Listings */}
        {csvListings.length > 0 && (
          <div className="rounded-md border">
            <h2 className="text-xl font-semibold p-4 border-b">Imported CSV Listings</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Additional Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>{listing.property_id || '-'}</TableCell>
                    <TableCell className="font-medium">{listing.property_name || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">{formatAddress(listing)}</TableCell>
                    <TableCell>
                      {listing.property_type && (
                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          <Building className="w-4 h-4" />
                          {listing.property_type}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{listing.room_type || '-'}</TableCell>
                    <TableCell>
                      {listing.additional_data && Object.keys(listing.additional_data).length > 0 ? (
                        <div className="text-sm text-muted-foreground">
                          {Object.entries(listing.additional_data)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </div>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {listings.length === 0 && csvListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No property listings found. Create your first listing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListings;

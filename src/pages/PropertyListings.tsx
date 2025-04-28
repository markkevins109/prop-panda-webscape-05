import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Upload, Download } from 'lucide-react';
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

interface CsvPropertyListing {
  [key: string]: any;
}

interface RegularPropertyListing {
  id: string;
  property_address: string;
  property_type: string;
  rent_per_month: number;
  available_date: string;
  preferred_nationality: string;
  preferred_profession: string;
  preferred_race: string;
  pets_allowed: boolean;
  created_at: string;
  updated_at: string;
}

const PropertyListings = () => {
  const [csvListings, setCsvListings] = useState<CsvPropertyListing[]>([]);
  const [regularListings, setRegularListings] = useState<RegularPropertyListing[]>([]);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);

  const fetchListings = async () => {
    const { data: csvData, error: csvError } = await supabase
      .from('property_listings_csv')
      .select('*')
      .order('created_at', { ascending: false });

    if (csvError) {
      console.error('Error fetching CSV listings:', csvError);
      return;
    }

    const { data: regularData, error: regularError } = await supabase
      .from('property_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (regularError) {
      console.error('Error fetching regular listings:', regularError);
      return;
    }

    const allColumns = new Set<string>();
    csvData?.forEach(listing => {
      Object.keys(listing).forEach(key => allColumns.add(key));
      if (listing.additional_data) {
        Object.keys(listing.additional_data).forEach(key => allColumns.add(key));
      }
    });

    const flattenedData = csvData?.map(listing => {
      const flatListing = { ...listing };
      if (listing.additional_data) {
        Object.entries(listing.additional_data).forEach(([key, value]) => {
          flatListing[key] = value;
        });
        delete flatListing.additional_data;
      }
      return flatListing;
    });

    setCsvColumns(Array.from(allColumns));
    setCsvListings(flattenedData || []);
    setRegularListings(regularData || []);
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

      {regularListings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Regular Property Listings</h2>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Address</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Rent per Month</TableHead>
                  <TableHead>Available Date</TableHead>
                  <TableHead>Preferred Nationality</TableHead>
                  <TableHead>Preferred Profession</TableHead>
                  <TableHead>Preferred Race</TableHead>
                  <TableHead>Pets Allowed</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regularListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>{listing.property_address}</TableCell>
                    <TableCell>{listing.property_type}</TableCell>
                    <TableCell>{listing.rent_per_month}</TableCell>
                    <TableCell>{new Date(listing.available_date).toLocaleDateString()}</TableCell>
                    <TableCell>{listing.preferred_nationality}</TableCell>
                    <TableCell>{listing.preferred_profession}</TableCell>
                    <TableCell>{listing.preferred_race}</TableCell>
                    <TableCell>{listing.pets_allowed ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {csvListings.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">CSV Property Listings</h2>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {csvColumns.map((column) => (
                    <TableHead key={column} className="whitespace-nowrap">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvListings.map((listing, index) => (
                  <TableRow key={index}>
                    {csvColumns.map((column) => (
                      <TableCell key={`${index}-${column}`} className="whitespace-nowrap">
                        {listing[column]?.toString() || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {csvListings.length === 0 && regularListings.length === 0 && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No property listings found. Create a new listing or upload a CSV file to get started!</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, FileText } from 'lucide-react';
import CsvUpload from '@/components/CsvUpload';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

const PropertyListings = () => {
  const [listings, setListings] = useState<PropertyListing[]>([]);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      return;
    }

    setListings(data || []);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDownloadTemplate = () => {
    const headers = [
      'Property Address',
      'Rent per Month',
      'Property Type (HDB/LANDED/CONDOMINIUM/SHOP)',
      'Available Date (YYYY-MM-DD)',
      'Preferred Nationality',
      'Preferred Profession (RETIRED/STUDENT/PROFESSIONAL/ANY)',
      'Preferred Race (INDIAN/CHINESE/MALAY/ANY)',
      'Pets Allowed (true/false)'
    ].join(',');

    const sampleData = [
      '"123 Sample Street, #12-34"',
      '2500',
      'HDB',
      '2025-12-31',
      'Any',
      'PROFESSIONAL',
      'ANY',
      'true'
    ].join(',');

    const csvContent = [headers, sampleData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'property-listing-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    const headers = [
      'Property Address',
      'Rent per Month',
      'Property Type',
      'Available Date',
      'Preferred Nationality',
      'Preferred Profession',
      'Preferred Race',
      'Pets Allowed'
    ].join(',');

    const rows = listings.map(listing => [
      `"${listing.property_address}"`,
      listing.rent_per_month,
      listing.property_type,
      format(new Date(listing.available_date), 'PP'),
      listing.preferred_nationality,
      listing.preferred_profession,
      listing.preferred_race,
      listing.pets_allowed ? 'Yes' : 'No'
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `property-listings-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <div className="flex gap-4">
          <CsvUpload onUploadSuccess={() => fetchListings()} />
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download Template
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
          <Link to="/property-listing">
            <Button>Create New Listing</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Rent/Month</TableHead>
              <TableHead>Available From</TableHead>
              <TableHead>Preferred Nationality</TableHead>
              <TableHead>Preferred Profession</TableHead>
              <TableHead>Preferred Race</TableHead>
              <TableHead>Pets Allowed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>{listing.property_type}</TableCell>
                <TableCell>{listing.property_address}</TableCell>
                <TableCell>${listing.rent_per_month.toFixed(2)}</TableCell>
                <TableCell>{format(new Date(listing.available_date), 'PP')}</TableCell>
                <TableCell>{listing.preferred_nationality}</TableCell>
                <TableCell>{listing.preferred_profession}</TableCell>
                <TableCell>{listing.preferred_race}</TableCell>
                <TableCell>{listing.pets_allowed ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PropertyListings;

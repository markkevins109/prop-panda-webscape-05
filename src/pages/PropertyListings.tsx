
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, FileText, Plus, Building } from 'lucide-react';
import CsvUpload from '@/components/CsvUpload';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Property Listings
        </h1>
        <div className="flex flex-wrap gap-3">
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
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Listing
            </Button>
          </Link>
        </div>
      </div>

      {listings.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No property listings found. Create your first listing!</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;

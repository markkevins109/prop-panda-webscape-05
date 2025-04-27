
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Building, FileText, Plus } from 'lucide-react';
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

    const sampleRows = [
      [
        '"Block 123 Clementi Ave 4, #12-34"',
        '2500',
        'HDB',
        '2025-01-01',
        'Any',
        'PROFESSIONAL',
        'ANY',
        'false'
      ].join(','),
      [
        '"15 Holland Road"',
        '8000',
        'LANDED',
        '2025-02-01',
        'Singapore',
        'ANY',
        'ANY',
        'true'
      ].join(',')
    ];

    const instructions = [
      '# Instructions:',
      '# 1. Keep the header row as is',
      '# 2. Each row should contain all required fields',
      '# 3. Property Type must be one of: HDB, LANDED, CONDOMINIUM, SHOP',
      '# 4. Date format: YYYY-MM-DD (e.g., 2025-12-31)',
      '# 5. Profession options: RETIRED, STUDENT, PROFESSIONAL, ANY',
      '# 6. Race options: INDIAN, CHINESE, MALAY, ANY',
      '# 7. Pets Allowed: true or false',
      '#'
    ].join('\n');

    const csvContent = [instructions, headers, ...sampleRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'property-listing-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            onClick={handleDownloadTemplate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download Template
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

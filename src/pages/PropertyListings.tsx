
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, FileText, Plus, Building, DollarSign, Calendar, Users, PawPrint } from 'lucide-react';
import CsvUpload from '@/components/CsvUpload';
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
                    <Building className="w-4 h-4" />
                    {listing.property_type}
                  </div>
                  <h3 className="text-lg font-semibold line-clamp-2">{listing.property_address}</h3>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold text-primary">
                  <DollarSign className="w-5 h-5" />
                  {listing.rent_per_month.toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Available from {format(new Date(listing.available_date), 'PP')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Preferred: {listing.preferred_nationality}, {listing.preferred_profession}, {listing.preferred_race}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PawPrint className="w-4 h-4" />
                  <span>Pets {listing.pets_allowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No property listings found. Create your first listing!</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;

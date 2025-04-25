
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

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

  useEffect(() => {
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

    fetchListings();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <Link to="/property-listing">
          <Button>Create New Listing</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <CardTitle className="text-lg">{listing.property_type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Address:</strong> {listing.property_address}</p>
              <p><strong>Rent:</strong> ${listing.rent_per_month.toFixed(2)}/month</p>
              <p><strong>Available From:</strong> {format(new Date(listing.available_date), 'PP')}</p>
              <p><strong>Preferred Nationality:</strong> {listing.preferred_nationality}</p>
              <p><strong>Preferred Profession:</strong> {listing.preferred_profession}</p>
              <p><strong>Preferred Race:</strong> {listing.preferred_race}</p>
              <p><strong>Pets Allowed:</strong> {listing.pets_allowed ? 'Yes' : 'No'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyListings;

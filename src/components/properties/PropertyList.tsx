
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePropertyAuth } from "@/hooks/usePropertyAuth";

interface Property {
  id: string;
  address: string;
  rent_per_month: number;
  property_type: string;
  available_date: string;
  nationality: string;
  profession: string;
  race: string;
  pets_allowed: boolean;
  agent_id: string;
}

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId, isLoading } = usePropertyAuth();

  useEffect(() => {
    if (userId) {
      fetchProperties();
    }
  }, [userId]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log("Fetching properties for agent ID:", userId);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Properties fetched:", data);
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProperties(properties.filter(property => property.id !== id));
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error("Failed to delete property");
    }
  };

  if (isLoading || loading) {
    return <div className="text-center py-4">Loading properties...</div>;
  }

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You need to be logged in to view properties.</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => navigate('/properties/new')}
        className="w-full md:w-auto"
      >
        Add New Property
      </Button>

      {properties.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No properties found. Add your first property to get started.
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Available From</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.property_type}</TableCell>
                  <TableCell>${property.rent_per_month}</TableCell>
                  <TableCell>
                    {format(new Date(property.available_date), 'PP')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/properties/edit/${property.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

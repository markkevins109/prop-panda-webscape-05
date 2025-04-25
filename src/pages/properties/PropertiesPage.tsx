
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyList from "@/components/properties/PropertyList";

export default function PropertiesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyList />
        </CardContent>
      </Card>
    </div>
  );
}

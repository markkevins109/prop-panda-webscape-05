
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyForm from "@/components/properties/PropertyForm";
import PropertyList from "@/components/properties/PropertyList";
import { useState } from "react";

export default function NewPropertyPage() {
  const [refreshList, setRefreshList] = useState(0);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm 
            onSuccess={() => {
              setRefreshList(prev => prev + 1);
            }} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyList key={refreshList} />
        </CardContent>
      </Card>
    </div>
  );
}

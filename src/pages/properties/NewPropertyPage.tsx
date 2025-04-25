
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyForm from "@/components/properties/PropertyForm";
import { useNavigate } from "react-router-dom";

export default function NewPropertyPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm onSuccess={() => navigate('/properties')} />
        </CardContent>
      </Card>
    </div>
  );
}

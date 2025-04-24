
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PROPERTY_TYPES = [
  { value: "hdb", label: "HDB Flat" },
  { value: "condo", label: "Condominium" },
  { value: "landed", label: "Landed Property" },
  { value: "commercial", label: "Commercial" }
];

export function PropertyTypeSelect({ value, onValueChange }: { 
  value: string; 
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select preferred property type" />
      </SelectTrigger>
      <SelectContent>
        {PROPERTY_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


import { z } from "zod";

export interface PropertyFormProps {
  onSuccess?: () => void;
  initialData?: PropertyFormData & { id: string };
}

export const propertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  rent_per_month: z.string().min(1, "Rent is required").refine(val => !isNaN(Number(val)), "Must be a valid number"),
  property_type: z.enum(["HDB", "Landed Property", "Condominium", "Shop Property"]),
  available_date: z.date(),
  nationality: z.string(),
  profession: z.enum(["Any", "Retired", "Student", "Professionals"]),
  race: z.enum(["Any", "Indian", "Chinese", "Malay"]),
  pets_allowed: z.enum(["true", "false"]).transform(val => val === "true"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

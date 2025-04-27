
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PropertyData } from './CsvUpload';

interface CsvDataPreviewProps {
  data: PropertyData[];
  onConfirm: () => void;
  onCancel: () => void;
}

const CsvDataPreview = ({ data, onConfirm, onCancel }: CsvDataPreviewProps) => {
  if (!data.length) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Rent/Month</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Available Date</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Race</TableHead>
              <TableHead>Pets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.property_address}</TableCell>
                <TableCell>${row.rent_per_month}</TableCell>
                <TableCell>{row.property_type}</TableCell>
                <TableCell>{row.available_date}</TableCell>
                <TableCell>{row.preferred_nationality}</TableCell>
                <TableCell>{row.preferred_profession}</TableCell>
                <TableCell>{row.preferred_race}</TableCell>
                <TableCell>{row.pets_allowed ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm Upload
        </Button>
      </div>
    </div>
  );
};

export default CsvDataPreview;

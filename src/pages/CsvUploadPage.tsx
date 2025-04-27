
import React from 'react';
import CsvUpload from '@/components/csv/CsvUpload';
import { toast } from 'sonner';

const CsvUploadPage = () => {
  const handleUploadSuccess = () => {
    toast.success('CSV data uploaded successfully');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">CSV File Upload</h1>
        <p className="text-muted-foreground">
          Upload a CSV file to preview and process its contents. The first row will be used as column headers.
        </p>
        <CsvUpload onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default CsvUploadPage;

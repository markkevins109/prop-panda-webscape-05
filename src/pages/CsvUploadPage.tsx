
import React from 'react';
import CsvUpload from '@/components/csv/CsvUpload';
import { toast } from 'sonner';
import { PageContainer, PageHero, SectionContainer } from '@/components/ui/page-container';
import { Upload } from 'lucide-react';

const CsvUploadPage = () => {
  const handleUploadSuccess = () => {
    toast.success('CSV data uploaded successfully');
  };

  return (
    <PageContainer>
      <PageHero 
        title="CSV File Upload" 
        description="Upload CSV files to manage your property listings efficiently"
      />
      
      <SectionContainer className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 border-t-4 border-t-accent-blue">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-accent-blue/10 p-4 rounded-full">
                <Upload className="h-10 w-10 text-accent-blue" />
              </div>
            </div>
            <p className="text-muted-foreground text-center mb-8">
              Upload a CSV file to preview and process its contents. The first row will be used as column headers.
            </p>
            <CsvUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default CsvUploadPage;

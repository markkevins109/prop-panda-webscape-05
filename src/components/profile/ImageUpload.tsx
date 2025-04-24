
import { useState } from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  onChange: (file: File) => void;
  imageUrl?: string;
}

export function ImageUpload({ onChange, imageUrl }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Label htmlFor="avatar-upload" className="cursor-pointer">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-[#28A745]">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Preview" />
            ) : (
              <AvatarFallback className="bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </Label>
      <input
        id="avatar-upload"
        type="file"
        className="hidden"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
}

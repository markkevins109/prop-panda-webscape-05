
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TutorialCardProps {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  className?: string; // Added className prop to fix the TypeScript error
}

const TutorialCard = ({ title, description, videoUrl, thumbnailUrl, className }: TutorialCardProps) => {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="p-0">
        <AspectRatio ratio={16/9}>
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-accent-blue text-white rounded-full p-4 hover:bg-accent-blue/90 transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </a>
          </div>
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default TutorialCard;

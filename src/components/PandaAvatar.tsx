
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from 'lucide-react';

export const PandaAvatar = () => {
  return (
    <Avatar className="h-10 w-10 border-2 border-accent-blue">
      <AvatarImage 
        src="/lovable-uploads/dd2be9f3-db6f-4ce7-91e3-51204245dde6.png" 
        alt="Prop Panda AI Logo" 
        className="object-contain p-1"
      />
      <AvatarFallback>
        <Bot className="h-8 w-8 text-accent-blue" />
      </AvatarFallback>
    </Avatar>
  );
};


import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from 'lucide-react';

export const PandaAvatar = () => {
  return (
    <Avatar className="h-12 w-12 border-2 border-primary">
      <AvatarImage 
        src="/panda-ai-logo.svg" 
        alt="Prop Panda AI Logo" 
        className="object-contain p-1"
      />
      <AvatarFallback>
        <Bot className="h-20 w-20 text-primary" />
      </AvatarFallback>
    </Avatar>
  );
};

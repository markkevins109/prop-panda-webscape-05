
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from 'lucide-react';

export const PandaAvatar = () => {
  return (
    <Avatar className="h-10 w-10 border-2 border-primary">
      <AvatarImage 
        src="/panda-ai-logo.svg" 
        alt="Prop Panda AI Logo" 
        className="object-contain p-1"
      />
      <AvatarFallback>
        <Bot className="h-8 w-8 text-primary" />
      </AvatarFallback>
    </Avatar>
  );
};


import { FC } from 'react';

interface PandaAvatarProps {
  size?: 'xs' | 'small' | 'medium' | 'large';
}

export const PandaAvatar: FC<PandaAvatarProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-16 w-16'
  };

  return (
    <div className={`rounded-full bg-accent-blue flex items-center justify-center ${sizeClasses[size]}`}>
      <img 
        src="/panda-ai-logo.svg" 
        alt="Prop Panda Avatar" 
        className="h-4/5 w-4/5 object-contain" 
      />
    </div>
  );
};

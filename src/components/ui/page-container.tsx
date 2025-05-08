
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`min-h-[70vh] overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}

export function PageHero({ 
  title, 
  description, 
  className = "" 
}: { 
  title: string; 
  description: string;
  className?: string;
}) {
  return (
    <section className={`section-padding bg-gradient-to-br from-white to-accent-blue/10 ${className}`}>
      <div className="container-custom text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-5 animate-fade-in">{title}</h1>
        <p className="text-lg md:text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>{description}</p>
      </div>
    </section>
  );
}

export function SectionContainer({ 
  children, 
  className = "",
  bgColor = "bg-white"
}: { 
  children: ReactNode;
  className?: string;
  bgColor?: string;
}) {
  return (
    <section className={`section-padding ${bgColor} ${className}`}>
      <div className="container-custom">
        {children}
      </div>
    </section>
  );
}

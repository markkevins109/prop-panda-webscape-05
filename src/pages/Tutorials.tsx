
import React from 'react';
import { PageContainer, PageHero, SectionContainer } from '@/components/ui/page-container';
import TutorialCard from '@/components/tutorials/TutorialCard';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tutorials = [
  {
    title: "Getting Started with Prop Panda",
    description: "Learn how to sign up, log in, and navigate the app's main features including property search and your personal dashboard.",
    videoUrl: "https://youtube.com/watch?v=example1",
    thumbnailUrl: "/lovable-uploads/f84bf499-93af-49a6-88c8-61cb9b9c6f02.png"
  },
  {
    title: "Exploring Market Insights",
    description: "Access real-time property data and understand price trends for HDBs and condos across Singapore.",
    videoUrl: "https://youtube.com/watch?v=example2",
    thumbnailUrl: "/lovable-uploads/8c5770e0-369c-4b42-ac1c-4d7a53f5b37b.png"
  },
  {
    title: "Scheduling Property Tours",
    description: "Learn how to book virtual or in-person property tours through our intuitive interface.",
    videoUrl: "https://youtube.com/watch?v=example3",
    thumbnailUrl: "/lovable-uploads/f371a031-4053-40e5-a2ac-40dd640a33a5.png"
  },
  {
    title: "Using the Chatbot",
    description: "Master our AI chatbot for property queries, tour scheduling, and secure communication.",
    videoUrl: "https://youtube.com/watch?v=example4",
    thumbnailUrl: "/lovable-uploads/dd2be9f3-db6f-4ce7-91e3-51204245dde6.png"
  }
];

const Tutorials = () => {
  return (
    <PageContainer>
      <PageHero 
        title="Learn How to Use Prop Panda" 
        description="Explore our comprehensive tutorials to get the most out of your AI real estate assistant"
      />
      
      <SectionContainer className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tutorials.map((tutorial, index) => (
            <TutorialCard
              key={index}
              {...tutorial}
              className="hover-scale border-t-4 border-t-accent-blue"
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="default" size="lg" className="btn-accent">
            Request Custom Tutorial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </SectionContainer>
      
      <SectionContainer bgColor="bg-gradient-to-br from-secondary/80 to-secondary" className="text-center">
        <h2 className="text-3xl font-bold mb-6">Need Additional Help?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our support team is available 24/7 to assist with any questions you may have about using Prop Panda.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="bg-white hover:bg-white/90">
            Contact Support
          </Button>
          <Button variant="default" className="btn-accent">
            Schedule a Demo
          </Button>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default Tutorials;

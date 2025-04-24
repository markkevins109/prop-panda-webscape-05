import React from 'react';
import TutorialHero from '@/components/tutorials/TutorialHero';
import TutorialCard from '@/components/tutorials/TutorialCard';

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
    thumbnailUrl: "/lovable-uploads/4e47f492-4503-48c4-a65a-f466f2262f02.png"
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
    <div className="min-h-screen">
      <TutorialHero />
      
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tutorials.map((tutorial, index) => (
            <TutorialCard
              key={index}
              {...tutorial}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;

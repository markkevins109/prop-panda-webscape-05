
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
    thumbnailUrl: "/lovable-uploads/f2547f6e-8155-4587-aab2-6c2dc46824ab.png"
  },
  {
    title: "Scheduling Property Tours",
    description: "Learn how to book virtual or in-person property tours through our intuitive interface.",
    videoUrl: "https://youtube.com/watch?v=example3",
    thumbnailUrl: "/lovable-uploads/f4657a83-6b0e-450a-ab34-18502b3896e2.png"
  },
  {
    title: "Using the Chatbot",
    description: "Master our AI chatbot for property queries, tour scheduling, and secure communication.",
    videoUrl: "https://youtube.com/watch?v=example4",
    thumbnailUrl: "/lovable-uploads/1aa8af60-84f1-4241-8781-e2936c2c1595.png"
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

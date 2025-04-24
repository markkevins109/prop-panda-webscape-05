
import React from 'react';

const TutorialHero = () => {
  return (
    <div 
      className="relative h-[400px] bg-cover bg-center"
      style={{
        backgroundImage: `url('/lovable-uploads/dd2be9f3-db6f-4ce7-91e3-51204245dde6.png')`
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container-custom h-full flex flex-col justify-center items-center text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Prop Panda Tutorials
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Master Prop Panda with our easy-to-follow video tutorials! Learn how to navigate the platform, explore market insights, and make the most of our features.
        </p>
      </div>
    </div>
  );
};

export default TutorialHero;

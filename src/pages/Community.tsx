
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import UserRegistrationForm from "@/components/community/UserRegistrationForm";
import QuestionForm from "@/components/community/QuestionForm";
import QuestionList from "@/components/community/QuestionList";

export default function Community() {
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from 'rgb(29, 78, 216)' to 'rgb(30, 64, 175)' py-20"
        style={{
          backgroundImage: `url('/lovable-uploads/dd2be9f3-db6f-4ce7-91e3-51204245dde6.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Property Community</h1>
            <p className="text-lg md:text-xl opacity-90">
              Connect with fellow property enthusiasts, share insights, and get your questions answered
              <Link 
                to="/tutorials" 
                className="text-white underline ml-2 inline-flex items-center"
              >
                <Book className="mr-2 h-4 w-4" />
                New to Prop Panda? Watch Tutorials
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {!userId ? (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-center">Register to Join the Discussion</h2>
              <UserRegistrationForm onSuccess={setUserId} />
            </div>
          ) : (
            <div className="space-y-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Ask a New Question</h2>
                <QuestionForm 
                  userId={userId} 
                  onSuccess={handleRefresh} 
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Community Questions</h2>
                <QuestionList 
                  userId={userId}
                  onRefresh={handleRefresh}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

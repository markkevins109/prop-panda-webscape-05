import { Book, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const blogPosts = [
  {
    title: "Automated Documentation and Compliance Checks",
    shortDescription: "Closing a deal in real estate involves handling complex documents—from agreements and legal disclosures to loan approvals and identity verifications. AI is helping agencies in Singapore automate parts of this documentation process using natural language processing (NLP) and document scanning technologies.",
    fullDescription: "Closing a deal in real estate involves handling complex documents—from agreements and legal disclosures to loan approvals and identity verifications. AI is helping agencies in Singapore automate parts of this documentation process using natural language processing (NLP) and document scanning technologies. Some platforms can even flag missing signatures or compliance issues, reducing back-and-forth delays and ensuring faster contract finalization.",
    date: "April 24, 2025",
    readTime: "3 min read",
    category: "Documentation",
    image: "/lovable-uploads/f2547f6e-8155-4587-aab2-6c2dc46824ab.png"
  },
  {
    title: "Predictive Analytics for Market Trends",
    shortDescription: "Singapore's real estate market is fast-moving and highly sensitive to economic and policy changes. AI tools provide agencies with predictive insights based on large datasets, including transaction history, neighborhood development plans, and economic indicators.",
    fullDescription: "Singapore's real estate market is fast-moving and highly sensitive to economic and policy changes. AI tools provide agencies with predictive insights based on large datasets, including transaction history, neighborhood development plans, and economic indicators. These insights help agents forecast property demand, anticipate price shifts, and make informed recommendations to clients. Faster, data-backed decision-making leads to quicker and more confident closings.",
    date: "April 24, 2025",
    readTime: "4 min read",
    category: "Market Analysis",
    image: "/lovable-uploads/33280170-2f82-41bb-8715-1d39ac6b5a87.png"
  },
  {
    title: "AI-Powered Lead Generation and Qualification",
    shortDescription: "The traditional method of sourcing and qualifying leads through cold calls, emails, and networking is time-consuming and often inefficient.",
    fullDescription: "The traditional method of sourcing and qualifying leads through cold calls, emails, and networking is time-consuming and often inefficient. AI changes the game by automating lead generation through data-driven platforms. Algorithms analyze online behavior, property searches, and demographic data to identify high-intent buyers or tenants. Some AI platforms score leads based on their readiness to buy, allowing agents to prioritize their time more effectively. For example, a prospective buyer who regularly visits high-value condo listings and requests multiple brochures is flagged as a high-potential lead.",
    date: "April 23, 2025",
    readTime: "4 min read",
    category: "AI Innovation",
    image: "/lovable-uploads/9bf9927b-cb59-4ad9-9b3e-31ec9f11273b.png"
  },
  {
    title: "Virtual Assistants for Client Communication",
    shortDescription: "AI-powered chatbots and virtual assistants are transforming how agencies interact with clients. These tools handle routine inquiries—like property availability, viewing schedules, or location info—24/7 without human intervention.",
    fullDescription: "AI-powered chatbots and virtual assistants are transforming how agencies interact with clients. These tools handle routine inquiries—like property availability, viewing schedules, or location info—24/7 without human intervention. This ensures that no opportunity is missed, even after office hours. In Singapore, where quick responses often determine whether a client chooses your agency or another, AI communication tools can make a measurable difference in conversion rates.",
    date: "April 22, 2025",
    readTime: "3 min read",
    category: "AI Communication",
    image: "/lovable-uploads/f4657a83-6b0e-450a-ab34-18502b3896e2.png"
  },
  {
    title: "Personalized Property Recommendations",
    shortDescription: "AI algorithms analyze a user's preferences, search history, and interaction patterns to recommend highly relevant properties. Instead of browsing through dozens of listings, clients are shown a tailored selection that matches their budget, lifestyle, and location criteria.",
    fullDescription: "AI algorithms analyze a user's preferences, search history, and interaction patterns to recommend highly relevant properties. Instead of browsing through dozens of listings, clients are shown a tailored selection that matches their budget, lifestyle, and location criteria. This shortens the property discovery phase, reducing the time it takes for a buyer or renter to find a suitable option and increasing the likelihood of a successful closing.",
    date: "April 21, 2025",
    readTime: "4 min read",
    category: "AI Recommendations",
    image: "/lovable-uploads/2826e8bc-03dd-4866-b8f0-71261ab22d07.png"
  },
  {
    title: "Smart Scheduling and Virtual Property Tours",
    shortDescription: "With AI-based scheduling tools, agents can automatically coordinate property viewings by syncing calendars, sending reminders, and suggesting optimal time slots. This eliminates the manual work of coordinating between multiple parties.",
    fullDescription: "With AI-based scheduling tools, agents can automatically coordinate property viewings by syncing calendars, sending reminders, and suggesting optimal time slots. This eliminates the manual work of coordinating between multiple parties. In addition, virtual property tours powered by AI and augmented reality (AR) allow clients to explore properties from their homes. This is particularly valuable in a city like Singapore, where time is at a premium and international investors often buy remotely.",
    date: "April 25, 2025",
    readTime: "4 min read",
    category: "AI Innovation",
    image: "/lovable-uploads/f84bf499-93af-49a6-88c8-61cb9b9c6f02.png"
  }
];

export default function Blog() {
  const [openArticles, setOpenArticles] = useState<number[]>([]);

  const toggleArticle = (index: number) => {
    setOpenArticles(current => 
      current.includes(index) 
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient 
              to-primary from-accent-blue bg-gradient-to-r">
              Insights & Updates
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay ahead of the curve with the latest insights on AI in real estate
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="w-full overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </AspectRatio>
                </div>
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                    <span>•</span>
                    <Book className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-accent-blue transition-colors">
                    {post.title}
                  </CardTitle>
                  <Collapsible open={openArticles.includes(index)}>
                    <CardDescription className="line-clamp-2">
                      {post.shortDescription || post.description}
                    </CardDescription>
                    <CollapsibleContent>
                      <CardDescription className="mt-2">
                        {post.fullDescription || post.description}
                      </CardDescription>
                    </CollapsibleContent>
                    <div className="mt-4">
                      <CollapsibleTrigger 
                        asChild 
                        onClick={() => toggleArticle(index)}
                      >
                        <button className="inline-flex items-center text-accent-blue hover:underline gap-1 font-medium">
                          {openArticles.includes(index) ? 'Show Less' : 'Read More'} <ArrowRight className="h-4 w-4" />
                        </button>
                      </CollapsibleTrigger>
                    </div>
                  </Collapsible>
                </CardHeader>
                <CardContent>
                  {/* Content moved to inside the Collapsible component */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

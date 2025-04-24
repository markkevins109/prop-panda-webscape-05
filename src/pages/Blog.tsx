import { Book, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const blogPosts = [
  {
    title: "How AI is Helping Singapore Real Estate Agents Close Deals 2x Faster",
    shortDescription: "Discover how cutting-edge AI tools are transforming property sales, streamlining client interactions, and boosting conversion rates in Singapore's competitive real estate market.",
    fullDescription: "This blog explores how real estate firms across Singapore are using AI technologies to streamline workflows, improve decision-making, and close deals faster than ever before.",
    date: "April 24, 2025",
    readTime: "5 min read",
    category: "Technology",
    image: "/lovable-uploads/4e47f492-4503-48c4-a65a-f466f2262f02.png"
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
    image: "/lovable-uploads/1aa8af60-84f1-4241-8781-e2936c2c1595.png"
  },
  {
    title: "Real Estate Market Trends 2025: AI's Growing Impact",
    description: "An in-depth analysis of how artificial intelligence is shaping the future of property transactions.",
    date: "April 18, 2025",
    readTime: "10 min read",
    category: "Market Analysis",
    image: "/lovable-uploads/1486312338219-ce68d2c6f44d.jpg"
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

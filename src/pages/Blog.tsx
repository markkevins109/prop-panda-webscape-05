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
    image: "/lovable-uploads/1488590528505-98d2b5aba04b.jpg"
  },
  {
    title: "Maximizing ROI with Prop Panda AI Integration",
    description: "Learn how real estate agencies increased their conversion rates by 300% using our AI solutions.",
    date: "April 20, 2025",
    readTime: "6 min read",
    category: "Case Study",
    image: "/lovable-uploads/1487058792275-0ad4aaf24ca7.jpg"
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
                      {post.shortDescription}
                    </CardDescription>
                    <CollapsibleContent>
                      <CardDescription className="mt-2">
                        {post.fullDescription}
                      </CardDescription>
                    </CollapsibleContent>
                  </Collapsible>
                </CardHeader>
                <CardContent>
                  <CollapsibleTrigger 
                    asChild 
                    onClick={() => toggleArticle(index)}
                  >
                    <button className="inline-flex items-center text-accent-blue hover:underline gap-1 font-medium">
                      {openArticles.includes(index) ? 'Show Less' : 'Read More'} <ArrowRight className="h-4 w-4" />
                    </button>
                  </CollapsibleTrigger>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

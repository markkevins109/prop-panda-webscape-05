
import { Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const blogPosts = [
  {
    title: "Getting Started with Prop Panda AI",
    description: "Learn how to leverage AI for your real estate business",
    date: "April 15, 2025",
    readTime: "5 min read"
  },
  {
    title: "Top 10 Real Estate AI Use Cases",
    description: "Discover how AI is transforming property management",
    date: "April 10, 2025",
    readTime: "8 min read"
  },
  {
    title: "AI-Powered Property Analysis",
    description: "How to use machine learning for property valuation",
    date: "April 5, 2025",
    readTime: "6 min read"
  }
];

export default function Blog() {
  return (
    <div>
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Our Blog</h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest insights and news about AI in real estate
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Book className="h-4 w-4" />
                    <span className="text-sm">{post.date} · {post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="text-accent-blue hover:underline">
                    Read more →
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

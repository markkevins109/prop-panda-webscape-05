
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const communityFeatures = [
  {
    title: "Discussion Forums",
    description: "Connect with other real estate professionals and share insights",
    members: "2,500+ members"
  },
  {
    title: "Expert Network",
    description: "Access to industry experts and AI specialists",
    members: "500+ experts"
  },
  {
    title: "Local Meetups",
    description: "Join local real estate tech communities",
    members: "50+ cities"
  }
];

export default function Community() {
  return (
    <div>
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Join Our Community</h1>
            <p className="text-lg text-muted-foreground">
              Connect with real estate professionals and AI enthusiasts
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {communityFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 text-accent-blue mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">{feature.members}</span>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="text-accent-blue hover:underline">
                    Learn more →
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

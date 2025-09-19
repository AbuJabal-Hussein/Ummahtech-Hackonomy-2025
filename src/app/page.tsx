import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Users, Target, HeartHandshake, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const successStories = [
  {
    id: 1,
    image: "https://picsum.photos/seed/coffee-shop/600/400",
    hint: "coffee cart",
    title: "Artisanal Coffee Cart",
    description: "Amina raised $1,200 to launch her mobile coffee cart, bringing specialty coffee and morning smiles to her local community.",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/baking/600/400",
    hint: "baker sweets",
    title: "Eid Festive Baker",
    description: "Yusuf's home bakery got a boost with $800 for better equipment, allowing him to serve delicious treats during holidays.",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/bike-repair/600/400",
    hint: "bike repair",
    title: "Community Bike Repair Stand",
    description: "Farida secured $500 to set up a much-needed bike repair stand, promoting sustainable transport and helping neighbors.",
  },
];

const testimonials = [
  {
    id: 1,
    avatar: "https://picsum.photos/seed/avatar1/100/100",
    hint: "woman portrait",
    name: "Fatima S.",
    role: "Contributor",
    quote: "Barakah Ledger makes it easy to support real people making a difference. Seeing the updates and knowing my contribution is interest-free is amazing.",
  },
  {
    id: 2,
    avatar: "https://picsum.photos/seed/avatar2/100/100",
    hint: "man portrait",
    name: "Ahmed K.",
    role: "Borrower",
    quote: "Getting funding without the burden of interest was a game-changer for my small business. The community support was truly a blessing.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 text-center py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tight">
            Support Local Entrepreneurs, Interest-Free
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Join a community-powered platform to fund small businesses and community projects with zero interest. Your contribution creates opportunities and empowers growth.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/discover">
                Contribute Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <Link href="/signup">Start a Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Counters Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-4xl font-bold text-accent">$75,000+</h3>
              <p className="mt-2 text-muted-foreground">Funded on Barakah Ledger</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-accent">150+</h3>
              <p className="mt-2 text-muted-foreground">Entrepreneurs Supported</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-accent">98%</h3>
              <p className="mt-2 text-muted-foreground">Repayment Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">How It Works</h2>
            <p className="mt-3 max-w-xl mx-auto text-foreground/70">A simple, transparent process for community-driven success.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 text-primary p-4 rounded-full">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Start a Project</h3>
              <p className="text-muted-foreground">Borrowers create a detailed profile for their business or idea, outlining their funding needs and plans.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 text-primary p-4 rounded-full">
                  <HeartHandshake className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Contribute with Barakah</h3>
              <p className="text-muted-foreground">Contributors browse projects and fund them through interest-free loans or donations, directly impacting their community.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 text-primary p-4 rounded-full">
                  <Target className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Achieve &amp; Repay</h3>
              <p className="text-muted-foreground">Entrepreneurs grow their business and repay loans over time. Funds are then recycled to support new projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Success Stories Section */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Featured Success Stories</h2>
            <p className="mt-3 max-w-xl mx-auto text-foreground/70">Real projects funded by people like you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  data-ai-hint={story.hint}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                  <p className="text-muted-foreground">{story.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">From Our Community</h2>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 flex flex-col items-center text-center shadow-lg">
                <Quote className="h-8 w-8 text-accent mb-4" />
                <p className="text-foreground/80 mb-6 flex-grow">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 text-left">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { User, Users, MessageSquare, Beaker } from "lucide-react";

const Index = () => {
  const { isAuthenticated, bypassAuth } = useAuth();
  const navigate = useNavigate();

  const handleTestMode = () => {
    bypassAuth();
    navigate("/matches");
  };

  return (
    <Layout>
      <div className="w-full">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Connect with <span className="text-secondary">Professional Women</span> in Kenya
                </h1>
                <p className="text-lg mb-8 max-w-md">
                  Find meaningful professional connections, mentorship opportunities, and friendships with like-minded women.
                </p>
                <div className="space-x-4">
                  {isAuthenticated ? (
                    <Button size="lg" onClick={() => navigate("/matches")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Find Matches
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" onClick={() => navigate("/register")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        Join Now
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="bg-transparent hover:bg-primary-foreground/10 text-primary-foreground border-primary-foreground">
                        Sign In
                      </Button>
                      <Button size="lg" variant="ghost" onClick={handleTestMode} className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                        <Beaker className="mr-2 h-4 w-4" />
                        Test Mode
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-2xl bg-white">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                    alt="Professional women networking" 
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-600">Showcase your professional experience, interests, and what you're looking for in connections.</p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover Matches</h3>
                <p className="text-gray-600">Our algorithm suggests connections based on common interests and professional goals.</p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Securely</h3>
                <p className="text-gray-600">Message your matches and build meaningful professional relationships in a safe environment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <p className="mb-4 italic text-primary-foreground/90">
                  "This platform helped me connect with other women in tech, which led to a mentorship relationship that transformed my career path."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                      alt="Sarah M." 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah M.</h4>
                    <p className="text-sm text-primary-foreground/80">Software Developer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <p className="mb-4 italic text-primary-foreground/90">
                  "I found a business partner through this app who shared my passion for sustainable fashion. We've now launched our own clothing line!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                      alt="Janet K." 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Janet K.</h4>
                    <p className="text-sm text-primary-foreground/80">Fashion Entrepreneur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Connect?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our growing community of professional women and start building meaningful connections today.
            </p>
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate("/matches")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Find Matches
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate("/register")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Join Now
              </Button>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;

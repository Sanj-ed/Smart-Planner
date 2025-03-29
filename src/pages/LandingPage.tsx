
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    "Smart task management with AI integration",
    "Intuitive calendar view for scheduling",
    "Priority-based task organization",
    "Real-time notifications for updates",
    "Detailed analytics and reporting",
    "Mobile-friendly responsive design",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            TaskAI
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-accent to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Manage Your Tasks with the Power of AI
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-muted-foreground">
              TaskAI helps you organize, prioritize, and track your tasks efficiently 
              with intelligent features designed to boost your productivity.
            </p>
            <Link to={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="text-lg px-8">
                {user ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Organized?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
              Join thousands of users who have transformed their task management with TaskAI.
            </p>
            <Link to={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="text-lg px-8">
                {user ? "Go to Dashboard" : "Sign Up Now"}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} TaskAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

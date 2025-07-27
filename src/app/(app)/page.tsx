'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Shield, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  Mail,
  Lock,
  Globe
} from 'lucide-react';
import messages from '@/messages.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

const features = [
  {
    icon: Lock,
    title: "Complete Privacy",
    description: "Your identity remains completely anonymous. No tracking, no data collection.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Messages are delivered instantly with real-time notifications.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with anyone, anywhere in the world anonymously.",
    gradient: "from-green-500 to-emerald-500"
  }
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Student",
    content: "Finally, a safe space to share thoughts without judgment. Love the anonymity!",
    rating: 5
  },
  {
    name: "Alex M.",
    role: "Professional",
    content: "Great for getting honest feedback from colleagues and friends.",
    rating: 5
  },
  {
    name: "Jordan L.",
    role: "Content Creator",
    content: "The best platform for anonymous communication. Simple and effective.",
    rating: 5
  }
];

const steps = [
  {
    step: "1",
    title: "Create Account",
    description: "Sign up with just your email and username"
  },
  {
    step: "2", 
    title: "Share Your Link",
    description: "Get your unique anonymous message link"
  },
  {
    step: "3",
    title: "Receive Messages",
    description: "Get anonymous messages from anyone"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10 pointer-events-none"></div>
        <motion.div 
          className="container mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-4">
              <MessageSquare className="w-3 h-3 mr-1" />
              Anonymous Messaging Platform
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
          >
            Share Your Thoughts
            <span className="gradient-text block">Anonymously</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance"
          >
            Connect with others without revealing your identity. Send and receive honest, 
            anonymous messages in a safe and secure environment.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="container mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AnonChat?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the freedom of anonymous communication with enterprise-grade security.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <motion.div 
          className="container mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sample Messages Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="container mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground">Real anonymous messages from our community</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {messages.slice(0, 6).map((message, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {message.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{message.content}</p>
                    <p className="text-xs text-muted-foreground">{message.received}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <motion.div 
          className="container mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Users Say</h2>
            <p className="text-xl text-muted-foreground">Join thousands of satisfied users</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10 pointer-events-none"></div>
        <motion.div 
          className="container mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Start Your Anonymous Journey?
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Join our community and experience the freedom of anonymous communication.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">AnonChat</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Where your identity remains a secret
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            © 2024 AnonChat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}